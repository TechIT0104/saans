"use strict";

const T = {
  en: {
    tagline: "Know why your air is bad. Fix it.", useLocation: "📍 Use my location", searchPh: "Search town or city",
    airEmpty: "Share your location to see the air where you are, hour by hour.",
    aqiSource: "India AQI from the CAMS satellite-model forecast for your area. A nearby monitor may differ.",
    bestTime: "Cleanest hours", worstTime: "Worst hour", next24: "Next 24 hours", next5: "Next 5 days",
    whyCta: "Why is my air bad? Scan around you →", scanTitle: "360° air scan",
    scanHelp: "Stand where you live. Take a photo in each direction, then one inside your room. Saans finds what is polluting your air.",
    whoLives: "Who lives with you?", m_child: "👧 Child", m_elderly: "👴 Elderly", m_asthma: "🫁 Asthma / heart", m_pregnant: "🤰 Pregnant", m_worker: "👷 Works outdoors",
    analyse: "Find the sources", st1: "Checking the air forecast for your spot", st2: "Looking for smoke with our trained detector",
    st3: "Reading haze in the sky", st4: "Naming every pollution source (Amazon Bedrock)", st5: "Building your family's action plan",
    mapTitle: "Pollution reports near you",
    mapHelp: "Every scan adds an anonymous dot (rounded to about 100 m, no photos). Together they show the burning and dust hotspots that air monitors miss.",
    tabAir: "Air", tabScan: "Scan", tabMap: "Map",
    slots: ["Front", "Right", "Back", "Left", "Inside room", "Kitchen / other"], tap: "Tap to add",
    needLoc: "First share your location on the Air tab, so Saans knows where the photos are from.",
    sourcesTitle: "What is polluting your air", none: "No clear pollution source was visible in these photos. That's good news. Your air is mostly the regional pollution shown on the Air tab.",
    roomTitle: "Your room right now (estimate)", fromOut: "from outside air", fromIn: "from sources inside",
    actionsTitle: "Your action plan", free: "FREE", complaintTitle: "Report it, with evidence", share: "Share with photo", whatsapp: "WhatsApp", email: "Email", copy: "Copy", copied: "Copied ✓",
    listen: "🔊 Listen", photosTitle: "What Saans saw", inside: "inside", outdoor: "outside", indoor: "inside", active: "active now",
    near: "near", street: "on the street", far: "far", sendTo: "Send to:", reports: "reports", lastDays: "in the last 30 days",
    aqi: "AQI", locating: "Finding you…", locFail: "Couldn't get your location. Search for your town instead.",
    pm: "PM2.5", wind: "wind", scanAgain: "Scan again", seeMap: "See it on the community map →", aiDown: "AI scene analysis is unavailable right now; showing what our smoke detector found.",
    hazeModel: "haze", evidence: "Seen:", estNote: "Estimated from outdoor air, ventilation and the sources seen. A low-cost sensor gives exact numbers.",
  },
  hi: {
    tagline: "जानिए हवा खराब क्यों है। उसे ठीक कीजिए।", useLocation: "📍 मेरी लोकेशन", searchPh: "शहर या कस्बा खोजें",
    airEmpty: "अपनी लोकेशन दें और जानें आपके आसपास की हवा, हर घंटे की।",
    aqiSource: "आपके इलाके का भारत AQI, CAMS सैटेलाइट-मॉडल पूर्वानुमान से। पास के मॉनिटर से थोड़ा अलग हो सकता है।",
    bestTime: "सबसे साफ़ समय", worstTime: "सबसे खराब समय", next24: "अगले 24 घंटे", next5: "अगले 5 दिन",
    whyCta: "मेरी हवा खराब क्यों है? आसपास स्कैन करें →", scanTitle: "360° हवा स्कैन",
    scanHelp: "जहाँ रहते हैं वहाँ खड़े होकर हर दिशा में एक फ़ोटो लें, फिर एक कमरे के अंदर। सांस बताएगा कि आपकी हवा को क्या गंदा कर रहा है।",
    whoLives: "आपके साथ कौन रहता है?", m_child: "👧 बच्चा", m_elderly: "👴 बुज़ुर्ग", m_asthma: "🫁 दमा / दिल", m_pregnant: "🤰 गर्भवती", m_worker: "👷 बाहर काम",
    analyse: "स्रोत खोजें", st1: "आपकी जगह का हवा पूर्वानुमान देख रहे हैं", st2: "हमारे मॉडल से धुआँ खोज रहे हैं",
    st3: "आसमान का धुंधलापन पढ़ रहे हैं", st4: "हर प्रदूषण स्रोत पहचान रहे हैं (Amazon Bedrock)", st5: "आपके परिवार का प्लान बना रहे हैं",
    mapTitle: "आसपास की प्रदूषण रिपोर्ट",
    mapHelp: "हर स्कैन एक गुमनाम बिंदु जोड़ता है (लगभग 100 मीटर तक, कोई फ़ोटो नहीं)। मिलकर ये वो जगहें दिखाते हैं जहाँ कचरा जलता है और धूल उड़ती है।",
    tabAir: "हवा", tabScan: "स्कैन", tabMap: "नक्शा",
    slots: ["सामने", "दाएँ", "पीछे", "बाएँ", "कमरे के अंदर", "रसोई / अन्य"], tap: "फ़ोटो जोड़ें",
    needLoc: "पहले हवा टैब पर अपनी लोकेशन दें, ताकि पता चले फ़ोटो कहाँ की हैं।",
    sourcesTitle: "आपकी हवा को क्या गंदा कर रहा है", none: "इन फ़ोटो में कोई साफ़ प्रदूषण स्रोत नहीं दिखा। अच्छी बात है। आपकी हवा ज़्यादातर इलाके के प्रदूषण से है।",
    roomTitle: "आपका कमरा अभी (अनुमान)", fromOut: "बाहर की हवा से", fromIn: "अंदर के स्रोतों से",
    actionsTitle: "आपका एक्शन प्लान", free: "मुफ़्त", complaintTitle: "सबूत के साथ शिकायत करें", share: "फ़ोटो के साथ भेजें", whatsapp: "WhatsApp", email: "ईमेल", copy: "कॉपी", copied: "कॉपी हुआ ✓",
    listen: "🔊 सुनें", photosTitle: "सांस ने क्या देखा", inside: "अंदर", outdoor: "बाहर", indoor: "अंदर", active: "अभी चालू",
    near: "पास", street: "सड़क पर", far: "दूर", sendTo: "यहाँ भेजें:", reports: "रिपोर्ट", lastDays: "पिछले 30 दिनों में",
    aqi: "AQI", locating: "लोकेशन ढूँढ रहे हैं…", locFail: "लोकेशन नहीं मिली। अपना शहर खोजें।",
    pm: "PM2.5", wind: "हवा", scanAgain: "फिर से स्कैन", seeMap: "कम्युनिटी नक्शे पर देखें →", aiDown: "AI विश्लेषण अभी उपलब्ध नहीं; हमारे धुआँ मॉडल के नतीजे दिखा रहे हैं।",
    hazeModel: "धुंध", evidence: "दिखा:", estNote: "बाहर की हवा, हवादारी और दिखे स्रोतों से अनुमान। सस्ता सेंसर सटीक आँकड़े देगा।",
  },
};

