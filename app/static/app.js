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
const t = (k) => (T[lang][k] ?? T.en[k] ?? k);
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
    const boxes = (p.smoke_boxes || []).map((b) => `<div class="bx" style="left:${b.box[0] * 100}%;top:${b.box[1] * 100}%;width:${(b.box[2] - b.box[0]) * 100}%;height:${(b.box[3] - b.box[1]) * 100}%"><span>${b.label} ${Math.round(b.confidence * 100)}%</span></div>`).join("");
    const hz = p.haze_model ? `${p.scene ? " · " : ""}${t("haze")}: ${t(p.haze_model.level)}` : "";
    ph += `<div class="ph"><img src="${src}" alt="">${boxes}<div class="cap">${esc(p.scene)}${hz}</div></div>`;
  });
  h += card(ph + "</div>");

  if (R.indoor) {
    const I = R.indoor, tot = Math.max(1, I.from_outside + I.from_inside);
    h += card(`<div class="label caps">${t("roomTitle")} <span class="tag" style="margin-left:auto">${t("estimate")}</span></div>
      <div class="room-aqi">${I.aqi_low}–${I.aqi_high}</div><div class="room-cat" style="color:${COLORS[I.category]}">AQI · ${esc(catLabel(I.category))}</div>
      <div class="meter"><div class="out" style="width:${(I.from_outside / tot) * 100}%"></div><div class="in" style="width:${(I.from_inside / tot) * 100}%"></div></div>
      <div class="meter-legend"><span><i style="background:#8e9ba8"></i>${I.from_outside} µg/m³ ${t("fromOut")}</span><span><i style="background:var(--vpoor)"></i>${I.from_inside} µg/m³ ${t("fromIn")}</span></div>
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
  h += `<button class="btn filled big" data-goto="map"><span>${t("seeMap")}</span>${icon("chevron")}</button>`;
  el.innerHTML = h;
  if (scroll) el.scrollIntoView({ behavior: "smooth" });
  wireResult(R, plan);
}

function wireResult(R, plan) {
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

/* ---------- Community map ---------- */
let map, layer;
async function loadMap() {
  if (!map) {
    map = L.map("map", { zoomControl: false }).setView([state.lat ?? 22.6, state.lon ?? 79.0], state.lat ? 13 : 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    layer = L.layerGroup().addTo(map);
  }
  $("#legend").innerHTML = ["burning", "dust", "industry", "traffic", "indoor"]
    .map((k) => `<span><i style="background:${SRC_COLORS[k]}"></i>${t(k === "indoor" ? "indoorOnly" : k)}</span>`).join("");
  setTimeout(() => map.invalidateSize(), 60);
  if (state.lat != null) map.setView([state.lat, state.lon], 13);
  if (!Object.keys(state.sources).length) state.sources = await fetch("/api/sources").then((r) => r.json());
  const reports = await fetch("/api/reports?days=30").then((r) => r.json());
  layer.clearLayers();
  const counts = {};
  reports.forEach((r) => {
    const groups = r.sources.map((s) => SRC_GROUP[s] || "indoor");
    new Set(groups).forEach((g) => (counts[g] = (counts[g] || 0) + 1));
    const g = ["burning", "industry", "dust", "traffic", "indoor"].find((x) => groups.includes(x)) || "other";
    const names = r.sources.map((s) => (state.sources[s] ? (lang === "hi" ? state.sources[s].hi : state.sources[s].en) : s)).join(", ");
    L.circleMarker([r.lat, r.lon], { radius: 9, color: "#fff", weight: 2.5, fillColor: SRC_COLORS[g], fillOpacity: 0.95 })
      .bindPopup(`<b>${esc(names)}</b><br>${new Date(r.ts * 1000).toLocaleString(locale())}${r.aqi ? `<br>AQI ${r.aqi}` : ""}`).addTo(layer);
  });
  $("#mapStats").innerHTML = `<div class="glass"><b>${reports.length}</b><span>${t("reports")} · ${t("lastDays")}</span></div>` +
    ["burning", "dust", "industry", "traffic"].filter((g) => counts[g]).map((g) => `<div class="glass"><b>${counts[g]}</b><span>${t(g)}</span></div>`).join("");
}

hydrateIcons();
applyLang();
// Deep link: ?lat=28.65&lon=77.23&place=Old%20Delhi&tab=scan
(() => {
  const q = new URLSearchParams(location.search);
  if (q.get("lat") && q.get("lon")) setLocation(+q.get("lat"), +q.get("lon"), q.get("place") || "");
  if (q.get("tab")) goto(q.get("tab"));
})();
