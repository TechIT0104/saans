#!/usr/bin/env bash
# One-shot AWS deployment for Saans.
#   S3 (models + code) -> EC2 (FastAPI + ONNX models, IAM role) -> CloudFront (HTTPS)
#   DynamoDB for community reports, Polly for Hindi voice.
#   Scene analysis: Qwen2.5-VL on our GPU, reached through a reverse SSH tunnel into the instance
#   (gpu_service/tunnel.sh), or Amazon Bedrock with SAANS_LLM_BACKEND=bedrock.
# Usage: GPU_CIDRS="1.2.3.4/32" AWS_REGION=ap-south-1 bash deploy/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

AWS="${AWS_CLI:-aws}"
REGION="${AWS_REGION:-ap-south-1}"
ACCOUNT=$($AWS sts get-caller-identity --query Account --output text)
BUCKET="saans-artifacts-$ACCOUNT-$REGION"
TABLE="saans-reports"
ROLE="saans-ec2-role"
SG="saans-web"
KEY="saans-key"
BACKEND="${SAANS_LLM_BACKEND:-gpu}"
VISION_MODEL="${SAANS_VISION_MODEL:-apac.amazon.nova-pro-v1:0}"
TEXT_MODEL="${SAANS_TEXT_MODEL:-apac.amazon.nova-lite-v1:0}"
GPU_CIDRS="${GPU_CIDRS:-}"
BUILD=deploy/.build
mkdir -p "$BUILD"
echo "Account $ACCOUNT, region $REGION"

# 1. S3: models + app bundle
$AWS s3 mb "s3://$BUCKET" --region "$REGION" 2>/dev/null || true
tar czf "$BUILD/saans-app.tgz" --exclude=__pycache__ app requirements.txt
$AWS s3 cp "$BUILD/saans-app.tgz" "s3://$BUCKET/saans-app.tgz" --region "$REGION" --only-show-errors
$AWS s3 cp models/ "s3://$BUCKET/models/" --recursive --only-show-errors --exclude "*" --include "*.onnx" --include "*.json" --region "$REGION"

# 2. DynamoDB table for community reports
$AWS dynamodb describe-table --table-name "$TABLE" --region "$REGION" >/dev/null 2>&1 || \
  $AWS dynamodb create-table --table-name "$TABLE" --billing-mode PAY_PER_REQUEST \
    --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --region "$REGION" >/dev/null

# 3. IAM role for the instance: only what the app calls
if ! $AWS iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  $AWS iam create-role --role-name "$ROLE" --assume-role-policy-document \
    '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
  $AWS iam create-instance-profile --instance-profile-name "$ROLE" >/dev/null
  $AWS iam add-role-to-instance-profile --instance-profile-name "$ROLE" --role-name "$ROLE"
  sleep 10
fi
cat > "$BUILD/policy.json" <<EOF
{"Version": "2012-10-17", "Statement": [
  {"Effect": "Allow", "Action": ["bedrock:InvokeModel", "bedrock:Converse"], "Resource": "*"},
  {"Effect": "Allow", "Action": ["polly:SynthesizeSpeech"], "Resource": "*"},
  {"Effect": "Allow", "Action": ["dynamodb:PutItem", "dynamodb:Scan"], "Resource": "arn:aws:dynamodb:$REGION:$ACCOUNT:table/$TABLE"},
  {"Effect": "Allow", "Action": ["s3:GetObject"], "Resource": "arn:aws:s3:::$BUCKET/*"}
]}
EOF
$AWS iam put-role-policy --role-name "$ROLE" --policy-name saans-app --policy-document "file://$BUILD/policy.json"

# 4. Security group: HTTP for CloudFront, SSH only from the GPU server for the tunnel
VPC=$($AWS ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text --region "$REGION")
SGID=$($AWS ec2 describe-security-groups --filters Name=group-name,Values=$SG Name=vpc-id,Values=$VPC --query 'SecurityGroups[0].GroupId' --output text --region "$REGION")
if [ "$SGID" = "None" ]; then
  SGID=$($AWS ec2 create-security-group --group-name $SG --description "Saans web" --vpc-id "$VPC" --query GroupId --output text --region "$REGION")
  $AWS ec2 authorize-security-group-ingress --group-id "$SGID" --protocol tcp --port 80 --cidr 0.0.0.0/0 --region "$REGION" >/dev/null
  for c in $GPU_CIDRS; do
    $AWS ec2 authorize-security-group-ingress --group-id "$SGID" --protocol tcp --port 22 --cidr "$c" --region "$REGION" >/dev/null
  done
fi
if [ ! -s "$BUILD/$KEY.pem" ]; then
  $AWS ec2 delete-key-pair --key-name $KEY --region "$REGION" >/dev/null 2>&1 || true
  $AWS ec2 create-key-pair --key-name $KEY --query KeyMaterial --output text --region "$REGION" > "$BUILD/$KEY.pem"
fi