const COLORS = { Good: "#2e9d4f", Satisfactory: "#9bc53d", Moderate: "#e5b81f", Poor: "#ef8a17", "Very Poor": "#d7372f", Severe: "#7a1c1c" };
const CAT_HI = { Good: "अच्छी", Satisfactory: "संतोषजनक", Moderate: "मध्यम", Poor: "खराब", "Very Poor": "बहुत खराब", Severe: "गंभीर" };
const SRC_COLORS = { burning: "#d7372f", dust: "#c08a2b", traffic: "#5560c9", industry: "#6b2f8a", indoor: "#0f766e", other: "#7d8784" };
const SRC_GROUP = {
  garbage_burning: "burning", crop_residue_burning: "burning", open_fire_smoke: "burning", landfill_dump: "burning",
  construction_dust: "dust", unpaved_road_dust: "dust", traffic_congestion: "traffic", diesel_generator: "industry",
  industrial_chimney: "industry", brick_kiln: "industry",
};

let lang = "en";
try { lang = localStorage.getItem("saans-lang") || "en"; } catch (e) {}
const state = { lat: null, lon: null, place: "", air: null, photos: [], members: new Set(), result: null, sources: {} };
const t = (k) => (T[lang][k] ?? T.en[k] ?? k);
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const catLabel = (c) => (lang === "hi" ? CAT_HI[c] || c : c);
const hhmm = (iso) => new Date(iso).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-IN", { hour: "numeric", hour12: true });

function applyLang() {
  document.documentElement.lang = lang;
  $("#langBtn").textContent = lang === "en" ? "हिंदी" : "English";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  renderSlots();
  if (state.air) renderAir();
  if (state.result) renderResult();
}

$("#langBtn").onclick = () => {
  lang = lang === "en" ? "hi" : "en";
  try { localStorage.setItem("saans-lang", lang); } catch (e) {}
  applyLang();
};

