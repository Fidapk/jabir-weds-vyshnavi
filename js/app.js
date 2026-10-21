/* Jabir Favas & Vyshnavi Byju — site behaviour. Content lives in js/config.js. */
(function () {
  "use strict";
  const W = window.WEDDING;
  const SHOW = !!W.showPlaceholders;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), W);
  const isPh = (v) => typeof v === "string" && /^\s*\[[\s\S]*\]\s*$/.test(v);
  const filled = (v) => typeof v === "string" && v.trim() !== "" && !isPh(v);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("vj_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("vj_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Text with placeholder support. Returns false when the element was hidden. */
  function setText(el, value) {
    if (value == null || value === "") { el.hidden = true; return false; }
    el.hidden = false;
    if (isPh(value)) {
      if (!SHOW) { el.hidden = true; return false; }
      el.innerHTML = '<span class="ph">' + esc(value.trim()) + "</span>";
      return true;
    }
    el.textContent = value;
    return true;
  }
  const phHtml = (v) => (isPh(v) ? (SHOW ? '<span class="ph">' + esc(v.trim()) + "</span>" : "") : esc(v));

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 3200);
  }

  /* ---------------- bind text ---------------- */
  $$("[data-bind]").forEach((el) => setText(el, get(el.dataset.bind)));
  $$("[data-row]").forEach((row) => { const v = get(row.dataset.row); if (!filled(v) && !SHOW) row.hidden = true; });
  if (!W.rsvpOptional && $("#rsvpOptional")) $("#rsvpOptional").hidden = true;
  if (!SHOW) document.documentElement.classList.add("hide-ph");

  /* ---------------- photos ---------------- */
  const MOTIF = '<svg viewBox="0 0 200 60" aria-hidden="true"><use href="#motif"/></svg>';
  const SCENE = '<svg class="scene" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
    '<g fill="none" stroke="#a9864f" stroke-opacity=".35"><path d="M0 120 Q100 112 200 120 T400 118"/><path d="M0 140 Q120 134 240 140 T400 138"/><path d="M0 162 Q90 158 180 162 T400 160"/></g>' +
    '<g fill="#56634e" fill-opacity=".55"><path d="M318 94 C320 70 324 46 330 26 L334 27 C329 48 326 72 324 94 Z"/>' +
    '<path d="M332 28 C318 20 300 22 288 32 C304 28 318 30 330 32 Z"/><path d="M332 28 C344 16 362 14 376 22 C360 22 346 26 334 32 Z"/>' +
    '<path d="M332 27 C326 12 314 4 300 4 C314 10 324 18 330 30 Z"/><path d="M333 27 C342 14 356 10 368 12 C354 16 344 22 335 31 Z"/>' +
    '<path d="M332 30 C322 34 312 44 308 56 C316 46 324 38 333 33 Z"/><path d="M334 30 C346 34 356 44 360 54 C352 46 344 38 335 33 Z"/>' +
    '<path d="M60 104 C61 86 64 68 69 54 L72 55 C68 70 66 88 65 104 Z" fill-opacity=".8"/><path d="M71 56 C60 50 46 52 37 60 C50 56 60 57 70 60 Z"/>' +
    '<path d="M71 56 C80 46 94 44 104 50 C92 50 82 54 72 60 Z"/><path d="M71 55 C66 44 56 38 46 38 C56 42 64 48 69 58 Z"/><path d="M72 55 C79 45 89 42 98 44 C88 47 80 52 73 59 Z"/></g></svg>';

  function fillPhoto(el, photo) {
    const label = el.dataset.phLabel || "Photo";
    el.innerHTML = "";
    if (photo && filled(photo.src)) {
      const img = new Image();
      img.className = "photo"; img.decoding = "async";
      if (el.dataset.photo === "opening") { img.loading = "eager"; img.fetchPriority = "high"; } else { img.loading = "lazy"; }
      img.src = photo.src; img.alt = photo.alt || "";
      if (photo.position) img.style.objectPosition = photo.position;
      el.appendChild(img);
      return;
    }
    const venue = el.dataset.phStyle === "venue";
    const f = document.createElement("div");
    f.className = "phframe" + (venue ? " phframe--venue" : "");
    f.setAttribute("role", "img");
    f.setAttribute("aria-label", (photo && photo.alt) || label);
    f.innerHTML = (venue ? SCENE : MOTIF) + "<span>" + esc(label) + "</span>" + (SHOW ? "<small>Add photo in config.js</small>" : "");
    el.appendChild(f);
  }
  $$("[data-photo]").forEach((el) => fillPhoto(el, W.photos[el.dataset.photo]));
  $$("[data-photo-path]").forEach((el) => fillPhoto(el, get(el.dataset.photoPath)));
  // small figure beside each celebration date: an image or one of the doodles
  $$("[data-figure]").forEach((el) => {
    const f = get(el.dataset.figure + ".figure");
    if (!f) { el.hidden = true; return; }
    if (filled(f.src)) {
      const img = new Image(); img.src = f.src; img.alt = f.alt || ""; img.loading = "lazy"; img.decoding = "async";
      el.appendChild(img); el.classList.add("ev__fig--img");
    } else if (f.art) {
      el.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#dd-' + esc(f.art) + '"/></svg>';
    }
  });

  /* ---------------- story ---------------- */
  $$("[data-facts]").forEach((dl) => {
    const facts = (W[dl.dataset.facts] && W[dl.dataset.facts].facts) || [];
    dl.innerHTML = facts.filter((f) => SHOW || filled(f.value))
      .map((f) => "<div><dt>" + esc(f.label) + "</dt><dd>" + phHtml(f.value) + "</dd></div>").join("");
    if (!dl.children.length) dl.hidden = true;
  });

  const tl = $("#timelineList");
  const UNDERLINE = '<svg class="tl-under" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 6 C40 2 80 9 120 5 S180 3 198 6"/></svg>';
  tl.innerHTML = W.timeline.map((m) =>
    '<li class="tl-item reveal">' +
      '<div class="tl-art">' + (filled(m.img) ? '<img src="' + esc(m.img) + '" alt="" loading="lazy" decoding="async">' : '<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#dd-' + esc(m.art || "more") + '"/></svg>') + '</div>' +
      '<span class="tl-dot" aria-hidden="true"></span>' +
      '<div class="tl-text"><h4>' + esc(m.title) + "</h4>" + UNDERLINE + "<p>" + phHtml(m.text) + "</p></div>" +
    "</li>").join("");

  // hearts floating up from the couple in the sunset photo
  const FB_COLOURS = ["#e2574a", "#ef6f7b", "#f48fb1", "#d7263d", "#f9a8c9", "#e1a21b"];
  const rnd = (a, b) => a + Math.random() * (b - a);
  $("#fbHearts").innerHTML = Array.from({ length: 24 }, (_, i) => {
    const dur = rnd(6, 10);
    return '<span style="left:' + rnd(26, 74).toFixed(1) + "%;bottom:" + rnd(30, 52).toFixed(1) + "%;" +
      "animation-duration:" + dur.toFixed(1) + "s;animation-delay:" + (-rnd(0, dur)).toFixed(1) + "s;" +
      "--sx:" + rnd(-70, 70).toFixed(0) + "px;--sy:" + (-rnd(140, 300)).toFixed(0) + "px;--sc:" + rnd(0.55, 1.25).toFixed(2) + ";" +
      "--hc:" + FB_COLOURS[i % FB_COLOURS.length] + '">' +
      '<svg viewBox="0 0 32 30"><path d="M16 28S2 19.5 2 10.2C2 5.6 5.6 2 10 2c2.6 0 4.8 1.3 6 3.3C17.2 3.3 19.4 2 22 2c4.4 0 8 3.6 8 8.2C30 19.5 16 28 16 28z"/></svg></span>';
  }).join("");

  $("#noteText").innerHTML =W.note.map((p) => "<p>" + phHtml(p) + "</p>").join("");

  /* note: shown faded, each line brightens as the reader scrolls to it */
  setTimeout(function noteLines() {
    const sheet = $(".np__sheet");
    if (!sheet || reduced) return;
    const chars = [];
    const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT);
    const nodes = []; let n;
    while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
    nodes.forEach((t) => {
      const frag = document.createDocumentFragment();
      t.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement("span"); w.className = "w";
        for (const ch of part) { const c = document.createElement("span"); c.className = "c"; c.textContent = ch; w.appendChild(c); chars.push(c); }
        frag.appendChild(w);
      });
      t.parentNode.replaceChild(frag, t);
    });
    const ring = sheet.querySelector(".np__ring"); if (ring) { ring.classList.add("c"); chars.push(ring); }
    if (!chars.length) return;
    sheet.classList.add("np--write");
    let lines = [], next = 0;
    const measure = () => {
      const sr = sheet.getBoundingClientRect(); lines = [];
      chars.forEach((c) => {
        const r = c.getBoundingClientRect(), top = r.top - sr.top, bottom = r.bottom - sr.top;
        let L = lines[lines.length - 1];
        if (!L || top > L.bottom - 4) { L = { top, bottom, items: [] }; lines.push(L); }
        L.bottom = Math.max(L.bottom, bottom); L.items.push(c);
      });
      next = 0; while (next < lines.length && lines[next].items[0].classList.contains("on")) next++;
    };
    const update = () => {
      const edge = innerHeight * 0.8 - sheet.getBoundingClientRect().top;
      while (next < lines.length && edge >= (lines[next].top + lines[next].bottom) / 2) {
        lines[next].items.forEach((c) => c.classList.add("on")); next++;
      }
      if (next >= lines.length) removeEventListener("scroll", onScroll);
    };
    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } };
    measure(); update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { measure(); update(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); update(); });
  }, 0);

  /* ---------------- links & calendar ---------------- */
  const R = W.reception;
  ["#mapLink", "#helpMap"].forEach((s) => { if ($(s)) $(s).href = R.mapUrl; });
  ["#dirLink", "#helpDir"].forEach((s) => { if ($(s)) $(s).href = R.directionsUrl; });
  const names = W.couple.groom.full + " & " + W.couple.bride.full;
  const calTitle = names + " — Wedding Reception";
  const calDetails = R.invitation + "\n\n" + R.timeLabel + " · " + R.venueName + ", " + R.venueArea + "\nMap: " + R.mapUrl;
  const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  $("#calGoogle").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(calTitle) +
    "&dates=" + utc(R.start) + "/" + utc(R.calendarEnd) +
    "&details=" + encodeURIComponent(calDetails) +
    "&location=" + encodeURIComponent(R.calendarLocation) + "&ctz=Asia/Kolkata";
  $("#calOutlook").href = "https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent" +
    "&subject=" + encodeURIComponent(calTitle) +
    "&startdt=" + encodeURIComponent(new Date(R.start).toISOString()) +
    "&enddt=" + encodeURIComponent(new Date(R.calendarEnd).toISOString()) +
    "&body=" + encodeURIComponent(calDetails) +
    "&location=" + encodeURIComponent(R.calendarLocation);
  function buildIcs() {
    const fold = (s) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Jabir Favas and Vyshnavi Byju//Wedding//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT", "UID:reception-20270131@jabir-vyshnavi", "DTSTAMP:" + utc(new Date().toISOString()),
      "DTSTART:" + utc(R.start), "DTEND:" + utc(R.calendarEnd),
      "SUMMARY:" + fold(calTitle), "DESCRIPTION:" + fold(calDetails), "LOCATION:" + fold(R.calendarLocation),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + fold(calTitle + " tomorrow"), "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }
  const inArtifact = !!(window.claude && typeof window.claude.use === "function");
  let downloads = null;
  if (inArtifact) window.claude.use("downloads").then((d) => { downloads = d; if (!d) $("#calIcs").hidden = true; }).catch(() => ($("#calIcs").hidden = true));
  $("#calIcs").addEventListener("click", async () => {
    const ics = buildIcs();
    const filename = "jabir-vyshnavi-reception.ics";
    if (inArtifact) {
      if (!downloads) { toast("Please use Google Calendar or Outlook here."); return; }
      try { await downloads.save({ filename, data: new Blob([ics], { type: "text/calendar" }) }); } catch (e) { /* viewer declined */ }
      return;
    }
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("Calendar file downloaded — open it to add the reception.");
  });
  const calBtn = $("#calBtn"), calMenu = $("#calMenu");
  calBtn.addEventListener("click", (e) => { e.stopPropagation(); const open = calMenu.hidden; calMenu.hidden = !open; calBtn.setAttribute("aria-expanded", String(open)); });
  document.addEventListener("click", (e) => { if (!calMenu.hidden && !calMenu.contains(e.target)) { calMenu.hidden = true; calBtn.setAttribute("aria-expanded", "false"); } });

  /* ---------------- countdown ---------------- */
  const target = new Date(R.start).getTime();
  const cd = { d: $("#cdD"), h: $("#cdH"), m: $("#cdM"), s: $("#cdS") };
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    cd.d.textContent = d; cd.h.textContent = pad(h); cd.m.textContent = pad(m); cd.s.textContent = pad(s);
    if (target - Date.now() <= 0) {
      $("#countdown").classList.add("is-done");
      const since = Date.now() - target;
      $("#cdTo").textContent = since < 12 * 36e5 ? "Today’s the day! We can’t wait to see you." : "We’re married! Thank you for celebrating with us.";
      return false;
    }
    return true;
  }
  $("#cdTo").textContent = "until the reception · " + R.dateLabel + ", " + R.timeLabel.replace(" onwards", "") + " IST";
  if (tick()) { const iv = setInterval(() => { if (!tick()) clearInterval(iv); }, 1000); }

  /* ---------------- music ---------------- */
  const player = (function () {
    const M = W.music;
    let audio = null, ctx = null, master = null, playing = false;
    let anchor = 0, nextIdx = 0, loopN = 0, timer = null, pausedAt = 0, started = false;
    // Playlist (falls back to the single src setting); each visit starts on a random song,
    // avoiding the one this browser started on last time.
    const tracks = mixLanguages((M.playlist || []).filter((t) => t && filled(t.src)));
    if (!tracks.length && filled(M.src)) tracks.push({ src: M.src, title: M.title, artist: M.artist });
    const useFile = tracks.length > 0;
    let cur = 0;
    // A fresh order every visit, with the languages mixed: never two songs of the same language
    // in a row, and not the same opening song this browser heard last time.
    function mixLanguages(list) {
      if (list.length < 2) return list;
      let lastStart = "";
      try { lastStart = localStorage.getItem("wedding:lastStart") || ""; } catch (e) {}
      let order = [];
      for (let tries = 0; tries < 6; tries++) {
        order = mixOnce(list);
        if (order[0].src !== lastStart) break;
      }
      try { localStorage.setItem("wedding:lastStart", order[0].src); } catch (e) {}
      return order;
    }
    function mixOnce(list) {
      const shuffled = list.slice();
      for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
      const groups = new Map(); // language -> its songs, shuffled
      shuffled.forEach((t) => {
        const k = t.lang || "other"; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(t);
      });
      const out = []; let prev = null;
      while (out.length < list.length) {
        const left = list.length - out.length;
        let options = [...groups].filter(([k, g]) => g.length && k !== prev);
        if (!options.length) options = [...groups].filter(([, g]) => g.length); // only one language left
        // A language holding half or more of what's left must go now, or its songs would bunch up at the end.
        const big = options.find(([, g]) => g.length >= left - g.length);
        let pick = big;
        if (!pick) { // otherwise random, weighted by how many songs each language has left
          let r = Math.random() * options.reduce((n, [, g]) => n + g.length, 0);
          pick = options.find(([, g]) => (r -= g.length) < 0) || options[0];
        }
        out.push(pick[1].shift()); prev = pick[0];
      }
      return out;
    }
    function ensureAudio() {
      if (audio) return;
      audio = new Audio(tracks[cur].src); audio.preload = "auto"; audio.loop = tracks.length === 1;
      audio.addEventListener("loadedmetadata", () => ui.time());
      audio.addEventListener("ended", () => player.next());
    }
    function startAudio() {
      const p = audio.play(); if (p && p.catch) p.catch(() => { playing = false; ui.state(); toast("Tap play to start the music."); });
    }
    // Original waltz melody for the music box (D major), composed for this site.
    const BEAT = 60 / 84;
    const bars = [
      ["D", [[69,1],[74,1],[78,1]]], ["Bm", [[78,2],[76,1]]], ["G", [[74,1],[76,1],[79,1]]], ["A", [[78,2],[76,1]]],
      ["D", [[69,1],[74,1],[78,1]]], ["Bm", [[83,2],[81,1]]], ["G", [[79,1],[78,1],[76,1]]], ["A", [[76,3]]],
      ["G", [[74,1],[79,1],[83,1]]], ["A", [[81,2],[79,1]]], ["F#m", [[78,1.5],[76,.5],[73,1]]], ["Bm", [[74,2],[71,1]]],
      ["G", [[79,1],[78,1],[76,1]]], ["Em", [[76,1],[78,1],[79,1]]], ["A", [[81,1],[79,1],[76,1]]], ["D", [[74,3]]]
    ];
    const CH = { D:[50,57,62,66], Bm:[47,54,59,62], G:[43,55,59,62], A:[45,57,61,64], "F#m":[42,54,57,61], Em:[40,55,59,64] };
    const events = [];
    (function build() {
      let t = 0;
      for (let pass = 0; pass < 2; pass++) {
        bars.forEach(([ch, mel], bi) => {
          const c = CH[ch];
          events.push({ t, n: c[0], d: 3 * BEAT, k: "bass" });
          events.push({ t: t + BEAT, n: c[1], d: BEAT, k: "pad" }, { t: t + BEAT, n: c[2], d: BEAT, k: "pad" });
          events.push({ t: t + 2 * BEAT, n: c[1], d: BEAT, k: "pad" }, { t: t + 2 * BEAT, n: c[3], d: BEAT, k: "pad" });
          let mt = t;
          mel.forEach(([n, b]) => { events.push({ t: mt, n, d: b * BEAT, k: "bell" }); mt += b * BEAT; });
          if (pass === 1 && bi % 2 === 1) events.push({ t: t + 2.5 * BEAT, n: mel[mel.length - 1][0] + 12, d: BEAT, k: "spark" });
          t += 3 * BEAT;
        });
      }
      events.sort((a, b) => a.t - b.t);
    })();
    const DUR = useFile ? 0 : 2 * bars.length * 3 * BEAT;
    const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);

    function setupCtx() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.32;
      const verb = ctx.createConvolver();
      const len = ctx.sampleRate * 2.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4); }
      verb.buffer = buf;
      const wet = ctx.createGain(); wet.gain.value = 0.32;
      master.connect(ctx.destination); master.connect(verb); verb.connect(wet); wet.connect(ctx.destination);
      return true;
    }
    function voice(ev, when) {
      const g = ctx.createGain(); g.connect(master);
      const f = hz(ev.n);
      const parts = ev.k === "bell" ? [[1, .5, "sine"], [2, .12, "sine"], [4.01, .05, "sine"]]
        : ev.k === "spark" ? [[1, .16, "sine"], [3, .04, "sine"]]
        : ev.k === "bass" ? [[1, .34, "sine"], [2, .05, "triangle"]]
        : [[1, .07, "triangle"]];
      const decay = ev.k === "bass" ? 2.4 : ev.k === "pad" ? 1.1 : 1.8;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(1, when + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
      parts.forEach(([mul, amp, type]) => {
        const o = ctx.createOscillator(), og = ctx.createGain();
        o.type = type; o.frequency.value = f * mul; og.gain.value = amp;
        o.connect(og); og.connect(g); o.start(when); o.stop(when + decay + 0.05);
      });
    }
    function schedule() {
      const ahead = ctx.currentTime + 0.2;
      while (true) {
        const ev = events[nextIdx];
        const at = anchor + loopN * DUR + ev.t;
        if (at > ahead) break;
        if (at >= ctx.currentTime - 0.02) voice(ev, Math.max(at, ctx.currentTime));
        nextIdx++;
        if (nextIdx >= events.length) { nextIdx = 0; loopN++; }
      }
    }
    function seekSynth(pos) {
      anchor = ctx.currentTime - pos; loopN = 0;
      nextIdx = events.findIndex((e) => e.t >= pos); if (nextIdx < 0) { nextIdx = 0; loopN = 1; }
    }
    return {
      get title() { return useFile ? tracks[cur].title : M.fallbackTitle; },
      get artist() { return useFile ? tracks[cur].artist : M.fallbackArtist; },
      get canSkip() { return tracks.length > 1; },
      get playing() { return playing; },
      skip(step) {
        if (!this.canSkip) return;
        cur = (cur + step + tracks.length) % tracks.length;
        ensureAudio(); audio.src = tracks[cur].src;
        ui.track(); ui.time();
        playing = true; startAudio(); ui.state();
      },
      next() { this.skip(1); },
      prev() {
        // Like most players: restart the song if it's a few seconds in, otherwise go back one.
        if (audio && audio.currentTime > 3) { audio.currentTime = 0; ui.time(); return; }
        this.skip(-1);
      },
      play() {
        if (useFile) {
          ensureAudio(); startAudio();
        } else {
          if (!ctx && !setupCtx()) { toast("Music isn’t supported in this browser."); return; }
          if (ctx.state === "suspended") ctx.resume();
          if (!timer) { seekSynth(pausedAt); started = true; timer = setInterval(schedule, 40); schedule(); }
        }
        playing = true; ui.state();
      },
      pause() {
        if (useFile) { audio && audio.pause(); }
        else if (ctx) { pausedAt = this.position(); ctx.suspend(); }
        playing = false; ui.state();
      },
      toggle() { this.playing ? this.pause() : this.play(); },
      duration() { return useFile ? (audio && isFinite(audio.duration) ? audio.duration : 0) : DUR; },
      position() {
        if (useFile) return audio ? audio.currentTime : 0;
        if (!ctx || !started) return pausedAt;
        return ((ctx.currentTime - anchor) % DUR + DUR) % DUR;
      },
      seek(frac) {
        const pos = frac * this.duration();
        if (useFile) { if (audio) audio.currentTime = pos; }
        else if (ctx && started) seekSynth(pos); else pausedAt = pos;
      }
    };
  })();

  const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + pad(s % 60); };
  const seek = $("#seek");
  let seeking = false;
  const ui = {
    state() {
      const on = player.playing;
      $("#playIcon").setAttribute("d", on ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z");
      $("#playBtn").setAttribute("aria-label", on ? "Pause" : "Play");
      $("#fab").classList.toggle("is-playing", on);
      $("#disc").classList.toggle("spin", on && !reduced);
    },
    time() {
      const d = player.duration(), p = player.position();
      $("#tCur").textContent = fmt(p); $("#tDur").textContent = fmt(d);
      if (!seeking) seek.value = d ? String(Math.round((p / d) * 1000)) : "0";
    },
    track() {
      setText($("#trackTitle"), player.title);
      setText($("#trackArtist"), player.artist);
    }
  };
  ui.track();
  ui.time();
  setInterval(() => { if (player.playing) ui.time(); }, 250);
  $("#playBtn").addEventListener("click", () => player.toggle());
  $("#prevBtn").hidden = $("#nextBtn").hidden = !player.canSkip;
  $("#prevBtn").addEventListener("click", () => player.prev());
  $("#nextBtn").addEventListener("click", () => player.next());
  $("#disc").addEventListener("click", () => {
    const open = !$("#fab").classList.contains("is-open");
    $("#fab").classList.toggle("is-open", open); $("#disc").setAttribute("aria-expanded", String(open));
  });
  seek.addEventListener("input", () => { seeking = true; $("#tCur").textContent = fmt((seek.value / 1000) * player.duration()); });
  seek.addEventListener("change", () => { player.seek(seek.value / 1000); seeking = false; ui.time(); });

  /* ---------------- opening invitation ---------------- */
  const invite = $("#invite");
  const openChip = $("#openMusicToggle");
  let musicOnOpen = !!W.music.playOnOpen;
  const syncOpenChip = () => { openChip.setAttribute("aria-pressed", String(musicOnOpen)); $(".chip__label", openChip).textContent = musicOnOpen ? "Music on" : "Music off"; };
  syncOpenChip();
  openChip.addEventListener("click", () => { musicOnOpen = !musicOnOpen; syncOpenChip(); });
  // lets motion.js start the page's entrance animation as the invitation fades away
  function announceOpen() {
    if (document.documentElement.classList.contains("site-open")) return;
    document.documentElement.classList.add("site-open");
    document.dispatchEvent(new Event("invite:open"));
  }
  function finishOpen() {
    announceOpen();
    invite.hidden = true;
    document.documentElement.classList.remove("locked");
    $("#fab").classList.add("is-shown");
    onScroll();
  }
  let opening = false;
  function openInvite() {
    if (opening) return;
    opening = true;
    if (musicOnOpen) player.play();
    if (reduced) { finishOpen(); return; }
    heartBurst($("#openSeal"), "heart-burst--top");
    invite.classList.add("is-opening");
    setTimeout(() => { invite.classList.add("is-gone"); announceOpen(); }, 950);
    setTimeout(finishOpen, 1850);
  }
  $("#openInvite").addEventListener("click", openInvite);
  $("#openSeal").addEventListener("click", openInvite);
  invite.addEventListener("keydown", (e) => { if (e.key === "Escape") openInvite(); });
  const SECTION_IDS = ["home", "story", "celebrations", "rsvp", "gallery", "music", "note", "wishes", "help", "closing"];
  // Deferred: finishOpen touches scroll code that is set up further down this file.
  if (SECTION_IDS.includes(location.hash.slice(1))) { setTimeout(finishOpen); } else { $("#openInvite").focus({ preventScroll: true }); }

  /* ---------------- nav ---------------- */
  const nav = $("#nav"), navToggle = $("#navToggle"), navMenu = $("#navMenu");
  navToggle.addEventListener("click", () => { const o = navToggle.getAttribute("aria-expanded") !== "true"; navToggle.setAttribute("aria-expanded", String(o)); navMenu.classList.toggle("is-open", o); });
  $$("a", navMenu).forEach((a) => a.addEventListener("click", () => { navToggle.setAttribute("aria-expanded", "false"); navMenu.classList.remove("is-open"); }));
  const links = new Map($$("a", navMenu).map((a) => [a.getAttribute("href").slice(1), a]));
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { links.forEach((a) => a.classList.remove("is-active")); const a = links.get(en.target.id); if (a) a.classList.add("is-active"); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el) so.observe(el); });
  }

  /* ---------------- reveal on scroll ---------------- */
  if ("IntersectionObserver" in window && !reduced) {
    const ro = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pre"); ro.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("pre"); ro.observe(el); } });
  }

  /* ---------------- scroll effects: nav, parallax, timeline line ---------------- */
  const hero = $("#home"), timeline = $("#timeline");
  const parallax = $$("[data-parallax]");
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      nav.classList.toggle("is-shown", invite.hidden && scrollY > hero.offsetHeight * 0.45);
      if (!reduced) parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) el.style.setProperty("--py", ((r.top + r.height / 2 - innerHeight / 2) * -0.07).toFixed(1) + "px");
      });
      const r = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
      timeline.style.setProperty("--tl-p", p.toFixed(3));
      heartRide(p);
    });
  }
  /* a red and a mustard heart zig-zag down the story line, meet at the end, join and pop */
  const rider = $("#tlRider");
  const HEART_PATH = "M16 28S2 19.5 2 10.2C2 5.6 5.6 2 10 2c2.6 0 4.8 1.3 6 3.3C17.2 3.3 19.4 2 22 2c4.4 0 8 3.6 8 8.2C30 19.5 16 28 16 28z";
  const HEART_COLOURS = ["#e2574a", "#f48fb1", "#ef6f7b", "#f6b2c4", "#c8574b", "#fbbf24"];
  const DUO_COLOURS = ["#d7263d", "#e1a21b", "#ef4f5f", "#f2c14e", "#b81d33", "#f6d27a"];
  const ZIGZAGS = 7, ZIG_PX = 16;
  let burst = false, lastTrail = -1, popTimer = null;
  function heartRide(p) {
    if (!rider) return;
    rider.classList.toggle("is-moving", p > 0.01 && p < 0.985);
    if (reduced) return;
    // zig-zag: a triangle wave across the line, narrowing to nothing over the last stretch so the hearts meet
    const x = p * ZIGZAGS + 0.25, tri = 1 - 4 * Math.abs(x - Math.floor(x) - 0.5); // +0.25 so they start side by side
    const narrow = Math.min(1, (1 - p) / 0.15);
    rider.style.setProperty("--zx", (tri * ZIG_PX * narrow).toFixed(1) + "px");
    // little hearts left behind along the line
    if (p > 0.02 && p < 0.97 && Math.abs(p - lastTrail) > 0.045) {
      lastTrail = p;
      const t = document.createElement("span");
      t.className = "tl-trail";
      t.style.top = rider.offsetTop + "px";
      t.style.setProperty("--dx", (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 30) + "px");
      t.innerHTML = '<svg viewBox="0 0 32 30"><path fill="' + DUO_COLOURS[Math.floor(Math.random() * DUO_COLOURS.length)] + '" d="' + HEART_PATH + '"/></svg>';
      timeline.appendChild(t);
      setTimeout(() => t.remove(), 1600);
    }
    if (p >= 0.985 && !burst) {
      // the two hearts press together, then pop
      burst = true;
      rider.classList.add("is-joined");
      popTimer = setTimeout(() => { rider.classList.add("is-popped"); heartBurst(rider, "", DUO_COLOURS); }, 450);
    }
    if (p < 0.75 && burst) { burst = false; clearTimeout(popTimer); rider.classList.remove("is-joined", "is-popped"); }
  }
  // Hearts fly out from the centre of el. extraClass lets a caller raise the layer (e.g. above the opening card).
  function heartBurst(el, extraClass, colours = HEART_COLOURS) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const layer = document.createElement("div");
    layer.className = "heart-burst" + (extraClass ? " " + extraClass : "");
    const n = innerWidth < 600 ? 28 : 44;
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      const ang = Math.random() * Math.PI * 2, dist = 80 + Math.random() * Math.max(innerWidth, innerHeight) * 0.55;
      h.style.left = cx + "px"; h.style.top = cy + "px";
      h.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      h.style.setProperty("--dy", Math.sin(ang) * dist * 0.8 - 40 + "px");
      h.style.setProperty("--s", (0.5 + Math.random() * 1.1).toFixed(2));
      h.style.setProperty("--r", (Math.random() * 80 - 40).toFixed(0) + "deg");
      h.style.animationDelay = (Math.random() * 0.25).toFixed(2) + "s";
      h.innerHTML = '<svg viewBox="0 0 32 30"><path fill="' + colours[i % colours.length] + '" d="' + HEART_PATH + '"/></svg>';
      layer.appendChild(h);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 2600);
  }

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------------- backend helpers ---------------- */
  const backend = filled(W.backendUrl) ? W.backendUrl.trim() : "";
  const waNumber = filled(W.whatsappNumber) ? W.whatsappNumber.replace(/\D/g, "") : "";
  const pageOpened = Date.now();
  async function post(payload) {
    if (!backend) throw new Error("no-backend");
    const res = await fetch(backend, { method: "POST", body: JSON.stringify(payload) }); // text/plain: no CORS preflight
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "failed");
    return data;
  }
  const waLink = (text) => "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text);
  function notConnectedMsg() {
    return SHOW ? "[Couple: RSVP isn’t connected yet — add backendUrl or whatsappNumber in config.js.]"
      : "Online replies aren’t open yet. Please reach us using the numbers under Need Help.";
  }

  /* ---------------- RSVP (form removed from the page; kept for easy restore) ---------------- */
  const rForm = $("#rsvpForm");
  if (rForm) {
  /* ---------------- RSVP ---------------- */
  const rCount = $("#rCount"), rStatus = $("#rStatus");
  const clampCount = () => { let v = parseInt(rCount.value, 10); if (!v || v < 1) v = 1; if (v > 20) v = 20; rCount.value = v; return v; };
  $("#rMinus").addEventListener("click", () => { rCount.value = clampCount() - 1; clampCount(); });
  $("#rPlus").addEventListener("click", () => { rCount.value = clampCount() + 1; clampCount(); });
  rCount.addEventListener("change", clampCount);
  $$('input[name="attending"]').forEach((r) => r.addEventListener("change", () => { $("#rCountWrap").hidden = $("#rNo").checked; }));
  function rsvpDone(html) {
    rForm.innerHTML = '<div class="form__done">' + html + "</div>";
    const again = $("#rAgain"); if (again) again.addEventListener("click", () => location.reload());
  }
  rForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#rName").value.trim();
    $("#rNameErr").hidden = !!name;
    if (!name) { $("#rName").focus(); return; }
    if ($("#rWebsite").value) return; // bot
    const attending = $("#rYes").checked ? "yes" : "no";
    const count = attending === "yes" ? clampCount() : 0;
    const phoneRaw = $("#rPhone").value.trim();
    const phone = phoneRaw ? ($("#rCode").value + " " + phoneRaw).trim() : "";
    const message = $("#rMsg").value.trim();
    const btn = $("#rSubmit"); btn.disabled = true; rStatus.className = "form__status"; rStatus.textContent = "Sending…";
    const yesHead = '<p class="eyebrow">See you on 31 January</p><h3>Thank you, ' + esc(name.split(" ")[0]) + "!</h3>";
    const noHead = '<p class="eyebrow">Thank you for letting us know</p><h3>We’ll miss you, ' + esc(name.split(" ")[0]) + "</h3>";
    try {
      await post({ type: "rsvp", name, phone, attending, count, message, website: "", elapsed: Date.now() - pageOpened });
      store.set("rsvp", { name, attending, count });
      rsvpDone((attending === "yes" ? yesHead + "<p>Your RSVP for " + count + (count === 1 ? " guest" : " guests") + " is saved. We can’t wait to celebrate with you at " + esc(R.venueName) + ".</p>"
        : noHead + "<p>Your reply is saved. You’ll be in our thoughts — and you can still leave us a wish below.</p>") +
        '<a class="btn btn--line" href="#wishes">Leave a wish</a>');
    } catch (err) {
      btn.disabled = false;
      if (waNumber) {
        const text = "RSVP — " + names + " reception, 31 Jan 2027\nName: " + name + "\nAttending: " + (attending === "yes" ? "Yes (" + count + ")" : "No") +
          (phone ? "\nPhone: " + phone : "") + (message ? "\nMessage: " + message : "");
        rsvpDone((attending === "yes" ? yesHead : noHead) + "<p>One last step: tap below to send your RSVP to us on WhatsApp. It isn’t sent until you press send there.</p>" +
          '<a class="btn btn--solid" target="_blank" rel="noopener" href="' + waLink(text) + '">Send RSVP on WhatsApp</a>' +
          '<p style="margin-top:14px"><button class="btn btn--line" id="rAgain" type="button">Start over</button></p>');
      } else {
        rStatus.className = "form__status err";
        rStatus.textContent = err.message === "no-backend" ? notConnectedMsg() : "We couldn’t save your RSVP just now. Please check your connection and try again.";
      }
    }
  });

  }

  /* ---------------- wishes ---------------- */
  const wForm = $("#wishForm"), wMsg = $("#wMsg"), wStatus = $("#wStatus");
  wMsg.addEventListener("input", () => ($("#wCount").textContent = wMsg.value.length));
  const MAIL_RE = /\S+@\S+\.\S+/;
  const hasPhone = (t) => (t.match(/\+?\d[\d\s\-().]{7,}\d/g) || []).some((m) => m.replace(/\D/g, "").length >= 9);
  /* lantern sky: one glowing lantern per wish, tap to read */
  const lsky = $("#lskyLanterns"), lskyEmpty = $("#lskyEmpty");
  const SLOTS = [[16,14,1],[50,18,1.35],[82,12,1.05],[30,38,1.1],[68,34,1.15],[12,52,.85],[50,52,.95],[86,48,.85],[30,66,.8],[66,64,.75],[14,80,.65],[48,80,.7],[84,80,.65],[32,24,.7],[64,22,.75],[40,92,.6]];
  let wishesShown = [];
  // Couple view: opening the site once with ?couple=<key> remembers the key on that device and lets
  // "Only the couple" wishes load too. The key is checked by the Google script, never stored in these files.
  let coupleKey = store.get("coupleKey", "");
  const keyParam = new URLSearchParams(location.search).get("couple");
  if (keyParam) {
    coupleKey = keyParam.trim(); store.set("coupleKey", coupleKey);
    const clean = new URL(location.href); clean.searchParams.delete("couple");
    history.replaceState(null, "", clean.pathname + clean.search + clean.hash); // keep the key out of the address bar
  }
  function lanternEl(w, i, mine) {
    const [x, y, sc] = SLOTS[i % SLOTS.length];
    const lap = Math.floor(i / SLOTS.length);
    const b = document.createElement("button");
    b.type = "button"; b.className = "lan" + (mine ? " lan--mine" : "") + (w.private ? " lan--private" : "");
    b.style.left = (x + lap * 4) % 96 + "%"; b.style.top = Math.min(92, y + lap * 3) + "%";
    b.style.setProperty("--sc", (sc * (lap ? 0.8 : 1)).toFixed(2));
    b.style.animationDelay = (-(i * 0.7) % 6).toFixed(1) + "s";
    b.setAttribute("aria-label", "Read the wish from " + w.name);
    b.innerHTML = '<span class="lan__body" aria-hidden="true"></span><span class="lan__name"></span>';
    b.lastChild.textContent = w.name;
    b.addEventListener("click", () => openWish(w, mine));
    return b;
  }
  function renderWall(list) {
    lsky.innerHTML = "";
    const mine = store.get("wishes", []).filter((m) => m.visibility === "public" && !list.some((w) => w.id && w.id === m.id));
    wishesShown = mine.map((m) => [m, true]).concat(list.map((w) => [w, false]));
    wishesShown.forEach(([w, m], i) => lsky.appendChild(lanternEl(w, i, m)));
    // fill the rest of the sky with softly glowing unnamed lanterns
    for (let i = wishesShown.length; i < 13; i++) {
      const [x, y, sc] = SLOTS[i];
      const d = document.createElement("span"); d.className = "lan lan--ghost"; d.setAttribute("aria-hidden", "true");
      d.style.left = x + "%"; d.style.top = y + "%"; d.style.setProperty("--sc", (sc * 0.85).toFixed(2)); d.style.animationDelay = (-i * 0.9) + "s";
      d.innerHTML = '<span class="lan__body"></span>'; lsky.appendChild(d);
    }
    lskyEmpty.hidden = wishesShown.length > 0;
  }
  const lmodal = $("#lmodal");
  let lmodalReturn = null;
  function openWish(w, mine) {
    lmodalReturn = document.activeElement;
    $("#lmodalMsg").textContent = w.message;
    $("#lmodalName").textContent = "— " + w.name;
    const note = $("#lmodalNote");
    note.textContent = w.private ? "A private wish — only the two of you can see this lantern." : "This lantern is yours — thank you for your wish!";
    note.hidden = !(mine || w.private);
    lmodal.hidden = false; $("#lmodalClose").focus();
  }
  function closeWish() { lmodal.hidden = true; if (lmodalReturn) lmodalReturn.focus(); }
  $("#lmodalClose").addEventListener("click", closeWish);
  lmodal.addEventListener("click", (e) => { if (e.target === lmodal) closeWish(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lmodal.hidden) closeWish(); });
  // wishes from the Google Sheet (public ones, plus private ones in the couple view)
  let approved = [];
  renderWall(approved);
  function loadWishes() {
    if (!backend) return;
    fetch(backend + (backend.includes("?") ? "&" : "?") + "action=wishes&t=" + Date.now() + (coupleKey ? "&key=" + encodeURIComponent(coupleKey) : ""))
      .then((r) => r.json()).then((d) => {
        if (!d || !d.ok || !Array.isArray(d.wishes)) return;
        if (coupleKey && !d.couple) { coupleKey = ""; store.set("coupleKey", ""); } // wrong or changed key: back to the guest view
        $(".lsky__hint").textContent = d.couple ? "Couple view · gold lanterns are private wishes, only for you two" : "Tap a lantern to read the wish";
        // This device keeps its own public wishes so they glow straight away; once the sheet no longer
        // lists one (row deleted or "Show" unticked), forget it here too.
        const live = new Set(d.wishes.map((w) => w.id));
        const kept = store.get("wishes", []).filter((m) => !(m.id && m.visibility === "public" && !live.has(m.id)));
        if (kept.length !== store.get("wishes", []).length) { store.set("wishes", kept); approved = null; }
        const next = d.wishes;
        if (JSON.stringify(next) === JSON.stringify(approved)) return; // nothing new
        approved = next; renderWall(approved);
      })
      .catch(() => {});
  }
  loadWishes();
  if (backend) setInterval(loadWishes, 60000); // new wishes appear for everyone without reloading
  wForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = wMsg.value.trim(), name = $("#wName").value.trim();
    const mErr = $("#wMsgErr");
    mErr.hidden = true; $("#wNameErr").hidden = !!name;
    if (!message) { mErr.textContent = "Please write a few words."; mErr.hidden = false; wMsg.focus(); return; }
    if (hasPhone(message) || MAIL_RE.test(message)) { mErr.textContent = "Please remove phone numbers or email addresses — wishes may be shown publicly."; mErr.hidden = false; wMsg.focus(); return; }
    if (!name) { $("#wName").focus(); return; }
    if ($("#wWebsite").value) return;
    if (Date.now() - pageOpened < 3000) { wStatus.textContent = "One moment…"; return; }
    const visibility = $("#wPrivate").checked ? "private" : "public";
    const btn = $("#wSubmit"); btn.disabled = true; wStatus.className = "form__status"; wStatus.textContent = "Releasing your lantern…";
    try {
      const res = await post({ type: "wish", name, message, visibility, website: "", elapsed: Date.now() - pageOpened });
      const mine = store.get("wishes", []); mine.unshift({ id: res.id || "", name, message, visibility }); store.set("wishes", mine.slice(0, 10));
      renderWall(approved);
      if (visibility === "public") { const first = lsky.querySelector(".lan"); if (first && !reduced) first.classList.add("lan--rise"); }
      $("#lsky").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      if (backend) loadWishes();
      wForm.reset(); $("#wCount").textContent = "0"; btn.disabled = false;
      wStatus.className = "form__status ok";
      wStatus.textContent = backend ? (visibility === "public" ? "Thank you! Your lantern is now glowing in the sky for everyone. 💛" : "Thank you! Your wish has reached us — only we will see it.")
        : "Thank you! Your lantern is lit and your wish has reached us. 💛";
    } catch (err) {
      btn.disabled = false;
      if (waNumber) {
        const text = "A wish for " + names + " 💌\n\n" + message + "\n\n— " + name;
        // light the guest's own lantern on this device straight away
        const mine = store.get("wishes", []); mine.unshift({ id: "", name, message, visibility }); store.set("wishes", mine.slice(0, 10));
        renderWall(approved);
        if (visibility === "public") { const first = lsky.querySelector(".lan"); if (first && !reduced) first.classList.add("lan--rise"); }
        wForm.reset(); $("#wCount").textContent = "0";
        wStatus.className = "form__status ok";
        wStatus.innerHTML = 'Your lantern is lit! One last step — tap below to send your wish to us on WhatsApp (it isn’t sent until you press send there).' +
          '<a class="btn btn--solid" style="margin-top:12px;display:inline-flex" target="_blank" rel="noopener" href="' + waLink(text) + '">Send wish on WhatsApp</a>';
      } else {
        wStatus.className = "form__status err";
        wStatus.textContent = err.message === "no-backend" ? notConnectedMsg().replace("RSVP", "The wishes wall") : "We couldn’t send your wish just now. Please try again.";
      }
    }
  });

  /* ---------------- gallery + lightbox ---------------- */
  const HEART = '<svg viewBox="0 0 32 30" aria-hidden="true"><path d="M16 28S2 19.5 2 10.2C2 5.6 5.6 2 10 2c2.6 0 4.8 1.3 6 3.3C17.2 3.3 19.4 2 22 2c4.4 0 8 3.6 8 8.2C30 19.5 16 28 16 28z"/></svg>';
  const masonry = $("#masonry");
  const items = W.gallery;
  const likes = store.get("likes:v2", {}); // v2: new photo set, so earlier hearts don't land on different photos
  items.forEach((it, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tile reveal" + (it.size ? " tile--" + it.size : "");
    const cap = isPh(it.caption) ? it.caption.replace(/^\s*\[|\]\s*$/g, "") : it.caption;
    b.setAttribute("aria-label", "Open photo: " + cap);
    b.dataset.phLabel = cap;
    fillPhoto(b, { src: it.thumb || it.src, alt: cap, position: it.position });
    const capEl = document.createElement("span"); capEl.className = "tile__cap"; capEl.textContent = cap; b.appendChild(capEl);
    const like = document.createElement("span"); like.className = "tile__like"; like.dataset.n = likes[i] || 0;
    like.innerHTML = HEART + "<b>" + (likes[i] || 0) + "</b>"; b.appendChild(like);
    let last = 0, timer = null;
    b.addEventListener("click", (e) => {
      const now = Date.now();
      if (now - last < 320) { clearTimeout(timer); last = 0; heart(b, i); return; }
      last = now;
      timer = setTimeout(() => openLb(i), 320);
    });
    masonry.appendChild(b);
  });
  function heart(tile, i) {
    likes[i] = (likes[i] || 0) + 1; store.set("likes:v2", likes);
    const l = $(".tile__like", tile); l.dataset.n = likes[i]; $("b", l).textContent = likes[i];
    const h = document.createElement("div"); h.innerHTML = HEART; const svg = h.firstChild; svg.classList.add("burst");
    tile.appendChild(svg); setTimeout(() => svg.remove(), 950);
  }
  // reveal for tiles created after the observer ran
  if ("IntersectionObserver" in window && !reduced) {
    const to = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pre"); to.unobserve(en.target); } }));
    $$(".tile", masonry).forEach((t) => { if (t.getBoundingClientRect().top > innerHeight) { t.classList.add("pre"); to.observe(t); } });
  }
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let lbIdx = 0, lastFocus = null;
  function showLb(i) {
    lbIdx = (i + items.length) % items.length;
    const it = items[lbIdx];
    const cap = isPh(it.caption) ? it.caption.replace(/^\s*\[|\]\s*$/g, "") : it.caption;
    lbImg.dataset.phLabel = cap;
    fillPhoto(lbImg, { src: it.src, alt: cap });
    const img = $("img", lbImg); if (img) img.loading = "eager";
    lbCap.textContent = cap + "  ·  " + (lbIdx + 1) + " / " + items.length;
  }
  function openLb(i) { lastFocus = document.activeElement; showLb(i); lb.hidden = false; document.documentElement.classList.add("locked"); $("#lbClose").focus(); }
  function closeLb() { lb.hidden = true; document.documentElement.classList.remove("locked"); if (lastFocus) lastFocus.focus(); }
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => showLb(lbIdx - 1));
  $("#lbNext").addEventListener("click", () => showLb(lbIdx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(lbIdx - 1);
    if (e.key === "ArrowRight") showLb(lbIdx + 1);
  });
  let tx = 0;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showLb(lbIdx + (dx < 0 ? 1 : -1)); });

  /* ---------------- contacts ---------------- */
  const PHONE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>';
  $("#contacts").innerHTML = W.contacts.map((g, gi) => {
    const people = g.people.filter((p) => filled(p.name));
    if (!people.length) return "";
    return '<div class="cgroup cgroup--' + (gi % 2 ? "right" : "left") + ' reveal"><h3 class="cgroup__title"><span>' + esc(g.group) + "</span></h3>" + people.map((p) => {
      const real = filled(p.phone);
      const digits = real ? p.phone.replace(/[^\d+]/g, "") : "";
      return '<div class="ccard"><div class="ccard__txt"><p class="ccard__name">' + esc(p.name) + '</p>' +
        '<p class="ccard__num">' + (real ? esc(p.phone) : '<span class="ccard__soon">Number coming soon</span>') + '</p></div>' +
        (real ? '<a class="ccard__call" href="tel:' + esc(digits) + '" aria-label="Call ' + esc(p.name) + '">' + PHONE_ICON + '</a>' : '<span class="ccard__call ccard__call--off" aria-hidden="true">' + PHONE_ICON + '</span>') + '</div>';
    }).join("") + "</div>";
  }).join("");
  $("#contacts").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("Number copied"); }
    catch (err) { const r = document.createRange(); r.selectNodeContents(b.closest(".cperson").querySelector(".cperson__num")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Number selected — copy it from here"); }
  });
})();
