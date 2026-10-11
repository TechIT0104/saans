"""What Saans knows about pollution sources: what they add, what to do, and which rule they break.

Indoor increments are rough evening-average PM2.5 additions (µg/m³) for a typical small Indian
room, used only to rank sources and give an estimated range. Basis: Pune low-income homes
(median 24-h PM2.5 167 µg/m³; coils, incense and wood fuel associated with higher levels,
PMC6013356) and chamber studies of coil/incense emissions. They are estimates, not measurements.
"""

SOURCES = {
    # outdoor
    "garbage_burning": {"en": "Garbage / waste burning", "hi": "कचरा जलाना", "where": "outdoor", "severity": 3, "violation": "burning"},
    "crop_residue_burning": {"en": "Crop residue (stubble) burning", "hi": "पराली जलाना", "where": "outdoor", "severity": 3, "violation": "burning"},
    "open_fire_smoke": {"en": "Open fire / smoke", "hi": "खुली आग / धुआँ", "where": "outdoor", "severity": 2, "violation": None},
    "construction_dust": {"en": "Construction / demolition dust", "hi": "निर्माण की धूल", "where": "outdoor", "severity": 2, "violation": "construction"},
    "unpaved_road_dust": {"en": "Dust from unpaved or broken road", "hi": "कच्ची/टूटी सड़क की धूल", "where": "outdoor", "severity": 2, "violation": "road"},
    "traffic_congestion": {"en": "Heavy traffic / idling vehicles", "hi": "भारी ट्रैफिक / खड़े वाहन", "where": "outdoor", "severity": 2, "violation": None},
    "diesel_generator": {"en": "Diesel generator", "hi": "डीज़ल जनरेटर", "where": "outdoor", "severity": 2, "violation": "industrial"},
    "industrial_chimney": {"en": "Industrial chimney / stack", "hi": "फैक्ट्री की चिमनी", "where": "outdoor", "severity": 3, "violation": "industrial"},
    "brick_kiln": {"en": "Brick kiln", "hi": "ईंट भट्ठा", "where": "outdoor", "severity": 3, "violation": "industrial"},
    "landfill_dump": {"en": "Open garbage dump", "hi": "खुला कूड़ा ढेर", "where": "outdoor", "severity": 2, "violation": "dump"},
    # indoor
    "mosquito_coil": {"en": "Mosquito coil", "hi": "मच्छर कॉइल", "where": "indoor", "severity": 3, "add": 100},
    "incense_dhoop": {"en": "Incense / agarbatti / dhoop", "hi": "अगरबत्ती / धूप", "where": "indoor", "severity": 2, "add": 60},
    "biomass_chulha": {"en": "Wood / dung / coal chulha", "hi": "लकड़ी/उपले का चूल्हा", "where": "indoor", "severity": 3, "add": 300},
    "lpg_stove_no_exhaust": {"en": "Cooking without exhaust or chimney", "hi": "बिना एग्ज़ॉस्ट के खाना पकाना", "where": "indoor", "severity": 1, "add": 30},
    "smoking": {"en": "Tobacco smoking", "hi": "धूम्रपान", "where": "indoor", "severity": 3, "add": 50},
    "kerosene_lamp": {"en": "Kerosene lamp / stove", "hi": "मिट्टी तेल का दीया/स्टोव", "where": "indoor", "severity": 2, "add": 40},
    "dampness_mold": {"en": "Damp walls / mould", "hi": "सीलन / फफूंद", "where": "indoor", "severity": 2, "add": 0},
    "fresh_paint_chemicals": {"en": "Fresh paint / strong chemicals", "hi": "ताज़ा पेंट / रसायन", "where": "indoor", "severity": 1, "add": 0},
}

# Fraction of outdoor PM2.5 that ends up indoors (literature range for naturally ventilated homes ~0.6-1.0).
INFILTRATION = {"open": 0.9, "closed": 0.65, "unknown": 0.8, "purifier": 0.35}