// Tabs
function goto(tab) {
  document.querySelectorAll(".tab").forEach((s) => s.classList.toggle("active", s.id === "tab-" + tab));
  document.querySelectorAll("nav.bottom button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  window.scrollTo(0, 0);
  if (tab === "map") loadMap();
}
document.querySelectorAll("nav.bottom button").forEach((b) => (b.onclick = () => goto(b.dataset.tab)));
document.addEventListener("click", (e) => { const g = e.target.closest("[data-goto]"); if (g) goto(g.dataset.goto); });

// Location
$("#locBtn").onclick = () => {
  $("#airEmpty").textContent = t("locating");
  navigator.geolocation.getCurrentPosition(
    async (p) => { await setLocation(p.coords.latitude, p.coords.longitude, ""); },
    () => { $("#airEmpty").textContent = t("locFail"); },
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
    b.onclick = () => { box.innerHTML = ""; setLocation(x.latitude, x.longitude, b.textContent); };
    box.appendChild(b);
  });
};

async function reverseName(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&accept-language=${lang}`).then((r) => r.json());
    const a = r.address || {};
    return [a.suburb || a.neighbourhood || a.village || a.town, a.city || a.state_district, a.state].filter(Boolean).join(", ");
  } catch (e) { return ""; }
}

async function setLocation(lat, lon, name) {
  state.lat = lat; state.lon = lon;
  state.place = name || (await reverseName(lat, lon)) || `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
  const r = await fetch(`/api/air?lat=${lat}&lon=${lon}`);
  if (!r.ok) { $("#airEmpty").textContent = "Air data unavailable. Try again."; return; }
  state.air = await r.json();
  renderAir();
  updateScanBtn();
}

function renderAir() {
  const a = state.air;
  $("#airEmpty").hidden = true;
  $("#airView").hidden = false;
  const cat = a.now.category;
  $("#aqiCard").className = "aqi-card c-" + String(cat).replace(" ", "");
  $("#placeName").textContent = "📍 " + state.place;
  $("#aqiNum").textContent = a.now.aqi ?? "–";
  $("#aqiCat").textContent = catLabel(cat);
  $("#aqiSub").textContent = `${t("pm")} ${Math.round(a.now.pm25)} µg/m³ · ${t("wind")} ${Math.round(a.now.wind_speed ?? 0)} km/h`;
  $("#bestWin").textContent = a.best_window ? `${hhmm(a.best_window.start)}–${hhmm(new Date(new Date(a.best_window.end).getTime() + 3600e3).toISOString())} · ${a.best_window.aqi}` : "–";
  $("#worstHr").textContent = a.worst_hour ? `${hhmm(a.worst_hour.time)} · ${a.worst_hour.aqi}` : "–";
  const max = Math.max(...a.next24.map((h) => h.aqi || 0), 100);
  $("#hourBars").innerHTML = a.next24.map((h) => `<div title="${hhmm(h.time)}: ${h.aqi}" style="height:${Math.max(3, (h.aqi / max) * 100)}%;background:${COLORS[h.category] || "#999"}"></div>`).join("");
  $("#axStart").textContent = a.next24.length ? hhmm(a.next24[0].time) : "";
  $("#axEnd").textContent = a.next24.length ? hhmm(a.next24[a.next24.length - 1].time) : "";
  $("#days").innerHTML = a.daily.slice(0, 5).map((d) => {
    const day = new Date(d.date + "T00:00").toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { weekday: "short" });
    return `<div>${day}<b>${d.max}</b><small>${esc(catLabel(d.category))}</small><i style="background:${COLORS[d.category]}"></i></div>`;
  }).join("");
}

