# Saans: know why your air is bad, and what to do about it

**Track: Air.** Built for AWS Environmental Hacks (WeMakeDevs × AWS, Bharat Builds Tour, Oct 2026).

Every AQI app gives you a number. None of them tells you *why* the air in your lane is bad, or what *you* can do tonight. Saans does.

## The problem

- **Most of India has no air monitor.** Over 64% of India's 742 districts have no continuous air-quality monitoring, and only about 15% of people live within 10 km of a monitor (CSE, *State of India's Environment 2026*).
- **Monitors miss what happens in your lane.** In Bengaluru, low-cost sensors caught a sharp spike from someone burning dry waste. The official station 3 km away never registered it.
- **The worst air is often inside.** In 166 low-income homes in Pune, median indoor PM2.5 was 167 µg/m³, about 11 times the WHO guideline. Mosquito coils, incense and wood fuel were linked to the highest levels.
- **Burning waste is illegal, but nobody has proof.** The NGT banned open waste burning in 2016, with ₹5,000 compensation per incident (₹25,000 for bulk). Enforcement needs evidence: a photo, a place and a time.

## What Saans does

1. **Air where you are, hour by hour.** India AQI (CPCB NAQI scale) for your exact location from the CAMS satellite-model forecast, including places with no monitor. Shows the cleanest hours today, the worst hour, a 5-day outlook, and what a day of this air equals in **cigarettes** (Berkeley Earth: 22 µg/m³ of PM2.5 for 24 h ≈ 1 cigarette).
2. **Smoke Watch.** Live NASA FIRMS satellite fire detections (VIIRS, last 24 h) combined with the 850 hPa wind forecast: how many fires are **upwind of you**, which direction the smoke is coming from, and roughly when it can arrive. The map draws the wind cone and lights up the fires inside it.
3. **360° scan.** Take 4–6 photos: four directions outside and one or two inside your home. Saans:
   - draws boxes around **smoke and fire** with our YOLO11 detector, fine-tuned on 21,527 D-Fire images on our GPUs;
   - reads **visible haze** with our ConvNeXt model, fine-tuned on 12,240 India/Nepal photos tagged with station AQI;
   - **names and boxes every pollution source** with an open vision-language model (Qwen2.5-VL-7B, visual grounding) running on our own GPU, one photo at a time: garbage burning, construction dust, broken roads, traffic, DG sets, chimneys, kilns, mosquito coils, agarbatti, chulhas, closed windows, damp walls and more;
   - **ranks the sources** by how much each one is likely hurting *this* household.
4. **Your room's air (estimate) and a what-if simulator.** Outdoor PM2.5 × ventilation, plus the indoor sources it saw, shown as a range with a "from outside" vs "from inside" split and a cigarette equivalent. Tap "remove the coil", "open the windows" or "run a DIY filter" and watch the room's AQI fall live.
5. **An action plan for your family,** with free actions first. It's tailored to who lives with you (child, elderly, asthma, pregnant, outdoor worker) and includes myth-busting ("plants don't clean air").
6. **A complaint with evidence.** For outdoor violations, Saans drafts a complaint in English or Hindi with the time, location, what was seen and the rule it breaks. It can be shared with the photo via WhatsApp, email or the share sheet.
7. **A shareable family air report.** One tap turns the scan into an image card for a family or RWA WhatsApp group.
8. **Community map and ward-officer view.** Each scan adds an anonymous report (location rounded to ~100 m, no photos), drawn over a live AQI grid (one square per 40 km model cell). Reports within ~500 m are grouped into hotspots, violations are flagged, and officers can download a CSV inspection list.
9. **Hindi everywhere,** plus a spoken summary through Amazon Polly.
10. **A living interface.** The sky colour follows the live AQI, and the particles on screen get denser with PM2.5 and drift in the real wind direction.

## Architecture

```
Phone browser ──HTTPS (Caddy + Let's Encrypt)──> Amazon EC2 (FastAPI, m7i-flex.large)
                    ├─ ONNX Runtime: haze model + smoke detector (trained on our GPUs, served on CPU)
                    ├─ Amazon Polly: Hindi / English voice
                    ├─ Amazon DynamoDB: anonymous community reports
                    ├─ Scene analysis: Qwen2.5-VL-7B on our GPU (gpu_service/vl_server.py)
                    │    or Amazon Bedrock (Nova) with SAANS_LLM_BACKEND=bedrock
                    ├─ NASA FIRMS VIIRS active fires (24 h) + Open-Meteo 850 hPa wind: Smoke Watch
                    └─ Open-Meteo (CAMS) air-quality + weather forecast
Amazon S3: model artifacts + app bundle, pulled by the EC2 instance role (least-privilege IAM) at every start
```

