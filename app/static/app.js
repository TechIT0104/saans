"use strict";

/* ---------- Icons (SF Symbols-style line icons) ---------- */
const P = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const ICONS = {
  wind: P('<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/>'),
  scan: P('<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.2"/>'),
  map: P('<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z"/><path d="M9 4v14M15 6v14"/>'),
  location: P('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  search: P('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
  clock: P('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  calendar: P('<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  chevron: P('<path d="m9 5 7 7-7 7"/>'),
  up: P('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  right: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  down: P('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  left: P('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  home: P('<path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>'),
  flame: P('<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 2.6-5 3.4-8.4C11.6 8.6 12.6 10.6 12.6 12c1-.6 1.6-2 1.6-3.4 2.4 1.8 3.8 4.4 3.8 6.8 0 3.2-2.4 5.6-6 5.6Z"/>'),
  close: P('<path d="M6 6l12 12M18 6 6 18"/>', 'stroke-width="2.4"'),
  speaker: P('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  alert: P('<path d="M12 4 2.8 19.5h18.4Z"/><path d="M12 10v4.2M12 17h.01"/>'),
  share: P('<path d="M12 15V4M8 8l4-4 4 4"/><path d="M6 12v6.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V12"/>'),
  copy: P('<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>'),
  mail: P('<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
  chat: P('<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z"/>'),
  check: P('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  satellite: P('<path d="m13 7 4 4M7.5 11.5l5-5 5 5-5 5z"/><path d="m5 14 5 5M3 16.5l4.5 4.5M16 3l5 5"/><path d="M18 14a4 4 0 0 1-4 4"/>'),
  cigarette: P('<rect x="2.5" y="13" width="15" height="4" rx="1"/><path d="M17.5 13v4M20 13v4M18.5 10c0-1.5-1.5-1.5-1.5-3s1.5-1.5 1.5-3M21 10c0-1.5-1.5-1.5-1.5-3"/>'),
  sliders: P('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
};
function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ""; });
}
const icon = (n, cls = "i") => `<span class="${cls}">${ICONS[n]}</span>`;

/* ---------- Copy ---------- */
const T = {
  en: {
    welcomePlace: "Your air, explained", welcomeCat: "Share your location to begin",
    useLocation: "Use my location", searchPh: "Search a town or city",
    aqiSource: "India AQI (CPCB scale) from the CAMS satellite-model forecast for your area. A nearby monitor may read differently.",
    bestTime: "Cleanest hours", worstTime: "Worst hour", next24: "Next 24 hours", next5: "Next 5 days",
    whyCta: "Find out why", scanTitle: "Air Scan",
    scanHelp: "Stand where you live. Take one photo in each direction, then one inside. Saans finds what is polluting your air.",
    whoLives: "Who lives with you", m_child: "Child", m_elderly: "Elderly", m_asthma: "Asthma or heart", m_pregnant: "Pregnant", m_worker: "Works outdoors",
    photos: "Photos", analyse: "Analyse my air",
    st1: "Reading the forecast for your spot", st2: "Detecting smoke and fire", st3: "Measuring haze in the sky",
    st4: "Identifying every pollution source", st5: "Writing your family's plan",
    mapTitle: "Community Map",
    mapHelp: "Every scan adds an anonymous point, rounded to about 100 metres, with no photos. Together they reveal the burning and dust hotspots that monitors miss.",
    tabAir: "Air", tabScan: "Scan", tabMap: "Map",
    slots: ["Front", "Right", "Back", "Left", "Inside", "Kitchen"], tap: "Add photo",
    needLoc: "Share your location on the Air tab first, so Saans knows where these photos are from.",
    sourcesTitle: "What is polluting your air",
    none: "No clear pollution source is visible in these photos. Your air is mostly the regional pollution shown on the Air tab.",
    roomTitle: "Your room right now", estimate: "Estimate", fromOut: "from outside air", fromIn: "from sources inside",
    actionsTitle: "What to do", free: "Free", tip: "Fact", complaintTitle: "Report it, with evidence",
    share: "Share", whatsapp: "WhatsApp", email: "Email", copy: "Copy", copied: "Copied",
    listen: "Listen", photosTitle: "What Saans saw", outdoor: "Outside", indoor: "Inside", active: "Active now",
    near: "Nearby", street: "On the street", far: "Far", inside: "Inside", law: "Violation", sendTo: "Send to",
    reports: "Reports", lastDays: "last 30 days", locating: "Finding you", locFail: "Couldn't get your location. Search for your town instead.",
    pm: "PM2.5", wind: "Wind", aiDown: "Source identification is unavailable right now. Showing what our smoke detector found.",
    haze: "Haze", seen: "Seen", estNote: "Estimated from outdoor air, ventilation and the sources seen. It is not a sensor reading.",
    now: "Now", seeMap: "See the community map", burning: "Burning", dust: "Dust", industry: "Industry", traffic: "Traffic", indoorOnly: "Indoor",
    scanFailed: "Scan failed", clear: "clear", hazy: "hazy", heavy: "heavy",
    aqiRange: "AQI across your region now", legendSources: "Dots: pollution sources found by people's scans",
    legendGrid: "Squares: live forecast AQI (one per 40 km model cell)",
    smokeTitle: "Smoke watch · NASA satellites, last 24 h", firesUpwind: "fires upwind of you",
    smokeLine: (w, s, d, e) => `Wind is coming from the ${w} at ${s} km/h. Smoke from these fires (median ${d} km away) can reach you in about ${e} hours.`,
    smokeCalm: "No fires are upwind of you right now.", firesNear: (n, r) => `${n} active fires detected within ${r} km.`,
    risk_high: "High risk", risk_medium: "Medium risk", risk_low: "Low risk", seeFires: "See the fires on the map",
    cigDay: (c) => `Breathing this air for a day ≈ ${c} cigarettes`, cigRoom: (c) => `≈ ${c} cigarettes a day`,
    legendFires: "Satellite fires (last 24 h)", fireUp: "Upwind of you", fireOther: "Other fires", cone: "Where your air is coming from",
    whatIf: "What if you…", wiRemove: "Remove", wiOpen: "Open the windows", wiFilter: "Run a DIY air filter",
    wiWas: (a, b) => `was ${a}–${b}`, firesUpCard: "Fires upwind",
    shareTitle: "Share this report", shareHelp: "Send your family or RWA group a one-page air report for this home.",
    shareCard: "Create report card", download: "Download", cardOutside: "outside", cardRoom: "Your room",
    cardSources: "What is polluting this home", cardDo: "Do this today", cardCig: (c) => `≈ ${c} cigarettes a day`,
    hotTitle: "For ward officers: hotspots to inspect", hotHelp: "Reports within about 500 m are grouped. Violations are flagged.",
    hotEmpty: "No reports yet in the last 30 days.", hotCsv: "Download inspection list (CSV)", hotReports: (n) => `${n} report${n === 1 ? "" : "s"}`,
    hotLast: "Last reported", openMaps: "Open in Maps",
  },
  hi: {
    welcomePlace: "आपकी हवा, आसान भाषा में", welcomeCat: "शुरू करने के लिए लोकेशन दें",
    useLocation: "मेरी लोकेशन", searchPh: "शहर या कस्बा खोजें",
    aqiSource: "आपके इलाके का भारत AQI (CPCB पैमाना), CAMS सैटेलाइट-मॉडल पूर्वानुमान से। पास के मॉनिटर का आँकड़ा अलग हो सकता है।",
    bestTime: "सबसे साफ़ समय", worstTime: "सबसे खराब समय", next24: "अगले 24 घंटे", next5: "अगले 5 दिन",
    whyCta: "वजह जानें", scanTitle: "हवा स्कैन",
    scanHelp: "जहाँ रहते हैं वहाँ खड़े होकर हर दिशा में एक फ़ोटो लें, फिर एक अंदर की। सांस बताएगा कि आपकी हवा को क्या गंदा कर रहा है।",
    whoLives: "आपके साथ कौन रहता है", m_child: "बच्चा", m_elderly: "बुज़ुर्ग", m_asthma: "दमा या दिल", m_pregnant: "गर्भवती", m_worker: "बाहर काम",
    photos: "फ़ोटो", analyse: "हवा जाँचें",
    st1: "आपकी जगह का पूर्वानुमान पढ़ रहे हैं", st2: "धुआँ और आग खोज रहे हैं", st3: "आसमान का धुंधलापन माप रहे हैं",
    st4: "हर प्रदूषण स्रोत पहचान रहे हैं", st5: "आपके परिवार का प्लान लिख रहे हैं",
    mapTitle: "कम्युनिटी नक्शा",
    mapHelp: "हर स्कैन एक गुमनाम बिंदु जोड़ता है, लगभग 100 मीटर तक, बिना फ़ोटो के। मिलकर ये वो जगहें दिखाते हैं जहाँ कचरा जलता है और धूल उड़ती है।",
    tabAir: "हवा", tabScan: "स्कैन", tabMap: "नक्शा",
    slots: ["सामने", "दाएँ", "पीछे", "बाएँ", "अंदर", "रसोई"], tap: "फ़ोटो जोड़ें",
    needLoc: "पहले हवा टैब पर लोकेशन दें, ताकि पता चले फ़ोटो कहाँ की हैं।",
    sourcesTitle: "आपकी हवा को क्या गंदा कर रहा है",
    none: "इन फ़ोटो में कोई साफ़ प्रदूषण स्रोत नहीं दिखा। आपकी हवा ज़्यादातर इलाके के प्रदूषण से है।",
    roomTitle: "आपका कमरा अभी", estimate: "अनुमान", fromOut: "बाहर की हवा से", fromIn: "अंदर के स्रोतों से",
    actionsTitle: "क्या करें", free: "मुफ़्त", tip: "तथ्य", complaintTitle: "सबूत के साथ शिकायत करें",
    share: "भेजें", whatsapp: "WhatsApp", email: "ईमेल", copy: "कॉपी", copied: "कॉपी हुआ",
    listen: "सुनें", photosTitle: "सांस ने क्या देखा", outdoor: "बाहर", indoor: "अंदर", active: "अभी चालू",
    near: "पास", street: "सड़क पर", far: "दूर", inside: "अंदर", law: "उल्लंघन", sendTo: "यहाँ भेजें",
    reports: "रिपोर्ट", lastDays: "पिछले 30 दिन", locating: "लोकेशन ढूँढ रहे हैं", locFail: "लोकेशन नहीं मिली। अपना शहर खोजें।",
    pm: "PM2.5", wind: "हवा", aiDown: "स्रोत पहचान अभी उपलब्ध नहीं है। हमारे धुआँ मॉडल के नतीजे दिखा रहे हैं।",
    haze: "धुंध", seen: "दिखा", estNote: "बाहर की हवा, हवादारी और दिखे स्रोतों से अनुमान। यह सेंसर की रीडिंग नहीं है।",
    now: "अभी", seeMap: "कम्युनिटी नक्शा देखें", burning: "जलाना", dust: "धूल", industry: "उद्योग", traffic: "ट्रैफ़िक", indoorOnly: "घर के अंदर",
    scanFailed: "स्कैन नहीं हो पाया", clear: "साफ़", hazy: "धुंधला", heavy: "घना",
    aqiRange: "अभी आपके इलाके में AQI", legendSources: "बिंदु: लोगों के स्कैन में मिले प्रदूषण स्रोत",
    legendGrid: "वर्ग: अभी का पूर्वानुमानित AQI (40 किमी का एक खाना)",
    smokeTitle: "धुआँ निगरानी · NASA सैटेलाइट, पिछले 24 घंटे", firesUpwind: "आग आपकी हवा की दिशा में",
    smokeLine: (w, s, d, e) => `हवा ${w} से ${s} किमी/घंटा की रफ़्तार से आ रही है। इन आगों (औसतन ${d} किमी दूर) का धुआँ लगभग ${e} घंटे में आप तक पहुँच सकता है।`,
    smokeCalm: "अभी आपकी हवा की दिशा में कोई आग नहीं है।", firesNear: (n, r) => `${r} किमी के अंदर ${n} सक्रिय आग मिलीं।`,
    risk_high: "ज़्यादा ख़तरा", risk_medium: "मध्यम ख़तरा", risk_low: "कम ख़तरा", seeFires: "नक्शे पर आग देखें",
    cigDay: (c) => `एक दिन यह हवा साँस में लेना ≈ ${c} सिगरेट`, cigRoom: (c) => `≈ ${c} सिगरेट रोज़`,
    legendFires: "सैटेलाइट से दिखी आग (24 घंटे)", fireUp: "आपकी हवा की दिशा में", fireOther: "बाकी आग", cone: "आपकी हवा कहाँ से आ रही है",
    whatIf: "अगर आप…", wiRemove: "हटाएँ", wiOpen: "खिड़कियाँ खोलें", wiFilter: "DIY एयर फ़िल्टर चलाएँ",
    wiWas: (a, b) => `पहले ${a}–${b}`, firesUpCard: "हवा की दिशा में आग",
    shareTitle: "यह रिपोर्ट भेजें", shareHelp: "अपने परिवार या RWA ग्रुप को इस घर की एक पन्ने की हवा रिपोर्ट भेजें।",
    shareCard: "रिपोर्ट कार्ड बनाएँ", download: "डाउनलोड", cardOutside: "बाहर", cardRoom: "आपका कमरा",
    cardSources: "इस घर की हवा को क्या गंदा कर रहा है", cardDo: "आज यह करें", cardCig: (c) => `≈ ${c} सिगरेट रोज़`,
    hotTitle: "वार्ड अधिकारियों के लिए: जाँच की जगहें", hotHelp: "लगभग 500 मीटर के अंदर की रिपोर्ट एक साथ गिनी गई हैं। उल्लंघन चिह्नित हैं।",
    hotEmpty: "पिछले 30 दिनों में अभी कोई रिपोर्ट नहीं।", hotCsv: "जाँच सूची डाउनलोड करें (CSV)", hotReports: (n) => `${n} रिपोर्ट`,
    hotLast: "आख़िरी रिपोर्ट", openMaps: "मैप में खोलें",
  },
};

const COLORS = { Good: "#34c759", Satisfactory: "#a3d14b", Moderate: "#f5c400", Poor: "#ff9500", "Very Poor": "#ff3b30", Severe: "#a2221b" };
const CAT_HI = { Good: "अच्छी", Satisfactory: "संतोषजनक", Moderate: "मध्यम", Poor: "खराब", "Very Poor": "बहुत खराब", Severe: "गंभीर" };
const SRC_COLORS = { burning: "#ff3b30", dust: "#c7883a", traffic: "#5e5ce6", industry: "#8e44ad", indoor: "#0a84ff", other: "#8e8e93" };
const SRC_GROUP = {
  garbage_burning: "burning", crop_residue_burning: "burning", open_fire_smoke: "burning", landfill_dump: "burning",
  construction_dust: "dust", unpaved_road_dust: "dust", traffic_congestion: "traffic", diesel_generator: "industry",
  industrial_chimney: "industry", brick_kiln: "industry",
};
const SLOT_ICONS = ["up", "right", "down", "left", "home", "flame"];

let lang = "en";
try { lang = localStorage.getItem("saans-lang") || "en"; } catch (e) {}
const state = { lat: null, lon: null, place: "", air: null, photos: [], members: new Set(), result: null, sources: {} };
const t = (k, ...args) => { const v = T[lang][k] ?? T.en[k] ?? k; return typeof v === "function" ? v(...args) : v; };
const CIG = 22; // Berkeley Earth: 22 µg/m³ of PM2.5 breathed for 24 h ≈ one cigarette
const PM25_BP = [[0, 30, 0, 50], [31, 60, 51, 100], [61, 90, 101, 200], [91, 120, 201, 300], [121, 250, 301, 400], [251, 500, 401, 500]];
function pmAqi(c) { for (const [lo, hi, a, b] of PM25_BP) if (c <= hi) { c = Math.max(c, lo); return Math.round(a + (b - a) * (c - lo) / (hi - lo)); } return 500; }
function aqiCat(a) { return a <= 50 ? "Good" : a <= 100 ? "Satisfactory" : a <= 200 ? "Moderate" : a <= 300 ? "Poor" : a <= 400 ? "Very Poor" : "Severe"; }
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const catLabel = (c) => (lang === "hi" ? CAT_HI[c] || c : c);
const locale = () => (lang === "hi" ? "hi-IN" : "en-IN");
const hh = (iso) => new Date(iso).toLocaleTimeString(locale(), { hour: "numeric", hour12: true }).replace(" ", "").toLowerCase();

/* ---------- Living sky: colour + particles follow the real air ---------- */
const sky = { pm: 25, cat: "none", windDir: 270, windSpeed: 6 };
function setSky(cat, pm25, windDir, windSpeed) {
  sky.cat = cat ? cat.replace(" ", "") : "none";
  sky.pm = pm25 ?? 25; sky.windDir = windDir ?? 270; sky.windSpeed = windSpeed ?? 6;
  document.body.dataset.cat = sky.cat;
  initParticles();
}
const cv = $("#particles"), ctx = cv.getContext("2d");
let parts = [], dpr = 1;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
}
function particleTint() {
  return { none: [255, 255, 255], Good: [255, 255, 255], Satisfactory: [255, 255, 255], Moderate: [250, 244, 225],
    Poor: [240, 215, 175], VeryPoor: [215, 180, 150], Severe: [185, 150, 125] }[sky.cat] || [255, 255, 255];
}
function initParticles() {
  const n = Math.round(Math.min(260, Math.max(24, sky.pm * 1.3)) * Math.min(1, innerWidth / 900 + 0.35));
  parts = Array.from({ length: n }, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height,
    r: (Math.random() * 1.8 + 0.6) * dpr * (sky.pm > 90 ? 1.25 : 1),
    a: Math.random() * 0.35 + (sky.pm > 90 ? 0.25 : 0.12), j: Math.random() * Math.PI * 2,
  }));
}
function frame() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  // Wind direction is where the wind comes FROM; particles move the opposite way.
  const ang = ((sky.windDir + 180) % 360) * Math.PI / 180;
  const sp = (0.15 + Math.min(sky.windSpeed, 30) / 30) * dpr;
  const vx = Math.sin(ang) * sp, vy = -Math.cos(ang) * sp * 0.4;
  const [r, g, b] = particleTint();
  for (const p of parts) {
    p.j += 0.01;
    p.x += vx + Math.cos(p.j) * 0.15 * dpr; p.y += vy + Math.sin(p.j) * 0.12 * dpr;
    if (p.x < -10) p.x = cv.width + 10; if (p.x > cv.width + 10) p.x = -10;
    if (p.y < -10) p.y = cv.height + 10; if (p.y > cv.height + 10) p.y = -10;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`; ctx.fill();
  }
  if (!reduceMotion) requestAnimationFrame(frame);
}
addEventListener("resize", () => { resize(); initParticles(); });
resize(); initParticles(); frame();

/* ---------- Language ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll(".segmented button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  document.querySelectorAll("[data-i18n]").forEach((el) => { if (!(state.air && ["welcomePlace", "welcomeCat"].includes(el.dataset.i18n))) el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  renderSlots();
  if (state.air) renderAir();
  if (state.result) renderResult(false);
}
document.querySelectorAll(".segmented button").forEach((b) => (b.onclick = () => {
  lang = b.dataset.lang;
  try { localStorage.setItem("saans-lang", lang); } catch (e) {}
  applyLang();
}));

/* ---------- Tabs ---------- */
function goto(tab) {
  document.querySelectorAll(".tab").forEach((s) => s.classList.toggle("active", s.id === "tab-" + tab));
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  window.scrollTo({ top: 0 });
  if (tab === "map") loadMap();
}
document.querySelectorAll(".tabbar button").forEach((b) => (b.onclick = () => goto(b.dataset.tab)));
document.addEventListener("click", (e) => { const g = e.target.closest("[data-goto]"); if (g) goto(g.dataset.goto); });

/* ---------- Location ---------- */
$("#locBtn").onclick = () => {
  $("#aqiCat").textContent = t("locating");
  navigator.geolocation.getCurrentPosition(
    (p) => setLocation(p.coords.latitude, p.coords.longitude, ""),
    () => { $("#aqiCat").textContent = t("locFail"); },
    { enableHighAccuracy: true, timeout: 15000 }
  );
};
$("#searchForm").onsubmit = async (e) => {
  e.preventDefault();
  const q = $("#searchIn").value.trim();
  if (!q) return;
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&countryCode=IN&language=${lang}`).then((r) => r.json());
  const box = $("#searchResults");
  box.innerHTML = "";
  (r.results || []).forEach((x) => {
    const b = document.createElement("button");
    b.textContent = [x.name, x.admin2, x.admin1].filter(Boolean).join(", ");
    b.onclick = () => { box.innerHTML = ""; $("#searchIn").value = ""; setLocation(x.latitude, x.longitude, x.name); };
    box.appendChild(b);
  });
};
async function reverseName(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&accept-language=${lang}`).then((r) => r.json());
    const a = r.address || {};
    return a.suburb || a.neighbourhood || a.village || a.town || a.city || a.state_district || "";
  } catch (e) { return ""; }
}
async function setLocation(lat, lon, name) {
  state.lat = lat; state.lon = lon;
  state.place = name || (await reverseName(lat, lon)) || `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
  const r = await fetch(`/api/air?lat=${lat}&lon=${lon}`);
  if (!r.ok) { $("#aqiCat").textContent = "Air data unavailable. Try again."; return; }
  state.air = await r.json();
  renderAir();
  updateScanBtn();
}

function renderAir() {
  const a = state.air, n = a.now;
  setSky(n.category, n.pm25, n.wind_dir, n.wind_speed);
  $("#airView").hidden = false;
  $(".locbar").classList.add("compact");
  $("#placeName").innerHTML = `${icon("location", "i")} ${esc(state.place)}`;
  $("#placeName").querySelector(".i").style.cssText = "width:16px;height:16px;vertical-align:-2px";
  $("#aqiNum").textContent = n.aqi ?? "--";
  $("#aqiCat").textContent = catLabel(n.category);
  const pms = a.next24.map((h) => h.pm25).filter((v) => v != null);
  if (pms.length) {
    const cig = (pms.reduce((x, y) => x + y, 0) / pms.length / CIG).toFixed(1);
    $("#cig").hidden = false;
    $("#cig").innerHTML = `${icon("cigarette")}<span>${t("cigDay", cig)}</span>`;
  }
  loadSmoke();
  $("#aqiSub").textContent = `${t("pm")} ${Math.round(n.pm25)} µg/m³  ·  ${t("wind")} ${Math.round(n.wind_speed ?? 0)} km/h`;
  const end = a.best_window && new Date(new Date(a.best_window.end).getTime() + 3600e3).toISOString();
  $("#bestWin").textContent = a.best_window ? `${hh(a.best_window.start)} – ${hh(end)}` : "--";
  $("#worstHr").textContent = a.worst_hour ? `${hh(a.worst_hour.time)}  ·  ${a.worst_hour.aqi}` : "--";
  const max = Math.max(...a.next24.map((h) => h.aqi || 0), 150);
  $("#hours").innerHTML = a.next24.map((h, i) => `<div class="hour ${i === 0 ? "now" : ""}"><span class="t">${i === 0 ? t("now") : hh(h.time)}</span>
    <span class="col"><i style="height:${Math.max(6, (h.aqi / max) * 100)}%;background:${COLORS[h.category] || "#999"}"></i></span><span class="v">${h.aqi ?? ""}</span></div>`).join("");
  const days = a.daily.slice(0, 5);
  const lo = Math.min(...days.map((d) => d.avg)), hi = Math.max(...days.map((d) => d.max), lo + 1);
  $("#days").innerHTML = days.map((d) => {
    const name = new Date(d.date + "T00:00").toLocaleDateString(locale(), { weekday: "short" });
    const l = ((d.avg - lo) / (hi - lo)) * 100, w = Math.max(8, ((d.max - d.avg) / (hi - lo)) * 100);
    return `<div class="row"><span class="d">${name}</span><span class="bar"><i style="left:${l}%;width:${Math.min(w, 100 - l)}%;background:linear-gradient(90deg, ${COLORS[d.category]}88, ${COLORS[d.category]})"></i></span><span class="m">${d.max}</span></div>`;
  }).join("");
}

/* ---------- Smoke watch ---------- */
async function loadSmoke() {
  if (state.lat == null) return;
  const key = `${state.lat},${state.lon}`;
  if (!state.smoke || state.smokeKey !== key) {
    try { state.smoke = await fetch(`/api/smoke?lat=${state.lat}&lon=${state.lon}`).then((r) => (r.ok ? r.json() : null)); state.smokeKey = key; }
    catch (e) { state.smoke = null; }
  }
  const S = state.smoke, el = $("#smoke");
  if (!S) { el.hidden = true; return; }
  const w = lang === "hi" ? S.wind.from_name_hi : S.wind.from_name;
  const line = S.fires_upwind ? t("smokeLine", w, Math.round(S.wind.speed_kmh), S.median_upwind_km, S.eta_hours) : t("smokeCalm");
  el.hidden = false;
  el.innerHTML = `<div class="label caps">${icon("satellite")}<span>${t("smokeTitle")}</span><span class="tag risk-${S.risk}" style="margin-left:auto">${t("risk_" + S.risk)}</span></div>
    <div class="smoke-row"><div class="smoke-num">${S.fires_upwind}</div><div class="smoke-txt">${t("firesUpwind")}</div></div>
    <p class="summary" style="margin:6px 0 4px">${esc(line)}</p><p class="small" style="margin:0 0 10px">${t("firesNear", S.fires_near, S.radius_km)}</p>
    <button class="btn" data-goto="map">${icon("map")}<span>${t("seeFires")}</span></button>`;
}

/* ---------- Scan ---------- */
function renderSlots() {
  const labels = t("slots");
  $("#slots").innerHTML = labels.map((l, i) => {
    const p = state.photos[i];
    return `<label class="slot">${p
      ? `<img src="${p.url}" alt=""><span class="tagline">${esc(l)}</span><button class="x" data-rm="${i}" aria-label="Remove">${icon("close")}</button>`
      : `${icon(SLOT_ICONS[i])}<span>${esc(l)}</span><small>${t("tap")}</small>`}<input type="file" accept="image/*" capture="environment" data-slot="${i}"></label>`;
  }).join("");
  $("#slots").querySelectorAll("input").forEach((inp) => (inp.onchange = () => {
    const f = inp.files[0];
    if (!f) return;
    const i = +inp.dataset.slot;
    state.photos[i] = { file: f, url: URL.createObjectURL(f), setting: i >= 4 ? "indoor" : "outdoor" };
    renderSlots(); updateScanBtn();
  }));
  $("#slots").querySelectorAll("[data-rm]").forEach((b) => (b.onclick = (e) => {
    e.preventDefault(); delete state.photos[+b.dataset.rm]; renderSlots(); updateScanBtn();
  }));
}
function updateScanBtn() { $("#scanBtn").disabled = !state.photos.some(Boolean); }

document.querySelectorAll("#members .chip").forEach((c) => (c.onclick = () => {
  const m = c.dataset.m;
  state.members.has(m) ? state.members.delete(m) : state.members.add(m);
  c.classList.toggle("on", state.members.has(m));
}));

async function shrink(file) {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
  if (!bmp) return file;
  const s = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b), "image/jpeg", 0.85));
}