def indoor_estimate(outdoor_pm25: float, ventilation: str, indoor_sources: list[str], purifier: bool) -> dict:
    f = INFILTRATION["purifier"] if purifier else INFILTRATION.get(ventilation, 0.8)
    base = outdoor_pm25 * f
    contrib = [{"source": s, "add": SOURCES[s].get("add", 0)} for s in indoor_sources if SOURCES.get(s, {}).get("add")]
    vent_mult = 1.3 if ventilation == "closed" else 1.0  # sources build up faster in a closed room
    add = sum(c["add"] for c in contrib) * vent_mult * (0.5 if purifier else 1.0)
    mid = base + add
    return {
        "pm25_mid": round(mid), "pm25_low": round(mid * 0.7), "pm25_high": round(mid * 1.3),
        "from_outside": round(base), "from_inside": round(add),
        "contributions": sorted(contrib, key=lambda c: -c["add"]),
        "assumptions": f"Infiltration factor {f}; indoor-source increments from published Indian household and chamber studies. This is an estimate, not a measurement.",
    }


# Ranked action library. cost in ₹ (0 = free). impact 3 = biggest. members: who it matters most for.
ACTIONS = {
    "mosquito_coil": [
        {"en": "Stop burning the coil indoors. Use a mosquito net or a plug-in liquid vaporiser with the window slightly open.",
         "hi": "कमरे में कॉइल जलाना बंद करें। मच्छरदानी या लिक्विड वेपोराइज़र इस्तेमाल करें, खिड़की थोड़ी खुली रखें।", "cost": 300, "impact": 3},
    ],
    "incense_dhoop": [
        {"en": "Light agarbatti only near an open window or outside, and for a few minutes, not in the bedroom.",
         "hi": "अगरबत्ती खुली खिड़की के पास या बाहर, थोड़ी देर के लिए ही जलाएँ, सोने के कमरे में नहीं।", "cost": 0, "impact": 2},
    ],
    "biomass_chulha": [
        {"en": "Keep children and elders out of the kitchen while the chulha burns, and cook with the door and window open.",
         "hi": "चूल्हा जलते समय बच्चों और बुज़ुर्गों को रसोई से दूर रखें, दरवाज़ा-खिड़की खुले रखकर पकाएँ।", "cost": 0, "impact": 3},
        {"en": "Check eligibility for a free LPG connection under PM Ujjwala Yojana.",
         "hi": "प्रधानमंत्री उज्ज्वला योजना में मुफ़्त LPG कनेक्शन की पात्रता जाँचें।", "cost": 0, "impact": 3},
    ],
    "lpg_stove_no_exhaust": [
        {"en": "Run an exhaust fan or open the kitchen window while cooking, especially when frying.",
         "hi": "खाना पकाते समय (ख़ासकर तलते समय) एग्ज़ॉस्ट चलाएँ या रसोई की खिड़की खोलें।", "cost": 0, "impact": 1},
    ],
    "smoking": [
        {"en": "Smoke only outdoors, away from children. Indoor smoke lingers for hours.",
         "hi": "धूम्रपान सिर्फ़ बाहर, बच्चों से दूर करें। घर के अंदर धुआँ घंटों रहता है।", "cost": 0, "impact": 3},
    ],
    "kerosene_lamp": [
        {"en": "Replace the kerosene lamp with a solar or rechargeable LED lamp.",
         "hi": "मिट्टी तेल के दीये की जगह सोलर या रिचार्जेबल LED लैंप लें।", "cost": 400, "impact": 2},
    ],
    "dampness_mold": [
        {"en": "Dry and clean the damp patch with diluted bleach and improve cross-ventilation. Mould triggers asthma.",
         "hi": "सीलन वाली जगह को सुखाएँ, पतले ब्लीच से साफ़ करें और हवा आने-जाने दें। फफूंद से दमा बढ़ता है।", "cost": 100, "impact": 2},
    ],
    "fresh_paint_chemicals": [
        {"en": "Keep the room aired out for 2-3 days and don't sleep there until the smell is gone.",
         "hi": "2-3 दिन कमरे में हवा आने दें, गंध जाने तक वहाँ न सोएँ।", "cost": 0, "impact": 1},
    ],
    "garbage_burning": [
        {"en": "Shut windows on the side facing the fire while it burns, and file a complaint with the photo (open burning is banned).",
         "hi": "आग जलते समय उस तरफ़ की खिड़कियाँ बंद करें और फ़ोटो के साथ शिकायत करें (खुले में कचरा जलाना प्रतिबंधित है)।", "cost": 0, "impact": 3},
        {"en": "Talk to neighbours and the RWA: give dry waste to the kabadiwala or waste collector instead of burning it.",
         "hi": "पड़ोसियों और RWA से बात करें: सूखा कचरा जलाने के बजाय कबाड़ीवाले या कचरा गाड़ी को दें।", "cost": 0, "impact": 2},
    ],
    "crop_residue_burning": [
        {"en": "Keep windows shut in the evening when smoke drifts in, and report the burning to the district administration.",
         "hi": "शाम को धुआँ आने पर खिड़कियाँ बंद रखें और ज़िला प्रशासन को सूचना दें।", "cost": 0, "impact": 2},
    ],
    "construction_dust": [
        {"en": "Report uncovered material and no water spraying at the site. Keep the windows on that side closed during work hours.",
         "hi": "बिना ढके मटेरियल और पानी का छिड़काव न होने की शिकायत करें। काम के समय उस तरफ़ की खिड़कियाँ बंद रखें।", "cost": 0, "impact": 2},
    ],
    "unpaved_road_dust": [
        {"en": "Wet-mop floors instead of sweeping, and request road repair or paving from the ward office.",
         "hi": "झाड़ू की जगह गीला पोछा लगाएँ और वार्ड ऑफिस से सड़क मरम्मत की माँग करें।", "cost": 0, "impact": 2},
    ],
    "traffic_congestion": [
        {"en": "Walk or let children play on the inner lane side, not the main road, and avoid peak traffic hours.",
         "hi": "बच्चों को मुख्य सड़क से दूर अंदर की गली में खेलने दें, ट्रैफिक के पीक समय से बचें।", "cost": 0, "impact": 1},
    ],
    "diesel_generator": [
        {"en": "Ask the owner to place the generator exhaust away from homes, and report it if it runs for long periods.",
         "hi": "जनरेटर का धुआँ घरों से दूर रखने को कहें, लंबे समय तक चले तो शिकायत करें।", "cost": 0, "impact": 2},
    ],
    "industrial_chimney": [
        {"en": "Report visible black smoke to the State Pollution Control Board with the photo and time.",
         "hi": "काला धुआँ दिखे तो फ़ोटो और समय के साथ राज्य प्रदूषण नियंत्रण बोर्ड को शिकायत करें।", "cost": 0, "impact": 2},
    ],
    "brick_kiln": [
        {"en": "Report the kiln to the State Pollution Control Board; keep windows shut when the wind blows from it.",
         "hi": "भट्ठे की शिकायत राज्य प्रदूषण नियंत्रण बोर्ड से करें; उस दिशा से हवा आए तो खिड़कियाँ बंद रखें।", "cost": 0, "impact": 2},
    ],
    "landfill_dump": [
        {"en": "Ask the municipality to clear the dump, and report it if it is ever set on fire.",
         "hi": "नगर निगम से कूड़ा ढेर हटाने को कहें, आग लगे तो तुरंत शिकायत करें।", "cost": 0, "impact": 2},
    ],
    "open_fire_smoke": [
        {"en": "Close windows facing the smoke until it clears.",
         "hi": "धुआँ हटने तक उस तरफ़ की खिड़कियाँ बंद रखें।", "cost": 0, "impact": 1},
    ],
}

