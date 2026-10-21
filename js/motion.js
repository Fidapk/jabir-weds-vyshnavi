/* =========================================================
   Motion: the page's entrance and scroll animations.
   - Headings write themselves in letter by letter.
   - Paragraphs light up word by word.
   - Blocks rise, zoom or unveil as they scroll into view.
   Nothing starts until the invitation is opened; everything
   below the fold waits until it is scrolled to. Skipped
   entirely for guests who prefer reduced motion.
   ========================================================= */
(function () {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const root = document.documentElement;
  root.classList.add("m-on");

  /* ---------- text splitting ---------- */
  // Wraps every word of el's text in spans, leaving child elements (em, svg, br…) in place.
  function eachTextNode(el, fn) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeValue.trim() && !n.parentElement.closest("svg") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(fn);
  }
  // Letter by letter (headings). Each word stays unbreakable so lines never wrap mid-word.
  // The letters are hidden from screen readers, which read a plain copy of the text instead.
  function splitChars(el, startDelay = 0) {
    if (el.dataset.mSplit) return; el.dataset.mSplit = "chars";
    const plain = document.createElement("span"); plain.className = "sr";
    plain.textContent = el.textContent.replace(/\s+/g, " ").trim();
    let i = 0;
    eachTextNode(el, (node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement("span"); w.className = "m-w"; w.setAttribute("aria-hidden", "true");
        for (const ch of part) {
          const c = document.createElement("span"); c.className = "m-c"; c.textContent = ch;
          c.style.setProperty("--i", Math.min(i++, 40)); w.appendChild(c);
        }
        frag.appendChild(w);
      });
      node.replaceWith(frag);
    });
    el.appendChild(plain);
    el.classList.add("m-chars");
    if (startDelay) el.style.setProperty("--d0", startDelay + "ms");
  }
  // Word by word (paragraphs): words start faint and light up in sequence.
  function splitWords(el, startDelay = 0) {
    if (el.dataset.mSplit) return; el.dataset.mSplit = "words";
    let i = 0;
    eachTextNode(el, (node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement("span"); w.className = "m-wd"; w.textContent = part;
        w.style.setProperty("--i", Math.min(i++, 60)); frag.appendChild(w);
      });
      node.replaceWith(frag);
    });
    el.classList.add("m-words");
    if (startDelay) el.style.setProperty("--d0", startDelay + "ms");
  }
  // A block effect: up | zoom | pop | left | right | clip | blur
  function fx(el, kind, delay = 0) {
    if (el.dataset.mFx) return; el.dataset.mFx = kind;
    el.classList.add("m-fx", "m-" + kind);
    if (delay) el.style.setProperty("--d0", delay + "ms");
    // once an unveil finishes, drop the clip so shadows and glows aren't cut off
    if (kind === "clip") el.addEventListener("transitionend", (e) => { if (e.target === el && e.propertyName === "clip-path") el.classList.add("m-done"); });
  }
  const each = (sel, fn) => $$(sel).forEach(fn);

  /* ---------- hero: plays once, right after the invitation opens ---------- */
  const hero = document.getElementById("home");
  const heroBits = [];
  function heroSet(el, fn) { if (el) { fn(el); heroBits.push(el); } }
  heroSet(hero.querySelector(".hs-kicker"), (el) => fx(el, "pop", 0));
  heroSet(hero.querySelector(".hs-card"), (el) => fx(el, "up", 150));
  heroSet(hero.querySelector(".hs-photo"), (el) => fx(el, "blur", 250));
  hero.querySelectorAll(".hs-names > span:not(.hs-heart)").forEach((el, n) => heroSet(el, () => splitChars(el, 550 + n * 450)));
  heroSet(hero.querySelector(".hs-heart"), (el) => fx(el, "pop", 950));
  heroSet(hero.querySelector(".hs-line"), (el) => splitWords(el, 1450));
  heroSet(hero.querySelector(".hs-dates"), (el) => fx(el, "up", 1750));
  hero.querySelectorAll(".hs-count > div").forEach((el, n) => heroSet(el, () => fx(el, "pop", 1850 + n * 110)));
  heroSet(hero.querySelector(".countdown__to"), (el) => fx(el, "up", 2300));
  heroSet(hero.querySelector(".hs-scroll"), (el) => fx(el, "up", 2450));

  /* ---------- the rest of the page: plays as each part scrolls into view ---------- */
  // section headings
  each(".sechead .eyebrow, .person .eyebrow", (el) => fx(el, "up"));
  each(".sechead h2, .cel-title, .journey__title, #closeTitle", (el) => splitChars(el));
  each(".cel-heart", (el) => fx(el, "pop", 700));
  each(".sechead__sub, .cel-sub", (el) => splitWords(el, 300));
  each(".cel-wave, .cel-lights, .motif", (el) => fx(el, "clip", 200));

  // bride & groom
  each(".person__photo", (el) => fx(el, "clip"));
  each(".person__body h3", (el) => splitChars(el, 150));
  each(".person__intro, .person__about", (el) => splitWords(el, 350));
  each(".facts", (dl) => $$(":scope > *", dl).forEach((el, n) => fx(el, "up", 300 + n * 70)));

  // timeline
  each(".tl-item", (li, n) => {
    const art = li.querySelector(".tl-art"); if (art) fx(art, n % 2 ? "right" : "left");
    const h = li.querySelector(".tl-text h4"); if (h) splitChars(h, 150);
    const p = li.querySelector(".tl-text p"); if (p) splitWords(p, 400);
  });
  each(".forever__photo", (el) => fx(el, "zoom"));

  // celebrations
  each(".ev__title", (el) => splitChars(el, 200));
  each(".ev__date", (el) => fx(el, "pop", 450));
  each(".ev__desc", (el) => splitWords(el, 500));
  each(".ev__photo", (el) => fx(el, "clip", 200));
  each(".ev__actions, .ev__dir", (el, n) => fx(el, "up", 300 + n * 120));
  each(".jm", (el) => fx(el, "zoom"));

  // note, wishes, help
  each(".np__text p", (el, n) => splitWords(el, 200 + n * 250));
  each(".np__sign", (el) => fx(el, "up", 600));
  each(".np__after", (el) => splitWords(el, 200));
  each(".lsky", (el) => fx(el, "zoom"));
  each(".form--wish", (el) => fx(el, "up", 150));
  each(".contacts__note", (el) => fx(el, "up", 200));

  // closing
  each(".closing__content > p:not(.closing__names):not(.closing__date)", (el) => splitWords(el, 300));
  each(".cl-art", (el) => fx(el, "zoom"));
  each(".closing__names", (el) => splitChars(el, 100));
  each(".closing__date", (el) => fx(el, "up", 600));

  /* ---------- trigger ---------- */
  const targets = new Set([...$$(".m-fx, .m-chars, .m-words")]);
  // A fully clipped element counts as invisible to the observer, so unveils are watched through their parent.
  const watchers = new Map(); // observed element -> elements to reveal
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    (watchers.get(en.target) || []).forEach((el) => el.classList.add("m-in"));
    watchers.delete(en.target); io.unobserve(en.target);
  }), { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

  // Safety net for fast flicks: anything already scrolled past is revealed even if the observer never saw it.
  let sweeping = false;
  function sweep() {
    if (sweeping) return; sweeping = true;
    requestAnimationFrame(() => {
      sweeping = false;
      const line = innerHeight * 0.9;
      watchers.forEach((els, watch) => {
        if (watch.getBoundingClientRect().top < line) { els.forEach((el) => el.classList.add("m-in")); watchers.delete(watch); io.unobserve(watch); }
      });
      if (!watchers.size) removeEventListener("scroll", sweep);
    });
  }

  function start() {
    heroBits.forEach((el) => { el.classList.add("m-in"); targets.delete(el); });
    targets.forEach((el) => {
      const watch = el.classList.contains("m-clip") ? el.parentElement : el;
      if (!watchers.has(watch)) { watchers.set(watch, []); io.observe(watch); }
      watchers.get(watch).push(el);
    });
    addEventListener("scroll", sweep, { passive: true });
  }
  if (root.classList.contains("site-open")) start();
  else document.addEventListener("invite:open", start, { once: true });
})();