$("#scanBtn").onclick = async () => {
  if (state.lat == null) { alert(t("needLoc")); goto("air"); return; }
  const chosen = state.photos.filter(Boolean);
  const fd = new FormData();
  for (const p of chosen) fd.append("files", await shrink(p.file), "photo.jpg");
  fd.append("lat", state.lat); fd.append("lon", state.lon); fd.append("lang", lang);
  fd.append("members", [...state.members].join(","));
  fd.append("settings", chosen.map((p) => p.setting).join(","));
  state.sent = chosen;
  $("#scanBtn").disabled = true;
  $("#scanResult").hidden = true;
  $("#scanProgress").hidden = false;
  $("#scanProgress").scrollIntoView({ behavior: "smooth", block: "center" });
  const steps = [...document.querySelectorAll("#steps li")];
  steps.forEach((s) => s.classList.remove("done"));
  let k = 0;
  const timer = setInterval(() => { if (k < steps.length - 1) steps[k++].classList.add("done"); }, 2600);
  try {
    const r = await fetch("/api/scan", { method: "POST", body: fd });
    if (!r.ok) throw new Error(await r.text());
    state.result = await r.json();
    steps.forEach((s) => s.classList.add("done"));
    renderResult(true);
  } catch (e) {
    $("#scanResult").hidden = false;
    $("#scanResult").innerHTML = `<div class="glass notice">${icon("alert")}<div>${t("scanFailed")}: ${esc(e.message).slice(0, 200)}</div></div>`;
  } finally {
    clearInterval(timer);
    $("#scanProgress").hidden = true;
    updateScanBtn();
  }
};