// Scan slots
function renderSlots() {
  const labels = t("slots");
  const icons = ["⬆️", "➡️", "⬇️", "⬅️", "🛏️", "🍳"];
  $("#slots").innerHTML = labels.map((l, i) => {
    const p = state.photos[i];
    return `<label class="slot ${p ? "filled" : ""}">${p ? `<img src="${p.url}" alt=""><button class="x" data-rm="${i}" aria-label="Remove">×</button>` : `<span class="ico">${icons[i]}</span>${esc(l)}<small>${t("tap")}</small>`}<input type="file" accept="image/*" capture="environment" data-slot="${i}"></label>`;
  }).join("");
  $("#slots").querySelectorAll("input").forEach((inp) => (inp.onchange = () => {
    const f = inp.files[0];
    if (!f) return;
    state.photos[+inp.dataset.slot] = { file: f, url: URL.createObjectURL(f), label: labels[+inp.dataset.slot], setting: +inp.dataset.slot >= 4 ? "indoor" : "outdoor" };
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
  const steps = [...document.querySelectorAll("#steps li")];
  steps.forEach((s) => s.classList.remove("done"));
  let k = 0;
  const timer = setInterval(() => { if (k < steps.length - 1) steps[k++].classList.add("done"); }, 2500);
  try {
    const r = await fetch("/api/scan", { method: "POST", body: fd });
    if (!r.ok) throw new Error(await r.text());
    state.result = await r.json();
    steps.forEach((s) => s.classList.add("done"));
    renderResult();
  } catch (e) {
    $("#scanResult").hidden = false;
    $("#scanResult").innerHTML = `<div class="card">Scan failed: ${esc(e.message)}</div>`;
  } finally {
    clearInterval(timer);
    $("#scanProgress").hidden = true;
    updateScanBtn();
  }
};

function costBadge(c) { return c === 0 ? `<span class="cost free">${t("free")}</span>` : `<span class="cost">₹${c.toLocaleString("en-IN")}</span>`; }

function renderResult() {
  const R = state.result;
  const el = $("#scanResult");
  el.hidden = false;
  const plan = R.plan;
  let h = "";
  if (!R.ai_ok) h += `<div class="flag">${t("aiDown")}</div>`;
  if (plan) {
    h += `<div class="card"><p class="headline">${esc(plan.headline)}</p><p>${esc(plan.summary)}</p>
      <button class="btn" id="listenBtn">${t("listen")}</button><audio id="voice" hidden></audio></div>`;
  }
  if (R.haze_flag) h += `<div class="flag">⚠️ ${esc(R.haze_flag)}</div>`;

  // Sources
  h += `<div class="card"><h3 style="margin-top:0">${t("sourcesTitle")}</h3>`;
  if (!R.sources.length) h += `<p class="muted">${t("none")}</p>`;
  R.sources.forEach((s, i) => {
    const name = lang === "hi" ? s.name_hi : s.name_en;
    h += `<div class="src"><div class="rank">${i + 1}</div><div><h4>${esc(name)}</h4>
      <div><span class="tag">${t(s.where)}</span>${s.active ? `<span class="tag red">${t("active")}</span>` : ""}${s.distance && s.distance !== "inside" ? `<span class="tag">${t(s.distance)}</span>` : ""}${s.violation ? `<span class="tag red">⚖️</span>` : ""}</div>
      <p>${t("evidence")} ${esc(s.evidence)}</p></div></div>`;
  });
  h += `</div>`;

  // Photos with smoke boxes
  h += `<div class="card"><h3 style="margin-top:0">${t("photosTitle")}</h3><div class="photos">`;
  R.photos.forEach((p) => {
    const src = state.sent && state.sent[p.index] ? state.sent[p.index].url : "";
    const boxes = (p.smoke_boxes || []).map((b) => `<div class="bx" style="left:${b.box[0] * 100}%;top:${b.box[1] * 100}%;width:${(b.box[2] - b.box[0]) * 100}%;height:${(b.box[3] - b.box[1]) * 100}%"><span>${b.label} ${Math.round(b.confidence * 100)}%</span></div>`).join("");
    const hz = p.haze_model ? ` · ${t("hazeModel")}: ${p.haze_model.level}` : "";
    h += `<div class="ph"><img src="${src}" alt="">${boxes}<div class="cap">${esc(p.scene)}${hz}</div></div>`;
  });
  h += `</div></div>`;

  // Indoor estimate
  if (R.indoor) {
    const I = R.indoor;
    const tot = Math.max(1, I.from_outside + I.from_inside);
    h += `<div class="card"><h3 style="margin-top:0">${t("roomTitle")}</h3>
      <div class="room-aqi" style="color:${COLORS[I.category]}">${t("aqi")} ${I.aqi_low}–${I.aqi_high} · ${esc(catLabel(I.category))}</div>
      <div class="small">PM2.5 ≈ ${I.pm25_low}–${I.pm25_high} µg/m³</div>
      <div class="meter"><div class="out" style="width:${(I.from_outside / tot) * 100}%"></div><div class="in" style="width:${(I.from_inside / tot) * 100}%"></div></div>
      <div class="meter-legend"><span><i style="background:#8aa39d"></i>${I.from_outside} ${t("fromOut")}</span><span><i style="background:var(--vpoor)"></i>${I.from_inside} ${t("fromIn")}</span></div>
      <p class="small">${t("estNote")}</p></div>`;
  }

  // Actions
  h += `<div class="card"><h3 style="margin-top:0">${t("actionsTitle")}</h3>`;
  R.actions.forEach((a) => {
    const txt = lang === "hi" ? a.hi : a.en;
    const why = a.for === "member" || a.for === "myth" || a.for === "general" ? "" : `<small>${esc(lang === "hi" ? a.for_hi : a.for_en)}</small>`;
    h += `<div class="act">${a.for === "myth" ? `<span class="cost">💡</span>` : costBadge(a.cost)}<div><p>${esc(txt)}</p>${why}</div></div>`;
  });
  h += `</div>`;

  // Complaint
  if (R.violations.length && plan && plan.complaint_body) {
    h += `<div class="card"><h3 style="margin-top:0">${t("complaintTitle")}</h3>
      <textarea id="complaint">${esc(plan.complaint_subject + "\n\n" + plan.complaint_body)}</textarea>
      <div class="row"><button class="btn primary" id="shareBtn">${t("share")}</button><button class="btn" id="waBtn">${t("whatsapp")}</button><button class="btn" id="mailBtn">${t("email")}</button><button class="btn" id="copyBtn">${t("copy")}</button></div>
      <p class="small">${t("sendTo")} ${R.channels.map((c) => esc(c.name)).join(" · ")}</p></div>`;
  }
  h += `<button class="btn primary big" data-goto="map">${t("seeMap")}</button>`;
  el.innerHTML = h;
  el.scrollIntoView({ behavior: "smooth" });

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
  const text = () => $("#complaint").value;
  const evidenceFile = () => {
    const s = R.sources.find((x) => x.violation);
    const p = s && state.sent && state.sent[s.photo_index];
    return p ? new File([p.file], "evidence.jpg", { type: p.file.type || "image/jpeg" }) : null;
  };
  const sb = $("#shareBtn");
  if (sb) {
    sb.onclick = async () => {
      const f = evidenceFile();
      const data = { title: "Air pollution complaint", text: text() };
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) data.files = [f];
      try { await navigator.share(data); } catch (e) {}
    };
    if (!navigator.share) sb.hidden = true;
    $("#waBtn").onclick = () => window.open("https://wa.me/?text=" + encodeURIComponent(text()), "_blank");
    $("#mailBtn").onclick = () => (location.href = "mailto:?subject=" + encodeURIComponent(plan.complaint_subject) + "&body=" + encodeURIComponent(plan.complaint_body));
    $("#copyBtn").onclick = async () => { await navigator.clipboard.writeText(text()); $("#copyBtn").textContent = t("copied"); };
  }
}

// Community map
let map, layer;
async function loadMap() {
  if (!map) {
    map = L.map("map").setView([state.lat ?? 22.6, state.lon ?? 79.0], state.lat ? 13 : 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    layer = L.layerGroup().addTo(map);
    $("#legend").innerHTML = Object.entries({ burning: "🔥 Burning", dust: "Dust", traffic: "Traffic", industry: "Industry / DG", indoor: "Indoor only" })
      .map(([k, v]) => `<span><i style="background:${SRC_COLORS[k]}"></i>${v}</span>`).join("");
  }
  setTimeout(() => map.invalidateSize(), 50);
  if (state.lat != null) map.setView([state.lat, state.lon], 13);
  if (!Object.keys(state.sources).length) state.sources = await fetch("/api/sources").then((r) => r.json());
  const reports = await fetch("/api/reports?days=30").then((r) => r.json());
  layer.clearLayers();
  const counts = {};
  reports.forEach((r) => {
    const groups = r.sources.map((s) => SRC_GROUP[s] || "indoor");
    groups.forEach((g) => (counts[g] = (counts[g] || 0) + 1));
    const g = ["burning", "industry", "dust", "traffic", "indoor"].find((x) => groups.includes(x)) || "other";
    const names = r.sources.map((s) => (state.sources[s] ? (lang === "hi" ? state.sources[s].hi : state.sources[s].en) : s)).join(", ");
    L.circleMarker([r.lat, r.lon], { radius: 9, color: "#fff", weight: 2, fillColor: SRC_COLORS[g], fillOpacity: 0.9 })
      .bindPopup(`<b>${esc(names)}</b><br>${new Date(r.ts * 1000).toLocaleString("en-IN")}${r.aqi ? `<br>AQI ${r.aqi}` : ""}`).addTo(layer);
  });
  $("#mapStats").innerHTML = `<div><b>${reports.length}</b>${t("reports")} ${t("lastDays")}</div>` +
    ["burning", "dust", "industry", "traffic"].filter((g) => counts[g]).map((g) => `<div><b>${counts[g]}</b>${g}</div>`).join("");
}

applyLang();
