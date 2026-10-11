# Saans: 3-minute demo video script

**Setup before recording**
- Laptop: Chrome at `http://localhost:8000/?lat=28.6519&lon=77.2315&place=Old%20Delhi`. Press F12, turn on device mode (Ctrl+Shift+M), choose **iPhone 14 Pro Max** and zoom to 100%. Close DevTools panels you don't need.
- The local server must be running with the GPU vision service (tunnel up), plus `SAANS_TABLE=saans-reports` so reports go to DynamoDB.
- Have `docs/demo-photos/` ready for the file picker: burning_panvel, construction, traffic_delhi, coil, kitchen.
- Open these AWS console tabs: **EC2** (instance "saans" running), **S3** (bucket `saans-artifacts-…`, `models/` folder), **DynamoDB** (table `saans-reports` → Explore items).
- Record with OBS or Xbox Game Bar (Win+Alt+R), 1080p. Record the voice separately if that's easier.

| Time | Screen | Voice-over |
|---|---|---|
| 0:00–0:15 | Black screen with white text: "64% of India's districts have no air-quality monitor." Then: "The AQI on your phone is someone else's air." | "Sixty-four percent of India's districts have no air monitor. Even in Bengaluru, a garbage fire spiked the air in one lane, and the official station three kilometres away never saw it." |
| 0:15–0:30 | The app opens on the Air tab: Old Delhi, the hazy sky, drifting particles. | "Meet Saans. The sky on screen *is* the air: its colour follows the live AQI, and the particles thicken with PM2.5 and drift with the real wind." |
| 0:30–0:45 | Scroll: cleanest hours, the hourly strip, 5 days (it climbs to Very Poor). | "For any spot in India, monitor or not, Saans shows the hour-by-hour AQI from the CAMS satellite-model forecast, the cleanest time to step out, and the week ahead: Very Poor from Tuesday as stubble season starts. But a number doesn't tell you why." |
| 0:45–1:05 | Scan tab. Tap Child and Asthma. Add the 5 photos (Front: burning, Right: construction, Back: traffic, Inside: coil, Kitchen: chulha). | "So you scan. Turn around, take a photo in each direction, then inside your home, and tell Saans who lives with you." |
| 1:05–1:20 | Press **Analyse my air**. The progress steps tick (speed this part up 2x in editing). | "Our own models run first: a YOLO smoke-and-fire detector and a haze model we trained on our GPUs. Then a vision-language model on our GPU names every source." |
| 1:20–1:50 | Results: the headline, then the ranked sources (coil, chulha, garbage burning, construction, traffic) with Violation tags, then the photos with the red smoke box. | "It found the garbage being burnt at the end of the lane (that's illegal), the construction dust, the traffic. And inside: a mosquito coil and a wood chulha. Saans ranks them by how much each one hurts *this* family. Often the worst air is inside." |
| 1:50–2:05 | The room estimate card (Severe, with the inside vs outside bar). | "It estimates the air in your room: most of it comes from sources inside, not from outside." |
| 2:05–2:25 | The action list (Free tags, then the ₹ costs), then tap **Listen**. Tap हिंदी and show the same screen in Hindi. | "Then it tells you what to do, free fixes first, tailored to a child and an asthma patient. In English or Hindi, and spoken aloud with Amazon Polly." |
| 2:25–2:40 | The complaint card: scroll the letter and tap WhatsApp. | "For the garbage fire, Saans drafts a complaint with the time, the location and the NGT rule it breaks. Open burning carries a five-thousand-rupee fine. One tap to send it with the photo." |
| 2:40–2:50 | Map tab with the new dot. Cut to AWS console: EC2 instance running, S3 models, the DynamoDB item that just appeared. Then the live URL on a phone. | "Every scan adds an anonymous point to a community map, so the hotspots monitors miss become visible. It runs on AWS: EC2, models in S3, reports in DynamoDB, voice from Polly. The models were trained on our own GPUs." |
| 2:50–3:00 | Logo and tagline: "Every AQI app gives you a number. Saans gives you the reason, and the remedy." Show the GitHub link. | "Every AQI app gives you a number. Saans gives you the reason, and the remedy." |

**Upload:** YouTube, set to **Unlisted**, under 3:00. Open the link in an incognito window to check it plays.