const costBadge = (c) => (c === 0 ? `<span class="cost free">${t("free")}</span>` : `<span class="cost">₹${c.toLocaleString("en-IN")}</span>`);

function renderResult(scroll) {
  const R = state.result, plan = R.plan;
  const el = $("#scanResult");
  el.hidden = false;
  let h = "", d = 0;
  const card = (inner, cls = "") => `<div class="glass reveal ${cls}" style="animation-delay:${(d++) * 70}ms">${inner}</div>`;

  if (!R.ai_ok) h += card(`<div class="notice">${icon("alert")}<div>${t("aiDown")}</div></div>`);
  if (plan) h += card(`<p class="headline">${esc(plan.headline)}</p><p class="summary">${esc(plan.summary)}</p>
      <button class="btn" id="listenBtn">${icon("speaker")}<span>${t("listen")}</span></button><audio id="voice" hidden></audio>`);
  if (R.haze_flag) h += card(`<div class="notice">${icon("alert")}<div>${esc(R.haze_flag)}</div></div>`);

  let s = `<div class="label caps">${t("sourcesTitle")}</div>`;
  if (!R.sources.length) s += `<p class="summary" style="margin:0">${t("none")}</p>`;
  R.sources.forEach((x, i) => {
    const tags = [`<span class="tag">${t(x.where)}</span>`];
    if (x.active) tags.push(`<span class="tag alert">${t("active")}</span>`);
    if (x.distance && x.distance !== "inside") tags.push(`<span class="tag">${t(x.distance)}</span>`);
    if (x.violation) tags.push(`<span class="tag law">${t("law")}</span>`);
    s += `<div class="src"><div class="rank">${i + 1}</div><div><h4>${esc(lang === "hi" ? x.name_hi : x.name_en)}</h4>
      <div class="tags">${tags.join("")}</div><p>${t("seen")}: ${esc(x.evidence)}</p></div></div>`;
  });
  h += card(s);

  let ph = `<div class="label caps">${t("photosTitle")}</div><div class="photos">`;
  R.photos.forEach((p) => {
    const src = state.sent && state.sent[p.index] ? state.sent[p.index].url : "";
    const boxes = (p.source_boxes || []).map((b) => `<div class="bx src-bx" style="left:${b.box[0] * 100}%;top:${b.box[1] * 100}%;width:${(b.box[2] - b.box[0]) * 100}%;height:${(b.box[3] - b.box[1]) * 100}%"><span>${esc(lang === "hi" ? b.name_hi : b.name_en)}</span></div>`).join("") +
      (p.smoke_boxes || []).map((b) => `<div class="bx" style="left:${b.box[0] * 100}%;top:${b.box[1] * 100}%;width:${(b.box[2] - b.box[0]) * 100}%;height:${(b.box[3] - b.box[1]) * 100}%"><span>${b.label} ${Math.round(b.confidence * 100)}%</span></div>`).join("");
    const hz = p.haze_model ? `${p.scene ? " · " : ""}${t("haze")}: ${t(p.haze_model.level)}` : "";
    ph += `<div class="ph"><img src="${src}" alt="">${boxes}<div class="cap">${esc(p.scene)}${hz}</div></div>`;
  });
  h += card(ph + "</div>");

  if (R.indoor) {
    const I = R.indoor;
    const chips = (I.contributions || []).map((c) => {
      const nm = R.sources.find((x) => x.type === c.source);
      return `<button class="chip wi" data-wi="rm:${c.source}">${t("wiRemove")} ${esc(nm ? (lang === "hi" ? nm.name_hi : nm.name_en).toLowerCase() : c.source)}</button>`;
    }).join("");
    h += card(`<div class="label caps">${t("roomTitle")} <span class="tag" style="margin-left:auto">${t("estimate")}</span></div>
      <div id="roomBox"></div>
      <div class="label caps" style="margin-top:18px">${icon("sliders")}<span>${t("whatIf")}</span></div>
      <div class="chips">${chips}${R.ventilation !== "open" ? `<button class="chip wi" data-wi="open">${t("wiOpen")}</button>` : ""}${!R.purifier ? `<button class="chip wi" data-wi="filter">${t("wiFilter")}</button>` : ""}</div>
      <p class="small">${t("estNote")}</p>`);
  }

  let a = `<div class="label caps">${t("actionsTitle")}</div>`;
  R.actions.forEach((x) => {
    const why = ["member", "myth", "general"].includes(x.for) ? "" : `<small>${esc(lang === "hi" ? x.for_hi : x.for_en)}</small>`;
    a += `<div class="act">${x.for === "myth" ? `<span class="cost tip">${t("tip")}</span>` : costBadge(x.cost)}<div><p>${esc(lang === "hi" ? x.hi : x.en)}</p>${why}</div></div>`;
  });
  h += card(a);

  if (R.violations.length && plan && plan.complaint_body) {
    h += card(`<div class="label caps">${t("complaintTitle")}</div>
      <textarea id="complaint">${esc(plan.complaint_subject + "\n\n" + plan.complaint_body)}</textarea>
      <div class="row"><button class="btn filled" id="shareBtn">${icon("share")}<span>${t("share")}</span></button>
      <button class="btn" id="waBtn">${icon("chat")}<span>${t("whatsapp")}</span></button>
      <button class="btn" id="mailBtn">${icon("mail")}<span>${t("email")}</span></button>
      <button class="btn" id="copyBtn">${icon("copy")}<span>${t("copy")}</span></button></div>
      <p class="small">${t("sendTo")}: ${R.channels.map((c) => esc(c.name)).join(" · ")}</p>`);
  }
  h += card(`<div class="label caps">${icon("share")}<span>${t("shareTitle")}</span></div><p class="summary" style="margin:0 0 12px">${t("shareHelp")}</p>
    <button class="btn filled" id="cardBtn">${icon("share")}<span>${t("shareCard")}</span></button><div id="cardOut"></div>`);
  h += `<button class="btn filled big" data-goto="map"><span>${t("seeMap")}</span>${icon("chevron")}</button>`;
  el.innerHTML = h;
  if (scroll) el.scrollIntoView({ behavior: "smooth" });
  wireResult(R, plan);
  if (R.indoor) wireWhatIf(R);
}