GENERAL = {
    "purifier": {"en": "Build a DIY box-fan filter: a 20-inch box fan with MERV-13 filters taped on (Corsi-Rosenthal box). Cuts indoor PM2.5 sharply in a bedroom.",
                 "hi": "DIY एयर फ़िल्टर बनाएँ: बॉक्स फ़ैन पर MERV-13 फ़िल्टर टेप करें (Corsi-Rosenthal बॉक्स)। सोने के कमरे में PM2.5 काफ़ी घटता है।", "cost": 2500, "impact": 3},
    "mask": {"en": "On bad-air days, wear an N95 (not a cloth or surgical mask) outdoors.",
             "hi": "खराब हवा वाले दिन बाहर N95 मास्क पहनें (कपड़े या सर्जिकल मास्क से काम नहीं चलेगा)।", "cost": 50, "impact": 2},
    "plants_myth": {"en": "Myth: indoor plants do not clean air in any useful amount. Ventilation and filters do.",
                    "hi": "भ्रम: घर के पौधे हवा को ख़ास साफ़ नहीं करते। हवादारी और फ़िल्टर करते हैं।", "cost": 0, "impact": 0},
    "wet_mop": {"en": "Wet-mop instead of dry sweeping. Sweeping throws settled dust back into the air.",
                "hi": "सूखी झाड़ू की जगह गीला पोछा लगाएँ। झाड़ू से बैठी धूल फिर हवा में उड़ती है।", "cost": 0, "impact": 1},
}

