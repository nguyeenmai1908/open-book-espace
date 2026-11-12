/* ==========================================================
   KHÔNG GIAN MỞ SÁCH — i18n.js: chọn ngôn ngữ Tiếng Việt / English
   Tiếng Việt là bản gốc trong code. Bản tiếng Anh tra từ điển assets/i18n-en.js (MS_EN, MS_EN_PATTERNS).
   Chuỗi nào không có trong từ điển thì giữ nguyên tiếng Việt — đây là chủ ý:
   CÁC KHOÁ HỌC VÀ MỌI CÂU ĐỐ GIỮ TIẾNG VIỆT (Mai dặn 11/11/2026). Đừng thêm chúng vào từ điển.
   Dùng:
     MS.lang()            "vi" | "en"   (lưu ở localStorage "mosach.lang"; ?lang=en trên đường dẫn cũng được)
     MS.setLang("en")     lưu rồi tải lại trang
     MS.tr("Đi nhanh")    → "Quick travel" khi đang ở tiếng Anh
   Trang có i18n.js: chữ trong trang tự dịch (kể cả phần thêm sau bằng JS), trừ vùng khớp MS.I18N_SKIP.
   Phải nạp SAU ms.js, i18n-en.js nạp ngay sau file này.
   ========================================================== */
(function () {
  var MS = window.MS = window.MS || {};
  var KEY = "mosach.lang", cur = "vi";
  try {
    var q = /[?&]lang=(vi|en)\b/.exec(location.search);
    if (q) { cur = q[1]; localStorage.setItem(KEY, cur); }
    else cur = localStorage.getItem(KEY) === "en" ? "en" : "vi";
  } catch (e) {}
  /* Chế độ portfolio (?portfolio): luôn tiếng Anh, ẩn nút đổi ngôn ngữ, có nút quay về trang case study.
     Nhớ trong sessionStorage nên đi từ trang này sang trang khác trong cùng tab vẫn giữ. */
  MS.portfolio = false;
  try {
    if (/[?&]portfolio\b/.test(location.search)) sessionStorage.setItem("mosach.portfolio", "1");
    MS.portfolio = sessionStorage.getItem("mosach.portfolio") === "1";
  } catch (e) {}
  if (MS.portfolio) cur = "en";

  MS.lang = function () { return cur; };
  MS.setLang = function (l) {
    try { localStorage.setItem(KEY, l === "en" ? "en" : "vi"); } catch (e) {}
    var u = location.href.replace(/([?&])lang=(vi|en)&?/, "$1").replace(/[?&]$/, "");
    location.replace(u);
  };

  function dict() { return window.MS_EN || {}; }
  function pats() { return window.MS_EN_PATTERNS || []; }

  /* Dịch một chuỗi. {1} trong mẫu = nhóm 1 đã dịch, {=1} = giữ nguyên (tên người, số). */
  function tr(s) {
    if (cur !== "en" || typeof s !== "string") return s;
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s), core = m[2];
    if (!core) return s;
    var out = trCore(core, 0);
    return out === core ? s : m[1] + out + m[3];
  }
  function trCore(core, depth) {
    var D = dict();
    if (Object.prototype.hasOwnProperty.call(D, core)) return D[core];
    if (depth > 3) return core;
    var P = pats();
    // mẫu có cờ thứ ba = true: chỉ dùng khi phần {n} dịch được (tránh dịch nhầm câu chuyện kể bắt đầu bằng "Vào…", "Chào…")
    for (var i = 0; i < P.length; i++) {
      var r = P[i][0].exec(core);
      if (!r) continue;
      var moved = false;
      var res = P[i][1].replace(/\{(=?)(\d)\}/g, function (_, raw, n) {
        var g = r[+n] || "";
        if (raw) return g;
        var t = trCore(g, depth + 1); if (t !== g) moved = true; return t;
      });
      if (P[i][2] && !moved) continue;
      if (res !== core) return res;
    }
    // chuỗi ghép bằng " · ": dịch từng phần
    if (core.indexOf(" · ") > 0) {
      var parts = core.split(" · "), changed = false;
      parts = parts.map(function (p) { var t = trCore(p, depth + 1); if (t !== p) changed = true; return t; });
      if (changed) return parts.join(" · ");
    }
    return core;
  }
  MS.tr = tr;

  /* ---------- Dịch chữ trong trang ---------- */
  // vùng không dịch: nội dung câu đố, chữ trong sách, khung khoá học. Trang có thể thêm vào MS.I18N_SKIP.
  MS.I18N_SKIP = "[data-no-i18n], script, style";
  var ATTRS = ["aria-label", "placeholder", "title", "alt"];
  function skipped(el) { return el && el.closest && el.closest(MS.I18N_SKIP); }
  function trText(n) {
    var v = n.nodeValue; if (!v || !/[^\s\d.,:;!?·→←×–—()\/+-]/.test(v)) return;
    if (skipped(n.parentElement)) return;
    var t = tr(v); if (t !== v) n.nodeValue = t;
  }
  function trEl(el) {
    if (skipped(el)) return;
    ATTRS.forEach(function (a) { var v = el.getAttribute && el.getAttribute(a); if (v) { var t = tr(v); if (t !== v) el.setAttribute(a, t); } });
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) return trText(root);
    if (root.nodeType !== 1 || skipped(root)) return;
    trEl(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.nodeType === 1 && n.matches(MS.I18N_SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) trText(n); else trEl(n); }
  }
  MS.trDom = walk;

  if (cur === "en") {
    document.documentElement.lang = "en";
    var start = function () {
      document.title = tr(document.title);
      walk(document.body);
      new MutationObserver(function (list) {
        list.forEach(function (mu) {
          if (mu.type === "characterData") trText(mu.target);
          else if (mu.type === "attributes") trEl(mu.target);
          else mu.addedNodes.forEach(walk);
        });
      }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  }

  /* Nút đổi ngôn ngữ: <button data-lang-toggle> → hiện "EN" khi đang tiếng Việt, "VI" khi đang tiếng Anh. */
  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-lang-toggle]"), function (b) {
      if (MS.portfolio) {   // người xem portfolio: thay nút ngôn ngữ bằng nút về trang case study
        b.setAttribute("data-no-i18n", "");
        b.textContent = "Case study";
        b.setAttribute("aria-label", "Back to the case study");
        b.onclick = function () { location.href = "portfolio.html"; };
        return;
      }
      var to = cur === "en" ? "vi" : "en";
      b.setAttribute("data-no-i18n", "");
      b.textContent = to === "en" ? "EN" : "VI";
      b.setAttribute("aria-label", to === "en" ? "Switch to English" : "Chuyển sang tiếng Việt");
      b.setAttribute("lang", to);
      b.onclick = function () { MS.setLang(to); };
    });
  });
})();
