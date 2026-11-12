/* ==========================================================
   SẢNH 3D MỞ SÁCH — themes.js
   1) Lễ hội cho Phòng Lễ hội: Tết Nguyên Đán, Trung thu, Halloween, Giáng sinh.
      Thêm lễ: thêm 1 dòng vào MS3D.FESTIVALS + 1 hàm dựng trong FESTIVAL_BUILD.
   2) Bốn mùa cho Vườn đọc sách: Xuân, Hạ, Thu, Đông (theo mùa khoá học của Mở Sách).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};

  /* Ngày âm lịch đổi ra dương lịch (tháng tính từ 1). Kiểm tra lại mỗi năm khi thêm dòng mới. */
  var LUNAR = {
    tet:       { 2026: [2, 17], 2027: [2, 6],  2028: [1, 26], 2029: [2, 13], 2030: [2, 3] },
    "trung-thu": { 2026: [9, 25], 2027: [9, 15], 2028: [10, 3], 2029: [9, 22], 2030: [9, 12] }
  };

  // before/after: số ngày trước/sau ngày lễ mà phòng tự trang trí theo lễ đó.
  MS3D.FESTIVALS = [
    { id: "tet",        name: "Tết Nguyên Đán", short: "Tết",        before: 21, after: 15, greet: "Chúc mừng năm mới! Năm nay đọc thật nhiều sách nha.", floor: 0xc62828, accent: "#b71c1c", accentInk: "#ffd02e" },
    { id: "trung-thu",  name: "Tết Trung thu",  short: "Trung thu",  before: 21, after: 7,  greet: "Trung thu vui vẻ! Rước đèn ông sao đi đọc truyện nào.", floor: 0x253a6e, accent: "#253a6e", accentInk: "#ffd02e" },
    { id: "halloween",  name: "Halloween",      short: "Halloween",  date: [10, 31], before: 21, after: 2, greet: "Bù! Halloween rồi. Đừng sợ, bí ngô ở đây hiền lắm.", floor: 0x3b2a4f, accent: "#4a2f73", accentInk: "#ff9a33" },
    { id: "giang-sinh", name: "Giáng sinh",     short: "Giáng sinh", date: [12, 25], before: 24, after: 10, greet: "Giáng sinh an lành! Món quà hay nhất là một cuốn sách.", floor: 0xe4eef4, accent: "#1b5e20", accentInk: "#ffffff" }
  ];

  function festDate(f, year) {
    if (f.date) return new Date(year, f.date[0] - 1, f.date[1]);
    var t = LUNAR[f.id] && LUNAR[f.id][year];
    return t ? new Date(year, t[0] - 1, t[1]) : null;
  }
  /* Lễ hợp với ngày hôm nay; ngoài các dịp lễ thì chọn lễ sắp tới gần nhất. */
  MS3D.festivalForDate = function (d) {
    d = d || new Date();
    var active = null, activeGap = 1e9, next = null, nextGap = 1e9, day = 864e5;
    MS3D.FESTIVALS.forEach(function (f) {
      [d.getFullYear() - 1, d.getFullYear(), d.getFullYear() + 1].forEach(function (y) {
        var fd = festDate(f, y); if (!fd) return;
        var diff = (fd - d) / day;              // dương: lễ còn ở phía trước
        if (diff <= f.before && diff >= -f.after) { if (Math.abs(diff) < activeGap) { activeGap = Math.abs(diff); active = f; } }
        else if (diff > 0 && diff < nextGap) { nextGap = diff; next = f; }
      });
    });
    return (active || next || MS3D.FESTIVALS[0]).id;
  };
  MS3D.getFestival = function (id) {
    for (var i = 0; i < MS3D.FESTIVALS.length; i++) if (MS3D.FESTIVALS[i].id === id) return MS3D.FESTIVALS[i];
    return MS3D.FESTIVALS[0];
  };

  /* ---------- hàm dựng nhỏ ---------- */
  function m(geo, color, x, y, z, p, emissive) {
    var mat = emissive ? new THREE.MeshLambertMaterial({ color: color, emissive: emissive, flatShading: true }) : MS3D.mat(color);
    var o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); p.add(o); return o;
  }
  function blossomTree(p, x, z, petal) {
    MS3D.cyl(0.12, 0.2, 1.4, 6, 0x5d4030, x, 0.7, z, p);
    var br = MS3D.cyl(0.06, 0.08, 0.9, 5, 0x5d4030, x + 0.3, 1.5, z, p); br.rotation.z = -0.6;
    var br2 = MS3D.cyl(0.06, 0.08, 0.8, 5, 0x5d4030, x - 0.3, 1.55, z, p); br2.rotation.z = 0.6;
    for (var i = 0; i < 26; i++) {
      var a = i * 2.39, r = 0.3 + (i % 5) * 0.16, h = 1.5 + (i % 7) * 0.13;
      MS3D.ball(0.11, petal, x + Math.cos(a) * r, h, z + Math.sin(a) * r * 0.7, p, 0);
    }
    MS3D.cyl(0.4, 0.32, 0.4, 8, 0x8a5a2e, x, 0.2, z, p); // chậu
  }
  function starLantern(p, x, y, z, color) {
    var g = new THREE.Group(); g.position.set(x, y, z); p.add(g);
    var st = m(new THREE.ExtrudeGeometry(MS3D.starShape(0.4, 0.18), { depth: 0.12, bevelEnabled: false }), color, 0, 0, -0.06, g, 0x551111);
    void st;
    MS3D.cyl(0.02, 0.02, 1.4, 5, 0x8a5a2e, 0.35, -0.75, 0, g).rotation.z = 0.25;
    return g;
  }
  function roundLantern(p, x, y, z, color) {
    var g = new THREE.Group(); g.position.set(x, y, z); p.add(g);
    var b = m(new THREE.IcosahedronGeometry(0.28, 1), color, 0, 0, 0, g, 0x441100); b.scale.y = 1.15;
    MS3D.cyl(0.12, 0.12, 0.06, 8, 0xffc83d, 0, 0.32, 0, g); MS3D.cyl(0.12, 0.12, 0.06, 8, 0xffc83d, 0, -0.32, 0, g);
    MS3D.box(0.02, 0.24, 0.02, 0xffc83d, 0, -0.46, 0, g);
    return g;
  }
  function stand(p, x, z, h) { MS3D.cyl(0.04, 0.05, h, 5, 0x5d4030, x, h / 2, z, p); MS3D.box(0.5, 0.05, 0.05, 0x5d4030, x, h, z, p); }
  function snowPoints(p, b, color, n) {
    var pos = [];
    for (var i = 0; i < n; i++) pos.push(b[0] + Math.random() * (b[1] - b[0]), Math.random() * 4, b[2] + Math.random() * (b[3] - b[2]));
    var geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    var pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: color, size: 0.16 }));
    p.add(pts);
    pts.userData.fall = function (dt, t, speed, drift) {
      var a = geo.attributes.position.array;
      for (var i = 0; i < a.length; i += 3) {
        a[i + 1] -= dt * speed * (0.6 + (i % 7) / 10);
        a[i] += Math.sin(t + i) * dt * drift;
        if (a[i + 1] < 0.05) { a[i + 1] = 4; }
      }
      geo.attributes.position.needsUpdate = true;
    };
    return pts;
  }
  MS3D.fallingPoints = snowPoints;

  /* ---------- 6 gian hàng, bục đố vui, bàn viết (dùng chung cho mọi lễ) ---------- */
  function rel(room, rx, rz) { return [room.bounds[0] + rx, room.bounds[2] + rz]; }
  // vị trí 6 gian hàng (tính từ góc tây-bắc phòng): đi vòng từ cửa bên trái → tường sau → bên phải
  var BOARD_SLOTS = [
    { x: 1.0,  z: 7.4,  rot: Math.PI / 4,  kind: "kiosk" },
    { x: 1.0,  z: 3.8,  rot: Math.PI / 4,  kind: "kiosk" },
    { x: 3.6,  z: 0.42, rot: 0,            kind: "wall" },
    { x: 10.4, z: 0.42, rot: 0,            kind: "wall" },
    { x: 13.0, z: 3.8,  rot: -Math.PI / 4, kind: "kiosk" },
    { x: 13.0, z: 7.4,  rot: -Math.PI / 4, kind: "kiosk" }
  ];
  function wrapText(g, text, maxW) {
    var words = text.split(" "), lines = [], cur = "";
    words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur); return lines;
  }
  function drawBoard(canvas, f, n, title, seen) {
    var g = canvas.getContext("2d"), W = canvas.width, H = canvas.height;
    // giấy kem, viền màu lễ, góc trang trí chấm tròn
    g.fillStyle = "#fff7e6"; g.fillRect(0, 0, W, H);
    g.strokeStyle = f.accent; g.lineWidth = 14; g.strokeRect(7, 7, W - 14, H - 14);
    g.setLineDash([10, 8]); g.lineWidth = 3; g.strokeRect(24, 24, W - 48, H - 48); g.setLineDash([]);
    g.fillStyle = f.accent; [[24, 24], [W - 24, 24], [24, H - 24], [W - 24, H - 24]].forEach(function (c) { g.beginPath(); g.arc(c[0], c[1], 9, 0, 7); g.fill(); });
    g.beginPath(); g.arc(78, 98, 42, 0, 7); g.fill();
    g.fillStyle = f.accentInk === "#ffffff" ? "#ffd02e" : f.accentInk; g.font = "800 48px 'Baloo 2', 'Be Vietnam Pro', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 78, 102);
    g.textAlign = "left"; g.fillStyle = "#3a2618"; g.font = "800 48px 'Baloo 2', 'Be Vietnam Pro', sans-serif";
    var lines = wrapText(g, title, W - 160);
    lines.slice(0, 2).forEach(function (l, i) { g.fillText(l, 128, 92 + i * 56 - (lines.length > 1 ? 24 : 0)); });
    g.font = "600 28px 'Be Vietnam Pro', sans-serif";
    if (seen) {
      g.strokeStyle = "#2e9e5b"; g.lineWidth = 7; g.beginPath(); g.moveTo(48, H - 66); g.lineTo(64, H - 50); g.lineTo(94, H - 84); g.stroke();
      g.fillStyle = "#2e9e5b"; g.fillText((window.MS && MS.tr ? MS.tr("Đã khám phá") : "Đã khám phá"), 108, H - 66);
    } else { g.fillStyle = f.accent; g.fillText((window.MS && MS.tr ? MS.tr("Chạm để khám phá →") : "Chạm để khám phá →"), 48, H - 66); }
  }
  function buildStations(world, g, room, f) {
    var content = (MS3D.FESTIVAL_CONTENT || {})[f.id]; if (!content) return;
    var boards = [];
    content.boards.slice(0, BOARD_SLOTS.length).forEach(function (bd, i) {
      var s = BOARD_SLOTS[i], p = rel(room, s.x, s.z);
      var grp = new THREE.Group(); grp.position.set(p[0], 0, p[1]); grp.rotation.y = s.rot; g.add(grp);
      var cv = document.createElement("canvas"); cv.width = 512; cv.height = 320;
      drawBoard(cv, f, i + 1, bd.title, false);
      var tex = new THREE.CanvasTexture(cv);
      var mat = new THREE.MeshBasicMaterial({ map: tex });
      var w = s.kind === "wall" ? 2.0 : 1.5, h = w * 0.625, y = s.kind === "wall" ? 1.82 : 1.5, acc = new THREE.Color(f.accent).getHex();
      if (s.kind === "kiosk") stall(world, grp, p, s.rot, acc, i, f);
      else banner(world, grp, p, s.rot, w, h, y, acc, i, f);
      MS3D.box(w + 0.16, h + 0.16, 0.1, C_WOOD_DARK, 0, y, 0, grp);
      var scr = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); scr.position.set(0, y, 0.056); grp.add(scr);
      var fx = Math.sin(s.rot), fz = Math.cos(s.rot);
      if (s.kind !== "kiosk") world.addCircle(p[0], p[1], 0.1);
      world.interactables.push({ kind: "fest-board", festival: f.id, idx: i, x: p[0] + fx * 1.25, z: p[1] + fz * 1.25, r: 1.15, label: "Ghé gian hàng", sub: (i + 1) + ". " + bd.title, room: "le-hoi" });
      world.pick(grp);
      boards.push({ canvas: cv, tex: tex, mat: mat, title: bd.title, seen: false });
    });
    // bục Đố vui
    var q = rel(room, 2.6, 10.2), accent = new THREE.Color(f.accent).getHex();
    MS3D.box(0.9, 0.95, 0.6, accent, q[0], 0.48, q[1], g);
    var top = MS3D.box(1.0, 0.06, 0.7, 0x2b2f3a, q[0], 1.0, q[1], g); top.rotation.x = 0.25;
    var ql = MS3D.label("Đố vui", { size: 0.3, bg: f.accent, fg: f.accentInk }); ql.position.set(q[0], 1.75, q[1]); g.add(ql);
    world.addBox(q[0] - 0.45, q[0] + 0.45, q[1] - 0.3, q[1] + 0.3);
    world.interactables.push({ kind: "fest-quiz", festival: f.id, x: q[0], z: q[1] - 1.0, r: 1.2, label: "Chơi đố vui", sub: content.quiz.length + " câu về " + f.name, room: "le-hoi" });
    world.pickArea(q[0], 0.8, q[1], 1.0, 1.6, 0.8, g);
    prizeWheel(world, g, q[0], q[1], f);
    // bàn Góc viết
    var wv = rel(room, 11.4, 10.2);
    MS3D.box(1.3, 0.08, 0.7, C_WOOD, wv[0], 0.75, wv[1], g);
    [[-0.55, -0.28], [0.55, -0.28], [-0.55, 0.28], [0.55, 0.28]].forEach(function (o) { MS3D.box(0.06, 0.75, 0.06, 0x8a5a2e, wv[0] + o[0], 0.375, wv[1] + o[1], g); });
    var pg1 = MS3D.box(0.36, 0.02, 0.46, 0xffffff, wv[0] - 0.18, 0.8, wv[1], g); pg1.rotation.z = 0.12;
    var pg2 = MS3D.box(0.36, 0.02, 0.46, 0xffffff, wv[0] + 0.18, 0.8, wv[1], g); pg2.rotation.z = -0.12;
    var pen = MS3D.cyl(0.015, 0.015, 0.36, 5, 0xff8300, wv[0] + 0.4, 0.82, wv[1] + 0.1, g); pen.rotation.z = Math.PI / 2;
    var wl = MS3D.label("Góc viết", { size: 0.3, bg: f.accent, fg: f.accentInk }); wl.position.set(wv[0], 1.6, wv[1]); g.add(wl);
    world.addBox(wv[0] - 0.65, wv[0] + 0.65, wv[1] - 0.35, wv[1] + 0.35);
    [-0.4, 0.4].forEach(function (dx, k) { MS3D.cyl(0.2, 0.22, 0.42, 8, palette(f)[k], wv[0] + dx, 0.21, wv[1] - 0.62, g); });
    MS3D.cyl(0.015, 0.015, 0.4, 5, 0x333333, wv[0] - 0.5, 0.99, wv[1] + 0.2, g);
    MS3D.cyl(0.07, 0.13, 0.12, 8, 0xffb35c, wv[0] - 0.5, 1.2, wv[1] + 0.2, g);
    world.interactables.push({ kind: "fest-write", festival: f.id, x: wv[0], z: wv[1] - 1.0, r: 1.2, label: "Góc viết", sub: "Viết ý kiến của bạn", room: "le-hoi" });
    world.pickArea(wv[0], 0.8, wv[1], 1.4, 1.6, 0.8, g);

    world.festBoards = world.festBoards || {};
    world.festBoards[f.id] = boards;
    world.updaters.push(function (dt, t) {
      if (!g.visible) return;
      boards.forEach(function (b, i) { var k = b.seen ? 1 : 0.78 + 0.22 * Math.abs(Math.sin(t * 2.2 + i)); b.mat.color.setScalar(k); });
    });
  }
  var C_WOOD = 0xc58a4f;
  MS3D.markFestBoard = function (world, fid, idx, seen) {
    var b = world.festBoards && world.festBoards[fid] && world.festBoards[fid][idx]; if (!b || b.seen === seen) return;
    b.seen = seen; drawBoard(b.canvas, MS3D.getFestival(fid), idx + 1, b.title, seen); b.tex.needsUpdate = true;
  };

  /* ---------- Không khí hội chợ: gian hàng, băng rôn, dây cờ, dây đèn ---------- */
  var C_WOOD_DARK = 0x8a5a2e, PALETTES = {
    tet: [0xd32f2f, 0xffc83d, 0xff8300, 0xe57373], "trung-thu": [0xffc83d, 0xe53935, 0x50b1b3, 0xff8300],
    halloween: [0xff7a00, 0x7e57c2, 0x2b2b2b, 0x9ccc65], "giang-sinh": [0xd32f2f, 0x2e7d32, 0xffffff, 0xffc83d]
  };
  function palette(f) { return PALETTES[f.id] || [0xff8300, 0x50b1b3, 0xffc83d]; }
  // gian hàng nhỏ: 2 cột gỗ, mái sọc, quầy, dây bóng đèn (toạ độ riêng của grp, mặt trước +z)
  function stall(world, grp, p, rot, acc, k, f) {
    [-0.95, 0.95].forEach(function (x) { MS3D.box(0.12, 2.5, 0.12, C_WOOD_DARK, x, 1.25, 0.15, grp); });
    MS3D.box(2.0, 0.72, 0.5, C_WOOD, 0, 0.36, 0.5, grp);
    MS3D.box(2.08, 0.06, 0.58, 0xfff1d6, 0, 0.75, 0.5, grp);
    for (var i = 0; i < 6; i++) {   // mái sọc nghiêng ra trước
      var st = MS3D.box(0.36, 0.05, 0.95, i % 2 ? 0xfffaf0 : acc, -0.9 + i * 0.36, 2.55, 0.48, grp); st.rotation.x = 0.32;
      var fr = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.16, 4), MS3D.mat(i % 2 ? acc : 0xfffaf0)); fr.position.set(-0.9 + i * 0.36, 2.33, 0.95); fr.rotation.x = Math.PI; grp.add(fr);
    }
    var bulbs = [];
    for (var j = 0; j < 6; j++) { var bm = new THREE.MeshBasicMaterial({ color: 0xffe08a }); var bb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 4), bm); bb.position.set(-0.85 + j * 0.34, 2.2, 0.98); grp.add(bb); bulbs.push(bm); }
    // hàng bày trên quầy + đồ treo dưới mái, theo lễ
    goods(grp, f, k, 0.78, 0.5);
    hangGoods(grp, f, k);
    var c = Math.cos(rot), s = Math.sin(rot);
    [[-0.6, 0.45], [0.6, 0.45]].forEach(function (q) { world.addCircle(p[0] + q[0] * c + q[1] * s, p[1] - q[0] * s + q[1] * c, 0.5); });
    world.updaters.push(function (dt, t) { bulbs.forEach(function (bm, j) { bm.color.setHex(Math.sin(t * 3 + j + k) > 0 ? 0xffe08a : 0xffb35c); }); });
  }
  /* ---------- Hàng hoá theo lễ: mỗi gian bày 3 món khác nhau (toạ độ riêng của gian, mặt quầy ở độ cao y) ---------- */
  var B = function (w, h, d, c, x, y, z, p) { return MS3D.box(w, h, d, c, x, y, z, p); };
  var GOODS = {
    tet: [
      function (p, x, y, z) {   // bánh chưng buộc lạt
        [[0, 0], [0.04, 0.12]].forEach(function (o, i) { B(0.26, 0.11, 0.26, 0x3f8a4e, x + o[0], y + 0.06 + o[1], z, p).rotation.y = i * 0.3; });
        B(0.27, 0.235, 0.02, 0xe8d6a0, x, y + 0.11, z, p); B(0.02, 0.235, 0.27, 0xe8d6a0, x, y + 0.11, z, p);
      },
      function (p, x, y, z) {   // khay mứt
        MS3D.cyl(0.24, 0.2, 0.05, 10, 0xc62828, x, y + 0.03, z, p);
        [[0, 0, 0xffc83d], [0.1, 0.06, 0xff8300], [-0.1, 0.05, 0x6cbf5a], [0.05, -0.1, 0xf48fb1], [-0.08, -0.08, 0xfff1d6]].forEach(function (c) { MS3D.ball(0.05, c[2], x + c[0], y + 0.08, z + c[1], p, 0); });
      },
      function (p, x, y, z) {   // xấp bao lì xì xoè quạt
        for (var i = 0; i < 4; i++) { var e = B(0.13, 0.2, 0.012, 0xd32f2f, x - 0.1 + i * 0.07, y + 0.11, z, p); e.rotation.z = 0.35 - i * 0.22; B(0.1, 0.03, 0.014, 0xffc83d, x - 0.1 + i * 0.07, y + 0.15, z + 0.002, p).rotation.z = 0.35 - i * 0.22; }
      },
      function (p, x, y, z) {   // bình hoa mai
        MS3D.cyl(0.07, 0.09, 0.2, 8, 0x3d7dd8, x, y + 0.1, z, p);
        [[-0.4, 0.34], [0.35, 0.3], [0, 0.42]].forEach(function (b) { var br = MS3D.cyl(0.012, 0.015, 0.4, 4, 0x6b3a1e, x + Math.sin(b[0]) * 0.1, y + 0.36, z, p); br.rotation.z = b[0]; });
        for (var i = 0; i < 8; i++) MS3D.ball(0.04, 0xffd02e, x + Math.sin(i * 2.4) * 0.18, y + 0.42 + (i % 3) * 0.09, z + Math.cos(i * 2.4) * 0.06, p, 0);
      },
      function (p, x, y, z) {   // dưa hấu
        var d = MS3D.ball(0.15, 0x2e7d32, x, y + 0.13, z, p, 1); d.scale.set(1, 0.85, 1.2);
        B(0.02, 0.2, 0.3, 0x1b5e20, x + 0.06, y + 0.13, z, p);
      },
      function (p, x, y, z) {   // chậu quất
        MS3D.cyl(0.1, 0.08, 0.13, 8, 0xc8643b, x, y + 0.07, z, p);
        MS3D.ball(0.17, 0x3f8a4e, x, y + 0.3, z, p, 0);
        for (var i = 0; i < 7; i++) MS3D.ball(0.035, 0xff8300, x + Math.sin(i * 2.1) * 0.16, y + 0.24 + (i % 3) * 0.08, z + Math.cos(i * 2.1) * 0.14, p, 0);
      }
    ],
    "trung-thu": [
      function (p, x, y, z) {   // chồng bánh nướng
        for (var i = 0; i < 3; i++) { MS3D.cyl(0.1, 0.1, 0.06, 10, 0xc98a3a, x + (i === 2 ? 0.02 : 0), y + 0.035 + i * 0.065, z, p); }
        MS3D.cyl(0.06, 0.06, 0.012, 10, 0xe6b46a, x + 0.02, y + 0.17, z, p);
      },
      function (p, x, y, z) {   // ấm trà + hai chén
        MS3D.ball(0.09, 0xf3efe7, x, y + 0.09, z, p, 1);
        var sp = MS3D.cyl(0.015, 0.02, 0.1, 5, 0xf3efe7, x + 0.1, y + 0.1, z, p); sp.rotation.z = -0.8;
        MS3D.cyl(0.03, 0.03, 0.02, 6, 0x3f8a4e, x, y + 0.18, z, p);
        [-0.17, 0.17].forEach(function (dx) { MS3D.cyl(0.04, 0.03, 0.05, 8, 0xf3efe7, x + dx, y + 0.03, z + 0.1, p); });
      },
      function (p, x, y, z) {   // bưởi
        [[0, 0], [0.16, 0.04]].forEach(function (o) { MS3D.ball(0.11, 0x9ccc65, x + o[0], y + 0.11, z + o[1], p, 1); });
        B(0.08, 0.02, 0.04, 0x3f8a4e, x, y + 0.23, z, p);
      },
      function (p, x, y, z) {   // mặt nạ giấy dựng nghiêng
        [[-0.1, 0xf48fb1], [0.12, 0xffc83d]].forEach(function (mk) {
          var g = new THREE.Group(); g.position.set(x + mk[0], y + 0.13, z); g.rotation.x = -0.25; p.add(g);
          B(0.17, 0.19, 0.03, mk[1], 0, 0, 0, g);
          B(0.04, 0.03, 0.01, 0x1b1b1b, -0.04, 0.03, 0.02, g); B(0.04, 0.03, 0.01, 0x1b1b1b, 0.04, 0.03, 0.02, g);
          B(0.06, 0.02, 0.01, 0xd32f2f, 0, -0.05, 0.02, g);
        });
      }
    ],
    halloween: [
      function (p, x, y, z) {   // bí ngô nhỏ
        [[0, 0, 0.12], [0.17, 0.05, 0.08]].forEach(function (b) { var pk = MS3D.ball(b[2], 0xff7a00, x + b[0], y + b[2] * 0.8, z + b[1], p, 1); pk.scale.y = 0.8; MS3D.cyl(0.015, 0.02, 0.06, 5, 0x3f8a4e, x + b[0], y + b[2] * 1.5, z + b[1], p); });
      },
      function (p, x, y, z) {   // xô kẹo hình bí ngô
        MS3D.cyl(0.11, 0.09, 0.15, 10, 0xff7a00, x, y + 0.08, z, p);
        B(0.03, 0.03, 0.01, 0x1b1b1b, x - 0.04, y + 0.1, z + 0.11, p); B(0.03, 0.03, 0.01, 0x1b1b1b, x + 0.04, y + 0.1, z + 0.11, p);
        [0xe53935, 0x7e57c2, 0x9ccc65, 0xffc83d].forEach(function (c, i) { MS3D.ball(0.035, c, x - 0.05 + (i % 2) * 0.1, y + 0.17, z - 0.03 + (i > 1 ? 0.06 : 0), p, 0); });
      },
      function (p, x, y, z) {   // mũ phù thuỷ
        MS3D.cyl(0.16, 0.16, 0.02, 12, 0x4a2f73, x, y + 0.01, z, p);
        var c = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 8), MS3D.mat(0x4a2f73)); c.position.set(x, y + 0.16, z); c.rotation.z = 0.15; p.add(c);
        MS3D.cyl(0.092, 0.092, 0.03, 8, 0xff7a00, x, y + 0.04, z, p);
      },
      function (p, x, y, z) {   // ma bông
        MS3D.ball(0.09, 0xf7f7fb, x, y + 0.2, z, p, 1);
        var b = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 8), MS3D.mat(0xf7f7fb)); b.position.set(x, y + 0.09, z); p.add(b);
        B(0.025, 0.035, 0.01, 0x1b1b1b, x - 0.03, y + 0.21, z + 0.085, p); B(0.025, 0.035, 0.01, 0x1b1b1b, x + 0.03, y + 0.21, z + 0.085, p);
      }
    ],
    "giang-sinh": [
      function (p, x, y, z) {   // hộp quà
        [[0, 0, 0.18, 0xe53935, 0xffc83d], [0.15, 0.06, 0.13, 0x2e7d32, 0xffffff]].forEach(function (q) {
          B(q[2], q[2], q[2], q[3], x + q[0], y + q[2] / 2, z + q[1], p);
          B(q[2] + 0.01, q[2] + 0.01, 0.03, q[4], x + q[0], y + q[2] / 2, z + q[1], p); B(0.03, q[2] + 0.01, q[2] + 0.01, q[4], x + q[0], y + q[2] / 2, z + q[1], p);
        });
      },
      function (p, x, y, z) {   // kẹo gậy cắm cốc
        MS3D.cyl(0.07, 0.06, 0.12, 8, 0xffffff, x, y + 0.06, z, p);
        [-0.03, 0.03].forEach(function (dx, i) {
          for (var k = 0; k < 4; k++) MS3D.cyl(0.015, 0.015, 0.05, 6, k % 2 ? 0xffffff : 0xe53935, x + dx, y + 0.14 + k * 0.05, z, p);
          var hk = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.015, 6, 8, Math.PI), MS3D.mat(0xe53935)); hk.position.set(x + dx + (i ? 0.035 : -0.035), y + 0.33, z); hk.rotation.y = i ? 0 : Math.PI; p.add(hk);
        });
      },
      function (p, x, y, z) {   // khay quả châu
        MS3D.cyl(0.2, 0.17, 0.04, 10, 0xc58a4f, x, y + 0.02, z, p);
        [[0, 0, 0xe53935], [0.09, 0.06, 0xffc83d], [-0.09, 0.05, 0x50b1b3], [0.04, -0.09, 0xffffff], [-0.06, -0.07, 0x2e7d32]].forEach(function (c) { MS3D.ball(0.05, c[2], x + c[0], y + 0.08, z + c[1], p, 1); });
      },
      function (p, x, y, z) {   // cây thông nhỏ
        var t = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 7), MS3D.mat(0x2e7d32)); t.position.set(x, y + 0.2, z); p.add(t);
        MS3D.cyl(0.05, 0.06, 0.06, 6, 0xc62828, x, y + 0.03, z, p);
        MS3D.ball(0.03, 0xffd02e, x, y + 0.37, z, p, 0);
      },
      function (p, x, y, z) {   // quả cầu tuyết
        B(0.18, 0.06, 0.18, 0x6b3a1e, x, y + 0.03, z, p);
        var gl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), new THREE.MeshLambertMaterial({ color: 0xdff3f2, transparent: true, opacity: 0.45 })); gl.position.set(x, y + 0.15, z); p.add(gl);
        var tr = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 6), MS3D.mat(0x2e7d32)); tr.position.set(x, y + 0.13, z); p.add(tr);
      }
    ]
  };
  function goods(grp, f, k, y, z) {
    var list = GOODS[f.id]; if (!list) return;
    [-0.6, 0, 0.6].forEach(function (x, j) {   // mỗi món trong một nhóm phóng to 1,3 lần cho dễ nhìn
      var g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(1.3); grp.add(g);
      list[(k * 3 + j) % list.length](g, 0, 0, 0);
    });
  }
  // đồ treo dưới mái gian hàng (3 món)
  function hangGoods(grp, f, k) {
    [-0.6, 0, 0.6].forEach(function (x, j) {
      if (f.id === "trung-thu") { if (j === 1) roundLantern(grp, x, 1.95, 0.9, [0xe53935, 0xffc83d][k % 2]).scale.setScalar(0.55); else { var st = starLantern(grp, x, 1.95, 0.9, j ? 0xffc83d : 0xe53935); st.scale.setScalar(0.4); } }
      else if (f.id === "tet") { B(0.012, 0.22, 0.012, 0xffc83d, x, 2.1, 0.9, grp); var e = B(0.14, 0.2, 0.02, 0xd32f2f, x, 1.9, 0.9, grp); e.rotation.z = (j - 1) * 0.15; B(0.08, 0.08, 0.022, 0xffc83d, x, 1.92, 0.9, grp); }
      else if (f.id === "halloween") { B(0.01, 0.25, 0.01, 0x333333, x, 2.08, 0.9, grp); MS3D.ball(0.05, 0x1b1b1b, x, 1.93, 0.9, grp, 0); var wl = B(0.14, 0.015, 0.07, 0x1b1b1b, x - 0.08, 1.95, 0.9, grp), wr = B(0.14, 0.015, 0.07, 0x1b1b1b, x + 0.08, 1.95, 0.9, grp); wl.rotation.z = 0.4; wr.rotation.z = -0.4; }
      else if (f.id === "giang-sinh") { B(0.01, 0.2, 0.01, 0x8a5a2e, x, 2.12, 0.9, grp); B(0.1, 0.16, 0.04, 0xd32f2f, x, 1.94, 0.9, grp); B(0.11, 0.05, 0.05, 0xffffff, x, 2.03, 0.9, grp); B(0.1, 0.06, 0.04, 0xd32f2f, x + 0.04, 1.85, 0.9, grp); }
    });
  }

  // bảng treo tường: diềm vải màu lễ + tua rua
  function banner(world, grp, p, rot, w, h, y, acc, k, f) {
    // bàn bày hàng nhỏ phía trước bảng tường
    MS3D.box(1.9, 0.68, 0.46, C_WOOD, 0, 0.34, 0.5, grp);
    MS3D.box(1.98, 0.05, 0.54, 0xfff1d6, 0, 0.7, 0.5, grp);
    MS3D.box(1.98, 0.16, 0.03, acc, 0, 0.6, 0.77, grp);
    goods(grp, f, k, 0.73, 0.5);
    var c = Math.cos(rot), sn = Math.sin(rot);
    [-0.6, 0, 0.6].forEach(function (x) { world.addCircle(p[0] + x * c + 0.5 * sn, p[1] - x * sn + 0.5 * c, 0.32); });
    MS3D.box(w + 0.5, 0.26, 0.12, acc, 0, y + h / 2 + 0.28, 0.04, grp);
    for (var i = 0; i < 7; i++) { var fr = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 4), MS3D.mat(acc)); fr.position.set(-(w + 0.3) / 2 + i * (w + 0.3) / 6, y + h / 2 + 0.08, 0.06); fr.rotation.x = Math.PI; grp.add(fr); }
    [-1, 1].forEach(function (sd) { MS3D.cyl(0.04, 0.04, 0.5, 5, 0xffc83d, sd * (w / 2 + 0.2), y - h / 2 + 0.05, 0.08, grp); MS3D.ball(0.07, 0xffc83d, sd * (w / 2 + 0.2), y - h / 2 + 0.33, 0.08, grp, 0); });
  }
  // dây cờ đuôi nheo + dây đèn giăng ngang phòng (nằm trong nhóm của lễ, đổi theo lễ)
  function festiveStrings(world, g, room, f) {
    var b = room.bounds, pal = palette(f), triGeo = new THREE.BufferGeometry();
    triGeo.setAttribute("position", new THREE.Float32BufferAttribute([-0.13, 0, 0, 0.13, 0, 0, 0, -0.3, 0], 3));
    triGeo.computeVertexNormals();
    var lines = [[b[2] + 2.6, 2.75, 0.55], [b[2] + 6.2, 2.85, 0.65], [b[2] + 9.6, 2.75, 0.5]];
    lines.forEach(function (L, li) {
      var n = 22;
      for (var i = 0; i <= n; i++) {
        var t = i / n, x = b[0] + 0.3 + t * (b[1] - b[0] - 0.6), y = L[1] - Math.sin(t * Math.PI) * L[2], z = L[0] + Math.sin(t * Math.PI * 2 + li) * 0.4;
        if (li === 1) {   // dây giữa: bóng đèn nhấp nháy
          var bm = new THREE.MeshBasicMaterial({ color: pal[i % pal.length] });
          var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), bm); bulb.position.set(x, y - 0.08, z); g.add(bulb);
          (function (bm, i) { world.updaters.push(function (dt, tt) { if (g.visible) bm.color.setHex(Math.sin(tt * 2.4 + i * 0.9) > -0.3 ? pal[i % pal.length] : 0x555555); }); })(bm, i);
        } else {
          var fl = new THREE.Mesh(triGeo, new THREE.MeshLambertMaterial({ color: pal[(i + li) % pal.length], side: THREE.DoubleSide }));
          fl.position.set(x, y, z); fl.rotation.y = 0.1 * Math.sin(i); g.add(fl);
        }
      }
    });
  }
  // vòng quay màu sau bục Đố vui
  function prizeWheel(world, g, x, z, f) {
    var c = document.createElement("canvas"); c.width = c.height = 128; var gg = c.getContext("2d"), pal = palette(f);
    for (var i = 0; i < 8; i++) { gg.fillStyle = "#" + ("000000" + pal[i % pal.length].toString(16)).slice(-6); gg.beginPath(); gg.moveTo(64, 64); gg.arc(64, 64, 62, i * Math.PI / 4, (i + 1) * Math.PI / 4); gg.fill(); }
    gg.fillStyle = "#fff7e6"; gg.beginPath(); gg.arc(64, 64, 12, 0, 7); gg.fill();
    MS3D.box(0.08, 1.9, 0.08, C_WOOD_DARK, x, 0.95, z + 0.45, g);
    var wh = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
    wh.position.set(x, 1.95, z + 0.4); wh.rotation.y = Math.PI; g.add(wh);
    var tick = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 3), MS3D.mat(0xffffff)); tick.position.set(x, 2.55, z + 0.38); tick.rotation.z = Math.PI; g.add(tick);
    world.updaters.push(function (dt, t) { if (g.visible) wh.rotation.z = t * 0.6; });
  }

  /* ---------- Dây hoa quanh tường + đồ treo theo lễ ---------- */
  function hangItem(g, f, x, y, z, k) {
    var pal = palette(f);
    if (f.id === "tet") { var l = roundLantern(g, x, y, z, 0xd32f2f); l.scale.setScalar(0.45); }
    else if (f.id === "trung-thu") { if (k % 2) { var st = starLantern(g, x, y, z, pal[k % pal.length]); st.scale.setScalar(0.35); } else { var rl = roundLantern(g, x, y, z, 0xffc83d); rl.scale.setScalar(0.4); } }
    else if (f.id === "halloween") {
      if (k % 2) { MS3D.ball(0.05, 0x1b1b1b, x, y, z, g, 0); var a = MS3D.box(0.16, 0.015, 0.07, 0x1b1b1b, x - 0.09, y + 0.02, z, g), bb = MS3D.box(0.16, 0.015, 0.07, 0x1b1b1b, x + 0.09, y + 0.02, z, g); a.rotation.z = 0.4; bb.rotation.z = -0.4; }
      else { var pk = m(new THREE.IcosahedronGeometry(0.12, 1), 0xff7a00, x, y, z, g, 0x552200); pk.scale.y = 0.8; }
    } else { m(new THREE.IcosahedronGeometry(0.09, 1), pal[k % pal.length], x, y, z, g, 0x222222); }
  }
  function festiveWalls(world, g, room, f) {
    var b = room.bounds, pal = palette(f), col = palette(f)[0];
    var runs = [[b[0] + 0.3, b[2] + 0.35, b[0] + 0.3, b[3] - 1.2], [b[1] - 0.3, b[2] + 0.35, b[1] - 0.3, b[3] - 1.2], [b[0] + 0.4, b[2] + 0.3, b[1] - 0.4, b[2] + 0.3]];
    runs.forEach(function (r, ri) {
      var len = Math.hypot(r[2] - r[0], r[3] - r[1]), n = Math.max(3, Math.round(len / 1.7));
      for (var i = 0; i < n; i++) {   // mỗi nhịp dây võng xuống, đồ treo ở điểm thấp nhất
        for (var j = 0; j < 6; j++) {
          var t = (i + j / 6) / n, x = r[0] + (r[2] - r[0]) * t, z = r[1] + (r[3] - r[1]) * t, y = 2.5 - Math.sin(j / 6 * Math.PI) * 0.3;
          MS3D.ball(0.045, j % 2 ? col : 0x3f8a4e, x, y, z, g, 0);
        }
        var tm = (i + 0.5) / n;
        hangItem(g, f, r[0] + (r[2] - r[0]) * tm, 1.95, r[1] + (r[3] - r[1]) * tm, i + ri);
      }
    });
  }

  /* ---------- Điểm nhấn giữa phòng, mỗi lễ một món (bấm được) ---------- */
  function centerpiece(world, g, room, f) {
    var b = room.bounds, cx = (b[0] + b[1]) / 2, cz = b[2] + 5.4, it = null;
    if (f.id === "tet") {   // ông đồ cho chữ: chiếu, án thư, giá treo chữ đỏ
      MS3D.box(1.8, 0.02, 1.2, 0xe8d6a0, cx, 0.03, cz, g);
      MS3D.box(1.2, 0.35, 0.55, 0x6b3a1e, cx, 0.18, cz, g);
      var paper = MS3D.box(0.5, 0.01, 0.34, 0xd32f2f, cx - 0.2, 0.36, cz, g); void paper;
      MS3D.cyl(0.07, 0.07, 0.03, 10, 0x1b1b1b, cx + 0.35, 0.37, cz - 0.1, g);
      var brush = MS3D.cyl(0.012, 0.02, 0.3, 5, 0x8a5a2e, cx + 0.3, 0.4, cz + 0.12, g); brush.rotation.z = 1.3;
      [-0.85, 0.85].forEach(function (dx) { MS3D.cyl(0.03, 0.03, 1.7, 5, 0x6b3a1e, cx + dx, 0.85, cz - 0.55, g); });
      MS3D.cyl(0.025, 0.025, 1.8, 5, 0x6b3a1e, cx, 1.7, cz - 0.55, g).rotation.z = Math.PI / 2;
      ["Học", "Tâm", "Nhẫn"].forEach(function (w, i) {
        var c = document.createElement("canvas"); c.width = 64; c.height = 128; var gg = c.getContext("2d");
        gg.fillStyle = "#c62828"; gg.fillRect(0, 0, 64, 128); gg.strokeStyle = "#ffd02e"; gg.lineWidth = 3; gg.strokeRect(4, 4, 56, 120);
        gg.fillStyle = "#1b1b1b"; gg.font = "700 26px 'Baloo 2', serif"; gg.textAlign = "center"; gg.textBaseline = "middle"; gg.fillText(w, 32, 64);
        var sc = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.68), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), side: THREE.DoubleSide }));
        sc.position.set(cx - 0.55 + i * 0.55, 1.3, cz - 0.55); g.add(sc);
      });
      world.addBox(cx - 0.9, cx + 0.9, cz - 0.65, cz + 0.3);
      it = { kind: "toast", label: "Xin chữ", sub: "Ông đồ cho chữ ngày Tết", texts: [
        "Con xin được chữ “Học”: học một biết mười, học đâu nhớ đó!", "Con xin được chữ “Tâm”: sống tử tế, nghĩ điều hay.",
        "Con xin được chữ “Nhẫn”: một điều nhịn, chín điều lành.", "Con xin được chữ “Phúc”: năm mới an vui bên gia đình.", "Con xin được chữ “Chí”: có chí thì nên!"] };
    } else if (f.id === "trung-thu") {   // đầu lân + trống
      var lion = new THREE.Group(); lion.position.set(cx - 0.4, 0, cz); g.add(lion);
      MS3D.cyl(0.05, 0.06, 0.7, 6, 0x6b3a1e, 0, 0.35, 0, lion);
      var head = new THREE.Group(); head.position.y = 0.95; lion.add(head);
      MS3D.box(0.8, 0.6, 0.7, 0xd32f2f, 0, 0, 0, head);
      MS3D.box(0.84, 0.16, 0.74, 0xffc83d, 0, 0.3, 0, head);
      MS3D.box(0.6, 0.14, 0.1, 0xffffff, 0, -0.18, 0.36, head);
      [-0.2, 0.2].forEach(function (dx) { MS3D.ball(0.1, 0xffffff, dx, 0.08, 0.36, head, 1); MS3D.ball(0.05, 0x1b1b1b, dx, 0.08, 0.44, head, 0); });
      var horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 6), MS3D.mat(0xffc83d)); horn.position.set(0, 0.48, 0.1); head.add(horn);
      for (var fr = 0; fr < 6; fr++) MS3D.box(0.1, 0.3, 0.05, [0xffc83d, 0x3f8a4e, 0x50b1b3][fr % 3], -0.35 + fr * 0.14, -0.38, -0.36, head);
      var drum = MS3D.cyl(0.32, 0.32, 0.45, 14, 0xc62828, cx + 0.8, 0.3, cz + 0.1, g); void drum;
      MS3D.cyl(0.33, 0.33, 0.04, 14, 0xf3e2c4, cx + 0.8, 0.54, cz + 0.1, g);
      world.addCircle(cx - 0.4, cz, 0.5); world.addCircle(cx + 0.8, cz + 0.1, 0.35);
      var dance = 0;
      world.updaters.push(function (dt, t) { if (dance > 0) { dance -= dt; head.rotation.z = Math.sin(t * 9) * 0.3; head.position.y = 0.95 + Math.abs(Math.sin(t * 9)) * 0.15; } else { head.rotation.z = 0; head.position.y = 0.95; } });
      it = { kind: "toast", label: "Múa lân", sub: "Đầu lân và trống Trung thu", onUse: function () { dance = 3; }, texts: [
        "Tùng tùng cắc! Lân ra múa chúc Trung thu vui vẻ!", "Lân lắc đầu, lân gật gù, chúc con học giỏi chăm ngoan!", "Tùng cắc tùng! Rước đèn ông sao đi khắp xóm nào!"] };
    } else if (f.id === "halloween") {   // bí ngô khổng lồ phát sáng + bát kẹo
      var big = m(new THREE.IcosahedronGeometry(0.75, 1), 0xff7a00, cx, 0.62, cz, g, 0x552200); big.scale.y = 0.8;
      MS3D.cyl(0.08, 0.1, 0.3, 6, 0x3f8a4e, cx, 1.3, cz, g);
      var glowM = new THREE.MeshBasicMaterial({ color: 0xffe066 });
      [[-0.25, 0.75], [0.25, 0.75]].forEach(function (e) { var tr = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.16, 3), glowM); tr.position.set(cx + e[0], e[1], cz + 0.7); tr.rotation.x = Math.PI / 2; g.add(tr); });
      var mouth = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.05), glowM); mouth.position.set(cx, 0.48, cz + 0.72); g.add(mouth);
      world.updaters.push(function (dt, t) { if (g.visible) glowM.color.setHSL(0.13, 1, 0.55 + Math.sin(t * 3) * 0.1); });
      MS3D.cyl(0.25, 0.18, 0.12, 10, 0x7e57c2, cx + 1.1, 0.06, cz + 0.4, g);
      [0xe53935, 0xffc83d, 0x9ccc65, 0x50b1b3].forEach(function (c, i) { MS3D.ball(0.05, c, cx + 1.05 + (i % 2) * 0.1, 0.15, cz + 0.35 + (i > 1 ? 0.1 : 0), g, 0); });
      world.addCircle(cx, cz, 0.8);
      it = { kind: "toast", label: "Xin kẹo", sub: "Bí ngô khổng lồ", texts: [
        "Trick or treat! Con nhận được một viên kẹo chữ “Dũng cảm”.", "Bí ngô cười hì hì: kẹo hôm nay vị “Tò mò”, ăn vào là muốn đọc sách!", "Kẹo của con là chữ “Sáng tạo”. Hù!"] };
    } else if (f.id === "giang-sinh") {   // xe trượt tuyết chở bao quà
      var sl = new THREE.Group(); sl.position.set(cx, 0, cz); g.add(sl);
      [-0.35, 0.35].forEach(function (dz) { MS3D.box(1.6, 0.05, 0.06, 0xd4a017, 0, 0.05, dz, sl); MS3D.box(0.06, 0.25, 0.06, 0xd4a017, -0.5, 0.17, dz, sl); MS3D.box(0.06, 0.25, 0.06, 0xd4a017, 0.5, 0.17, dz, sl); });
      MS3D.box(1.3, 0.35, 0.8, 0xc62828, 0, 0.45, 0, sl); MS3D.box(0.3, 0.55, 0.8, 0xc62828, -0.55, 0.6, 0, sl);
      MS3D.box(1.32, 0.06, 0.82, 0xffc83d, 0, 0.64, 0, sl);
      var sack = MS3D.ball(0.42, 0x8a5a2e, 0.25, 0.95, 0, sl, 1); sack.scale.set(1, 1.1, 0.9);
      [[0.0, 1.35, 0xe53935], [0.4, 1.3, 0x50b1b3], [0.2, 1.42, 0xffc83d]].forEach(function (q) { MS3D.box(0.2, 0.2, 0.2, q[2], q[0], q[1], 0, sl); });
      world.addBox(cx - 0.85, cx + 0.85, cz - 0.45, cz + 0.45);
      var books = (MS3D.BOOKS || []).map(function (bk) { return "Quà của con là cuốn “" + bk.title + "”. Ghé Không gian đọc tìm đọc nhé!"; });
      it = { kind: "toast", label: "Mở quà", sub: "Xe trượt tuyết chở quà", texts: books.length ? books : ["Quà của con là một cuốn sách hay ở Không gian đọc!"] };
    }
    if (!it) return;
    it.x = cx; it.z = cz + 1.3; it.r = 1.3; it.room = "le-hoi"; it.festival = f.id;
    world.interactables.push(it);
    world.pickArea(cx, 0.8, cz, 1.8, 1.6, 1.2, g, it);
  }

  function group(p, x, z, s) { var g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s || 1); p.add(g); return g; }

  /* Đồ trang trí từng lễ: đặt ở giữa phòng và các góc, chừa chỗ cho 6 gian hàng. */
  var FESTIVAL_BUILD = {
    tet: function (world, g, room) {
      var P = function (x, z) { return rel(room, x, z); };
      var a = P(1.5, 1.5), d = P(12.5, 1.5);
      blossomTree(group(g, a[0], a[1], 0.8), 0, 0, 0xffd02e);   // cây mai vàng
      blossomTree(group(g, d[0], d[1], 0.8), 0, 0, 0xf48fb1);   // cây đào hồng
      for (var i = 0; i < 6; i++) MS3D.box(0.1, 0.15, 0.03, 0xd32f2f, a[0] + Math.cos(i) * 0.5, 1.25 + (i % 3) * 0.16, a[1] + Math.sin(i) * 0.3 + 0.35, g);
      world.addCircle(a[0], a[1], 0.4); world.addCircle(d[0], d[1], 0.4);
      var t = P(7, 1.6);
      var s = MS3D.label("Chúc Mừng Năm Mới", { size: 0.42, bg: "#c62828", fg: "#ffd02e" }); s.position.set(t[0], 3.0, room.bounds[2] + 0.35); g.add(s);
      MS3D.box(2.6, 0.7, 1.0, 0x8a1c1c, t[0], 0.35, t[1], g);
      [-0.8, -0.3].forEach(function (dx) {
        MS3D.box(0.42, 0.24, 0.42, 0x3f8a4e, t[0] + dx, 0.82, t[1], g);
        MS3D.box(0.44, 0.25, 0.03, 0xe8d6a0, t[0] + dx, 0.82, t[1], g); MS3D.box(0.03, 0.25, 0.44, 0xe8d6a0, t[0] + dx, 0.82, t[1], g);
      });
      MS3D.cyl(0.42, 0.3, 0.08, 12, 0xffc83d, t[0] + 0.6, 0.74, t[1], g);
      [[0, 0x6cbf5a, 0.2], [0.18, 0xffd02e, 0.14], [-0.18, 0xff8300, 0.14], [0.05, 0xe53935, 0.12], [-0.06, 0x9ccc65, 0.12]].forEach(function (f, k) {
        MS3D.ball(f[2], f[1], t[0] + 0.6 + f[0], 0.92 + (k ? 0.04 : 0.08), t[1] + (k % 2 ? 0.12 : -0.08), g, 1);
      });
      world.addBox(t[0] - 1.3, t[0] + 1.3, t[1] - 0.5, t[1] + 0.5);
      [P(5, 5), P(9, 5)].forEach(function (p) { stand(g, p[0], p[1], 2.4); roundLantern(g, p[0] + 0.25, 1.85, p[1], 0xe53935); world.addCircle(p[0], p[1], 0.12); });
    },
    "trung-thu": function (world, g, room) {
      var P = function (x, z) { return rel(room, x, z); }, c = P(7, 0.2);
      var moon = m(new THREE.CylinderGeometry(1.6, 1.6, 0.1, 28), 0xfff3c4, c[0], 3.3, c[1], g, 0x8a7a40); moon.rotation.x = Math.PI / 2;
      var t = P(7, 1.6);
      MS3D.box(2.4, 0.6, 1.0, 0x6b3a1e, t[0], 0.3, t[1], g);
      [-0.6, 0, 0.6].forEach(function (dx) { MS3D.cyl(0.24, 0.24, 0.14, 12, 0xc98a3a, t[0] + dx, 0.67, t[1], g); MS3D.cyl(0.14, 0.14, 0.15, 8, 0xa8692a, t[0] + dx, 0.68, t[1], g); });
      world.addBox(t[0] - 1.2, t[0] + 1.2, t[1] - 0.5, t[1] + 0.5);
      if (MS3D.makeCharacter) { var r = P(5.0, 2.4), rab = MS3D.makeCharacter("tho"); rab.scale.setScalar(0.7); rab.position.set(r[0], 0, r[1]); rab.rotation.y = Math.PI; g.add(rab); world.addCircle(r[0], r[1], 0.3); }
      [[P(4.6, 5.4), 0xe53935], [P(9.4, 5.4), 0xffc83d]].forEach(function (q, k) {
        var l = starLantern(g, q[0][0], 1.9, q[0][1], q[1]);
        world.updaters.push(function (dt, tt) { if (g.visible) l.rotation.z = Math.sin(tt * 1.5 + k) * 0.15; });
      });
      [P(1.5, 1.4), P(12.5, 1.4)].forEach(function (p) { stand(g, p[0], p[1], 2.4); roundLantern(g, p[0] + 0.25, 1.85, p[1], 0xff8300); world.addCircle(p[0], p[1], 0.12); });
      var s = MS3D.label("Trung Thu Vui Vẻ", { size: 0.42, bg: "#253a6e", fg: "#ffd02e" }); s.position.set(c[0], 5.3, c[1] + 0.1); g.add(s);
    },
    halloween: function (world, g, room) {
      var P = function (x, z) { return rel(room, x, z); };
      function pumpkin(p, s) {
        var pg = group(g, p[0], p[1], s);
        var body = m(new THREE.IcosahedronGeometry(0.42, 1), 0xff7a00, 0, 0.36, 0, pg, 0x552200); body.scale.y = 0.8;
        MS3D.cyl(0.05, 0.06, 0.18, 5, 0x3f8a4e, 0, 0.74, 0, pg);
        [-0.14, 0.14].forEach(function (dx) { var e = m(new THREE.ConeGeometry(0.07, 0.1, 3), 0x1b1b1b, dx, 0.44, 0.38, pg); e.rotation.x = Math.PI / 2; });
        MS3D.box(0.3, 0.06, 0.04, 0x1b1b1b, 0, 0.26, 0.39, pg);
        world.addCircle(p[0], p[1], 0.4 * s);
      }
      pumpkin(P(1.4, 1.3), 1.1); pumpkin(P(12.6, 1.3), 1.0); pumpkin(P(5.3, 1.8), 0.8); pumpkin(P(8.8, 1.7), 0.9);
      var cd = P(7, 2.2);
      MS3D.cyl(0.6, 0.45, 0.7, 10, 0x222222, cd[0], 0.35, cd[1], g);
      m(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 10), 0x7cff6b, cd[0], 0.68, cd[1], g, 0x2a8a20);
      world.addCircle(cd[0], cd[1], 0.6);
      var ctr = P(7, 5.2);
      [0, 2.1, 4.2].forEach(function (ph, k) {
        var gh = new THREE.Group(); g.add(gh);
        var c = m(new THREE.ConeGeometry(0.35, 0.8, 8), 0xf7f7fb, 0, 0, 0, gh); c.rotation.x = Math.PI; void c;
        MS3D.ball(0.33, 0xf7f7fb, 0, 0.32, 0, gh, 1);
        MS3D.box(0.07, 0.1, 0.02, 0x1b1b1b, -0.1, 0.38, 0.31, gh); MS3D.box(0.07, 0.1, 0.02, 0x1b1b1b, 0.1, 0.38, 0.31, gh);
        world.updaters.push(function (dt, t) { if (!g.visible) return; var a = t * 0.4 + ph; gh.position.set(ctr[0] + Math.cos(a) * 2.6, 2.0 + Math.sin(t * 2 + k) * 0.2, ctr[1] + Math.sin(a) * 1.6); });
      });
      for (var i = 0; i < 4; i++) (function (i) {
        var bat = new THREE.Group(); g.add(bat);
        MS3D.ball(0.1, 0x1b1b1b, 0, 0, 0, bat, 0);
        var wl = MS3D.box(0.3, 0.02, 0.14, 0x1b1b1b, -0.18, 0, 0, bat), wr = MS3D.box(0.3, 0.02, 0.14, 0x1b1b1b, 0.18, 0, 0, bat);
        world.updaters.push(function (dt, t) {
          if (!g.visible) return;
          var a = t * 0.8 + i * 1.6; bat.position.set(ctr[0] + Math.cos(a) * 3.6, 2.9 + Math.sin(t * 2 + i) * 0.3, ctr[1] - 1 + Math.sin(a) * 2.6);
          wl.rotation.z = Math.sin(t * 14 + i) * 0.6; wr.rotation.z = -wl.rotation.z;
        });
      })(i);
      var s = MS3D.label("Lễ hội Halloween", { size: 0.42, bg: "#3b2a4f", fg: "#ff8300" }); s.position.set(ctr[0], 3.0, room.bounds[2] + 0.35); g.add(s);
    },
    "giang-sinh": function (world, g, room) {
      var P = function (x, z) { return rel(room, x, z); }, tr = P(7, 2.4), cx = tr[0], tz = tr[1];
      MS3D.cyl(0.18, 0.22, 0.5, 6, 0x6b3a1e, cx, 0.25, tz, g);
      [[1.4, 1.4, 0.95], [1.1, 1.2, 1.75], [0.8, 1.0, 2.45]].forEach(function (c) { m(new THREE.ConeGeometry(c[0], c[1], 9), 0x2e7d32, cx, c[2], tz, g); });
      var cols = [0xe53935, 0xffc83d, 0x50b1b3, 0xff8300, 0xffffff];
      for (var i = 0; i < 18; i++) { var a = i * 2.2, h = 0.7 + (i % 6) * 0.36, r = 1.18 - (h - 0.7) * 0.42; MS3D.ball(0.08, cols[i % 5], cx + Math.cos(a) * r, h, tz + Math.sin(a) * r, g, 0); }
      var star = m(new THREE.ExtrudeGeometry(MS3D.starShape(0.3, 0.13), { depth: 0.08, bevelEnabled: false }), 0xffd02e, cx, 3.15, tz - 0.04, g, 0x886600);
      world.updaters.push(function (dt, t) { if (g.visible) star.rotation.y = Math.sin(t) * 0.4; });
      world.addCircle(cx, tz, 1.05);
      [[-1.5, 0.7, 0xe53935, 0xffc83d], [1.5, 0.6, 0x50b1b3, 0xffffff], [1.0, 1.4, 0xff8300, 0x1d6b6d], [-1.0, 1.5, 0xffc83d, 0xe53935]].forEach(function (q) {
        var sz = 0.45 + (q[1] % 0.3); MS3D.box(sz, sz, sz, q[2], cx + q[0], sz / 2, tz + q[1], g);
        MS3D.box(sz + 0.02, sz + 0.02, 0.08, q[3], cx + q[0], sz / 2, tz + q[1], g); MS3D.box(0.08, sz + 0.02, sz + 0.02, q[3], cx + q[0], sz / 2, tz + q[1], g);
        world.addCircle(cx + q[0], tz + q[1], sz * 0.6);
      });
      var sm = P(12.4, 1.5), sx = sm[0], sz2 = sm[1];
      MS3D.ball(0.5, 0xffffff, sx, 0.45, sz2, g, 1); MS3D.ball(0.36, 0xffffff, sx, 1.12, sz2, g, 1); MS3D.ball(0.26, 0xffffff, sx, 1.6, sz2, g, 1);
      var nose = m(new THREE.ConeGeometry(0.05, 0.22, 5), 0xff7a1a, sx, 1.6, sz2 + 0.3, g); nose.rotation.x = Math.PI / 2;
      MS3D.box(0.05, 0.05, 0.02, 0x1b1b1b, sx - 0.09, 1.68, sz2 + 0.24, g); MS3D.box(0.05, 0.05, 0.02, 0x1b1b1b, sx + 0.09, 1.68, sz2 + 0.24, g);
      MS3D.cyl(0.3, 0.32, 0.1, 10, 0xff8300, sx, 1.4, sz2, g);
      world.addCircle(sx, sz2, 0.5);
      var b = room.bounds;
      var snow = snowPoints(g, [b[0] + 0.5, b[1] - 0.5, b[2] + 0.5, b[3] - 0.5], 0xffffff, 160);
      world.updaters.push(function (dt, t) { if (g.visible) snow.userData.fall(dt, t, 0.8, 0.3); });
      var s = MS3D.label("Giáng Sinh An Lành", { size: 0.42, bg: "#2e7d32", fg: "#ffffff" }); s.position.set(cx, 3.9, b[2] + 0.35); g.add(s);
    }
  };

  /* Dựng phòng lễ hội: mỗi lễ là một nhóm (trang trí + 6 gian hàng + đố vui + góc viết), chỉ hiện nhóm đang chọn. */
  MS3D.buildFestivalRoom = function (world, room) {
    var groups = {};
    var floor = world.festivalFloor;
    MS3D.FESTIVALS.forEach(function (f) {
      var g = new THREE.Group(); g.visible = false; world.scene.add(g); groups[f.id] = g;
      var before = world.colliders.length;
      (FESTIVAL_BUILD[f.id] || function () {})(world, g, room);
      buildStations(world, g, room, f);
      festiveStrings(world, g, room, f);
      festiveWalls(world, g, room, f);
      centerpiece(world, g, room, f);
      // va chạm của từng lễ chỉ bật khi lễ đó đang hiện
      g.userData.colliders = world.colliders.splice(before, world.colliders.length - before);
    });
    var current = null;
    world.setFestival = function (id) {
      var f = MS3D.getFestival(id);
      if (current) { groups[current].visible = false; groups[current].userData.colliders.forEach(function (c) { var i = world.colliders.indexOf(c); if (i >= 0) world.colliders.splice(i, 1); }); }
      current = f.id; groups[f.id].visible = true;
      Array.prototype.push.apply(world.colliders, groups[f.id].userData.colliders);
      if (floor) floor.material.color.setHex(f.floor);
      world.festival = f.id;
      return f;
    };
  };

  /* ---------- BỐN MÙA CHO VƯỜN ----------
     leaf/leaf2: màu tán cây; bloom: hoa trên cây (null = không có); grass: cỏ ban ngày;
     fall: hạt rơi (cánh hoa, lá, tuyết) hoặc null. */
  MS3D.SEASONS = [
    { id: "xuan", name: "Xuân", leaf: 0x6cbf5a, leaf2: 0x8fd16f, bloom: 0xf8a5c2, grass: 0x9bd67f, flowers: true,  fall: { color: 0xffc1d6, speed: 0.5 }, greet: "Mùa xuân: hoa đào nở, cùng đọc thơ xuân nhé." },
    { id: "he",   name: "Hạ",   leaf: 0x3f8a4e, leaf2: 0x4f9d58, bloom: 0xe53935, grass: 0x7cc35a, flowers: true,  fall: null, greet: "Mùa hạ: hoa phượng đỏ rực, nghỉ hè đọc truyện thôi." },
    { id: "thu",  name: "Thu",  leaf: 0xe8892b, leaf2: 0xf2b134, bloom: null,     grass: 0xb5c46a, flowers: false, fall: { color: 0xe8892b, speed: 0.45 }, greet: "Mùa thu: lá vàng rơi, mùa tựu trường đến rồi." },
    { id: "dong", name: "Đông", leaf: 0x7c9a8a, leaf2: 0x93ad9f, bloom: null,     grass: 0xa8b8a8, flowers: false, fall: { color: 0xffffff, speed: 0.7 }, greet: "Mùa đông: trời se lạnh, cuộn tròn đọc sách là nhất." }
  ];
  MS3D.seasonForDate = function (d) {
    var mth = (d || new Date()).getMonth() + 1;
    if (mth >= 2 && mth <= 4) return "xuan";
    if (mth >= 5 && mth <= 7) return "he";
    if (mth >= 8 && mth <= 10) return "thu";
    return "dong";
  };
  MS3D.getSeason = function (id) {
    for (var i = 0; i < MS3D.SEASONS.length; i++) if (MS3D.SEASONS[i].id === id) return MS3D.SEASONS[i];
    return MS3D.SEASONS[2];
  };
})();