function roomCalc(R, off, open, filter) {
  const pm = (R.air && R.air.now.pm25) || 60;
  const vent = open ? "open" : R.ventilation;
  const pur = filter || R.purifier;
  const f = pur ? 0.35 : ({ open: 0.9, closed: 0.65 }[vent] ?? 0.8);
  const add = (R.indoor.contributions || []).filter((c) => !off.has(c.source)).reduce((x, c) => x + c.add, 0) * (vent === "closed" ? 1.3 : 1) * (pur ? 0.5 : 1);
  const out = pm * f, mid = out + add;
  return { out: Math.round(out), inn: Math.round(add), mid, lo: pmAqi(mid * 0.7), hi: pmAqi(mid * 1.3), aqi: pmAqi(mid) };
}
function wireWhatIf(R) {
  const off = new Set(); let open = false, filter = false;
  const base = roomCalc(R, off, false, false);
  const draw = () => {
    const c = roomCalc(R, off, open, filter), cat = aqiCat(c.aqi), tot = Math.max(1, c.out + c.inn);
    const changed = off.size || open || filter;
    $("#roomBox").innerHTML = `<div class="room-aqi" style="color:${changed ? COLORS[cat] : "inherit"}">${c.lo}–${c.hi}</div>
      <div class="room-cat" style="color:${COLORS[cat]}">AQI · ${esc(catLabel(cat))}${changed ? `<span class="was">${t("wiWas", base.lo, base.hi)}</span>` : ""}</div>
      <div class="cig-pill">${icon("cigarette")}<span>${t("cigRoom", (c.mid / CIG).toFixed(1))}</span></div>
      <div class="meter"><div class="out" style="width:${(c.out / tot) * 100}%"></div><div class="in" style="width:${(c.inn / tot) * 100}%"></div></div>
      <div class="meter-legend"><span><i style="background:#8e9ba8"></i>${c.out} µg/m³ ${t("fromOut")}</span><span><i style="background:var(--vpoor)"></i>${c.inn} µg/m³ ${t("fromIn")}</span></div>`;
  };
  document.querySelectorAll("[data-wi]").forEach((b) => (b.onclick = () => {
    const k = b.dataset.wi;
    if (k.startsWith("rm:")) { const x = k.slice(3); off.has(x) ? off.delete(x) : off.add(x); }
    else if (k === "open") open = !open; else if (k === "filter") filter = !filter;
    b.classList.toggle("on"); draw();
  }));
  draw();
}