**Training** ran on our lab GPUs (RTX 5000 Ada and 3× RTX 3090). The trained models are exported to ONNX and served on CPU on EC2.

**Note on Bedrock.** The code supports Amazon Bedrock (Nova via the Converse API, with tool-forced JSON output). Our AWS account is on the Free plan, where Bedrock calls return "Operation not allowed", so scene analysis runs on Qwen2.5-VL on our own GPU. The public EC2 deployment runs the air forecast, both trained models, Polly, DynamoDB and the map. Full source naming needs the GPU service or a paid-plan Bedrock account. Switch with one environment variable.

## Models and honest results

| Model | Data | Result on held-out data |
|---|---|---|
| Haze (ConvNeXt-Tiny, 3 levels: clear / hazy / heavy) | 12,240 photos, India + Nepal, labelled with station AQI | **45% exact (chance is 33%), 79% within one level**, on days and places never seen in training |
| Smoke / fire detector (YOLO11s) | D-Fire, 21,527 images | **mAP@50 0.77** on 4,306 test images (smoke 0.83, fire 0.72) |
| Source naming (Qwen2.5-VL-7B, zero-shot) | n/a | On our 5-photo demo set, all 6 sources found (garbage burning, garbage heap, construction, traffic, mosquito coil, chulha) |

**One finding shaped the product.** The photo dataset comes in bursts (many frames from one place in one hour). With a random split, a photo-only AQI model looks excellent. When we split by location and day, so the test set really is unseen, exact 6-class accuracy fell to 15%. **A sky photo cannot measure AQI.** So Saans takes the *number* from the forecast model and uses the camera for what cameras are good at: **seeing the sources.**

## Run locally

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000
# needs AWS credentials with Bedrock access for scene analysis; everything else works without them
```

Environment: `AWS_REGION`, `SAANS_VISION_MODEL`, `SAANS_TEXT_MODEL` (Bedrock model or inference-profile IDs), `SAANS_TABLE` (DynamoDB table; local JSON if unset).

Training: `training/train_haze.py`, `training/prep_dfire.py`, `training/train_smoke.py`. GPU scene service: `gpu_service/vl_server.py`. Deploy: `deploy/deploy.sh`.

Live: https://13-207-153-59.sslip.io

## Limits

- The forecast grid is ~45 km. Local hotspots are exactly why the scan exists, but the hourly number is regional.
- The indoor figure is an estimate from published Indian household and chamber studies, not a sensor reading.
- Source naming comes from a vision-language model and can be wrong. Every source shows the evidence it is based on, so the user can judge.

## Credits and licences

- Air Pollution Image Dataset from India and Nepal (Rouniyar et al.; Kaggle `adarshrouniyar/air-pollution-image-dataset-from-india-and-nepal`).
- D-Fire dataset (Venâncio et al., *Neural Computing and Applications*, 2022), via the Hugging Face mirror `badsaarow/d-fire`.
- Ultralytics YOLO11 (AGPL-3.0), timm ConvNeXt, ONNX Runtime.
- Qwen2.5-VL-7B-Instruct (Apache-2.0).
- Demo photos (Wikimedia Commons, `docs/demo-photos/`):
  - "A burning roadside garbage dump at Panvel Naka near Mumbai", Sumaira Abdulali, CC BY-SA 4.0
  - "Bangalore building under construction", Saad Faruque, CC BY-SA 2.0
  - "Heavy Traffic Jam in Delhi", Srvkumar09, CC BY-SA 4.0
  - "Burning mosquito coil", Ant1234567, CC BY-SA 4.0
  - "Grandmother preparing food inside traditional kitchen (edited)", Mithun Kunwar / Radomianin, CC BY-SA 4.0
- Air-quality forecasts: Copernicus Atmosphere Monitoring Service (CAMS), via Open-Meteo. Maps: © OpenStreetMap contributors.
- Fire data: we acknowledge the use of data from NASA's Fire Information for Resource Management System (FIRMS), part of NASA's Earth Science Data and Information System (ESDIS).
- Cigarette equivalence: Berkeley Earth (Muller & Muller, 2015).
