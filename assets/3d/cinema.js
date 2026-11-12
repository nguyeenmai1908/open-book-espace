/* ==========================================================
   SẢNH 3D MỞ SÁCH — cinema.js: Phòng chiếu phim ngắn
   Màn chiếu + 12 ghế + máy chiếu (tường bắc, phía tây cửa), tường poster (phía đông cửa), xe bắp rang.
   Danh sách phim ở assets/phim/phim.js (window.MS_FILMS). Việc xem/nghĩ/viết diễn ra ở bảng 2D trong play.html.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  MS3D.FILMS = window.MS_FILMS || [];
  MS3D.getFilm = function (id) { for (var i = 0; i < MS3D.FILMS.length; i++) if (MS3D.FILMS[i].id === id) return MS3D.FILMS[i]; return null; };

  /* ---------- Poster phim vẽ bằng canvas (không dùng ảnh có bản quyền) ---------- */
  function wrap(g, text, x, y, maxW, lh) {
    var words = text.split(" "), line = "", lines = [];
    words.forEach(function (w) { var t = line ? line + " " + w : w; if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line);
    lines.forEach(function (l, i) { g.fillText(l, x, y + i * lh); });
    return lines.length;
  }
  MS3D.drawFilmPoster = function (film, canvas) {
    canvas.width = 320; canvas.height = 440;
    var g = canvas.getContext("2d"), W = 320, H = 440, cx = W / 2, cy = 170;
    g.fillStyle = film.color || "#1d6b6d"; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(255,255,255,.14)"; g.beginPath(); g.arc(cx, cy, 120, 0, 7); g.fill();
    g.fillStyle = "rgba(0,0,0,.22)"; for (var k = 0; k < 11; k++) { g.fillRect(8 + k * 28, 10, 16, 10); g.fillRect(8 + k * 28, H - 20, 16, 10); } // lỗ phim
    var acc = film.accent || "#ffffff";
    if (film.art === "o") {            // chiếc ô + giọt mưa
      g.fillStyle = acc; g.beginPath(); g.arc(cx, cy, 82, Math.PI, 0); g.closePath(); g.fill();
      g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.arc(cx - 40, cy, 41, Math.PI, 0); g.fill();
      g.strokeStyle = "#1b2a2b"; g.lineWidth = 7; g.lineCap = "round";
      g.beginPath(); g.moveTo(cx, cy - 4); g.lineTo(cx, cy + 82); g.arc(cx + 14, cy + 82, 14, Math.PI, 0, true); g.stroke();
      g.fillStyle = "#dff3f2"; [[-110, -70], [-80, 60], [100, -40], [118, 50], [-30, -110], [60, -112]].forEach(function (p) { g.beginPath(); g.ellipse(cx + p[0], cy + p[1], 5, 10, 0, 0, 7); g.fill(); });
    } else if (film.art === "but") {   // bút chì cụt nối ống tre
      g.save(); g.translate(cx, cy); g.rotate(-0.5);
      g.fillStyle = "#7cc35a"; g.fillRect(-110, -18, 90, 36);                     // ống tre
      g.fillStyle = "#5c9a43"; g.fillRect(-80, -18, 6, 36); g.fillRect(-46, -18, 6, 36);
      g.fillStyle = acc; g.fillRect(-20, -18, 70, 36);                              // thân bút
      g.fillStyle = "#f2d7a6"; g.beginPath(); g.moveTo(50, -18); g.lineTo(100, 0); g.lineTo(50, 18); g.fill();
      g.fillStyle = "#1b2a2b"; g.beginPath(); g.moveTo(86, -5); g.lineTo(100, 0); g.lineTo(86, 5); g.fill();
      g.restore();
    } else if (film.art === "bong") {  // quả bóng giấy báo
      g.fillStyle = "#f3eee6"; g.beginPath(); g.arc(cx, cy, 78, 0, 7); g.fill();
      g.strokeStyle = "#9aa3a3"; g.lineWidth = 3;
      for (var i = 0; i < 7; i++) { g.beginPath(); g.moveTo(cx - 60, cy - 48 + i * 16); g.lineTo(cx + 60, cy - 44 + i * 16); g.stroke(); }
      g.strokeStyle = acc; g.lineWidth = 12;
      g.beginPath(); g.moveTo(cx - 74, cy - 20); g.lineTo(cx + 74, cy + 20); g.stroke();
      g.beginPath(); g.moveTo(cx - 20, cy - 76); g.lineTo(cx + 22, cy + 76); g.stroke();
    } else if (film.art === "qua") {   // hộp quà mở nắp + quả bóng đỏ
      g.fillStyle = "#f3e2c4"; g.fillRect(cx - 70, cy - 10, 140, 90);
      g.fillStyle = "#d7bf96"; g.save(); g.translate(cx - 74, cy - 22); g.rotate(-0.25); g.fillRect(0, -18, 150, 20); g.restore();
      g.fillStyle = acc; g.fillRect(cx - 8, cy - 10, 16, 90);
      g.beginPath(); g.arc(cx + 58, cy - 62, 28, 0, 7); g.fill();
      g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.arc(cx + 50, cy - 70, 9, 0, 7); g.fill();
    } else if (film.art === "alike") { // thành phố xám + một nốt nhạc cam
      [[-96, 70, 40], [-50, 110, 34], [-8, 84, 38], [36, 120, 32], [76, 92, 40]].forEach(function (b) { g.fillStyle = "#8b96a3"; g.fillRect(cx + b[0], cy + 70 - b[1], b[2], b[1]); });
      g.fillStyle = acc; g.beginPath(); g.ellipse(cx + 6, cy - 6, 22, 16, -0.4, 0, 7); g.fill();
      g.fillRect(cx + 22, cy - 92, 9, 88); g.beginPath(); g.moveTo(cx + 31, cy - 92); g.quadraticCurveTo(cx + 70, cy - 76, cx + 52, cy - 44); g.lineTo(cx + 31, cy - 64); g.fill();
    } else if (film.art === "mua") {   // bốn mùa: bốn góc tròn xuân – hạ – thu – đông
      [["#f8a5c2", Math.PI, 1.5 * Math.PI], ["#e53935", 1.5 * Math.PI, 2 * Math.PI], ["#e8892b", 0, 0.5 * Math.PI], ["#dff3f2", 0.5 * Math.PI, Math.PI]].forEach(function (q) {
        g.fillStyle = q[0]; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 86, q[1], q[2]); g.closePath(); g.fill();
      });
      g.fillStyle = acc; g.beginPath(); g.arc(cx, cy, 26, 0, 7); g.fill();
      g.fillStyle = "#1b2a2b"; g.font = "800 22px 'Baloo 2', system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      [["Xuân", -46, -40], ["Hạ", 46, -40], ["Thu", 46, 44], ["Đông", -46, 44]].forEach(function (l) { g.fillText(l[0], cx + l[1], cy + l[2]); });
    } else {                           // mặc định: nút play
      g.fillStyle = acc; g.beginPath(); g.moveTo(cx - 40, cy - 60); g.lineTo(cx + 60, cy); g.lineTo(cx - 40, cy + 60); g.fill();
    }
    g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, 300, W, 120);
    g.fillStyle = "#ffffff"; g.textAlign = "center"; g.textBaseline = "top";
    g.font = "800 38px 'Baloo 2', system-ui, sans-serif";
    var n = wrap(g, film.title, cx, 310, W - 40, 38);
    g.font = "600 18px 'Be Vietnam Pro', system-ui, sans-serif"; g.fillStyle = "#fff6ea";
    g.fillText((window.MS && MS.tr ? MS.tr("Phim ngắn · " + (film.minutes || "")) : "Phim ngắn · " + (film.minutes || "")), cx, 316 + n * 38);
    if (film.demo) {
      g.fillStyle = "#ff8300"; g.fillRect(W - 112, 30, 100, 30);
      g.fillStyle = "#1f1406"; g.font = "700 16px 'Be Vietnam Pro', system-ui, sans-serif"; g.fillText((window.MS && MS.tr ? MS.tr("MINH HOẠ") : "MINH HOẠ"), W - 62, 36);
    } else if (film.by) {   // phim thật: ghi ai làm phim
      g.font = "700 15px 'Be Vietnam Pro', system-ui, sans-serif";
      var bw = g.measureText(film.by).width + 24;
      g.fillStyle = "#ffc83d"; g.fillRect(W - bw - 12, 30, bw, 30);
      g.fillStyle = "#1f1406"; g.fillText(film.by, W - 12 - bw / 2, 37);
    }
    return canvas;
  };
  var cache = {};
  MS3D.posterURL = function (film) {
    if (!cache[film.id]) cache[film.id] = MS3D.drawFilmPoster(film, document.createElement("canvas")).toDataURL("image/png");
    return cache[film.id];
  };

  /* Chữ ngắn trên màn chiếu: tên phim đang chọn. */
  function drawScreen(canvas, film) {
    var g = canvas.getContext("2d"), W = canvas.width, H = canvas.height;
    var grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, "#fdfcf7"); grd.addColorStop(1, "#e4efee");
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    g.textAlign = "center"; g.textBaseline = "middle";
    if (!film) {
      g.fillStyle = "#1d6b6d"; g.font = "800 64px 'Baloo 2', system-ui, sans-serif"; g.fillText("Mở Sách Cinema", W / 2, H / 2 - 22);
      g.fillStyle = "#a85000"; g.font = "600 26px 'Be Vietnam Pro', system-ui, sans-serif"; g.fillText((window.MS && MS.tr ? MS.tr("Xem · Nghĩ · Viết") : "Xem · Nghĩ · Viết"), W / 2, H / 2 + 38);
      return;
    }
    var p = MS3D.drawFilmPoster(film, document.createElement("canvas"));
    var ph = H - 40, pw = ph * 320 / 440;
    g.drawImage(p, 30, 20, pw, ph);
    g.textAlign = "left";
    g.fillStyle = "#a85000"; g.font = "700 24px 'Be Vietnam Pro', system-ui, sans-serif"; g.fillText((window.MS && MS.tr ? MS.tr("ĐANG CHIẾU") : "ĐANG CHIẾU"), 60 + pw, H / 2 - 50);
    g.fillStyle = "#1b2a2b"; g.font = "800 54px 'Baloo 2', system-ui, sans-serif"; g.fillText(film.title, 60 + pw, H / 2 + 6);
    g.fillStyle = "#1d6b6d"; g.font = "600 24px 'Be Vietnam Pro', system-ui, sans-serif"; g.fillText((window.MS && MS.tr ? MS.tr(film.minutes + " · " + film.grade) : film.minutes + " · " + film.grade), 60 + pw, H / 2 + 58);
  }

  /* ---------- Không khí rạp: ốp tường tối, viền bóng đèn quanh màn, cột chắn dây nhung, biển Lối ra, cuộn phim ---------- */
  function cinemaDecor(world, b, wallZ, SX, h, slot) {
    var scene = world.scene, C = MS3D.COLORS, NAVY = 0x262b40, GROOVE = 0x323852, GOLD = 0xd4a017;
    var dx = slot.door[0], half = 1.6 + 0.35;
    // ốp tường bên trong: tây, đông, và tường bắc (chừa cửa). Tường nam để trống vì camera nhìn từ phía nam.
    function panelRun(x0, z0, x1, z1) {   // dải ốp chạy dọc một bức tường, mặt ốp dày 0.05
      var horiz = z0 === z1, len = horiz ? Math.abs(x1 - x0) : Math.abs(z1 - z0), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
      MS3D.box(horiz ? len : 0.05, 2.5, horiz ? 0.05 : len, NAVY, mx, 1.25, mz, scene);
      var n = Math.floor(len / 0.9);
      for (var i = 1; i < n; i++) { var t = -len / 2 + i * len / n; MS3D.box(horiz ? 0.05 : 0.06, 2.2, horiz ? 0.06 : 0.05, GROOVE, horiz ? mx + t : mx, 1.3, horiz ? mz : mz + t, scene); }
      MS3D.box(horiz ? len : 0.07, 0.07, horiz ? 0.07 : len, GOLD, mx, 2.5, mz, scene);   // nẹp vàng trên
      MS3D.box(horiz ? len : 0.08, 0.2, horiz ? 0.08 : len, 0x1b1e2c, mx, 0.1, mz, scene); // chân tường tối
    }
    panelRun(b[0] + 0.23, b[2] + 0.2, b[0] + 0.23, b[3] - 0.2);
    panelRun(b[1] - 0.23, b[2] + 0.2, b[1] - 0.23, b[3] - 0.2);
    panelRun(b[0] + 0.2, wallZ + 0.02, dx - half, wallZ + 0.02);
    panelRun(dx + half, wallZ + 0.02, b[1] - 0.2, wallZ + 0.02);
    // viền bóng đèn quanh màn chiếu (nhấp nháy kiểu rạp xưa)
    var bulbs = [], bw = 5.2, bh = 2.5, by0 = 1.4 - bh / 2 + 0.1;
    for (var i = 0; i <= 16; i++) bulbs.push([SX - bw / 2 + i * bw / 16, by0 + bh]);
    for (var j = 1; j < 7; j++) { bulbs.push([SX - bw / 2, by0 + j * bh / 7]); bulbs.push([SX + bw / 2, by0 + j * bh / 7]); }
    var mats = bulbs.map(function (p, k) {
      var m = new THREE.MeshBasicMaterial({ color: 0xffe08a }), bl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), m);
      bl.position.set(p[0], p[1], wallZ + 0.2); scene.add(bl); return m;
    });
    world.updaters.push(function (dt, t) { mats.forEach(function (m, k) { m.color.setHex(Math.floor(t * 4 + k) % 3 ? 0xffe08a : 0x8a6a2a); }); });
    // cột chắn dây nhung đỏ hai bên lối vào
    var z0 = wallZ + 1.0, z1 = wallZ + 2.8;
    [-1.25, 1.25].forEach(function (ox) {
      var px = dx + ox, posts = [z0, (z0 + z1) / 2, z1];
      posts.forEach(function (pz) {
        MS3D.cyl(0.13, 0.15, 0.04, 10, GOLD, px, 0.02, pz, scene); MS3D.cyl(0.03, 0.03, 0.9, 6, GOLD, px, 0.47, pz, scene); MS3D.ball(0.06, GOLD, px, 0.95, pz, scene, 0);
        world.addCircle(px, pz, 0.14);
      });
      for (var k = 0; k < 2; k++) {
        var za = posts[k], zb = posts[k + 1];
        for (var q = 1; q < 6; q++) { var tq = q / 6; MS3D.ball(0.035, 0xa31f1f, px, 0.88 - Math.sin(tq * Math.PI) * 0.16, za + (zb - za) * tq, scene, 0); }
      }
      world.addBox(px - 0.05, px + 0.05, z0, z1);
    });
    // biển "Lối ra" phía trên cửa
    var ec = document.createElement("canvas"); ec.width = 256; ec.height = 64; var eg = ec.getContext("2d");
    eg.fillStyle = "#1e8a4c"; eg.fillRect(0, 0, 256, 64); eg.fillStyle = "#ffffff"; eg.font = "700 30px 'Be Vietnam Pro', system-ui, sans-serif"; eg.textAlign = "center"; eg.textBaseline = "middle"; eg.fillText((window.MS && MS.tr ? MS.tr("Lối ra · Sảnh chính") : "Lối ra · Sảnh chính"), 128, 34);
    var ex = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ec) }));
    ex.position.set(dx, 3.3, wallZ + 0.12); scene.add(ex);
    // cuộn phim + dải phim trên tường đông
    var rz = b[2] + 8.2, rx = b[1] - 0.32;
    [[0, 1.85], [0, 1.0]].forEach(function (q, k) {
      var reel = MS3D.cyl(0.42 - k * 0.1, 0.42 - k * 0.1, 0.06, 16, 0x9aa3ad, rx, q[1], rz + (k ? 0.75 : 0), scene); reel.rotation.z = Math.PI / 2;
      for (var hl = 0; hl < 5; hl++) { var a = hl * 1.2566; var ho = MS3D.cyl(0.07, 0.07, 0.07, 8, NAVY, rx - 0.01, q[1] + Math.sin(a) * 0.2 * (1 - k * 0.25), rz + (k ? 0.75 : 0) + Math.cos(a) * 0.2 * (1 - k * 0.25), scene); ho.rotation.z = Math.PI / 2; }
    });
    for (var f = 0; f < 6; f++) MS3D.box(0.03, 0.22, 0.3, f % 2 ? 0x1b1e2c : 0x3a3f52, rx - 0.02, 1.45 - f * 0.05, rz - 0.6 - f * 0.32, scene);
  }

  /* ---------- Dựng phòng ---------- */
  // h: { sign, place, floor } từ rooms.js
  MS3D.buildCinemaRoom = function (world, slot, zone, h) {
    var b = slot.bounds, C = MS3D.COLORS, scene = world.scene;
    var wallZ = b[2] + 0.2;                 // mặt trong tường bắc (tường chung với sảnh)
    var SX = b[0] + 3.2;                    // tâm màn chiếu (nửa tây, tránh cửa)
    h.floor(world, b, 0x3a3f52, 0, "carpet");
    h.floor(world, [b[0] + 0.6, b[0] + 5.8, b[2] + 2.6, b[2] + 9], 0x6b2430, 0.01, "carpet");   // thảm đỏ dưới ghế

    // màn chiếu + rèm + bục
    MS3D.box(4.9, 2.2, 0.08, 0x1b1e2c, SX, 1.4, wallZ + 0.04, scene);
    var sc = document.createElement("canvas"); sc.width = 640; sc.height = 280;
    drawScreen(sc, null);
    var stex = new THREE.CanvasTexture(sc);
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 1.97), new THREE.MeshBasicMaterial({ map: stex }));
    screen.position.set(SX, 1.4, wallZ + 0.09); scene.add(screen);
    [-2.65, 2.65].forEach(function (dx) {
      for (var f = 0; f < 3; f++) MS3D.box(0.16, 2.45, 0.18, f % 2 ? 0xa93226 : 0xc0392b, SX + dx + (dx < 0 ? -f * 0.14 : f * 0.14), 1.22, wallZ + 0.16, scene);
    });
    MS3D.box(5.9, 0.28, 0.32, 0xc0392b, SX, 2.5, wallZ + 0.16, scene);    // diềm rèm
    MS3D.box(5.6, 0.22, 0.9, C.woodDark, SX, 0.11, wallZ + 0.45, scene);   // bục
    world.addBox(SX - 2.95, SX + 2.95, wallZ, wallZ + 0.9);
    var cinemaIt = { kind: "cinema", x: SX, z: wallZ + 2.1, r: 1.5, label: "Chọn phim", sub: "Màn chiếu · Xem, nghĩ rồi viết", room: zone.id };
    world.interactables.push(cinemaIt);
    world.pick(screen, cinemaIt);
    h.place(world, "man-chieu", "Màn chiếu (Phòng chiếu phim)", zone.id, SX, wallZ + 2.1);
    world.setScreen = function (film) { drawScreen(sc, film); stex.needsUpdate = true; };

    // 3 hàng ghế quay về màn chiếu
    var seatMat = 0xc0392b, backMat = 0xa93226;
    [3.6, 5.4, 7.2].forEach(function (dz, r) {
      var z = b[2] + dz;
      for (var s = 0; s < 4; s++) {
        var x = SX - 1.8 + s * 1.2;
        MS3D.box(0.86, 0.42, 0.7, seatMat, x, 0.21, z, scene);
        MS3D.box(0.86, 0.8, 0.16, backMat, x, 0.6, z + 0.36, scene);
        MS3D.box(0.08, 0.6, 0.7, 0x1b1e2c, x + 0.47, 0.3, z, scene);
      }
      MS3D.box(0.08, 0.6, 0.7, 0x1b1e2c, SX - 2.27, 0.3, z, scene);
      world.addBox(SX - 2.35, SX + 2.35, z - 0.36, z + 0.45);
      world.pickArea(SX, 0.5, z + 0.05, 4.7, 1, 0.9, null, cinemaIt);
    });
    // đèn dẫn lối dọc lối đi
    var ledMat = new THREE.MeshBasicMaterial({ color: 0xffb35c });
    for (var k = 0; k < 7; k++) { var l = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.12), ledMat); l.position.set(SX + 2.75, 0.03, b[2] + 2.4 + k * 1.1); scene.add(l); }

    // máy chiếu phía sau + chùm sáng
    var PZ = b[2] + 10.2;
    MS3D.cyl(0.1, 0.14, 1.5, 6, 0x333333, SX, 0.75, PZ, scene);
    MS3D.box(0.6, 0.4, 0.7, 0x1b2a2b, SX, 1.7, PZ, scene);
    MS3D.cyl(0.13, 0.13, 0.2, 10, 0x8fd3d4, SX, 1.7, PZ - 0.42, scene).rotation.x = Math.PI / 2;
    [-0.2, 0.2].forEach(function (dx) { MS3D.cyl(0.17, 0.17, 0.08, 10, 0x333333, SX + dx, 2.05, PZ, scene).rotation.z = Math.PI / 2; });
    world.addCircle(SX, PZ, 0.45);
    var len = PZ - 0.5 - (wallZ + 0.1);
    var beamMat = new THREE.MeshBasicMaterial({ color: 0xfff6d8, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false });
    var beam = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.1, len, 14, 1, true), beamMat);
    beam.rotation.x = -Math.PI / 2; beam.scale.x = 2;   // rộng ngang theo màn
    beam.position.set(SX, 1.55, wallZ + 0.1 + len / 2); scene.add(beam);
    world.updaters.push(function (dt, t) { beamMat.opacity = 0.06 + Math.sin(t * 7) * 0.006 + Math.sin(t * 2.3) * 0.008; });

    // tường poster (nửa đông, phía kia cửa)
    // dãy poster nằm gọn giữa khung cửa (cạnh phải cửa ở x = DOOR_W/2 + 0.32) và góc tường đông
    var films = MS3D.FILMS.slice(0, 3), GAP = 1.6, left = 1.6 + 0.32 + 0.35, right = b[1] - 0.4, PX0 = (left + right) / 2;
    h.sign(world, "Phim đang chiếu", PX0, 2.48, wallZ + 0.3, { size: 0.3, bg: "#1d6b6d", fg: "#ffffff" });
    films.forEach(function (film, i) {
      var x = PX0 + (i - (films.length - 1) / 2) * GAP;
      var grp = new THREE.Group(); grp.position.set(x, 1.35, wallZ + 0.06); scene.add(grp);
      MS3D.box(1.32, 1.76, 0.06, C.orange, 0, 0, 0, grp);
      var tex = new THREE.CanvasTexture(MS3D.drawFilmPoster(film, document.createElement("canvas")));
      var p = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.65), new THREE.MeshBasicMaterial({ map: tex }));
      p.position.z = 0.04; grp.add(p);
      world.interactables.push({ kind: "film", film: film.id, x: x, z: wallZ + 1.1, r: 0.85, label: "Xem phim", sub: film.title + " · " + film.minutes, room: zone.id });
      world.pick(grp);
    });
    if (!films.length) h.sign(world, "Sắp có phim", PX0, 1.4, wallZ + 0.3, { size: 0.36, bg: "#ff8300", fg: "#1f1406" });

    // xe bắp rang (trang trí, chạm cho vui)
    var cx = b[1] - 2.2, cz = b[2] + 9.6;
    MS3D.box(1.3, 0.8, 0.8, 0xc0392b, cx, 0.5, cz, scene);
    for (var st = 0; st < 4; st++) MS3D.box(0.14, 0.81, 0.81, 0xffffff, cx - 0.48 + st * 0.32, 0.5, cz, scene);
    var glass = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.7), new THREE.MeshLambertMaterial({ color: 0xdff3f2, transparent: true, opacity: 0.35 }));
    glass.position.set(cx, 1.25, cz); scene.add(glass);
    var cornMat = new THREE.MeshLambertMaterial({ color: 0xffe08a });
    for (var c = 0; c < 26; c++) { var m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 0), cornMat); m.position.set(cx - 0.45 + (c * 37 % 90) / 100, 0.96 + (c % 4) * 0.06, cz - 0.25 + (c * 13 % 50) / 100); scene.add(m); }
    MS3D.box(1.3, 0.08, 0.8, 0xc0392b, cx, 1.64, cz, scene);
    [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]].forEach(function (p) { MS3D.cyl(0.08, 0.08, 0.06, 8, 0x1b2a2b, cx + p[0], 0.08, cz + p[1], scene).rotation.z = Math.PI / 2; });
    h.sign(world, "Bắp rang", cx, 2.0, cz, { size: 0.26, bg: "#ff8300", fg: "#1f1406" });
    world.addBox(cx - 0.7, cx + 0.7, cz - 0.45, cz + 0.45);
    world.interactables.push({ kind: "popcorn", x: cx - 1.2, z: cz, r: 1.2, label: "Lấy bắp rang", sub: "Xe bắp rang Mở Sách", room: zone.id });
    world.pickArea(cx, 1, cz, 1.4, 2, 0.9);

    // góc viết cảm nhận (nửa đông): thảm tròn, bàn tròn, đệm ngồi, sổ + bút + đèn bàn
    var wx = b[1] - 3.4, wz = b[2] + 5.4;
    MS3D.cyl(1.9, 1.9, 0.02, 20, 0x2c6e6f, wx, 0.02, wz, scene);
    MS3D.cyl(1.65, 1.65, 0.025, 20, 0x3c8a8b, wx, 0.025, wz, scene);
    MS3D.cyl(0.75, 0.75, 0.08, 14, C.wood, wx, 0.62, wz, scene).castShadow = true;
    MS3D.cyl(0.08, 0.14, 0.6, 8, C.woodDark, wx, 0.3, wz, scene);
    world.addCircle(wx, wz, 0.8);
    [0, 2.1, 4.2].forEach(function (a, i) {
      MS3D.cyl(0.3, 0.33, 0.3, 10, [0xff8300, 0xf6c84c, 0xe86a92][i], wx + Math.sin(a) * 1.25, 0.15, wz + Math.cos(a) * 1.25, scene).castShadow = true;
    });
    [[-0.25, 0.1, 0xfffaf0, 0.3], [0.2, -0.2, 0xffe6c4, -0.4]].forEach(function (n) {   // hai cuốn sổ mở
      var pg = MS3D.box(0.42, 0.03, 0.3, n[2], wx + n[0], 0.68, wz + n[1], scene); pg.rotation.y = n[3];
    });
    var pen = MS3D.box(0.24, 0.025, 0.025, 0x3d7dd8, wx - 0.2, 0.7, wz + 0.28, scene); pen.rotation.y = 0.5;
    MS3D.cyl(0.07, 0.09, 0.03, 8, 0x333333, wx + 0.42, 0.67, wz - 0.3, scene);
    MS3D.cyl(0.015, 0.015, 0.36, 5, 0x333333, wx + 0.42, 0.85, wz - 0.3, scene);
    MS3D.cyl(0.08, 0.15, 0.14, 10, 0xffb35c, wx + 0.42, 1.06, wz - 0.3, scene);
    h.sign(world, "Góc viết cảm nhận", wx, 1.75, wz, { size: 0.26, bg: "#1d6b6d", fg: "#ffffff" });
    var writeIt = { kind: "cinema", x: wx - 1.3, z: wz + 0.9, r: 1.5, label: "Viết cảm nhận", sub: "Chọn phim đã xem để viết vài dòng", room: zone.id };
    world.interactables.push(writeIt);
    world.pickArea(wx, 0.6, wz, 1.6, 1.2, 1.6, null, writeIt);
    h.place(world, "goc-viet-phim", "Góc viết cảm nhận (Phòng chiếu)", zone.id, wx - 1.3, wz + 1.4);

    cinemaDecor(world, b, wallZ, SX, h, slot);

    // đèn tường ấm dọc hai bên phòng
    var glowTex = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d");
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,200,120,.75)"); gr.addColorStop(1, "rgba(255,200,120,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
    })();
    var lampMat = new THREE.MeshBasicMaterial({ color: 0xffd89a });
    [b[2] + 3, b[2] + 6.5, b[2] + 10].forEach(function (z) {
      [[b[0] + 0.33, 1], [b[1] - 0.33, -1]].forEach(function (w) {
        var lm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.34, 0.26), lampMat); lm.position.set(w[0], 1.9, z); scene.add(lm);
        var gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        gl.scale.set(1.3, 1.3, 1); gl.position.set(w[0] + w[1] * 0.12, 1.9, z); scene.add(gl);
      });
    });
  };
})();