MEMBER_ADVICE = {
    "child": {"en": "Child: shift outdoor play to the cleanest hours shown above; schools should hold assembly indoors on Poor days.",
              "hi": "बच्चे: बाहर खेलने का समय ऊपर दिखाए साफ़ घंटों में रखें; खराब हवा वाले दिन स्कूल में असेंबली अंदर हो।"},
    "elderly": {"en": "Elderly: skip early-morning walks on Poor days. Morning air is often the worst; walk at the cleanest hour instead.",
                "hi": "बुज़ुर्ग: खराब हवा वाले दिन सुबह की सैर टालें। सुबह की हवा अक्सर सबसे खराब होती है; साफ़ घंटे में टहलें।"},
    "asthma": {"en": "Asthma / heart patient: keep the reliever inhaler and medicines handy; spend the worst hours in the cleanest room.",
               "hi": "दमा / दिल के मरीज़: इनहेलर और दवाइयाँ पास रखें; सबसे खराब घंटे सबसे साफ़ कमरे में बिताएँ।"},
    "pregnant": {"en": "Pregnant: avoid smoke from chulha, coils and incense entirely; it is linked to low birth weight.",
                 "hi": "गर्भवती: चूल्हे, कॉइल और अगरबत्ती के धुएँ से पूरी तरह बचें; इससे बच्चे का वज़न कम होने का ख़तरा है।"},
    "outdoor_worker": {"en": "Outdoor worker: wear an N95 during the worst hours and take breaks away from traffic and fires.",
                       "hi": "बाहर काम करने वाले: सबसे खराब घंटों में N95 पहनें, आराम ट्रैफिक और आग से दूर करें।"},
}

# What the law says, used in complaints. Kept general and accurate.
VIOLATIONS = {
    "burning": "Open burning of waste is prohibited under the Solid Waste Management Rules, 2016. The National Green Tribunal (Dec 2016) set environmental compensation of ₹5,000 per incident of simple burning and ₹25,000 for bulk waste burning.",
    "construction": "The Construction & Demolition Waste Management Rules, 2016 and CPCB dust-control directions require construction material to be covered and dust to be suppressed with water spraying and screens.",
    "road": "Dust from broken and unpaved roads is a major PM10 source listed in city clean-air action plans under the National Clean Air Programme (NCAP).",
    "industrial": "Visible emissions from chimneys, kilns and generators must comply with the consent conditions and emission norms set by the State Pollution Control Board under the Air (Prevention and Control of Pollution) Act, 1981.",
    "dump": "The Solid Waste Management Rules, 2016 require municipal waste to be collected and processed, not dumped in the open.",
}

COMPLAINT_CHANNELS = [
    {"name": "CPCB Sameer app (air pollution complaints)", "url": None},
    {"name": "Swachhata-MoHUA app (garbage and burning)", "url": None},
    {"name": "Your municipal corporation / State Pollution Control Board", "url": None},
]