/* ---------- Shareable report card ---------- */
function wrapText(g, text, x, y, maxW, lh, maxLines = 3) {
  const words = String(text).split(" "); let line = "", n = 0;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > maxW && line) {
      if (++n >= maxLines) { g.fillText(line + "…", x, y); return y + lh; }
      g.fillText(line, x, y); y += lh; line = w;
    } else line = test;
  }
  if (line) { g.fillText(line, x, y); y += lh; }
  return y;
}
async function makeCard(R) {
  const F = "Inter, 'Noto Sans Devanagari', sans-serif";
  try { await Promise.all(["200 100px Inter", "600 40px Inter", "400 30px 'Noto Sans Devanagari'"].map((f) => document.fonts.load(f))); } catch (e) {}
  const W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  const SK = { Good: ["#1f7ae0", "#cfe6fb"], Satisfactory: ["#3f86bf", "#dbe9ee"], Moderate: ["#7894a6", "#ece4cc"], Poor: ["#8a7d70", "#efd6b4"], "Very Poor": ["#5f514b", "#d1ab88"], Severe: ["#2d2725", "#9a7559"] };
  const cat = R.air ? R.air.now.category : "Moderate";
  const [c1, c2] = SK[cat] || SK.Moderate;
  const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, c1); grd.addColorStop(1, c2);
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(255,255,255,.25)";
  for (let i = 0; i < 140; i++) { g.beginPath(); g.arc(Math.random() * W, Math.random() * 560, Math.random() * 3 + 1, 0, 7); g.fill(); }
  g.fillStyle = "#fff";
  g.font = `600 44px ${F}`; g.fillText("Saans", 72, 104);
  g.font = `400 30px ${F}`; g.fillText(`${state.place || ""}  ·  ${R.time}`, 72, 152);
  g.font = `200 230px ${F}`; g.fillText(String(R.air ? R.air.now.aqi : "--"), 60, 380);
  g.font = `600 48px ${F}`; g.fillText(`AQI · ${catLabel(cat)} ${t("cardOutside")}`, 72, 452);
  if (R.indoor) {
    const ic = roomCalc(R, new Set(), false, false);
    g.font = `500 34px ${F}`;
    g.fillText(`${t("cardRoom")}: AQI ${ic.lo}–${ic.hi} · ${t("cardCig", (ic.mid / CIG).toFixed(1))}`, 72, 512);
  }
  // panel
  const px = 48, py = 560, pw = W - 96, ph = H - py - 110;
  g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.roundRect(px, py, pw, ph, 36); g.fill();
  let y = py + 72; g.fillStyle = "#0d1b2a";
  g.font = `700 30px ${F}`; g.fillText(t("cardSources").toUpperCase(), px + 44, y); y += 56;
  R.sources.slice(0, 3).forEach((x, i) => {
    g.fillStyle = "#0d1b2a"; g.beginPath(); g.arc(px + 66, y - 12, 22, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = `700 26px ${F}`; g.fillText(String(i + 1), px + 58, y - 3);
    g.fillStyle = "#0d1b2a"; g.font = `600 36px ${F}`; g.fillText(lang === "hi" ? x.name_hi : x.name_en, px + 104, y);
    y += 58;
  });
  if (!R.sources.length) { g.font = `400 32px ${F}`; y = wrapText(g, t("none"), px + 44, y, pw - 88, 44); }
  y += 20; g.font = `700 30px ${F}`; g.fillText(t("cardDo").toUpperCase(), px + 44, y); y += 52;
  g.font = `400 31px ${F}`;
  R.actions.filter((a) => a.for !== "myth").slice(0, 3).forEach((a) => {
    g.fillStyle = "#34c759"; g.beginPath(); g.arc(px + 58, y - 10, 8, 0, 7); g.fill();
    g.fillStyle = "#0d1b2a"; y = wrapText(g, lang === "hi" ? a.hi : a.en, px + 84, y, pw - 130, 42, 2) + 14;
  });
  g.fillStyle = "#fff"; g.font = `500 28px ${F}`;
  g.fillText("Saans · github.com/TechIT0104/saans", 72, H - 46);
  return new Promise((res) => c.toBlob(res, "image/png"));
}

