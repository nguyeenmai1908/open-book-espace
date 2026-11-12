/* ==========================================================
   SẢNH 3D MỞ SÁCH — doc-room.js: KHÔNG GIAN ĐỌC
   Tường bắc: tủ Kinh điển Đông – Tây (thấy rõ gáy sách) + bảng "Sách đọc nhiều nhất tháng".
   Giữa phòng: bục trưng bày từng kệ (truyện cổ tích, sách tranh), thảm tròn + ghế lười.
   Phía nam: bàn đọc có đèn, bình nước. Cây lô hội + monstera của cô Vi ở các góc.
   Thư viện ấm cúng (thêm 22/10/2026): thêm tủ sách cao ở tường tây, thảm hoa văn, góc ghế bành có đèn cây,
   quả địa cầu, đèn tường, tranh khẩu hiệu đọc sách.
   NPC: cô Vi đi tưới cây, bạn Minh đi tìm sách, bạn Thảo ngồi đọc.
   Dữ liệu: sách ở assets/sach/thu-vien.js (MS_BOOKS, MS_SHELVES, MS_TOP_BOOKS).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  var C = MS3D.COLORS;
  var FILLER = [0x9b6b43, 0x6f8f7a, 0xb88a5a, 0x7a6a8e, 0x5f7f8f, 0xa86b5a, 0x8a8a5f];

  function fillerBooks(parent, x0, x1, y, hMax, k0) {
    var bx = x0, k = k0 || 0;
    while (bx < x1 - 0.1) {
      var bw = 0.09 + ((k * 37) % 4) * 0.025, bh = hMax * (0.72 + ((k * 13) % 4) * 0.08);
      MS3D.box(bw, bh, 0.34, FILLER[k % FILLER.length], bx + bw / 2, y + bh / 2, 0.02, parent);
      bx += bw + 0.015; k++;
    }
  }

  /* Tủ kinh điển: hàng giữa là gáy sách thật (chạm để mở), hàng trên/dưới là sách trang trí. */
  function classicCase(world, x, z, books, zone, h) {
    var W = 7.2, H = 2.35, D = 0.5;
    var g = new THREE.Group(); g.position.set(x, 0, z); world.scene.add(g);
    MS3D.box(W, H, 0.06, C.woodDark, 0, H / 2, -D / 2 + 0.03, g);                       // lưng tủ
    [-W / 2, 0, W / 2].forEach(function (sx) { MS3D.box(0.1, H, D, C.woodDark, sx, H / 2, 0, g); });
    [0.05, 0.78, 1.9, H].forEach(function (y) { MS3D.box(W, 0.07, D, C.wood, 0, y, 0, g); });
    MS3D.box(W + 0.2, 0.12, D + 0.1, C.woodDark, 0, H + 0.06, 0, g);
    fillerBooks(g, -W / 2 + 0.1, -0.05, 0.09, 0.6, 1);
    fillerBooks(g, 0.05, W / 2 - 0.1, 0.09, 0.6, 5);
    fillerBooks(g, -W / 2 + 0.1, -1.0, 1.94, 0.34, 3);
    fillerBooks(g, 1.0, W / 2 - 0.1, 1.94, 0.34, 7);
    // gáy sách kinh điển: phương Đông nửa trái, phương Tây nửa phải
    var pageMat = MS3D.mat(0xf6ecd6);
    ["dong", "tay"].forEach(function (side, si) {
      var list = books.filter(function (b) { return b.side === side; }).slice(0, 6);
      var sw = 0.46, gap = 0.04, total = list.length * (sw + gap) - gap;
      var start = (si ? W / 4 : -W / 4) - total / 2;
      list.forEach(function (bk, i) {
        var tex = new THREE.CanvasTexture(MS3D.drawSpine(bk, document.createElement("canvas")));
        tex.anisotropy = 4;
        var col = MS3D.mat(new THREE.Color(bk.color).getHex());
        var hh = 0.96 + ((i * 7) % 3) * 0.04;
        var sp = new THREE.Mesh(new THREE.BoxGeometry(sw, hh, 0.4), [col, col, pageMat, pageMat, new THREE.MeshLambertMaterial({ map: tex }), col]);
        sp.position.set(start + i * (sw + gap) + sw / 2, 0.815 + hh / 2, 0.03);
        g.add(sp);
        world.pick(sp, { kind: "book", book: bk.id, label: "Chọn sách", sub: bk.title, room: zone.id });
      });
      // giá chặn sách
      MS3D.box(0.04, 0.5, 0.3, C.orange, start - 0.08, 1.07, 0.02, g);
      MS3D.box(0.04, 0.5, 0.3, C.orange, start + total + 0.08, 1.07, 0.02, g);
      h.sign(world, si ? "Phương Tây" : "Phương Đông", x + (si ? W / 4 : -W / 4), 2.12, z + 0.4, { size: 0.22, bg: si ? "#1d3557" : "#8e1b1b", fg: "#fff6ea" });
    });
    h.sign(world, "Kinh điển Đông – Tây", x, 2.82, z + 0.3, { size: 0.32, bg: "#ffc83d", fg: "#1f1406" });
    world.addBox(x - W / 2 - 0.1, x + W / 2 + 0.1, z - D / 2, z + D / 2);
    MS3D.shadow(g);
    var it = { kind: "classics", x: x, z: z + 1.5, r: 2.2, label: "Tủ kinh điển", sub: books.length + " tác phẩm Đông – Tây · chạm gáy sách để chọn", room: zone.id };
    world.interactables.push(it);
    h.place(world, "tu-kinh-dien", "Tủ sách Kinh điển Đông – Tây", zone.id, x, z + 1.8);
  }

  /* Bảng xếp hạng sách đọc nhiều nhất tháng (số liệu ở MS_TOP_BOOKS). */
  function topBoard(world, x, z, zone, h) {
    var data = window.MS_TOP_BOOKS || { list: [] };
    var c = document.createElement("canvas"); c.width = 600; c.height = 360; var g = c.getContext("2d");
    g.fillStyle = "#1d6b6d"; g.fillRect(0, 0, 600, 360);
    g.fillStyle = "#ffc83d"; g.font = "800 34px 'Baloo 2', sans-serif"; g.textBaseline = "middle"; g.textAlign = "left";
    g.fillText((window.MS && MS.tr ? MS.tr("Đọc nhiều nhất tháng") : "Đọc nhiều nhất tháng"), 24, 34);
    g.fillStyle = "#dff3f2"; g.font = "600 20px 'Be Vietnam Pro', sans-serif"; g.textAlign = "right";
    g.fillText((window.MS && MS.tr ? MS.tr(data.month || "") : data.month || ""), 576, 36);
    var max = Math.max.apply(null, data.list.map(function (r) { return r.reads; }).concat([1]));
    var MEDAL = ["#ffc83d", "#cfd8dc", "#e0a06a", "#50b1b3", "#50b1b3"];
    data.list.slice(0, 5).forEach(function (r, i) {
      var bk = MS3D.getBook(r.id), y = 84 + i * 54;
      g.fillStyle = MEDAL[i]; g.beginPath(); g.arc(46, y + 6, 19, 0, 7); g.fill();
      g.fillStyle = "#1f1406"; g.font = "800 22px 'Baloo 2', sans-serif"; g.textAlign = "center"; g.fillText(String(i + 1), 46, y + 8);
      g.textAlign = "left"; g.fillStyle = "#ffffff"; g.font = "700 22px 'Be Vietnam Pro', sans-serif";
      g.fillText(bk ? bk.title : r.id, 80, y - 6);
      g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(80, y + 12, 400, 10);
      g.fillStyle = "#ff8300"; g.fillRect(80, y + 12, 400 * r.reads / max, 10);
      g.fillStyle = "#dff3f2"; g.font = "600 18px 'Be Vietnam Pro', sans-serif"; g.textAlign = "right"; g.fillText((window.MS && MS.tr ? MS.tr(r.reads + " lượt") : r.reads + " lượt"), 576, y + 16);
    });
    if (data.demo) { g.fillStyle = "rgba(255,255,255,.7)"; g.font = "500 15px 'Be Vietnam Pro', sans-serif"; g.textAlign = "right"; g.fillText((window.MS && MS.tr ? MS.tr("số liệu minh hoạ") : "số liệu minh hoạ"), 576, 346); }
    var tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
    MS3D.box(3.6, 2.25, 0.1, 0xd4a017, x, 1.5, z, world.scene);
    var b = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.04), new THREE.MeshBasicMaterial({ map: tex }));
    b.position.set(x, 1.5, z + 0.06); world.scene.add(b);
    MS3D.cyl(0.07, 0.07, 0.08, 10, C.orange, x, 2.75, z + 0.05, world.scene).rotation.x = Math.PI / 2;
    var it = { kind: "topbooks", x: x, z: z + 1.5, r: 1.6, label: "Xem bảng xếp hạng", sub: "Sách đọc nhiều nhất " + (data.month || "tháng").toLowerCase(), room: zone.id };
    world.interactables.push(it);
    world.pick(b, it);
    h.place(world, "top-sach", "Bảng sách đọc nhiều nhất tháng", zone.id, x, z + 1.8);
  }

  // điểm đứng cách cây 0.95 về phía (sx, sz), mặt quay vào cây
  MS3D.waterStop = waterStop;   // rooms.js dùng cho lộ trình cô Vi ở các phòng khác
  function waterStop(plant, sx, sz) {
    var px = plant.position.x, pz = plant.position.z, dx = sx - px, dz = sz - pz, L = Math.hypot(dx, dz) || 1;
    var x = px + dx / L * 0.95, z = pz + dz / L * 0.95;
    return { x: x, z: z, wait: 3.2, plant: plant, face: Math.atan2(-(px - x), -(pz - z)) };
  }

  /* Thư viện ấm cúng: tủ sách cao (tường tây), thảm hoa văn, góc ghế bành, quả địa cầu, đèn tường, tranh. */
  function cozyLibrary(world, b, cx, cz, tz, zone, h) {
    var scene = world.scene;
    // thảm hoa văn: tròn dưới góc ghế lười, chữ nhật dưới bàn đọc
    var tex = MS3D.floorTexture ? MS3D.floorTexture("carpet").clone() : null; if (tex) { tex.needsUpdate = true; tex.repeat.set(3, 3); }
    var rug = new THREE.Mesh(new THREE.CylinderGeometry(1.88, 1.88, 0.03, 32), new THREE.MeshLambertMaterial({ color: 0xf4c7a1, map: tex }));
    rug.position.set(cx, 0.03, cz + 1); scene.add(rug);
    h.floor(world, [cx - 2.5, cx + 2.5, tz - 1.6, tz + 1.6], C.orange, 0.01);
    h.floor(world, [cx - 2.3, cx + 2.3, tz - 1.4, tz + 1.4], 0x2c7f7f, 0.014, "carpet");
    // thêm một tủ sách cao trên tường tây (nối tiếp tủ cũ). Tường nam để trống: đó là lối đi của cô Vi,
    // và camera nhìn từ phía nam nên đồ áp tường nam chỉ thấy mặt lưng.
    h.shelf(world, b[0] + 0.55, cz - 3.2, 3.6, Math.PI / 2, 2.2);
    // góc ghế bành: ghế (ngồi đọc được), bàn nhỏ có sách + cốc, đèn cây
    var ax = b[1] - 3.0, az = cz + 3.0, face = Math.PI / 2;   // mặt ghế nhìn về phía tây (vào phòng)
    var ch = new THREE.Group(); ch.position.set(ax, 0, az); ch.rotation.y = face; scene.add(ch);
    MS3D.box(0.95, 0.32, 0.85, 0xc8643b, 0, 0.26, 0, ch);
    MS3D.box(0.75, 0.12, 0.65, 0xe9905f, 0, 0.47, -0.05, ch);
    MS3D.box(0.95, 0.75, 0.2, 0xc8643b, 0, 0.72, 0.33, ch);
    [-0.42, 0.42].forEach(function (x) { MS3D.box(0.16, 0.48, 0.85, 0xb5562f, x, 0.48, 0, ch); });
    [[-0.38, -0.32], [0.38, -0.32], [-0.38, 0.32], [0.38, 0.32]].forEach(function (q) { MS3D.box(0.06, 0.1, 0.06, C.woodDark, q[0], 0.05, q[1], ch); });
    MS3D.shadow(ch);
    world.addCircle(ax, az, 0.55);
    var seat = { x: ax, z: az, face: face, stand: [ax - 1.0, az] };
    world.interactables.push({ kind: "seat", x: ax - 1.0, z: az, r: 1.2, label: "Ngồi đọc", sub: "Ghế bành góc đọc", seat: seat, room: zone.id });
    world.pickArea(ax, 0.5, az, 0.95, 1.0, 0.95);
    var sx = ax, sz = az + 1.1;
    MS3D.cyl(0.32, 0.32, 0.05, 12, C.wood, sx, 0.55, sz, scene); MS3D.cyl(0.05, 0.08, 0.53, 6, C.woodDark, sx, 0.27, sz, scene);
    MS3D.box(0.3, 0.06, 0.22, 0x3d7dd8, sx - 0.06, 0.61, sz, scene).rotation.y = 0.3;
    MS3D.cyl(0.06, 0.05, 0.11, 8, 0xffffff, sx + 0.14, 0.63, sz + 0.06, scene);
    world.addCircle(sx, sz, 0.32);
    var lx = ax + 0.5, lz = az - 0.9;
    MS3D.cyl(0.18, 0.2, 0.05, 10, 0x333333, lx, 0.03, lz, scene); MS3D.cyl(0.025, 0.025, 1.55, 5, 0x333333, lx, 0.8, lz, scene);
    var shade = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.3, 0.32, 10, 1, true), new THREE.MeshLambertMaterial({ color: 0xfff1d0, emissive: 0x6b5a30, side: THREE.DoubleSide }));
    shade.position.set(lx, 1.62, lz); scene.add(shade);
    world.addCircle(lx, lz, 0.2);
    h.place(world, "ghe-banh", "Ghế bành góc đọc (Không gian đọc)", zone.id, ax - 1.2, az);
    // quả địa cầu trên chân gỗ, xoay chậm
    var gx = cx + 4.0, gz = tz + 0.2;
    MS3D.cyl(0.2, 0.24, 0.06, 10, C.woodDark, gx, 0.03, gz, scene); MS3D.cyl(0.04, 0.05, 0.75, 6, C.woodDark, gx, 0.42, gz, scene);
    var gc = document.createElement("canvas"); gc.width = 128; gc.height = 64; var gg = gc.getContext("2d");
    gg.fillStyle = "#3d8fd8"; gg.fillRect(0, 0, 128, 64); gg.fillStyle = "#7cc35a";
    [[18, 20, 14, 10], [30, 40, 8, 12], [60, 18, 18, 9], [70, 34, 8, 14], [95, 22, 16, 10], [104, 46, 9, 6]].forEach(function (c) { gg.beginPath(); gg.ellipse(c[0], c[1], c[2], c[3], 0.3, 0, 7); gg.fill(); });
    var globe = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(gc) }));
    globe.position.set(gx, 1.12, gz); globe.rotation.z = 0.4; scene.add(globe);
    var arc = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.015, 6, 20, Math.PI), MS3D.mat(0xd4a017)); arc.position.set(gx, 1.12, gz); arc.rotation.set(0, Math.PI / 2, 0.4 - Math.PI / 2); scene.add(arc);
    world.updaters.push(function (dt) { globe.rotation.y += dt * 0.3; });
    world.addCircle(gx, gz, 0.3);
    var gIt = { kind: "toast", x: gx, z: gz - 0.9, r: 1.0, label: "Xoay quả địa cầu", sub: "Quả địa cầu", room: zone.id,
      texts: ["Việt Nam ở Đông Nam Á, hình chữ S, dài hơn 1.600 cây số từ Bắc vào Nam.", "Trái Đất có 7 châu lục và 5 đại dương. Con kể tên được mấy cái?", "Sách đưa mình đi khắp thế giới mà không cần vé máy bay!"] };
    world.interactables.push(gIt);
    world.pickArea(gx, 1.0, gz, 0.8, 0.9, 0.8, null, gIt);
    // đèn tường ánh vàng
    var glowTex = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d");
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,210,140,.7)"); gr.addColorStop(1, "rgba(255,210,140,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
    })();
    var lampMat = new THREE.MeshBasicMaterial({ color: 0xffd89a });
    [[b[0] + 0.25, cz - 6.0, 1], [b[1] - 0.25, cz - 5.8, -1], [b[1] - 0.25, cz + 4.4, -1]].forEach(function (p) {
      var lm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.24), lampMat); lm.position.set(p[0], 1.95, p[1]); scene.add(lm);
      var gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      gl.scale.set(1.2, 1.2, 1); gl.position.set(p[0] + p[2] * 0.12, 1.95, p[1]); scene.add(gl);
    });
    // tranh khẩu hiệu đọc sách trên tường đông (tường chung với sảnh)
    if (h.wallPoster) {
      h.wallPoster(world, b[1], cz - 3.2, -Math.PI / 2, "Mỗi cuốn sách là một chuyến đi", 0x50b1b3);
      h.wallPoster(world, b[1], az, -Math.PI / 2, "Đọc sách là nuôi dưỡng tâm hồn", 0xff8300);
    }
  }

  /* h: { floor, sign, place, shelf, beanBag, bookStand, soonSign, wallPoster } từ rooms.js */
  MS3D.buildReadingRoom = function (world, slot, zone, h) {
    var b = slot.bounds, cx = (b[0] + b[1]) / 2, cz = (b[2] + b[3]) / 2;
    h.floor(world, b, 0xf6ead8, 0, "wood");   // sàn ván gỗ

    var books = MS3D.BOOKS || [], shelves = window.MS_SHELVES || [];
    // 1. tủ kinh điển + bảng xếp hạng (tường bắc)
    var classic = books.filter(function (bk) { return bk.shelf === "kinh-dien"; });
    if (classic.length) classicCase(world, b[0] + 5.6, b[2] + 0.45, classic, zone, h);
    topBoard(world, b[1] - 3.0, b[2] + 0.28, zone, h);

    // 2. bục trưng bày cho các kệ thường (không phải tủ)
    var stands = shelves.filter(function (sh) { return sh.type !== "case" && books.some(function (bk) { return (bk.shelf || "") === sh.id; }); });
    if (!stands.length && !classic.length) h.soonSign(world, zone, cx, cz - 2.5);
    stands.slice(0, 3).forEach(function (sh, i) {
      var list = books.filter(function (bk) { return (bk.shelf || "") === sh.id; });
      h.bookStand(world, cx + (i - (Math.min(stands.length, 3) - 1) / 2) * 5.2, cz - 2.8, zone, list, sh);
    });

    // 3. góc ghế lười + kệ tường tây
    h.shelf(world, b[0] + 0.55, cz + 2, 5, Math.PI / 2, 2.2);
    MS3D.cyl(2.2, 2.2, 0.03, 18, C.orange, cx, 0.015, cz + 1, world.scene);
    MS3D.cyl(1.9, 1.9, 0.035, 18, 0xfff1dc, cx, 0.02, cz + 1, world.scene);
    [[-1.4, 0], [1.4, 0], [0, 2.0]].forEach(function (p, i) {
      h.beanBag(world, cx + p[0], cz + 1 + p[1], [C.teal, 0xf6c84c, 0xe86a92][i], cx, cz + 0.6, zone.id);
    });

    // 4. bàn đọc + bình nước (phía nam)
    var tz = b[3] - 3.0;
    MS3D.readingTable(world, cx, tz, 3.0, 1.0, { stools: [[-0.9, -0.8], [0.9, -0.8], [-0.9, 0.8], [0.9, 0.8]], lamps: [-1.05, 1.05], books: [[0.3, 0.05, 0x50b1b3, 0.3], [-0.2, 0.1, 0xe86a92, -0.2]] });
    MS3D.waterCooler(world, b[1] - 0.6, b[3] - 2.4, zone.id);
    h.place(world, "binh-nuoc-doc", "Bình nước (Không gian đọc)", zone.id, b[1] - 0.6, b[3] - 1.4);

    // 5. cây của cô Vi
    var pA = MS3D.monstera(world, b[0] + 1.0, b[2] + 1.1, 1.1);
    var pB = MS3D.monstera(world, b[0] + 10.0, b[2] + 1.0, 0.95);
    var pC = MS3D.aloe(world, b[1] - 0.75, cz - 3.6, 1.1);
    var pD = MS3D.aloe(world, b[1] - 0.75, b[3] - 0.7, 1.0);
    var pE = MS3D.monstera(world, b[0] + 1.0, b[3] - 1.1, 1.0);
    MS3D.aloe(world, b[1] - 0.75, cz + 2.4, 0.8);

    // 6. thư viện ấm cúng
    cozyLibrary(world, b, cx, cz, tz, zone, h);

    // 7. NPC
    if (MS3D.spawnNPC) {
      // cô Vi trong phòng này: tưới cây, xem đồng hồ, uống nước, hỏi chuyện bạn Thảo, xếp sách, đứng đọc một lúc
      var faceTo = function (x, z, tx, tz) { return Math.atan2(-(tx - x), -(tz - z)); };
      var chatX = cx - 2.1, chatZ = tz + 1.7;
      world.coViDocRoute = [   // đoạn trong Không gian đọc; rooms.js (spawnCoVi) nối thêm các phòng khác
        waterStop(pA, b[0] + 2, b[2] + 2.2),
        { x: cx - 2, z: b[2] + 2.2 },
        waterStop(pB, b[0] + 10.0, b[2] + 3),
        { x: b[1] - 1.8, z: b[2] + 2.6, wait: 2.8, act: "watch", say: "Cô xem đồng hồ chút… vẫn còn sớm!" },
        waterStop(pC, b[1] - 3, cz - 3.6),
        { x: b[1] - 1.7, z: cz + 0.2 },
        { x: b[1] - 1.7, z: b[3] - 2.4, wait: 3, act: "drink", face: -Math.PI / 2, say: "Uống ngụm nước cho mát giọng nào!" },
        waterStop(pD, b[1] - 3, b[3] - 0.7),
        { x: chatX, z: chatZ, wait: 3.6, act: "chat", face: faceTo(chatX, chatZ, cx - 0.9, tz + 0.8), say: "Thảo đọc tới đâu rồi con?" },
        waterStop(pE, b[0] + 3, b[3] - 1.1),
        { x: b[0] + 1.6, z: cz + 2, wait: 4, act: "shelf", face: Math.PI / 2, say: "Để cô xếp sách lại cho ngay ngắn nào." },
        { x: b[0] + 3.2, z: cz + 3.6, wait: 5, act: "read", face: Math.PI, say: "Cuốn này hay ghê, lát cô kể các con nghe." },
        { x: b[0] + 1.7, z: cz - 1.5 }
      ];
      MS3D.spawnNPC(world, "ban-minh", { room: zone.id, route: [
        { x: b[0] + 3.8, z: b[2] + 2.3, wait: 3, face: 0 },
        { x: b[0] + 7.0, z: b[2] + 2.3, wait: 2.5, face: 0 },
        { x: b[1] - 3.0, z: b[2] + 2.4, wait: 3, face: 0 },
        { x: b[1] - 2.6, z: cz - 1.6, wait: 0.5 },
        { x: cx + 0.5, z: cz - 1.7, wait: 1.5, face: Math.PI },
        { x: b[0] + 3.0, z: cz - 1.6, wait: 0.5 }
      ] });
      MS3D.spawnNPC(world, "ban-thao", { room: zone.id, sit: { x: cx - 0.9, z: tz + 0.8, y: 0.36, face: 0 } });
    }
  };
})();
