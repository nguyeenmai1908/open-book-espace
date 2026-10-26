/* ==========================================================
   TRÌNH ĐỌC SÁCH MỞ SÁCH — reader.js
   window.MSReader.open(container, book, opts)
     book: { title, author, summary, color, pages:[{text}|{img}], question }
     opts: { cover, start, note, prefs, titlePrefix,
             onPos(pos,total,note), onDone(note), onClose(), onPrefs(prefs) }
   Trang trong sách: bìa · trang tên sách · các trang nội dung · trang câu hỏi · (lót) · bìa sau
   Kiểu đọc: spread (hai trang) | single (một trang) | scroll (cuộn dọc)
   ========================================================== */
(function () {
  var S = null;                 // trạng thái phiên đọc hiện tại
  var RM = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var PAPERS = [["trang", "Trắng"], ["nga", "Ngà"], ["co", "Giấy cổ"], ["dem", "Ban đêm"]];
  var LAYOUTS = [["spread", "Hai trang"], ["single", "Một trang"], ["scroll", "Cuộn dọc"]];
  var FONTS = [["tron", "Chữ tròn"], ["sach", "Chữ sách"]];

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function defLayout() { return (innerWidth >= 900 && innerWidth > innerHeight) ? "spread" : "single"; }

  /* ---------- dựng danh sách trang ---------- */
  function buildPages(book, cover) {
    var L = [{ t: "cover" }, { t: "title" }];
    (book.pages || []).forEach(function (p, i) { L.push({ t: "body", p: p, n: i + 1 }); });
    L.push({ t: "end" });
    if (L.length % 2 === 0) L.push({ t: "endpaper" });   // bìa sau luôn ở trang lẻ (bên trái khi gập sách)
    L.push({ t: "back" });
    return L;
  }

  function pageInner(i) {
    var b = S.book, P = S.L[i]; if (!P) return null;
    var inn = el("div", "rd-in");
    if (P.t === "cover") {
      inn.className = "rd-in full";
      var im = el("img", "rd-img"); im.alt = "Bìa sách " + b.title; im.src = S.opts.cover || ""; im.draggable = false; inn.appendChild(im);
    } else if (P.t === "title") {
      inn.appendChild(el("div", "rd-title-page",
        '<div class="orn">✦ ✦ ✦</div><h2>' + esc(b.title) + "</h2><p>" + esc(b.author || "") + "</p>" +
        (b.grade || b.minutes ? "<p>" + esc([b.grade, b.minutes].filter(Boolean).join(" · ")) + "</p>" : "") +
        '<div class="orn">✦</div><p>Thư viện Mở Sách</p>'));
    } else if (P.t === "body") {
      if (P.p.img) {
        inn.className = "rd-in full";
        var ip = el("img", "rd-img"); ip.alt = "Trang " + P.n; ip.src = P.p.img; ip.draggable = false; ip.loading = "lazy"; inn.appendChild(ip);
      } else {
        var tx = el("div", "rd-text");
        String(P.p.text || "").split(/\n+/).forEach(function (para) { tx.appendChild(el("p", "", esc(para))); });
        inn.appendChild(tx); inn.appendChild(el("div", "rd-num", String(P.n)));
      }
    } else if (P.t === "end") {
      var end = el("div", "rd-end",
        "<h3>Đọc xong rồi!</h3><p class=\"q\">" + esc(b.question || "Bạn thích chi tiết nào nhất trong cuốn sách? Vì sao?") + "</p>" +
        '<textarea aria-label="Câu trả lời của bạn" placeholder="Mình nghĩ là…"></textarea>' +
        '<div class="acts"><button type="button" class="ghost" data-a="again">Đọc lại từ đầu</button><button type="button" class="cta" data-a="done">Lưu và xong</button></div>');
      var ta = end.querySelector("textarea"); ta.value = S.note || "";
      ta.addEventListener("input", function () { S.note = ta.value; clearTimeout(S.noteT); S.noteT = setTimeout(report, 400); });
      ta.addEventListener("keydown", function (e) { e.stopPropagation(); });
      end.querySelector('[data-a="again"]').onclick = function (e) { e.stopPropagation(); go(0, true); };
      end.querySelector('[data-a="done"]').onclick = function (e) { e.stopPropagation(); report(); S.opts.onDone && S.opts.onDone(S.note || ""); };
      inn.appendChild(end);
    } else if (P.t === "endpaper") {
      inn.className = "rd-in full"; inn.appendChild(el("div", "rd-endpaper"));
    } else if (P.t === "back") {
      inn.className = "rd-in full";
      inn.appendChild(el("div", "rd-backcover", "<b>" + esc(b.title) + "</b><p>" + esc(b.summary || "") + "</p><p style=\"opacity:.75\">Thư viện Mở Sách</p>"));
    }
    return inn;
  }
  function fill(node, i) {
    node.innerHTML = "";
    var inn = i == null ? null : pageInner(i);
    node.classList.toggle("empty", !inn);
    if (inn) node.appendChild(inn);
    if (node.classList.contains("rd-face")) node.appendChild(el("div", "rd-shade"));
  }

  /* ---------- kích thước ---------- */
  function measure() {
    if (!S) return;
    var r = S.stage.getBoundingClientRect(), w = Math.max(200, r.width - 28), h = Math.max(240, r.height - 28), pw;
    if (S.prefs.layout === "spread") pw = Math.min(w / 2, h * 0.72);
    else if (S.prefs.layout === "single") pw = Math.min(w, h * 0.72);
    else pw = Math.min(w, 560);
    pw = Math.floor(pw);
    var ph = Math.floor(pw / 0.72);
    S.root.style.setProperty("--pw", pw + "px");
    S.root.style.setProperty("--ph", ph + "px");
    S.root.style.setProperty("--bw", (S.prefs.layout === "spread" ? pw * 2 : pw) + "px");
  }

  /* ---------- vị trí ---------- */
  function spreadOf(i) { return Math.floor((i + 1) / 2); }
  function lastIdx() { return S.L.length - 1; }
  function label() {
    var L = S.L, n = (S.book.pages || []).length;
    function nm(i) { var P = L[i]; if (!P) return ""; return P.t === "body" ? String(P.n) : ""; }
    function name(i) { var P = L[i]; return { cover: "Bìa", title: "Tên sách", end: "Câu hỏi", endpaper: "Trang lót", back: "Bìa sau" }[P.t] || ("Trang " + P.n + "/" + n); }
    if (S.prefs.layout === "spread") {
      var s = spreadOf(S.pos), a = 2 * s - 1, b = 2 * s;
      var na = nm(a), nb = nm(b);
      if (na && nb) return "Trang " + na + "–" + nb + "/" + n;
      if (na || nb) return "Trang " + (na || nb) + "/" + n;
      return name(L[b] ? b : a);
    }
    return name(S.pos);
  }
  function report() {
    if (!S) return;
    S.count.textContent = label();
    var sp = S.prefs.layout === "spread";
    S.prev.disabled = S.pos <= 0;
    S.next.disabled = sp ? spreadOf(S.pos) >= spreadOf(lastIdx()) : S.pos >= lastIdx();
    S.range.max = lastIdx(); S.range.value = S.pos;
    S.opts.onPos && S.opts.onPos(S.pos, S.L.length, S.note || "");
  }

  /* ---------- vẽ trạng thái tĩnh ---------- */
  function render() {
    var sp = S.prefs.layout === "spread";
    S.bookEl.className = "rd-book " + (sp ? "spread" : "single");
    S.bookEl.style.transform = "";
    if (sp) {
      var s = spreadOf(S.pos), a = 2 * s - 1, b = 2 * s;
      fill(S.left, a >= 0 ? a : null); fill(S.right, b <= lastIdx() ? b : null);
      S.left.style.display = "";
      if (s === 0) S.bookEl.classList.add("closed");
      else if (b > lastIdx()) S.bookEl.style.transform = "translateX(calc(var(--pw) * .5))";
    } else {
      S.left.style.display = "none";
      fill(S.right, S.pos);
    }
    report();
  }
  function renderScroll() {
    S.scroll.innerHTML = "";
    S.L.forEach(function (_, i) {
      var pg = el("div", "rd-page right"); pg.dataset.i = i; fill(pg, i); S.scroll.appendChild(pg);
    });
    var t = S.scroll.children[S.pos]; if (t) S.scroll.scrollTop = t.offsetTop - 18;
    report();
  }
  function setMode() {
    var sc = S.prefs.layout === "scroll";
    S.bookEl.style.display = sc ? "none" : "";
    S.scroll.style.display = sc ? "" : "none";
    measure();
    if (sc) renderScroll(); else { S.scroll.innerHTML = ""; render(); }
  }

  /* ---------- tiếng lật trang ---------- */
  function rustle() {
    if (!S.prefs.sound) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      var ac = S.ac || (S.ac = new AC()), len = Math.floor(ac.sampleRate * 0.32);
      var buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) { var t = i / len; d[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * t), 1.6) * (0.6 + 0.4 * Math.random()); }
      var src = ac.createBufferSource(); src.buffer = buf;
      var f = ac.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2600; f.Q.value = 0.7;
      var g = ac.createGain(); g.gain.value = 0.16;
      src.connect(f); f.connect(g); g.connect(ac.destination); src.start();
    } catch (e) {}
  }

  /* ---------- lật trang ---------- */
  function animateLeaf(fromDeg, toDeg, fade, done) {
    var leaf = S.leaf, dur = 680;
    leaf.classList.add("on", "fwd");
    var easing = "cubic-bezier(.45,.05,.25,1)";
    var frames = [{ transform: "rotateY(" + fromDeg + "deg)" }, { transform: "rotateY(" + ((fromDeg + toDeg) / 2) + "deg) translateZ(1px)", offset: 0.5 }, { transform: "rotateY(" + toDeg + "deg)" }];
    if (fade) { frames[0].opacity = 1; frames[1].opacity = 1; frames[2].opacity = 0; }
    var a = leaf.animate(frames, { duration: dur, easing: easing, fill: "forwards" });
    leaf.querySelectorAll(".rd-shade").forEach(function (sh) { sh.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: dur, easing: easing }); });
    a.onfinish = function () { a.cancel(); leaf.classList.remove("on", "fwd"); done(); };
    S.anim = a;
  }
  function go(target, instant) {
    if (!S || S.busy) return;
    var last = lastIdx(); target = Math.max(0, Math.min(last, target));
    var mode = S.prefs.layout;
    if (mode === "scroll") {
      var t = S.scroll.children[target]; if (t) S.scroll.scrollTo({ top: t.offsetTop - 18, behavior: instant || RM.matches ? "auto" : "smooth" });
      S.pos = target; report(); return;
    }
    if (mode === "spread") {
      var s0 = spreadOf(S.pos), s1 = spreadOf(target);
      if (s0 === s1) { S.pos = target; report(); return; }
      if (instant || RM.matches || Math.abs(s1 - s0) > 1 || !S.leaf.animate) { S.pos = target; render(); return; }
      S.busy = true; rustle();
      var R = s1 * 2, Lf = s1 * 2 - 1;   // trang phải / trái của cặp mới
      if (s1 > s0) {                    // lật tới: tờ bên phải lật sang trái
        fill(S.fFront, s0 * 2); fill(S.fBack, Lf);
        fill(S.right, R <= last ? R : null);
        if (s0 === 0) { S.bookEl.classList.remove("closed"); }
        if (R > last) S.bookEl.style.transform = "translateX(calc(var(--pw) * .5))";
        animateLeaf(0, -180, false, function () { S.busy = false; S.pos = target; render(); });
      } else {                          // lật lui: tờ bên trái lật về phải
        fill(S.fFront, R); fill(S.fBack, s0 * 2 - 1);
        var nl = Lf; fill(S.left, nl >= 0 ? nl : null);
        S.bookEl.style.transform = "";
        if (s1 === 0) S.bookEl.classList.add("closed");
        animateLeaf(-180, 0, false, function () { S.busy = false; S.pos = target; render(); });
      }
      return;
    }
    // một trang
    if (target === S.pos) return;
    if (instant || RM.matches || Math.abs(target - S.pos) > 1 || !S.leaf.animate) { S.pos = target; render(); return; }
    S.busy = true; rustle();
    if (target > S.pos) {
      fill(S.fFront, S.pos); fill(S.fBack, null); S.fBack.classList.remove("empty");
      fill(S.right, target);
      animateLeaf(0, -160, true, function () { S.busy = false; S.pos = target; render(); });
    } else {
      fill(S.fFront, target); fill(S.fBack, null); S.fBack.classList.remove("empty");
      animateLeaf(-160, 0, false, function () { S.busy = false; S.pos = target; render(); });
      S.leaf.getAnimations && S.leaf.animate([{ opacity: 0 }, { opacity: 1, offset: .35 }, { opacity: 1 }], { duration: 680 });
    }
  }
  function step(d) {
    if (!S) return;
    if (S.prefs.layout === "spread") {
      var s = spreadOf(S.pos) + d; if (s < 0 || s > spreadOf(lastIdx())) return;
      go(Math.min(lastIdx(), Math.max(0, s * 2 - (s ? 1 : 0))));
    } else go(S.pos + d);
  }

  /* ---------- bảng tuỳ chỉnh ---------- */
  function savePrefs() {
    S.root.dataset.paper = S.prefs.paper; S.root.dataset.font = S.prefs.font; S.root.dataset.layout = S.prefs.layout;
    S.root.style.setProperty("--scale", S.prefs.scale);
    S.opts.onPrefs && S.opts.onPrefs({ paper: S.prefs.paper, font: S.prefs.font, layout: S.prefs.layout, scale: S.prefs.scale, sound: S.prefs.sound });
  }
  function buildSettings() {
    var p = el("div", "rd-settings"); p.hidden = true; p.setAttribute("role", "dialog"); p.setAttribute("aria-label", "Tuỳ chỉnh trang sách");
    function sec(title, items, key, cls) {
      var box = el("div"), row = el("div", "rd-row");
      box.appendChild(el("h4", "", title));
      items.forEach(function (it) {
        var b = el("button", cls, cls === "rd-swatch" ? esc(it[1]) : esc(it[1])); b.type = "button"; b.dataset.v = it[0];
        b.setAttribute("aria-pressed", String(S.prefs[key] === it[0]));
        b.onclick = function () {
          S.prefs[key] = it[0]; row.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          savePrefs(); if (key === "layout") setMode();
        };
        row.appendChild(b);
      });
      box.appendChild(row); p.appendChild(box);
    }
    sec("Loại giấy", PAPERS, "paper", "rd-swatch");
    sec("Kiểu đọc", LAYOUTS, "layout", "rd-chip");
    sec("Phông chữ", FONTS, "font", "rd-chip");
    var sz = el("div"); sz.appendChild(el("h4", "", "Cỡ chữ"));
    var r = el("div", "rd-row"), mi = el("button", "rd-chip", "A−"), pl = el("button", "rd-chip", "A+"), v = el("span", "rd-size");
    mi.type = pl.type = "button"; mi.setAttribute("aria-label", "Chữ nhỏ hơn"); pl.setAttribute("aria-label", "Chữ to hơn");
    function sz2(d) { S.prefs.scale = Math.round(Math.max(0.8, Math.min(1.5, S.prefs.scale + d)) * 10) / 10; v.textContent = Math.round(S.prefs.scale * 100) + "%"; savePrefs(); }
    mi.onclick = function () { sz2(-0.1); }; pl.onclick = function () { sz2(0.1); }; sz2(0);
    r.appendChild(mi); r.appendChild(v); r.appendChild(pl); sz.appendChild(r); p.appendChild(sz);
    var so = el("div"), sr = el("div", "rd-row"), sb = el("button", "rd-chip"); sb.type = "button";
    function sl() { sb.textContent = S.prefs.sound ? "Tiếng lật trang: bật" : "Tiếng lật trang: tắt"; sb.setAttribute("aria-pressed", String(!!S.prefs.sound)); }
    sb.onclick = function () { S.prefs.sound = !S.prefs.sound; sl(); savePrefs(); rustle(); }; sl();
    so.appendChild(el("h4", "", "Âm thanh")); sr.appendChild(sb); so.appendChild(sr); p.appendChild(so);
    return p;
  }

  /* ---------- sự kiện ---------- */
  function onKey(e) {
    if (!S || S.root.hidden) return;
    var tg = e.target && e.target.tagName; if (tg === "TEXTAREA" || tg === "INPUT") return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); step(-1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(lastIdx()); }
  }
  function onResize() { if (!S) return; measure(); }

  function open(root, book, opts) {
    close(true);
    opts = opts || {};
    var pr = opts.prefs || {};
    S = {
      root: root, book: book, opts: opts, note: opts.note || "",
      prefs: { paper: pr.paper || "nga", font: pr.font || "tron", layout: pr.layout || defLayout(), scale: pr.scale || 1, sound: pr.sound !== false },
      L: buildPages(book, opts.cover)
    };
    if (S.prefs.layout === "spread" && innerWidth < 700) S.prefs.layout = "single";
    root.innerHTML = "";
    root.style.setProperty("--book", book.color || "#1d6b6d");
    root.dataset.paper = S.prefs.paper; root.dataset.font = S.prefs.font; root.dataset.layout = S.prefs.layout;
    root.style.setProperty("--scale", S.prefs.scale);

    var top = el("div", "rd-top");
    var cl = el("button", "rd-btn", "← Về không gian"); cl.type = "button";
    cl.onclick = function () { report(); opts.onClose && opts.onClose(); };
    var tt = el("b", "", esc((opts.titlePrefix || "") + book.title));
    S.count = el("span", "rd-count");
    var aa = el("button", "rd-btn rd-aa", "Aa"); aa.type = "button"; aa.setAttribute("aria-label", "Tuỳ chỉnh giấy, cỡ chữ, kiểu đọc"); aa.setAttribute("aria-expanded", "false");
    top.appendChild(cl); top.appendChild(tt); top.appendChild(S.count); top.appendChild(aa);
    root.appendChild(top);
    var set = buildSettings(); root.appendChild(set);
    aa.onclick = function (e) { e.stopPropagation(); set.hidden = !set.hidden; aa.setAttribute("aria-expanded", String(!set.hidden)); };
    S.closeSet = function () { if (!set.hidden) { set.hidden = true; aa.setAttribute("aria-expanded", "false"); return true; } return false; };

    var stage = S.stage = el("div", "rd-stage");
    var bk = S.bookEl = el("div", "rd-book");
    S.left = el("div", "rd-page left"); S.right = el("div", "rd-page right");
    S.leaf = el("div", "rd-leaf"); S.fFront = el("div", "rd-face front"); S.fBack = el("div", "rd-face back");
    S.leaf.appendChild(S.fFront); S.leaf.appendChild(S.fBack);
    bk.appendChild(S.left); bk.appendChild(S.right); bk.appendChild(S.leaf);
    stage.appendChild(bk);
    S.scroll = el("div", "rd-scroll"); stage.appendChild(S.scroll);
    root.appendChild(stage);

    var foot = el("div", "rd-foot");
    S.prev = el("button", "rd-nav", "‹"); S.prev.type = "button"; S.prev.setAttribute("aria-label", "Trang trước");
    S.next = el("button", "rd-nav", "›"); S.next.type = "button"; S.next.setAttribute("aria-label", "Trang sau");
    S.range = el("input", "rd-range"); S.range.type = "range"; S.range.min = 0; S.range.step = 1; S.range.setAttribute("aria-label", "Chọn trang");
    S.prev.onclick = function () { step(-1); }; S.next.onclick = function () { step(1); };
    S.range.oninput = function () { go(+S.range.value, true); };
    foot.appendChild(S.prev); foot.appendChild(S.range); foot.appendChild(S.next);
    root.appendChild(foot);

    // bấm nửa phải / nửa trái cuốn sách để lật
    bk.addEventListener("click", function (e) {
      if (S.closeSet()) return;
      if (e.target.closest("textarea,button,a,input")) return;
      if (S.swiped) { S.swiped = false; return; }
      var r = bk.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
      if (S.prefs.layout === "spread") { if (spreadOf(S.pos) === 0) step(1); else step(x >= 0.5 ? 1 : -1); }
      else step(x >= 0.35 ? 1 : -1);
    });
    stage.addEventListener("click", function (e) { if (e.target === stage) S.closeSet(); });
    var sx = 0, sy = 0, down = false;
    stage.addEventListener("pointerdown", function (e) { if (e.target.closest("textarea")) return; down = true; sx = e.clientX; sy = e.clientY; S.swiped = false; });
    stage.addEventListener("pointerup", function (e) {
      if (!down) return; down = false;
      if (S.prefs.layout === "scroll") return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) { S.swiped = true; step(dx < 0 ? 1 : -1); setTimeout(function () { if (S) S.swiped = false; }, 50); }
    });
    root.addEventListener("contextmenu", S.ctx = function (e) { e.preventDefault(); });
    S.scroll.addEventListener("scroll", function () {
      clearTimeout(S.scT); S.scT = setTimeout(function () {
        if (!S || S.prefs.layout !== "scroll") return;
        var top = S.scroll.scrollTop + 40, kids = S.scroll.children, k = 0;
        for (var i = 0; i < kids.length; i++) if (kids[i].offsetTop <= top) k = i;
        if (k !== S.pos) { S.pos = k; report(); }
      }, 120);
    });
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    if (window.ResizeObserver) { S.ro = new ResizeObserver(onResize); S.ro.observe(stage); }

    var start = Math.max(0, Math.min(lastIdx(), opts.start | 0));
    S.pos = start;
    requestAnimationFrame(function () { if (S) setMode(); });
    measure(); setMode();
    return api;
  }
  function close(silent) {
    if (!S) return;
    if (S.anim) try { S.anim.cancel(); } catch (e) {}
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
    if (S.ro) S.ro.disconnect();
    clearTimeout(S.noteT);
    if (!silent) report();
    S = null;
  }
  var api = {
    open: open, close: close, go: function (i) { go(i, true); }, next: function () { step(1); }, prev: function () { step(-1); },
    closeSettings: function () { return S ? S.closeSet() : false; },
    state: function () { return S ? { pos: S.pos, total: S.L.length, layout: S.prefs.layout, paper: S.prefs.paper, busy: !!S.busy } : null; }
  };
  window.MSReader = api;
})();