function wireResult(R, plan) {
  const cb = $("#cardBtn");
  if (cb) cb.onclick = async () => {
    cb.disabled = true;
    const blob = await makeCard(R);
    cb.disabled = false;
    const url = URL.createObjectURL(blob), file = new File([blob], "saans-air-report.png", { type: "image/png" });
    $("#cardOut").innerHTML = `<img class="report-card" src="${url}" alt="Air report card"><div class="row"><button class="btn filled" id="cardShare">${icon("share")}<span>${t("share")}</span></button><a class="btn" href="${url}" download="saans-air-report.png">${t("download")}</a></div>`;
    const sh = $("#cardShare");
    if (navigator.canShare && navigator.canShare({ files: [file] })) sh.onclick = () => navigator.share({ files: [file], title: "Saans air report" }).catch(() => {});
    else sh.hidden = true;
  };
  const listen = $("#listenBtn");
  if (listen) listen.onclick = async () => {
    listen.disabled = true;
    const top = R.actions.slice(0, 3).map((a) => (lang === "hi" ? a.hi : a.en)).join(" ");
    const r = await fetch("/api/speak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `${plan.headline} ${plan.summary} ${top}`, lang }) });
    listen.disabled = false;
    if (!r.ok) return;
    const audio = $("#voice");
    audio.src = URL.createObjectURL(await r.blob());
    audio.play();
  };
  const sb = $("#shareBtn");
  if (!sb) return;
  const text = () => $("#complaint").value;
  const evidence = () => {
    const s = R.sources.find((x) => x.violation);
    const p = s && state.sent && state.sent[s.photo_index];
    return p ? new File([p.file], "evidence.jpg", { type: p.file.type || "image/jpeg" }) : null;
  };
  sb.onclick = async () => {
    const f = evidence();
    const data = { title: "Air pollution complaint", text: text() };
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) data.files = [f];
    try { await navigator.share(data); } catch (e) {}
  };
  if (!navigator.share) sb.hidden = true;
  $("#waBtn").onclick = () => window.open("https://wa.me/?text=" + encodeURIComponent(text()), "_blank");
  $("#mailBtn").onclick = () => (location.href = "mailto:?subject=" + encodeURIComponent(plan.complaint_subject) + "&body=" + encodeURIComponent(plan.complaint_body));
  $("#copyBtn").onclick = async () => {
    await navigator.clipboard.writeText(text());
    $("#copyBtn").innerHTML = `${icon("check")}<span>${t("copied")}</span>`;
  };
}

