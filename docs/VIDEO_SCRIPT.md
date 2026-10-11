# Saans: 3-minute demo video script

**Setup before recording**
- Laptop: Chrome at `http://localhost:8000/?lat=28.6519&lon=77.2315&place=Old%20Delhi`. Press F12, turn on device mode (Ctrl+Shift+M), choose **iPhone 14 Pro Max**, zoom 100%.
- The local server must be running with the GPU vision service (tunnel up) and `SAANS_TABLE=saans-reports`.
- Photos for the file picker: `docs/demo-photos/` (burning_panvel, construction, traffic_delhi, coil, kitchen).
- AWS console tabs: **EC2** (instance "saans"), **S3** (`saans-artifacts-…/models`), **DynamoDB** (`saans-reports` → Explore items).
- Record at 1080p (Win+Alt+R or OBS). Speed up the 40-second analysis in editing.

| Time | Screen | Voice-over |
|---|---|---|
| 0:00–0:12 | White text on black: "64% of India's districts have no air monitor." | "Sixty-four percent of India's districts have no air monitor. And the AQI on your phone never tells you *why* your air is bad." |
| 0:12–0:32 | Air tab: hazy sky, drifting particles, AQI 129, the cigarette pill, then the Smoke Watch card. | "This is Saans. The sky *is* the air: its colour follows the live AQI and the particles drift with the real wind. A day of this air equals about three cigarettes. And Smoke Watch reads NASA satellites live: 104 farm fires are upwind of Delhi right now, and their smoke can arrive in about a day." |
| 0:32–0:47 | Map tab: the AQI grid, the dashed wind cone, the red fires inside it. | "The map shows the AQI across the region, the cone the wind is coming from, and every fire inside it." |
| 0:47–1:02 | Scan tab: tap Child and Asthma, add the 5 photos. | "Then you scan. One photo in each direction, one inside, and tell Saans who lives with you." |
| 1:02–1:12 | Analyse my air, then the progress steps (sped up). | "Our own models run first: a smoke-and-fire detector and a haze model we trained on our GPUs. Then a vision AI on our GPU finds every source." |
| 1:12–1:40 | Results: the "What Saans saw" photos with yellow boxes around the chulha, coil, garbage fire, construction and traffic. Then the ranked list with Violation tags. | "It boxes every source it finds: the garbage being burnt, the construction, the traffic, and inside, a mosquito coil and a wood chulha. It ranks them by harm to *this* family. The worst air is inside." |
| 1:40–2:02 | Room card: AQI 458–500, Severe, about 26 cigarettes a day. Tap "Remove wood chulha", then "Remove mosquito coil", then "Open the windows": the number drops and the colour changes. | "The child's room is Severe, like smoking twenty-six cigarettes a day. But watch: remove the coil, open the window, and the room drops to Moderate. That's what a family can actually change tonight." |
| 2:02–2:17 | Action plan (Free tags), tap हिंदी, tap Listen. | "Free fixes first, in English or Hindi, read aloud with Amazon Polly." |
| 2:17–2:32 | Complaint card, then tap "Create report card" and show the card. | "For the garbage fire, a complaint citing the NGT rule, ready to send with the photo. And a report card for the family's WhatsApp group." |
| 2:32–2:47 | Map, scrolled down: "For ward officers", then Download CSV. Cut to AWS: EC2 running, S3 models, the new DynamoDB item. | "Every scan becomes an anonymous hotspot for ward officers, with an inspection list they can download. It all runs on AWS: EC2, S3, DynamoDB and Polly." |
| 2:47–3:00 | Logo and tagline, then the GitHub link. | "Every AQI app gives you a number. Saans gives you the reason, and the remedy." |

**Upload:** YouTube, **Unlisted**, under 3:00. Check the link plays in an incognito window.
