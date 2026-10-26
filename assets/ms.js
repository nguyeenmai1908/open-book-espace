/* ==========================================================
   KHÔNG GIAN MỞ SÁCH — dữ liệu chung + lưu tiến độ (bản offline)
   Thêm khoá học mới: thêm 1 dòng vào MS.COURSES.
   Thêm không gian mới: thêm 1 dòng vào MS.ZONES.
   Khi lên online: thay phần "store" bên dưới bằng gọi máy chủ.
   ========================================================== */
(function () {
  var KEY = "mosach.space.v1";

  var ZONES = [
    { id: "hoc",  name: "Không gian học",     desc: "Các khoá học tự học: nghị luận, kể chuyện…", url: "khong-gian-hoc.html", status: "open" },
    { id: "vuon", name: "Vườn đọc sách",      desc: "Đọc đoạn văn mẫu dưới tán cây — ban ngày hay ban đêm đều được.", url: "vuon-doc-sach.html", status: "open" },
    { id: "doc",  name: "Không gian đọc",     desc: "Tủ kinh điển Đông – Tây, truyện cổ tích, sách tranh và bảng sách đọc nhiều nhất tháng.", url: "play.html#doc", status: "open" }, // [3D] mở 16/10/2026: chọn sách ở kệ rồi ngồi ghế đọc
    { id: "phim", name: "Phòng chiếu phim ngắn", desc: "Phim ngắn để xem, nghĩ và viết.", url: "play.html#phim", status: "open" }, // [3D] mở 21/10/2026: xem → nghĩ → viết
    // [3D] phòng chỉ có ở sảnh 3D; bản đồ 2D mở thẳng sảnh 3D tại phòng này (thêm 16/10/2026)
    { id: "le-hoi", name: "Phòng Lễ hội", desc: "Tết, Trung thu, Halloween, Giáng sinh: chọn lễ hội để trang trí cả phòng.", url: "play.html#le-hoi", status: "open" }
  ];

  // series: chuỗi lớp của Mở Sách. url tính từ thư mục gốc.
  var COURSES = [
    { id: "nghi-luan-1", series: "nghi-luan", title: "Cấu trúc đoạn văn nghị luận", code: "Khoá 1",
      blurb: "Nhận ra 5 phần của một đoạn nghị luận theo mô hình bánh hamburger.",
      grade: "Lớp 6–9", minutes: "15–20 phút", maxStars: 5, status: "open", url: "khoa-hoc/nghi-luan-1.html" },
    { id: "nghi-luan-2", series: "nghi-luan", title: "Viết bằng chứng và phân tích", code: "Khoá 2",
      blurb: "Tự viết hai phần dễ bắt tay nhất: bằng chứng và phân tích bằng chứng.",
      grade: "Lớp 6–9", minutes: "20 phút", maxStars: 5, status: "soon", url: "" },
    { id: "nghi-luan-3", series: "nghi-luan", title: "Lý lẽ và câu chủ đề", code: "Khoá 3",
      blurb: "Viết lý lẽ thuyết phục và câu chủ đề rõ ràng, rồi ráp thành đoạn hoàn chỉnh.",
      grade: "Lớp 6–9", minutes: "20 phút", maxStars: 5, status: "soon", url: "" },
    { id: "ke-chuyen-1", series: "ke-chuyen", title: "Kể chuyện cơ bản", code: "Khoá 1",
      blurb: "Mở đầu, diễn biến, kết thúc — kể một câu chuyện có duyên.",
      grade: "Lớp 4–7", minutes: "15–20 phút", maxStars: 5, status: "soon", url: "" }
  ];

  var SERIES = [
    { id: "nghi-luan", name: "Nghị luận Vỡ Lòng", program: "Viết Không Khó · Viết Nghị Luận online" },
    { id: "ke-chuyen", name: "Kể chuyện cơ bản", program: "Viết Là Vui" }
  ];

  var memory = {};
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) || {}; } catch (e) {}
    return memory;
  }
  function save(data) {
    memory = data;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  function getName() { return (load().name || "").trim(); }
  function setName(name) {
    var d = load(); d.name = String(name || "").trim().slice(0, 30);
    if (!d.cardNo) d.cardNo = "MS-" + String(Math.floor(1000 + Math.random() * 9000));
    if (!d.joined) d.joined = new Date().toISOString().slice(0, 10);
    save(d); return d.name;
  }
  function getCard() { var d = load(); return { name: d.name || "", cardNo: d.cardNo || "MS-0000", joined: d.joined || "" }; }

  function getProgress(courseId) { var d = load(); return (d.courses && d.courses[courseId]) || null; }
  function saveProgress(courseId, stars) {
    var d = load(); d.courses = d.courses || {};
    var prev = d.courses[courseId] || { best: 0, runs: 0 };
    d.courses[courseId] = { best: Math.max(prev.best || 0, stars), last: stars, runs: (prev.runs || 0) + 1, done: new Date().toISOString().slice(0, 10) };
    save(d); return d.courses[courseId];
  }
  function totalStars() {
    var d = load(), t = 0; if (d.courses) for (var k in d.courses) t += d.courses[k].best || 0; return t;
  }
  function reset() { save({}); try { localStorage.removeItem(KEY); } catch (e) {} }

  // ngôi sao biển (sao 5 cánh bo tròn)
  var STAR_PATH = "M12 1.8c.9 0 1.5.9 1.9 2.4l1.2 4.1 4.3-.1c1.6 0 2.6.3 2.8 1.1.3.8-.4 1.6-1.7 2.5l-3.5 2.5 1.4 4.1c.5 1.5.5 2.5-.2 3s-1.7.1-3-.8L12 18.1l-3.4 2.5c-1.3.9-2.3 1.3-3 .8s-.7-1.5-.2-3l1.4-4.1-3.5-2.5C2 10.9 1.3 10.1 1.6 9.3c.2-.8 1.2-1.1 2.8-1.1l4.3.1 1.2-4.1C10.5 2.7 11.1 1.8 12 1.8z";
  function starsHTML(n, max) {
    var s = '<span class="stars" role="img" aria-label="' + n + " trên " + max + ' sao biển">';
    for (var i = 0; i < max; i++) s += '<svg viewBox="0 0 24 24" class="' + (i < n ? "on" : "off") + '" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg>';
    return s + "</span>";
  }

  function toast(msg) {
    var t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }

  window.MS = {
    ZONES: ZONES, COURSES: COURSES, SERIES: SERIES, STAR_PATH: STAR_PATH,
    getName: getName, setName: setName, getCard: getCard,
    getProgress: getProgress, saveProgress: saveProgress, totalStars: totalStars, reset: reset,
    starsHTML: starsHTML, toast: toast, esc: esc
  };
  // [3D] Nhân vật đã chọn ở sảnh 3D, lưu cùng thẻ thư viện (thêm 15/10/2026, chỉ bổ sung).
  function getAvatar() { return load().avatar || ""; }
  function setAvatar(id) { var d = load(); d.avatar = String(id || "").slice(0, 20); save(d); return d.avatar; }
  window.MS.getAvatar = getAvatar;
  window.MS.setAvatar = setAvatar;
})();