# 5. EC2 instance (Amazon Linux 2023)
AMI=$($AWS ssm get-parameters --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query 'Parameters[0].Value' --output text --region "$REGION")
cat > "$BUILD/userdata.sh" <<EOF
#!/bin/bash
set -eux
dnf install -y python3.11 python3.11-pip tar
mkdir -p /opt/saans && cd /opt/saans
aws s3 cp s3://$BUCKET/saans-app.tgz . --region $REGION && tar xzf saans-app.tgz
mkdir -p models && for f in haze.onnx haze_metrics.json smoke.onnx smoke_metrics.json; do aws s3 cp s3://$BUCKET/models/\$f models/\$f --region $REGION; done
python3.11 -m venv venv && venv/bin/pip install -q -r requirements.txt
# HTTPS: Caddy with a Let's Encrypt certificate for <public-ip>.sslip.io
TOKEN=\$(curl -sX PUT http://169.254.169.254/latest/api/token -H "X-aws-ec2-metadata-token-ttl-seconds: 300")
IP=\$(curl -s -H "X-aws-ec2-metadata-token: \$TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)
HOST=\$(echo \$IP | tr . -).sslip.io
curl -sL https://github.com/caddyserver/caddy/releases/download/v2.8.4/caddy_2.8.4_linux_amd64.tar.gz | tar xz -C /usr/local/bin caddy
mkdir -p /etc/caddy /var/lib/caddy
printf '%s {\n  reverse_proxy 127.0.0.1:8000\n}\n:80 {\n  reverse_proxy 127.0.0.1:8000\n}\n' "\$HOST" > /etc/caddy/Caddyfile
cat > /etc/systemd/system/caddy.service <<UNIT
[Unit]
Description=Caddy
After=network-online.target
[Service]
Environment=XDG_DATA_HOME=/var/lib/caddy
Environment=XDG_CONFIG_HOME=/var/lib/caddy
ExecStart=/usr/local/bin/caddy run --config /etc/caddy/Caddyfile
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/systemd/system/saans.service <<UNIT
[Unit]
Description=Saans
After=network-online.target
[Service]
WorkingDirectory=/opt/saans
ExecStartPre=/bin/bash -c 'aws s3 cp s3://$BUCKET/saans-app.tgz /opt/saans/saans-app.tgz --region $REGION && tar xzf /opt/saans/saans-app.tgz -C /opt/saans'
Environment=AWS_REGION=$REGION
Environment=SAANS_TABLE=$TABLE
Environment=SAANS_LLM_BACKEND=$BACKEND
Environment=SAANS_GPU_URL=http://127.0.0.1:9000
Environment=SAANS_VISION_MODEL=$VISION_MODEL
Environment=SAANS_TEXT_MODEL=$TEXT_MODEL
ExecStart=/opt/saans/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 2 --proxy-headers --forwarded-allow-ips=*
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload && systemctl enable --now saans caddy
echo "SAANS READY https://\$HOST"
EOF
IID=$($AWS ec2 run-instances --image-id "$AMI" --instance-type "${INSTANCE_TYPE:-m7i-flex.large}" --security-group-ids "$SGID" \
  --key-name $KEY --iam-instance-profile Name=$ROLE --user-data "file://$BUILD/userdata.sh" \
  --block-device-mappings 'DeviceName=/dev/xvda,Ebs={VolumeSize=16,VolumeType=gp3}' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saans}]' \
  --query 'Instances[0].InstanceId' --output text --region "$REGION")
echo "Instance $IID"
$AWS ec2 wait instance-running --instance-ids "$IID" --region "$REGION"
DNS=$($AWS ec2 describe-instances --instance-ids "$IID" --query 'Reservations[0].Instances[0].PublicDnsName' --output text --region "$REGION")
echo "EC2: http://$DNS"
IP=$($AWS ec2 describe-instances --instance-ids "$IID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text --region "$REGION")
echo "HTTPS (Caddy + Let's Encrypt, ready in ~3 min): https://${IP//./-}.sslip.io"
echo "$IID $DNS ${IP//./-}.sslip.io" > "$BUILD/last-deploy.txt"
[ "${USE_CLOUDFRONT:-0}" = "1" ] || exit 0

# 6. CloudFront for HTTPS (phones only allow camera + location on secure pages)
cat > "$BUILD/cf.json" <<EOF
{
  "CallerReference": "saans-$(date +%s)",
  "Comment": "Saans",
  "Enabled": true,
  "Origins": {"Quantity": 1, "Items": [{"Id": "ec2", "DomainName": "$DNS",
    "CustomOriginConfig": {"HTTPPort": 80, "HTTPSPort": 443, "OriginProtocolPolicy": "http-only", "OriginReadTimeout": 60}}]},
  "DefaultCacheBehavior": {"TargetOriginId": "ec2", "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {"Quantity": 7, "Items": ["GET","HEAD","OPTIONS","PUT","POST","PATCH","DELETE"], "CachedMethods": {"Quantity": 2, "Items": ["GET","HEAD"]}},
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
    "OriginRequestPolicyId": "b689b0a8-53d0-40ab-baf2-68738e2966ac",
    "Compress": true}
}
EOF
CF=$($AWS cloudfront create-distribution --distribution-config "file://$BUILD/cf.json" --query 'Distribution.DomainName' --output text)
echo "HTTPS (ready in ~5-10 min): https://$CF"
echo "$IID $DNS $CF" > "$BUILD/last-deploy.txt"
