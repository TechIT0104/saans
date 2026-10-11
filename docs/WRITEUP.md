# Saans: know why your air is bad, and what to do about it

**Track:** Air · **Repo:** https://github.com/TechIT0104/saans · **Live:** https://13-207-153-59.sslip.io

## The problem
More than 64% of India's districts have no continuous air-quality monitor, and only about 15% of people live within 10 km of one. Fixed stations also miss what happens in your lane: in Bengaluru, a waste fire spiked one street while the station 3 km away saw nothing. The worst air is often indoors. In low-income homes in Pune, median PM2.5 was 167 µg/m³ (11 times the WHO guideline), driven by mosquito coils, incense and wood fuel. AQI apps give people a number, but not the cause, and not what to do.

## What we built
Saans turns a phone into an air-pollution inspector.
- **Air where you are.** India AQI (CPCB scale) for any point, from the CAMS forecast: hour-by-hour values, the cleanest hours and a 5-day outlook. The interface's sky colour and particles follow the live AQI and wind.
- **360° scan.** 4–6 photos around and inside the home. Our **YOLO11 smoke/fire detector** (trained on 21,527 D-Fire images, mAP@50 0.77) and our **ConvNeXt haze model** (trained on 12,240 India/Nepal photos) run first. Then **Qwen2.5-VL** on our GPU names each source: garbage burning, construction dust, traffic, kilns, DG sets, coils, agarbatti, chulhas, closed windows. The sources are ranked by how much each one affects this household.
- **Room estimate**, split into "from outside" and "from inside" and labelled as an estimate.
- **Family action plan**, free fixes first, tailored to children, elders, asthma, pregnancy and outdoor workers. Available in English and Hindi, with voice.
- **One-tap complaint** for violations, citing the SWM Rules 2016 and the NGT's ₹5,000 / ₹25,000 compensation, shareable with the photo.
- **Community map** of anonymous reports, showing hotspots where no monitor exists.

**An honest finding that shaped the design.** With a split that keeps locations and days apart, a sky photo alone predicts the 6 AQI classes with only 15% accuracy, and 3 haze levels with 45% (chance is 33%). So Saans takes the number from the forecast and uses the camera for what it is good at: seeing sources.

## Where AWS fits
- **Amazon EC2** (m7i-flex.large, Amazon Linux 2023) hosts the FastAPI app and both trained ONNX models, behind HTTPS.
- **Amazon S3** stores the model artifacts and app bundle. The instance pulls them with a least-privilege **IAM role** on every start.
- **Amazon DynamoDB** stores the anonymous community reports behind the map.
- **Amazon Polly** (Kajal, Hindi and English) reads the plan aloud.
- **Amazon Bedrock** (Nova, Converse API) is wired in as the scene-analysis backend. Our Free-plan account cannot call it, so that step runs on Qwen2.5-VL on our own GPU, which also trained both models. Switching takes one environment variable.