/* ---------- Hotspots for ward officers ---------- */
function renderHotspots(reports) {
  const el = $("#hotspots");
  const cl = {};
  reports.forEach((r) => {
    const k = `${(Math.round(r.lat / 0.005) * 0.005).toFixed(3)},${(Math.round(r.lon / 0.005) * 0.005).toFixed(3)}`;
    const c = cl[k] || (cl[k] = { lat: r.lat, lon: r.lon, n: 0, types: {}, last: 0 });
    c.n++; c.last = Math.max(c.last, r.ts); r.sources.forEach((s) => (c.types[s] = (c.types[s] || 0) + 1));
  });
  const name = (s) => (state.sources[s] ? (lang === "hi" ? state.sources[s].hi : state.sources[s].en) : s);
  const isViol = (s) => state.sources[s] && state.sources[s].violation;
  const list = Object.values(cl).sort((a, b) => (Object.keys(b.types).some(isViol) - Object.keys(a.types).some(isViol)) || b.n - a.n);
  el.hidden = false;
  if (!list.length) { el.innerHTML = `<div class="label caps">${t("hotTitle")}</div><p class="summary" style="margin:0">${t("hotEmpty")}</p>`; return; }
  el.innerHTML = `<div class="label caps">${t("hotTitle")}</div><p class="small" style="margin:-4px 0 10px">${t("hotHelp")}</p>` +
    list.slice(0, 6).map((c, i) => `<div class="src"><div class="rank">${i + 1}</div><div style="flex:1"><h4>${Object.keys(c.types).map((s) => esc(name(s))).join(", ")}</h4>
      <div class="tags"><span class="tag">${t("hotReports", c.n)}</span>${Object.keys(c.types).some(isViol) ? `<span class="tag law">${t("law")}</span>` : ""}</div>
      <p>${t("hotLast")}: ${new Date(c.last * 1000).toLocaleString(locale())} · <a href="https://maps.google.com/?q=${c.lat},${c.lon}" target="_blank" rel="noopener">${t("openMaps")}</a></p></div></div>`).join("") +
    `<button class="btn" id="csvBtn" style="margin-top:8px">${icon("copy")}<span>${t("hotCsv")}</span></button>`;
  $("#csvBtn").onclick = () => {
    const rows = [["rank", "lat", "lon", "reports", "sources", "violation", "last_reported_ist", "map_link"]];
    list.forEach((c, i) => rows.push([i + 1, c.lat, c.lon, c.n, Object.keys(c.types).map((s) => (state.sources[s] || {}).en || s).join("; "),
      Object.keys(c.types).some(isViol) ? "yes" : "no", new Date(c.last * 1000).toLocaleString("en-IN"), `https://maps.google.com/?q=${c.lat},${c.lon}`]));
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "saans-inspection-list.csv"; a.click();
  };
}

