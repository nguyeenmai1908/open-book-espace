/* ==========================================================
   SẢNH 3D MỞ SÁCH — books.js
   Vẽ bìa sách (canvas) dùng chung cho kệ 3D và thẻ sách 2D.
   Sách nào có `cover: "assets/sach/<id>/bia.webp"` thì dùng ảnh bìa đó thay vì bìa vẽ.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  MS3D.BOOKS = window.MS_BOOKS || [];
  MS3D.getBook = function (id) { for (var i = 0; i < MS3D.BOOKS.length; i++) if (MS3D.BOOKS[i].id === id) return MS3D.BOOKS[i]; return null; };

  function star(g, x, y, R, r, n) {
    g.beginPath();
    for (var i = 0; i < n * 2; i++) { var a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); }
    g.closePath(); g.fill();
  }
  function wrap(g, text, maxW) {
    var words = text.split(" "), lines = [], cur = "";
    words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur); return lines;
  }
  /* Bìa 320×440: nền màu sách, hình minh hoạ đơn giản, tên sách, dòng tác giả. */
  MS3D.drawCover = function (book, canvas) {
    canvas.width = 320; canvas.height = 440;
    var g = canvas.getContext("2d"), W = 320, H = 440;
    g.fillStyle = book.color || "#1d6b6d"; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, 0, 18, H);           // gáy sách
    g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(W * 0.62, H * 0.42, 120, 0, 7); g.fill();
    var cx = W * 0.58, cy = H * 0.42;
    if (book.art === "khe") {               // quả khế + chú chim
      g.fillStyle = book.accent || "#f6c84c"; star(g, cx, cy + 10, 64, 30, 5);
      g.fillStyle = "#2f6e3c"; g.fillRect(cx - 3, cy - 70, 6, 26);
      g.fillStyle = "#ff8300"; g.beginPath(); g.ellipse(cx + 70, cy - 70, 26, 16, -0.3, 0, 7); g.fill();
      g.beginPath(); g.moveTo(cx + 92, cy - 76); g.lineTo(cx + 108, cy - 70); g.lineTo(cx + 92, cy - 64); g.fill();
      g.fillStyle = "#1b2a2b"; g.beginPath(); g.arc(cx + 82, cy - 74, 3, 0, 7); g.fill();
    } else if (book.art === "vusua") {      // quả vú sữa + lá hai màu
      g.fillStyle = "#3f8a4e"; g.beginPath(); g.ellipse(cx - 46, cy - 50, 40, 18, -0.6, 0, 7); g.fill();
      g.fillStyle = "#c0392b"; g.beginPath(); g.ellipse(cx + 46, cy - 52, 40, 18, 0.6, 0, 7); g.fill();
      g.fillStyle = book.accent || "#c9e6a0"; g.beginPath(); g.arc(cx, cy + 22, 58, 0, 7); g.fill();
      g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.arc(cx - 20, cy + 2, 14, 0, 7); g.fill();
    } else if (book.art === "xe-dap") {     // chiếc xe đạp đơn giản
      g.strokeStyle = "#ffffff"; g.lineWidth = 9; g.lineCap = "round";
      g.beginPath(); g.arc(cx - 52, cy + 30, 36, 0, 7); g.stroke();
      g.beginPath(); g.arc(cx + 52, cy + 30, 36, 0, 7); g.stroke();
      g.strokeStyle = book.accent || "#7cc35a";
      g.beginPath(); g.moveTo(cx - 52, cy + 30); g.lineTo(cx - 10, cy - 20); g.lineTo(cx + 30, cy - 20); g.lineTo(cx + 52, cy + 30); g.moveTo(cx - 10, cy - 20); g.lineTo(cx + 2, cy + 30); g.lineTo(cx + 30, cy - 20); g.stroke();
      g.beginPath(); g.moveTo(cx - 22, cy - 34); g.lineTo(cx + 2, cy - 34); g.moveTo(cx + 30, cy - 20); g.lineTo(cx + 34, cy - 44); g.lineTo(cx + 50, cy - 46); g.stroke();
    } else if (book.art === "an-sach") {    // cuốn sách bị cắn một miếng
      g.fillStyle = book.accent || "#f2d7a6"; g.fillRect(cx - 60, cy - 60, 120, 140);
      g.fillStyle = "#ffffff"; g.fillRect(cx - 50, cy - 50, 100, 120);
      g.fillStyle = "#c9b48a"; for (var k = 0; k < 6; k++) g.fillRect(cx - 38, cy - 34 + k * 18, 76, 5);
      g.fillStyle = book.color || "#a8432c";
      [[60, -40], [64, -14], [58, 12]].forEach(function (b) { g.beginPath(); g.arc(cx + b[0], cy + b[1], 18, 0, 7); g.fill(); });
    } else if (book.art === "classic") {    // sách kinh điển: khung viền vàng + hoạ tiết Đông/Tây
      var ac = book.accent || "#e8c15a";
      g.strokeStyle = ac; g.lineWidth = 4; g.strokeRect(34, 30, W - 56, H - 60);
      g.lineWidth = 1.5; g.strokeRect(42, 38, W - 72, H - 76);
      g.fillStyle = ac;
      if (book.side === "dong") {           // con dấu đỏ + mây cuộn
        g.fillStyle = "#c62828"; g.fillRect(cx - 34, cy - 70, 68, 68);
        g.strokeStyle = "#ffe9b0"; g.lineWidth = 3; g.strokeRect(cx - 28, cy - 64, 56, 56);
        g.fillStyle = "#ffe9b0"; g.font = "800 30px 'Baloo 2', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("書", cx, cy - 34);
        g.strokeStyle = ac; g.lineWidth = 3;
        [[-60, 40], [10, 30], [70, 45]].forEach(function (p) { g.beginPath(); g.arc(cx + p[0], cy + p[1], 14, Math.PI, 0); g.arc(cx + p[0] + 22, cy + p[1], 10, Math.PI, 0); g.stroke(); });
      } else {                              // huy hiệu tròn + ngôi sao
        g.beginPath(); g.arc(cx, cy - 20, 52, 0, 7); g.fill();
        g.fillStyle = book.color || "#1d3557"; g.beginPath(); g.arc(cx, cy - 20, 42, 0, 7); g.fill();
        g.fillStyle = ac; star(g, cx, cy - 20, 30, 13, 5);
        g.fillRect(cx - 80, cy + 46, 160, 3);
      }
    } else {                                // sách chung: cuốn sách mở
      g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(cx - 70, cy - 30); g.lineTo(cx, cy - 10); g.lineTo(cx + 70, cy - 30); g.lineTo(cx + 70, cy + 40); g.lineTo(cx, cy + 60); g.lineTo(cx - 70, cy + 40); g.closePath(); g.fill();
    }
    g.fillStyle = "#ffffff"; g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.font = "800 44px 'Baloo 2', 'Be Vietnam Pro', sans-serif";
    var lines = wrap(g, book.title, W - 60), y = H - 120 - (lines.length - 1) * 46;
    lines.forEach(function (l, i) { g.fillText(l, 34, y + i * 46); });
    g.font = "600 16px 'Be Vietnam Pro', sans-serif"; g.fillStyle = "rgba(255,255,255,.85)";
    wrap(g, book.author || "", W - 60).slice(0, 2).forEach(function (l, i) { g.fillText(l, 34, H - 56 + i * 20); });
    g.fillStyle = "#ff8300"; g.fillRect(34, H - 100, 48, 5);
    return canvas;
  };
  /* Gáy sách 170×380 (cho tủ sách 3D): tên sách chạy dọc từ trên xuống, viền vàng. */
  MS3D.drawSpine = function (book, canvas) {
    canvas.width = 170; canvas.height = 380;
    var g = canvas.getContext("2d"), W = 170, H = 380, ac = book.accent || "#e8c15a";
    g.fillStyle = book.color || "#1d6b6d"; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(255,255,255,.10)"; g.fillRect(10, 0, 14, H);                 // gáy bo tròn
    g.fillStyle = ac; g.fillRect(0, 18, W, 7); g.fillRect(0, 31, W, 3); g.fillRect(0, H - 25, W, 7); g.fillRect(0, H - 34, W, 3);
    g.save(); g.translate(W / 2 + 4, 46); g.rotate(Math.PI / 2);
    var F = function (n) { g.font = "800 " + n + "px 'Baloo 2', 'Be Vietnam Pro', sans-serif"; };
    var maxW = H - 90, words = book.title.split(" "), lines = [book.title], fs = 52;
    F(fs);
    if (g.measureText(book.title).width > maxW && words.length > 2) {   // tên dài: 2 dòng cho chữ to, dễ đọc
      var half = Math.ceil(words.length / 2);
      lines = [words.slice(0, half).join(" "), words.slice(half).join(" ")]; fs = 46; F(fs);
    }
    var widest = function () { return Math.max.apply(null, lines.map(function (l) { return g.measureText(l).width; })); };
    while (widest() > maxW && fs > 24) { fs -= 2; F(fs); }
    g.fillStyle = "#fff8e8"; g.textAlign = "left"; g.textBaseline = "middle";
    lines.forEach(function (l, i) { g.fillText(l, 0, (i - (lines.length - 1) / 2) * fs * 1.0); });
    g.restore();
    return canvas;
  };
  var cache = {};
  MS3D.coverURL = function (book) {
    if (book.cover) return book.cover;
    if (!cache[book.id]) cache[book.id] = MS3D.drawCover(book, document.createElement("canvas")).toDataURL("image/png");
    return cache[book.id];
  };
})();