/* ---------- Community map ---------- */
let map, layer;
async function loadMap() {
  if (!map) {
    map = L.map("map", { zoomControl: false }).setView([state.lat ?? 22.6, state.lon ?? 79.0], state.lat ? 13 : 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    layer = L.layerGroup().addTo(map);
  }
  $("#legend").innerHTML = `<div class="legend-title">${t("legendSources")}</div>` + ["burning", "dust", "industry", "traffic", "indoor"]
    .map((k) => `<span><i style="background:${SRC_COLORS[k]}"></i>${t(k === "indoor" ? "indoorOnly" : k)}</span>`).join("") +
    `<div class="legend-title">${t("legendFires")}</div><span><i style="background:#ff2d55"></i>${t("fireUp")}</span><span><i style="background:#ff9f0a"></i>${t("fireOther")}</span><span><i class="sq cone"></i>${t("cone")}</span>` +
    `<div class="legend-title">${t("legendGrid")}</div>` + Object.entries(COLORS).map(([c, v]) => `<span><i class="sq" style="background:${v}"></i>${esc(catLabel(c))}</span>`).join("");
  setTimeout(() => map.invalidateSize(), 60);
  if (state.lat != null) map.setView([state.lat, state.lon], 7);
  if (!Object.keys(state.sources).length) state.sources = await fetch("/api/sources").then((r) => r.json());
  layer.clearLayers();

  // 1. Live AQI field: forecast AQI on a grid around you, so the regional picture is always visible.
  let gridNote = "";
  if (state.lat != null) {
    try {
      const g = await fetch(`/api/aqi-grid?lat=${state.lat}&lon=${state.lon}`).then((r) => r.json());
      const h = g.step / 2;
      g.cells.forEach((c) => {
        if (c.aqi == null) return;
        L.rectangle([[c.lat - h, c.lon - h], [c.lat + h, c.lon + h]], { stroke: false, fillColor: COLORS[c.category], fillOpacity: 0.5, interactive: true })
          .bindTooltip(`AQI ${c.aqi} · ${esc(catLabel(c.category))}`, { direction: "top" }).addTo(layer);
        L.marker([c.lat, c.lon], { interactive: false, icon: L.divIcon({ className: "aqi-label", html: `${c.aqi}`, iconSize: [36, 18] }) }).addTo(layer);
      });
      const vals = g.cells.map((c) => c.aqi).filter((v) => v != null);
      gridNote = `<div class="glass"><b>${Math.min(...vals)}–${Math.max(...vals)}</b><span>${t("aqiRange")}</span></div>`;
    } catch (e) {}
  }

  // 2. Satellite fires (NASA FIRMS) and the wind cone: where your air is coming from right now.
  let fireNote = "";
  if (state.lat != null) {
    if (!state.smoke || state.smokeKey !== `${state.lat},${state.lon}`) await loadSmoke();
    const S = state.smoke;
    if (S) {
      if (S.wind.speed_kmh >= 2) {
        const R = 6371, d = S.radius_km / R, la1 = state.lat * Math.PI / 180, lo1 = state.lon * Math.PI / 180;
        const pts = [[state.lat, state.lon]];
        for (let b = S.wind.from_deg - S.half_angle; b <= S.wind.from_deg + S.half_angle; b += 3) {
          const br = b * Math.PI / 180;
          const la2 = Math.asin(Math.sin(la1) * Math.cos(d) + Math.cos(la1) * Math.sin(d) * Math.cos(br));
          const lo2 = lo1 + Math.atan2(Math.sin(br) * Math.sin(d) * Math.cos(la1), Math.cos(d) - Math.sin(la1) * Math.sin(la2));
          pts.push([la2 * 180 / Math.PI, lo2 * 180 / Math.PI]);
        }
        L.polygon(pts, { color: "#0a84ff", weight: 1.5, dashArray: "6 6", fillColor: "#0a84ff", fillOpacity: 0.08, interactive: false }).addTo(layer);
      }
      const rend = L.canvas({ padding: 0.5 });
      S.fires.forEach((f) => {
        L.circleMarker([f.lat, f.lon], { renderer: rend, radius: f.upwind ? 4.5 : 3, stroke: false, fillColor: f.upwind ? "#ff2d55" : "#ff9f0a", fillOpacity: f.upwind ? 0.95 : 0.55 })
          .bindTooltip(`${f.upwind ? t("fireUp") : t("fireOther")} · ${f.dist_km} km · ${esc(f.time)}`).addTo(layer);
      });
      fireNote = `<div class="glass"><b>${S.fires_upwind}</b><span>${t("firesUpCard")}</span></div>`;
    }
  }

  // 3. Citizen reports: one marker per pollution source found, so every type shows up.
  const reports = await fetch("/api/reports?days=30").then((r) => r.json());
  const counts = {};
  reports.forEach((r) => {
    const types = [...new Set(r.sources)];
    types.forEach((s, k) => {
      const grp = SRC_GROUP[s] || "indoor";
      counts[grp] = (counts[grp] || 0) + 1;
      const ang = (k / Math.max(1, types.length)) * 2 * Math.PI, off = types.length > 1 ? 0.012 : 0;
      const name = state.sources[s] ? (lang === "hi" ? state.sources[s].hi : state.sources[s].en) : s;
      L.circleMarker([r.lat + Math.sin(ang) * off, r.lon + Math.cos(ang) * off], { radius: 8, color: "#fff", weight: 2.5, fillColor: SRC_COLORS[grp], fillOpacity: 0.95 })
        .bindPopup(`<b>${esc(name)}</b><br>${new Date(r.ts * 1000).toLocaleString(locale())}${r.aqi ? `<br>AQI ${r.aqi}` : ""}`).addTo(layer);
    });
  });
  $("#mapStats").innerHTML = gridNote + fireNote + `<div class="glass"><b>${reports.length}</b><span>${t("reports")} · ${t("lastDays")}</span></div>` +
    ["burning", "dust", "industry", "traffic", "indoor"].filter((g) => counts[g]).map((g) => `<div class="glass"><b>${counts[g]}</b><span>${t(g === "indoor" ? "indoorOnly" : g)}</span></div>`).join("");
  renderHotspots(reports);
}

hydrateIcons();
applyLang();
// Deep link: ?lat=28.65&lon=77.23&place=Old%20Delhi&tab=scan
(() => {
  const q = new URLSearchParams(location.search);
  if (q.get("lat") && q.get("lon")) setLocation(+q.get("lat"), +q.get("lon"), q.get("place") || "");
  if (q.get("tab")) goto(q.get("tab"));
})();
