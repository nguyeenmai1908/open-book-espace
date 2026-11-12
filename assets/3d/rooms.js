/* ==========================================================
   SẢNH 3D MỞ SÁCH — rooms.js
   Bản đồ: 1 sảnh chính (22×18) + các phòng lấy từ MS.ZONES theo thứ tự trong SLOTS.
   Kệ khoá học đọc từ MS.COURSES / MS.SERIES.
   Vật tương tác chỉ là dữ liệu {kind, label, sub, url...}; play.html quyết định làm gì.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  var C = MS3D.COLORS;
  var T = 0.4;       // độ dày tường
  var WALL_H = 2.6;  // chiều cao tường
  var DOOR_W = 3.2;  // bề rộng cửa
  var WALL_LOW = 0xd3e6e2;  // màu ốp chân tường (xanh Mở Sách rất nhạt)
  var LOBBY = [-11, 11, -9, 9];   // 22×18 (trước 21/10/2026 là 28×20, rộng quá)

  /* Ảnh kỷ niệm (cô giáo Mở Sách...). Thêm: { src: "assets/anh/ten-file.jpg", caption: "Cô ..." }.
     Ảnh hiện trong cảnh 3D khi trang chạy trên web (http/https); mở file trực tiếp thì chỉ hiện ở bảng xem ảnh. */
  MS3D.MEMORY_PHOTOS = window.MS_PHOTOS || [];   // dữ liệu ở assets/anh/anh-ky-niem.js

  // Vị trí phòng quanh sảnh, theo thứ tự MS.ZONES. skip: cạnh tường dùng chung, không dựng lại.
  // Hai phòng phía bắc rộng hơn sảnh: phần thò ra ngoài được tự xây tường (xem buildWorld).
  var SLOTS = [
    { side: "n", bounds: [-14, 0, -27, -9], door: [-7, -9], spawn: [-7, -11.6], face: 0 },
    { side: "e", bounds: [11, 33, -9, 9],   door: [11, 0],  spawn: [13.6, 0],   face: -Math.PI / 2 },
    { side: "w", bounds: [-27, -11, -8, 8], door: [-11, 0], spawn: [-13.6, 0],  face: Math.PI / 2 },
    { side: "s", bounds: [-8, 8, 9, 21],    door: [0, 9],   spawn: [0, 11.6],   face: Math.PI },
    { side: "n", bounds: [0, 14, -21, -9],  door: [7, -9],  spawn: [7, -11.6],  face: 0, skip: ["w"] }
  ];
  var INWARD = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] };
  MS3D.WORLD_BOUNDS = [-27, 33, -27, 21];

  /* ---------- tường ---------- */
  function wall(world, x0, z0, x1, z1, opts) {
    opts = opts || {};
    var h = opts.h || WALL_H, color = opts.color || C.wall;
    var horiz = z0 === z1;
    var w = horiz ? Math.abs(x1 - x0) + T : T, d = horiz ? T : Math.abs(z1 - z0) + T;
    var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    var fade = horiz && !opts.noFade;
    var m = MS3D.box(w, h, d, color, cx, h / 2, cz, world.scene, { unique: fade });
    var b = { minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 };
    world.addBox(b.minX, b.maxX, b.minZ, b.maxZ);
    if (!opts.noTrim) MS3D.box(w + 0.08, 0.18, d + 0.08, opts.trim || C.teal, cx, 0.09, cz, world.scene);
    var parts = [m];
    if (!opts.color) {   // tường trong nhà: ốp chân tường xanh nhạt, nẹp gỗ, gờ trắng trên đỉnh
      parts.push(MS3D.box(w + 0.04, 0.95, d + 0.04, WALL_LOW, cx, 0.475, cz, world.scene, { unique: fade }));
      parts.push(MS3D.box(w + 0.07, 0.07, d + 0.07, C.wood, cx, 0.97, cz, world.scene, { unique: fade }));
      parts.push(MS3D.box(w + 0.06, 0.08, d + 0.06, 0xfffaf0, cx, h + 0.04, cz, world.scene, { unique: fade }));
    }
    if (fade) parts.forEach(function (p) { p.userData.b = b; world.fadeWalls.push(p); });
    return m;
  }
  // tường có nhiều khe cửa (gaps = toạ độ tâm các cửa)
  function wallGaps(world, horiz, fixed, a, b, gaps, opts) {
    var cur = a;
    gaps.slice().sort(function (p, q) { return p - q; }).forEach(function (gc) {
      var g0 = gc - DOOR_W / 2, g1 = gc + DOOR_W / 2;
      if (g0 > cur) { if (horiz) wall(world, cur, fixed, g0, fixed, opts); else wall(world, fixed, cur, fixed, g0, opts); }
      cur = g1;
    });
    if (b > cur) { if (horiz) wall(world, cur, fixed, b, fixed, opts); else wall(world, fixed, cur, fixed, b, opts); }
  }

  // kind: vân sàn (MS3D.floorTexture: "tile", "wood", "carpet", "grass"); bỏ trống là sàn trơn
  function floor(world, b, color, y, kind) {
    var w = b[1] - b[0], d = b[3] - b[2];
    var mat = new THREE.MeshLambertMaterial({ color: color });
    if (kind && MS3D.floorTexture) {
      var src = MS3D.floorTexture(kind), sz = src.userData.size, tex = src.clone();
      tex.needsUpdate = true; tex.repeat.set(w / sz, d / sz); mat.map = tex;
    }
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set((b[0] + b[1]) / 2, y || 0, (b[2] + b[3]) / 2);
    world.scene.add(m);
    return m;
  }
  function sign(world, text, x, y, z, opts, parent) {
    var s = MS3D.label(text, opts);
    s.position.set(x, y, z);
    (parent || world.scene).add(s);
    return s;
  }
  function place(world, id, name, room, x, z) { world.places.push({ id: id, name: name, room: room, x: x, z: z }); }

  /* Khung cửa cam + biển tên phòng */
  function doorFrame(world, slot, zone) {
    var dx = slot.door[0], dz = slot.door[1], horiz = slot.side === "n" || slot.side === "s";
    var p = DOOR_W / 2 + 0.15;
    var a = horiz ? [dx - p, dz] : [dx, dz - p], b = horiz ? [dx + p, dz] : [dx, dz + p];
    MS3D.box(0.34, WALL_H + 0.3, 0.5, C.orange, a[0], (WALL_H + 0.3) / 2, a[1], world.scene);
    MS3D.box(0.34, WALL_H + 0.3, 0.5, C.orange, b[0], (WALL_H + 0.3) / 2, b[1], world.scene);
    var lin = MS3D.box(horiz ? DOOR_W + 0.7 : 0.5, 0.36, horiz ? 0.5 : DOOR_W + 0.7, C.orange, dx, WALL_H + 0.3, dz, world.scene, { unique: horiz });
    if (horiz) { // xà cửa cũng mờ đi khi che nhân vật
      lin.userData.b = { minX: dx - DOOR_W / 2 - 0.35, maxX: dx + DOOR_W / 2 + 0.35, minZ: dz - 0.25, maxZ: dz + 0.25 };
      world.fadeWalls.push(lin);
    }
    world.doorSigns = world.doorSigns || [];
    var pc = pathColor(zone.id), pcHex = "#" + ("000000" + pc.toString(16)).slice(-6);
    world.doorSigns.push(sign(world, zone.name, dx, WALL_H + 0.95, dz, { size: 0.29, fg: "#1d6b6d", border: pcHex }));
    if (zone.status !== "open") world.doorSigns.push(sign(world, "Sắp mở", dx, WALL_H + 0.5, dz, { size: 0.26, bg: "#ff8300", fg: "#1f1406" }));
  }

  /* ---------- Lối màu: từ thảm Cây Mở Sách tới từng cửa phòng, mỗi phòng một màu ----------
     Ô đậm nhạt xen kẽ như bàn cờ; bước lên ô nào thì ô đó sáng lên. Biển tên cửa viền cùng màu. */
  var PATH_COLORS = { hoc: 0x3d7dd8, vuon: 0x6cbf5a, doc: 0xe8a90c, phim: 0xe86a92, "le-hoi": 0xff8300 };
  var PATH_EXTRA = [0x50b1b3, 0xa85000, 0x1d6b6d];   // phòng mới chưa có màu riêng
  function pathColor(id) {
    if (PATH_COLORS[id] === undefined) PATH_COLORS[id] = PATH_EXTRA[Object.keys(PATH_COLORS).length % PATH_EXTRA.length];
    return PATH_COLORS[id];
  }
  function buildPaths(world, zones) {
    var L = LOBBY, R0 = 3.7, tiles = [];
    zones.forEach(function (zone, i) {
      var slot = SLOTS[i], d = slot.door, inw = INWARD[slot.side], col = pathColor(zone.id);
      var light = new THREE.Color(col).lerp(new THREE.Color(0xffffff), 0.35).getHex();
      // khuỷu: cách tường có cửa 2,4 đơn vị, thẳng hàng với cửa; đầu lối nằm trên mép thảm, hướng về khuỷu
      var elbow = slot.side === "n" ? [d[0], L[2] + 2.4] : slot.side === "s" ? [d[0], L[3] - 2.4] : slot.side === "e" ? [L[1] - 2.4, d[1]] : [L[0] + 2.4, d[1]];
      var el = Math.hypot(elbow[0], elbow[1]) || 1, start = [elbow[0] / el * R0, elbow[1] / el * R0];
      var end = [d[0] - inw[0] * 0.45, d[1] - inw[1] * 0.45];
      var cross = (elbow[0] - start[0]) * (end[1] - start[1]) - (elbow[1] - start[1]) * (end[0] - start[0]);
      var pts = Math.abs(cross) < 0.01 ? [start, end] : [start, elbow, end], k = 0;   // thẳng hàng: một đoạn, ô cách đều
      MS3D.cyl(0.32, 0.32, 0.05, 14, col, start[0], 0.045, start[1], world.scene);   // chấm đầu lối trên thảm
      for (var s = 0; s < pts.length - 1; s++) {
        var a = pts[s], b = pts[s + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]); if (len < 0.3) continue;
        var ang = Math.atan2(b[0] - a[0], b[1] - a[1]);
        for (var t = (s === 0 ? 0.75 : 0.5); t < len - 0.2; t += 1.0) {
          var x = a[0] + (b[0] - a[0]) * t / len, z = a[1] + (b[1] - a[1]) * t / len;
          var base = k++ % 2 ? light : col;
          var mat = new THREE.MeshLambertMaterial({ color: base, flatShading: true });
          var m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.8), mat);
          m.position.set(x, 0.016, z); m.rotation.y = ang; world.scene.add(m);
          tiles.push({ m: m, mat: mat, glow: new THREE.Color(base).multiplyScalar(0.45), x: x, z: z, t: 0 });
        }
      }
    });
    world.updaters.push(function (dt) {
      var p = world.player && world.player.position;
      tiles.forEach(function (it) {
        if (p && Math.abs(p.x - it.x) < 0.45 && Math.abs(p.z - it.z) < 0.45) it.t = 1;
        else if (it.t > 0) it.t = Math.max(0, it.t - dt * 1.6);
        it.mat.emissive.copy(it.glow).multiplyScalar(it.t);
        it.m.position.y = 0.016 + it.t * 0.02;
      });
    });
  }

  /* ---------- đồ dùng chung ---------- */
  function plant(world, x, z) {
    MS3D.cyl(0.35, 0.28, 0.5, 8, C.orange, x, 0.25, z, world.scene).castShadow = true;
    MS3D.ball(0.55, 0x4f9d58, x, 0.95, z, world.scene, 0).castShadow = true;
    MS3D.ball(0.35, 0x6cbf5a, x + 0.15, 1.35, z - 0.1, world.scene, 0).castShadow = true;
    world.addCircle(x, z, 0.45);
  }
  /* Ghế băng gỗ có nan; mặt ghế quay về phía -z của ghế (rot xoay ghế). Va chạm: hai vòng tròn dọc thân ghế. */
  function benchAt(world, x, z, rot, color) {
    rot = rot || 0; color = color || C.wood;
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; world.scene.add(g);
    [-0.18, 0, 0.18].forEach(function (dz) { MS3D.box(1.8, 0.06, 0.15, color, 0, 0.47, dz, g); });          // nan mặt ghế
    [0.62, 0.82].forEach(function (y) { MS3D.box(1.8, 0.12, 0.05, color, 0, y, 0.27, g); });                // nan tựa lưng
    [-0.7, 0.7].forEach(function (lx) {
      MS3D.box(0.08, 0.44, 0.08, C.woodDark, lx, 0.22, -0.2, g); MS3D.box(0.08, 0.9, 0.08, C.woodDark, lx, 0.45, 0.27, g);
      MS3D.box(0.08, 0.06, 0.55, C.woodDark, lx, 0.62, 0.03, g);   // tay vịn
    });
    var c = Math.cos(rot), s = Math.sin(rot);
    [-0.5, 0.5].forEach(function (lx) { world.addCircle(x + lx * c, z - lx * s, 0.45); });
    MS3D.shadow(g);
    return g;
  }
  // góc xoay để mặt ghế (phía -z) nhìn về điểm (tx, tz)
  function faceRot(x, z, tx, tz) { return Math.atan2(-(tx - x), -(tz - z)); }
  var BOOK_COLORS = [0xff8300, 0x50b1b3, 0xf6c84c, 0xe86a92, 0x3d7dd8, 0x6cbf5a, 0x1d6b6d, 0xa85000];
  function shelf(world, x, z, w, rot, h) {
    h = h || 1.9;
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0; world.scene.add(g);
    MS3D.box(w, h, 0.5, C.woodDark, 0, h / 2, 0, g);
    var rows = Math.floor(h / 0.6), k = 0;
    for (var r = 0; r < rows; r++) {
      var y = 0.35 + r * 0.58, bx = -w / 2 + 0.15;
      while (bx < w / 2 - 0.25) {
        var bw = 0.12 + ((k * 37) % 5) * 0.02, bh = 0.34 + ((k * 13) % 4) * 0.04;
        MS3D.box(bw, bh, 0.34, BOOK_COLORS[k % BOOK_COLORS.length], bx + bw / 2, y + bh / 2 - 0.12, 0.1, g);
        bx += bw + 0.03; k++;
      }
    }
    if (Math.abs(Math.cos(rot || 0)) > 0.5) world.addBox(x - w / 2, x + w / 2, z - 0.3, z + 0.3); else world.addBox(x - 0.3, x + 0.3, z - w / 2, z + w / 2);
    MS3D.shadow(g);
    return g;
  }
  /* Ghế lười (bean bag): khối tròn mềm. Ngồi được. */
  function beanBag(world, x, z, color, lookX, lookZ, room) {
    var face = Math.atan2(-(lookX - x), -(lookZ - z)); // mặt ghế (phía -z) quay về điểm nhìn
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = face; world.scene.add(g);
    var base = MS3D.ball(0.55, color, 0, 0.3, 0, g, 1); base.scale.set(1, 0.55, 1);
    var back = MS3D.ball(0.42, color, 0, 0.55, 0.28, g, 1); back.scale.set(1.05, 0.9, 0.6);
    world.addCircle(x, z, 0.5);
    MS3D.shadow(g);
    // điểm đứng dậy: phía trước ghế
    var sx = x - Math.sin(face) * 1.0, sz = z - Math.cos(face) * 1.0;
    world.interactables.push({ kind: "seat", x: sx, z: sz, r: 1.2, label: "Ngồi đọc", sub: "Ghế lười góc đọc sách", seat: { x: x, z: z, face: face, stand: [sx, sz] }, room: room });
    world.pick(g);
  }
  function floorLamp(world, x, z) {
    MS3D.cyl(0.2, 0.22, 0.06, 8, 0x333333, x, 0.03, z, world.scene);
    MS3D.cyl(0.03, 0.03, 1.6, 5, 0x333333, x, 0.8, z, world.scene);
    var shade = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 0.36, 10, 1, true), new THREE.MeshLambertMaterial({ color: 0xfff1d0, emissive: 0x6b5a30, side: THREE.DoubleSide }));
    shade.position.set(x, 1.7, z); world.scene.add(shade);
    world.addCircle(x, z, 0.22);
  }
  function bookStack(world, x, z, n) {
    for (var i = 0; i < n; i++) { var b = MS3D.box(0.42, 0.08, 0.3, BOOK_COLORS[(i * 3) % 8], x, 0.06 + i * 0.085, z, world.scene); b.rotation.y = i * 0.35; }
  }

  /* Đặt đồ sát một bức tường: dựng trong group theo toạ độ riêng (tường ở z = 0, mặt trước là +z),
     rồi xoay group. p/box/it đổi toạ độ riêng sang toạ độ thế giới cho va chạm và vật tương tác. */
  function wallSpot(world, x, z, rot) {
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0; world.scene.add(g);
    var c = Math.cos(rot || 0), s = Math.sin(rot || 0);
    function p(lx, lz) { return [x + lx * c + lz * s, z - lx * s + lz * c]; }
    return {
      g: g, p: p,
      box: function (x0, x1, z0, z1) {
        var a = p(x0, z0), b = p(x1, z1);
        world.addBox(Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]));
      },
      it: function (o, lx, lz) { var q = p(lx, lz); o.x = q[0]; o.z = q[1]; world.interactables.push(o); return o; }
    };
  }

  /* Cây Mở Sách giữa sảnh: mọc theo tổng Sao Biển (MS.totalStars).
     0 sao: cây non 6 lá · mỗi sao +3 lá (đủ 48 lá ở 14 sao) · từ 3 sao ra hoa · mỗi 5 sao một "quả sách".
     world.refreshTree() gọi lại mỗi khi sao đổi (refreshCourseLabels); lá mới mọc ra có hiệu ứng nảy. */
  var TREE_LEAVES = 48, TREE_FLOWERS = 12, TREE_FRUITS = 6;
  function treeCounts(st) {
    return {
      leaves: Math.min(TREE_LEAVES, 6 + st * 3),
      flowers: st >= 3 ? Math.min(TREE_FLOWERS, st - 2) : 0,
      fruits: Math.min(TREE_FRUITS, Math.floor(st / 5)),
      scale: 0.62 + 0.38 * Math.min(1, st / 14)
    };
  }
  function buildStarTree(world) {
    var bark = 0x7a5232;
    // chậu + đất
    MS3D.cyl(0.85, 0.7, 0.55, 10, C.tealInk, 0, 0.275, 0, world.scene).castShadow = true;
    MS3D.cyl(0.88, 0.88, 0.08, 10, C.orange, 0, 0.55, 0, world.scene);
    MS3D.cyl(0.76, 0.76, 0.04, 10, 0x6b4a2f, 0, 0.58, 0, world.scene);
    var tree = new THREE.Group(); tree.position.y = 0.58; world.scene.add(tree);
    // thân + ba cành
    MS3D.cyl(0.11, 0.2, 1.7, 7, bark, 0, 0.85, 0, tree);
    [[0.3, 1.35, 0, 0, -0.75], [-0.3, 1.45, 0.05, 0, 0.75], [0, 1.4, -0.28, -0.7, 0]].forEach(function (c) {
      var br = MS3D.cyl(0.05, 0.08, 0.8, 6, bark, c[0], c[1], c[2], tree); br.rotation.set(c[3], 0, c[4]);
    });
    // chỗ mọc lá: xếp từ trong ra ngoài để cây tán rộng dần
    var leafMats = [0x4f9d58, 0x6cbf5a, 0x3f8a4e].map(function (c) { return new THREE.MeshLambertMaterial({ color: c, flatShading: true }); });
    function dir(i, n) {   // điểm rải đều trên mặt cầu (xoắn Fibonacci)
      var y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = i * 2.39996;
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    }
    var leaves = [];
    for (var i = 0; i < TREE_LEAVES; i++) {
      var d = dir((i * 17) % TREE_LEAVES, TREE_LEAVES), rr = 0.3 + 0.7 * Math.sqrt((i + 1) / TREE_LEAVES);
      var m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3 + (i % 3) * 0.05, 0), leafMats[i % 3]);
      m.position.set(d[0] * 1.3 * rr, Math.max(1.45, 2.05 + d[1] * 0.85 * rr), d[2] * 1.3 * rr);
      m.rotation.set(i, i * 2, 0); m.visible = false; m.castShadow = true; tree.add(m); leaves.push(m);
    }
    var flowers = [];
    for (var f = 0; f < TREE_FLOWERS; f++) {
      var fd = dir(f, TREE_FLOWERS);
      var fl = MS3D.ball(0.1, [0xffc83d, 0xff8300, 0xf8a5c2][f % 3], fd[0] * 1.35, Math.max(1.6, 2.1 + fd[1] * 0.9), fd[2] * 1.35, tree, 0);
      fl.visible = false; flowers.push(fl);
    }
    // quả sách: cuốn sách nhỏ treo dưới tán
    var fruits = [];
    for (var k = 0; k < TREE_FRUITS; k++) {
      var a = k / TREE_FRUITS * Math.PI * 2 + 0.4, fg = new THREE.Group();
      fg.position.set(Math.cos(a) * 0.95, 1.3, Math.sin(a) * 0.95); fg.rotation.y = -a; tree.add(fg);
      MS3D.box(0.015, 0.22, 0.015, 0x5b4636, 0, 0.11, 0, fg);
      MS3D.box(0.2, 0.26, 0.07, BOOK_COLORS[k % BOOK_COLORS.length], 0, -0.12, 0, fg);
      MS3D.box(0.17, 0.23, 0.075, 0xfffaf0, 0.02, -0.12, 0, fg);
      fg.visible = false; fruits.push(fg);
    }
    world.addCircle(0, 0, 1.6);
    // ghế gỗ vòng quanh gốc cây (10 đoạn), ngồi được ở phía nam
    for (var bi = 0; bi < 10; bi++) {
      var ba = bi / 10 * Math.PI * 2, bx = Math.cos(ba) * 1.32, bz = Math.sin(ba) * 1.32;
      var seg = MS3D.box(0.78, 0.08, 0.36, C.wood, bx, 0.42, bz, world.scene); seg.rotation.y = -ba + Math.PI / 2; seg.castShadow = true;
      MS3D.box(0.08, 0.38, 0.08, C.woodDark, bx, 0.19, bz, world.scene);
    }
    var benchSeat = { x: 0, z: 1.32, face: Math.PI, stand: [0, 2.4] };
    world.interactables.push({ kind: "seat", x: 0, z: 2.4, r: 0.9, label: "Ngồi dưới gốc cây", sub: "Ghế vòng quanh Cây Mở Sách", seat: benchSeat });
    // đèn nháy quấn quanh tán cây (lớn theo cây)
    var fairy = [];
    for (var fi = 0; fi < 28; fi++) {
      var fa = fi * 0.9, fy = 1.45 + (fi / 28) * 1.3, fr = 1.35 - (fi / 28) * 0.6;
      var fm = new THREE.MeshBasicMaterial({ color: [0xffe08a, 0xff9a33, 0x9be3e0][fi % 3] });
      var fb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), fm); fb.position.set(Math.cos(fa) * fr, fy, Math.sin(fa) * fr); tree.add(fb); fairy.push(fm);
    }
    world.updaters.push(function (dt, t) { fairy.forEach(function (fm, k) { fm.color.setHex(Math.sin(t * 2.5 + k * 1.7) > -0.3 ? [0xffe08a, 0xff9a33, 0x9be3e0][k % 3] : 0x6b5a30); }); });
    var it = { kind: "tree", x: 0, z: 1.3, r: 1.8, label: "Cây Mở Sách", sub: "Mọc thêm lá theo Sao Biển của bạn" };
    world.interactables.push(it);
    world.pickArea(0, 1.7, 0, 2.6, 3.4, 2.6, null, it);
    place(world, "cay-mo-sach", "Cây Mở Sách", "sanh", 0, 2.2);

    var grow = [], shown = null, want = 0.62;
    function setPart(list, n, animate) {
      var added = 0;
      list.forEach(function (o, j) {
        var on = j < n;
        if (on && !o.visible) {
          o.visible = true; added++;
          if (animate) { o.scale.setScalar(0.01); grow.push({ o: o, t: -added * 0.08 }); } else o.scale.setScalar(1);
        } else if (!on) o.visible = false;
      });
      return added;
    }
    world.refreshTree = function () {
      var st = window.MS && MS.totalStars ? MS.totalStars() : 0, c = treeCounts(st), first = !shown;
      var newLeaves = setPart(leaves, c.leaves, !first);
      setPart(flowers, c.flowers, !first); setPart(fruits, c.fruits, !first);
      want = c.scale; if (first) tree.scale.setScalar(want);
      if (!first && newLeaves && window.MS && MS.toast) setTimeout(function () { MS.toast("Cây Mở Sách vừa mọc thêm " + newLeaves + " lá nhờ Sao Biển của bạn!"); }, 900);
      shown = c;
    };
    world.treeStatus = function () {
      var st = window.MS && MS.totalStars ? MS.totalStars() : 0, c = treeCounts(st);
      var s = "Cây Mở Sách có " + c.leaves + " lá" + (c.flowers ? ", " + c.flowers + " bông hoa" : "") + (c.fruits ? " và " + c.fruits + " quả sách" : "") + ". ";
      if (st < 3) s += "Đủ 3 Sao Biển cây sẽ ra hoa!";
      else if (c.fruits < TREE_FRUITS) s += "Đủ " + (c.fruits + 1) * 5 + " Sao Biển cây sẽ ra một quả sách!";
      else s += "Cây đã sum suê rồi, giỏi quá!";
      return s;
    };
    world.updaters.push(function (dt, t) {
      tree.rotation.z = Math.sin(t * 0.8) * 0.02;
      var sc = tree.scale.x + (want - tree.scale.x) * Math.min(1, dt * 2);
      tree.scale.setScalar(sc);
      for (var g = grow.length - 1; g >= 0; g--) {
        var e = grow[g]; e.t += dt;
        if (e.t <= 0) continue;
        var p = Math.min(1, e.t / 0.6), k = 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);   // nảy nhẹ
        e.o.scale.setScalar(Math.max(0.01, k));
        if (p >= 1) { e.o.scale.setScalar(1); grow.splice(g, 1); }
      }
    });
    world.refreshTree();
  }

  /* Tranh khung treo tường: nền màu, chữ trắng (ca dao, tục ngữ). (x, z) trên đường tường, rot xoay mặt tranh vào phòng. */
  function wallPoster(world, x, z, rot, text, color) {
    var c = document.createElement("canvas"); c.width = 256; c.height = 320; var g = c.getContext("2d");
    g.fillStyle = "#" + ("000000" + color.toString(16)).slice(-6); g.fillRect(0, 0, 256, 320);
    g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.arc(200, 60, 70, 0, 6.3); g.fill();
    g.fillStyle = "#ffffff"; g.font = "700 34px 'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"; g.textAlign = "center";
    var words = text.split(" "), lines = [], cur = "";
    words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (g.measureText(t).width > 210 && cur) { lines.push(cur); cur = w; } else cur = t; });
    lines.push(cur);
    lines.forEach(function (l, i) { g.fillText(l, 128, 170 - (lines.length - 1) * 21 + i * 42); });
    g.font = "600 18px 'Be Vietnam Pro', system-ui, sans-serif"; g.fillStyle = "rgba(255,255,255,.85)"; g.fillText("Mở Sách", 128, 292);
    var w = wallSpot(world, x, z, rot);
    MS3D.box(1.06, 1.3, 0.06, C.woodDark, 0, 1.75, 0.24, w.g);
    var pic = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 1.18), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
    pic.position.set(0, 1.75, 0.28); w.g.add(pic);
  }

  /* ---------- SẢNH CHÍNH ---------- */
  function buildLobby(world) {
    var b = LOBBY;
    floor(world, b, C.floor, 0, "tile");
    // thảm tròn + Cây Mở Sách ở giữa (mọc theo Sao Biển)
    MS3D.cyl(3.4, 3.4, 0.03, 24, C.teal, 0, 0.015, 0, world.scene);
    MS3D.cyl(2.5, 2.5, 0.035, 24, 0xffffff, 0, 0.02, 0, world.scene);
    MS3D.cyl(1.5, 1.5, 0.04, 24, C.orange, 0, 0.025, 0, world.scene);
    buildStarTree(world);
    sign(world, "Không gian Mở Sách", 0, 4.15, b[2] + 0.4, { size: 0.42, fg: "#a85000", border: "#ff8300" });

    // tường bắc: sân khấu giữa hai cửa, bảng vàng làm phông; nửa bắc tường tây: ảnh kỷ niệm; nửa bắc tường đông: pantry
    var nz = (b[2] - DOOR_W / 2) / 2, sz = (b[3] + DOOR_W / 2) / 2;
    var stage = buildStage(world, b[2] + T / 2);
    buildHonorBoard(world, 0, b[2] + 0.3, { lift: 0.4, it: [-1.9, stage.front + 1.0] });
    buildPhotoWall(world, b[0], nz, Math.PI / 2);
    buildPantry(world, b[1], nz, -Math.PI / 2);
    // nửa nam: góc ghế lười (tây) và góc Thử thách tiếng Việt (đông)
    buildLounge(world, b[0] + 4, sz);
    buildChallenge(world, b[1] - 2.7, sz);

    [[-4.4, b[2] + 0.7], [4.4, b[2] + 0.7], [-2.6, b[3] - 0.7], [2.6, b[3] - 0.7]].forEach(function (p) { plant(world, p[0], p[1]); });
    MS3D.monstera(world, b[0] + 0.8, b[2] + 0.8, 1.25); MS3D.monstera(world, b[1] - 0.8, b[2] + 0.8, 1.25);
    flyingBooks(world);

    world.rooms.push({ id: "sanh", name: "Sảnh chính", status: "open", bounds: b, spawn: [0, 4.2], face: 0 });
  }

  /* Sân khấu kể chuyện (giữa tường bắc, bảng vàng làm phông).
     Mi thỉnh thoảng lên kể chuyện (npcs.js, act "story"); người chơi bấm "Lên sân khấu" để cúi chào.
     world.stage: { x, y, z, front, cheer(), setShow(on) } — play.html và npcs.js dùng. */
  function buildStage(world, zb) {
    var W = 6.4, D = 2.4, H = 0.35, z = zb + D / 2, zf = zb + D;
    MS3D.box(W, H, D, C.wood, 0, H / 2, z, world.scene).castShadow = true;
    MS3D.box(W + 0.04, 0.08, 0.06, C.orange, 0, H - 0.04, zf, world.scene);
    MS3D.box(1.6, H / 2, 0.4, C.woodDark, 0, H / 4, zf + 0.2, world.scene);   // bậc lên
    world.addBox(-W / 2, W / 2, zb, zf + 0.4);
    // rèm đỏ hai bên, buộc dây vàng
    [-1, 1].forEach(function (s) {
      MS3D.box(0.7, 2.9, 0.25, 0xc62828, s * (W / 2 - 0.3), H + 1.45, zb + 0.3, world.scene).castShadow = true;
      MS3D.box(0.45, 2.5, 0.2, 0xa31f1f, s * (W / 2 - 0.75), H + 1.6, zb + 0.45, world.scene);
      MS3D.ball(0.1, 0xffc83d, s * (W / 2 - 0.62), H + 1.05, zb + 0.6, world.scene, 0);
    });
    // dây đèn màu võng giữa hai rèm
    for (var i = 0; i <= 12; i++) {
      var t = i / 12;
      MS3D.ball(0.07, BOOK_COLORS[i % BOOK_COLORS.length], -W / 2 + 0.5 + t * (W - 1), H + 2.95 - Math.sin(t * Math.PI) * 0.35, zb + 0.45, world.scene, 0);
    }
    // micro
    MS3D.cyl(0.16, 0.18, 0.04, 10, 0x333333, 1.3, H + 0.02, zf - 0.6, world.scene);
    MS3D.cyl(0.02, 0.02, 1.1, 5, 0x333333, 1.3, H + 0.57, zf - 0.6, world.scene);
    MS3D.ball(0.08, 0x222222, 1.3, H + 1.17, zf - 0.6, world.scene, 0);
    // đèn rọi: hai cột trước sân khấu + vệt sáng, bật khi có người diễn
    var beamMat = new THREE.MeshBasicMaterial({ color: 0xfff1b0, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
    var poolMat = new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.45, depthWrite: false });
    var lights = [];
    [-1, 1].forEach(function (s) {
      var px = s * (W / 2 + 0.5), pz = zf + 0.3;
      MS3D.cyl(0.05, 0.07, 2.6, 6, 0x333333, px, 1.3, pz, world.scene);
      var head = MS3D.box(0.3, 0.26, 0.4, 0x222222, px, 2.65, pz, world.scene); head.rotation.y = s * 0.6;
      world.addCircle(px, pz, 0.15);
      var bx = s * 1.0, beam = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.6, 16, 1, true), beamMat);
      beam.position.set(bx, H + 1.3, z); world.scene.add(beam);
      var pool = new THREE.Mesh(new THREE.CircleGeometry(0.85, 20), poolMat);
      pool.rotation.x = -Math.PI / 2; pool.position.set(bx, H + 0.01, z); world.scene.add(pool);
      lights.push(beam, pool);
    });
    lights.forEach(function (m) { m.visible = false; });
    // pháo giấy khi cả sảnh vỗ tay
    var conf = [];
    for (var k = 0; k < 36; k++) { var c = MS3D.box(0.08, 0.02, 0.06, BOOK_COLORS[k % BOOK_COLORS.length], 0, -5, 0, world.scene); c.visible = false; conf.push(c); }
    var cheerT = 0, showOn = false;
    var it = { kind: "stage", x: 1.9, z: zf + 1.0, r: 1.3, label: "Lên sân khấu", sub: "Cúi chào cả sảnh" };
    world.interactables.push(it);
    world.pickArea(0, H / 2 + 0.3, z, W, H + 0.6, D, null, it);
    place(world, "san-khau", "Sân khấu kể chuyện", "sanh", 1.9, zf + 1.4);

    world.stage = {
      x: 0, y: H, z: z, front: zf,
      setShow: function (on) { showOn = on; },
      cheer: function () {
        cheerT = 2.6;
        conf.forEach(function (c) { c.visible = true; c.position.set((Math.random() - 0.5) * W, H + 2.6 + Math.random() * 1.2, z + (Math.random() - 0.3) * D); });
      }
    };
    world.updaters.push(function (dt, t) {
      var on = showOn || cheerT > 0;
      if (lights[0].visible !== on) lights.forEach(function (m) { m.visible = on; });
      if (cheerT <= 0) return;
      cheerT -= dt;
      conf.forEach(function (c, i) {
        c.position.y = Math.max(H + 0.02, c.position.y - dt * (0.9 + (i % 4) * 0.15));
        c.position.x += Math.sin(t * 3 + i) * dt * 0.4;
        c.rotation.set(t * 4 + i, t * 3, 0);
        if (cheerT <= 0) c.visible = false;
      });
    });

    if (MS3D.spawnNPC) {   // Mi đi dạo quanh sảnh, thỉnh thoảng lên sân khấu kể một mẩu chuyện
      var sx = -0.4;
      MS3D.spawnNPC(world, "ban-mi", { room: "sanh", route: [
        { x: -4.2, z: zf + 2.2, wait: 3 },
        { x: sx, z: zf + 0.9 },
        { x: sx, z: z, y: H },
        { x: sx, z: z - 0.01, y: H, act: "story", face: Math.PI },
        { x: sx, z: zf + 0.9, y: 0 },
        { x: 4.6, z: zf + 2.4, wait: 4 },
        { x: 2.4, z: -3.8, wait: 3 }
      ] });
    }
    return world.stage;
  }

  /* Sách bay: năm cuốn sách vỗ bìa như cánh chim, lượn vòng phía trên Cây Mở Sách. */
  function flyingBooks(world) {
    // điện thoại: màn hình nhỏ, 5 cuốn bay qua lại rối mắt nên chỉ để 2 cuốn, bay chậm hơn
    var phone = MS3D.isTouch && MS3D.isTouch() && Math.min(window.innerWidth, window.innerHeight) < 600;
    var books = [], N = phone ? 2 : 5, SP = phone ? 0.2 : 0.35;
    for (var i = 0; i < N; i++) {
      var g = new THREE.Group(); world.scene.add(g);
      var col = BOOK_COLORS[(i * 2) % BOOK_COLORS.length], L = new THREE.Group(), R = new THREE.Group(); g.add(L); g.add(R);
      MS3D.box(0.3, 0.025, 0.4, col, -0.15, 0, 0, L); MS3D.box(0.28, 0.03, 0.37, 0xfffaf0, -0.14, 0.02, 0, L);
      MS3D.box(0.3, 0.025, 0.4, col, 0.15, 0, 0, R); MS3D.box(0.28, 0.03, 0.37, 0xfffaf0, 0.14, 0.02, 0, R);
      books.push({ g: g, L: L, R: R, ph: i * Math.PI * 2 / N, rr: 2.2 + (i % 2) * 0.6, yy: 3.5 + (i % 3) * 0.35 });
    }
    world.updaters.push(function (dt, t) {
      books.forEach(function (bk, i) {
        var a = t * SP + bk.ph;
        bk.g.position.set(Math.cos(a) * bk.rr, bk.yy + Math.sin(t * 1.3 + i) * 0.15, Math.sin(a) * bk.rr);
        bk.g.rotation.y = -a;
        var fl = 0.35 + Math.sin(t * 6 + i) * 0.35;
        bk.L.rotation.z = fl; bk.R.rotation.z = -fl;
      });
    });
  }

  /* Góc ghế lười (tây nam): chỗ học trò nằm chơi, đọc vu vơ. */
  function buildLounge(world, ax, az) {
    var b = LOBBY;
    MS3D.box(4.4, 0.03, 3.6, C.orange, ax, 0.015, az, world.scene);
    MS3D.box(4.0, 0.035, 3.2, 0xd8f0ee, ax, 0.02, az, world.scene);
    beanBag(world, ax - 1.3, az + 0.9, C.orange, ax, az, "sanh");
    beanBag(world, ax + 1.1, az + 1.1, C.teal, ax, az, "sanh");
    beanBag(world, ax - 0.7, az - 1.0, 0xf6c84c, ax, az, "sanh");
    beanBag(world, ax + 1.4, az - 0.8, 0xe86a92, ax, az, "sanh");
    bookStack(world, ax + 0.2, az, 4);
    shelf(world, b[0] + 0.55, az, 3, Math.PI / 2, 1.3);
    floorLamp(world, b[0] + 1.1, az + 2.8);
    sign(world, "Góc ghế lười", b[0] + 0.5, 2.15, az, { size: 0.28, fg: "#1d6b6d", border: "#50b1b3" });
    place(world, "goc-ghe-luoi", "Góc ghế lười", "sanh", ax + 0.4, az - 2.4);
  }

  /* Góc Thử thách tiếng Việt (đông nam): thảm ô cờ, bục dấu hỏi, bảng đen trên tường.
     Câu đố ở assets/3d/daily-content.js; play.html mở bảng đố khi bấm (kind "daily"). */
  function buildChallenge(world, x, z) {
    var b = LOBBY, s = 0.9;
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++)
      MS3D.box(s, 0.03, s, (i + j) % 2 ? C.teal : 0xfff1d6, x + (i - 1.5) * s, 0.015, z + (j - 1.5) * s, world.scene);
    // bục đố + dấu hỏi lơ lửng; hôm nay đã chơi thì mặt bục hoá vàng
    MS3D.cyl(0.5, 0.62, 0.9, 10, C.tealInk, x, 0.45, z, world.scene).castShadow = true;
    var topMat = new THREE.MeshLambertMaterial({ color: C.orange, flatShading: true });
    var top = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 10), topMat); top.position.set(x, 0.95, z); world.scene.add(top);
    var q = sign(world, "?", x, 1.85, z, { size: 0.8, bg: "#ff8300", fg: "#ffffff" });
    world.updaters.push(function (dt, t) { q.position.y = 1.85 + Math.sin(t * 2) * 0.1; });
    world.addCircle(x, z, 0.7);
    // hai đệm ngồi
    [[0.3, -1.35, 0xf6c84c], [0.3, 1.35, 0xe86a92]].forEach(function (c) {
      MS3D.cyl(0.32, 0.36, 0.28, 10, c[2], x + c[0], 0.14, z + c[1], world.scene).castShadow = true;
      world.addCircle(x + c[0], z + c[1], 0.34);
    });
    // bảng đen trên tường đông
    var w = wallSpot(world, b[1], z, -Math.PI / 2);
    MS3D.box(3.3, 1.6, 0.08, C.woodDark, 0, 1.6, 0.26, w.g);
    MS3D.box(3.1, 1.4, 0.04, 0x1f4d3a, 0, 1.6, 0.31, w.g);
    [[-0.9, 1.9, 1.1], [-0.6, 1.6, 1.7], [-1.0, 1.3, 0.9], [0.9, 1.25, 0.7]].forEach(function (c) { MS3D.box(c[2], 0.05, 0.01, 0xe8efe9, c[0], c[1], 0.34, w.g); });
    sign(world, "Thử thách tiếng Việt", 0, 2.75, 0.5, { size: 0.3, bg: "#ff8300", fg: "#1f1406" }, w.g);
    var it = { kind: "daily", x: x - 1.2, z: z, r: 1.6, label: "Thử thách tiếng Việt", sub: "Ca dao, tục ngữ, từ vựng · mỗi lần 3 câu mới" };
    world.interactables.push(it);   // đứng trước bục (phía sảnh)
    world.pickArea(0, 1.6, 0.3, 3.3, 1.6, 0.2, w.g);
    world.pickArea(x, 1.1, z, 1.3, 2.2, 1.3, null, it);
    var p = w.p(0, 2.6);
    place(world, "thu-thach", "Góc Thử thách tiếng Việt", "sanh", p[0], p[1]);
    world.setDailyDone = function (done) {
      topMat.color.setHex(done ? 0xffc83d : C.orange);
      topMat.emissive.setHex(done ? 0x5a4300 : 0x000000);
    };
  }

  /* Bảng vàng: mỗi khoá một huy chương. Vàng = 5 sao, xanh = đã học, mờ = chưa học.
     o.lift: nâng bảng lên (khi đứng sau sân khấu); o.it: [x, z] chỗ đứng xem bảng. */
  function buildHonorBoard(world, x, z, o) {
    o = o || {};
    var y = 1.65 + (o.lift || 0), itp = o.it || [x, z + 1.6];
    MS3D.box(4.8, 2.1, 0.14, 0xd4a017, x, y, z, world.scene);
    MS3D.box(4.5, 1.8, 0.04, 0x1d6b6d, x, y, z + 0.08, world.scene);
    sign(world, "Bảng vàng", x, y + 1.3, z + 0.25, { size: 0.34, bg: "#ffc83d", fg: "#1f1406" });
    var medals = [], courses = (window.MS && MS.COURSES) || [], n = Math.min(courses.length, 8), per = Math.min(4, n);
    for (var i = 0; i < n; i++) {
      var row = Math.floor(i / per), col = i % per, cols = Math.min(per, n - row * per);
      var mx = x + (col - (cols - 1) / 2) * 1.0, my = y + 0.35 - row * 0.75;
      var mat = new THREE.MeshLambertMaterial({ color: 0x2a4f50, flatShading: true });
      var md = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 14), mat);
      md.rotation.x = Math.PI / 2; md.position.set(mx, my, z + 0.13); world.scene.add(md);
      var ribbon = MS3D.box(0.12, 0.22, 0.02, 0x2a4f50, mx, my + 0.3, z + 0.11, world.scene);
      medals.push({ mat: mat, ribbon: ribbon, course: courses[i] });
    }
    world.refreshBoard = function () {
      medals.forEach(function (m) {
        var p = window.MS && MS.getProgress ? MS.getProgress(m.course.id) : null;
        var col = p && p.best >= (m.course.maxStars || 5) ? 0xffc83d : p ? 0x50b1b3 : 0x2a4f50;
        m.mat.color.setHex(col); m.mat.emissive.setHex(col === 0xffc83d ? 0x5a4300 : 0x000000);
      });
    };
    world.interactables.push({ kind: "board", x: itp[0], z: itp[1], r: o.it ? 1.3 : 1.7, label: "Xem bảng vàng", sub: "Huy chương các khoá học" });
    world.pickArea(x, y, z + 0.1, 4.8, 2.2, 0.3);
    place(world, "bang-vang", "Bảng vàng", "sanh", itp[0], itp[1] + 0.6);
  }

  /* Khung ảnh kỷ niệm: ảnh các cô giáo Mở Sách (thêm vào MS3D.MEMORY_PHOTOS). */
  function placeholderTex(i) {
    var c = document.createElement("canvas"); c.width = 128; c.height = 160; var g = c.getContext("2d");
    g.fillStyle = ["#e2f3f3", "#fff1e2", "#f4f9f9"][i % 3]; g.fillRect(0, 0, 128, 160);
    g.fillStyle = "#b9d9d9"; g.beginPath(); g.arc(64, 62, 26, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(64, 140, 46, 40, 0, Math.PI, 0); g.fill();
    g.fillStyle = "#1d6b6d"; g.font = "600 15px 'Be Vietnam Pro', system-ui, sans-serif"; g.textAlign = "center"; g.fillText((window.MS && MS.tr ? MS.tr("Sắp có ảnh") : "Sắp có ảnh"), 64, 108);
    return new THREE.CanvasTexture(c);
  }
  function buildPhotoWall(world, x, z, rot) {
    var n = 3, photos = MS3D.MEMORY_PHOTOS || [], w = wallSpot(world, x, z, rot);
    for (var i = 0; i < n; i++) {
      // khung ngang (ảnh 4:3)
      var fx = (i - 1) * 1.55, fy = i === 1 ? 1.8 : 1.6;
      MS3D.box(1.36, 1.06, 0.08, i === 1 ? C.orange : C.woodDark, fx, fy, 0.32, w.g);
      var mat = new THREE.MeshBasicMaterial({ map: placeholderTex(i) });
      var pic = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9), mat);
      pic.position.set(fx, fy, 0.37); w.g.add(pic);
      var src = photos[i] && photos[i].src;
      if (src && (src.indexOf("data:") === 0 || location.protocol.indexOf("http") === 0)) {
        (function (mat, src) { new THREE.TextureLoader().load(src, function (t) { mat.map = t; mat.needsUpdate = true; }); })(mat, src);
      }
    }
    sign(world, "Kỷ niệm Mở Sách", 0, 2.95, 0.5, { size: 0.3, fg: "#a85000", border: "#ff8300" }, w.g);
    w.it({ kind: "photos", r: 1.8, label: "Xem ảnh kỷ niệm", sub: "Cô và trò Mở Sách" }, 0, 1.9);
    world.pickArea(0, 1.7, 0.4, 4.6, 1.5, 0.3, w.g);
    var p = w.p(0, 2.5);
    place(world, "anh-ky-niem", "Khung ảnh kỷ niệm", "sanh", p[0], p[1]);
  }

  /* Góc pantry: bình nước uống chung, lò vi sóng, tủ lạnh. Cho vui.
     (x, z) là tâm góc trên đường tường, rot xoay mặt trước (+z) vào sảnh. */
  function buildPantry(world, x, z, rot) {
    var W = wallSpot(world, x, z, rot), g = W.g;
    // bình nước
    var wx = -1.9, wz = 0.6;
    MS3D.box(0.55, 1.0, 0.5, 0xe9eef0, wx, 0.5, wz, g);
    MS3D.box(0.12, 0.08, 0.1, 0x3d7dd8, wx - 0.1, 0.78, wz + 0.28, g);
    MS3D.box(0.12, 0.08, 0.1, 0xe53935, wx + 0.1, 0.78, wz + 0.28, g);
    var bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 12), new THREE.MeshLambertMaterial({ color: 0x8fd3f4, transparent: true, opacity: 0.75 }));
    bottle.position.set(wx, 1.32, wz); g.add(bottle);
    var bubbles = [];
    for (var i = 0; i < 4; i++) { var bb = MS3D.ball(0.04, 0xffffff, wx, 1.05, wz, g, 0); bb.visible = false; bubbles.push(bb); }
    W.box(wx - 0.3, wx + 0.3, wz - 0.3, wz + 0.3);
    W.it({ kind: "water", r: 1.0, label: "Uống nước", sub: "Bình nước uống chung" }, wx, wz + 1.1);
    world.pickArea(wx, 0.85, wz, 0.65, 1.7, 0.6, g);
    // quầy + lò vi sóng
    var cx = -0.2, cz = 0.55;
    MS3D.box(1.6, 0.9, 0.6, C.wood, cx, 0.45, cz, g);
    MS3D.box(1.7, 0.06, 0.66, 0xf3efe7, cx, 0.93, cz, g);
    MS3D.box(0.62, 0.38, 0.42, 0xb9bdb7, cx - 0.3, 1.15, cz, g);
    var win = new THREE.MeshLambertMaterial({ color: 0x2b2f33, emissive: 0x000000 });
    var wm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.26, 0.02), win); wm.position.set(cx - 0.36, 1.15, cz + 0.22); g.add(wm);
    MS3D.box(0.1, 0.26, 0.02, 0x555a5e, cx - 0.08, 1.15, cz + 0.22, g);
    MS3D.cyl(0.08, 0.1, 0.16, 8, 0xff8300, cx + 0.45, 1.04, cz, g); // cốc
    W.box(cx - 0.85, cx + 0.85, cz - 0.35, cz + 0.35);
    W.it({ kind: "microwave", r: 0.9, label: "Hâm nóng", sub: "Lò vi sóng" }, cx - 0.3, cz + 1.1);
    world.pickArea(cx - 0.3, 1.15, cz, 0.7, 0.45, 0.5, g);
    // tủ lạnh có cửa mở được (bản lề phía trước, mở ra phía sảnh)
    var fx = 1.7, fz = 0.6;
    MS3D.box(0.9, 1.9, 0.66, 0xf2f6f7, fx, 0.95, fz, g);
    MS3D.box(0.86, 0.04, 0.6, 0xc9d3d3, fx, 0.9, fz + 0.02, g);
    MS3D.ball(0.1, 0xff8300, fx - 0.15, 0.6, fz + 0.2, g, 0);
    MS3D.ball(0.09, 0x6cbf5a, fx + 0.15, 0.6, fz + 0.2, g, 0);
    MS3D.box(0.12, 0.22, 0.12, 0xffffff, fx, 1.15, fz + 0.15, g);
    MS3D.box(0.2, 0.14, 0.26, 0x50b1b3, fx + 0.2, 1.06, fz + 0.15, g); // cuốn sách ai để quên
    var hinge = new THREE.Group(); hinge.position.set(fx - 0.45, 0, fz + 0.34); g.add(hinge);
    MS3D.box(0.9, 1.88, 0.06, 0xf7fafb, 0.45, 0.95, 0.02, hinge);
    MS3D.box(0.04, 0.5, 0.05, 0x9aa5a5, 0.82, 1.2, 0.07, hinge);
    [[0.25, 1.5, 0xe53935], [0.55, 1.6, 0x50b1b3], [0.4, 1.3, 0xffc83d]].forEach(function (q) { MS3D.box(0.1, 0.1, 0.02, q[2], q[0], q[1], 0.06, hinge); });
    W.box(fx - 0.45, fx + 0.45, fz - 0.33, fz + 0.33);
    W.it({ kind: "fridge", r: 0.9, label: "Mở tủ lạnh", sub: "Tủ lạnh chung" }, fx, fz + 1.2);
    world.pickArea(fx, 0.95, fz, 0.95, 1.9, 0.7, g);
    MS3D.shadow(g);
    var pp = W.p(-0.9, 2.0);
    place(world, "pantry", "Góc pantry (nước, tủ lạnh)", "sanh", pp[0], pp[1]);

    var doorOpen = 0, doorWant = 0, micro = 0, bubbleT = 0;
    world.pantry = {
      toggleFridge: function () { doorWant = doorWant ? 0 : 1; return doorWant; },
      microwave: function () { micro = 3; },
      water: function () { bubbleT = 1.6; }
    };
    world.updaters.push(function (dt, t) {
      doorOpen += (doorWant - doorOpen) * Math.min(1, dt * 6);
      hinge.rotation.y = -doorOpen * 1.7;
      if (micro > 0) { micro -= dt; win.emissive.setHex(micro > 0 ? 0xffc85a : 0x000000); }
      bubbles.forEach(function (bb, i) {
        bb.visible = bubbleT > 0;
        if (bubbleT > 0) bb.position.set(wx + Math.sin(t * 3 + i) * 0.08, 1.05 + ((t * 0.6 + i * 0.25) % 0.55), wz);
      });
      if (bubbleT > 0) bubbleT -= dt;
    });
  }

  /* ---------- KHÔNG GIAN HỌC: kệ khoá học theo chuỗi ---------- */
  function buildHoc(world, slot, zone) {
    var b = slot.bounds;
    floor(world, b, 0xe6d3b3, 0, "wood");   // sàn gỗ ấm cho lớp học
    var cx = (b[0] + b[1]) / 2;
    var SERIES_COL = { "nghi-luan": C.orange, "ke-chuyen": C.teal }, EXTRA_COL = [0xe86a92, 0x3d7dd8, 0x6cbf5a];
    var seriesList = (window.MS && MS.SERIES) || [];
    var courses = (window.MS && MS.COURSES) || [];
    world.courseLabels = [];
    var dir = -1, startZ = slot.door[1] + dir * 5.5;
    seriesList.slice(0, 3).forEach(function (se, si) {
      var list = courses.filter(function (c) { return c.series === se.id; });
      if (!list.length) return;
      var rowZ = startZ + dir * si * 5.2;
      var width = b[1] - b[0] - 2;
      var gap = Math.min(3.4, width / list.length);
      var rowW = Math.min(width, gap * list.length + 1), sc = SERIES_COL[se.id] !== undefined ? SERIES_COL[se.id] : EXTRA_COL[si % EXTRA_COL.length];
      var soft = new THREE.Color(sc).lerp(new THREE.Color(0xffffff), 0.72).getHex();
      // thảm màu chia khu cho từng chuỗi khoá học
      floor(world, [cx - rowW / 2 - 0.5, cx + rowW / 2 + 0.5, rowZ + dir * 2.1, rowZ + 1.3], sc, 0.032);   // nằm trên thảm dài giữa lớp (mặt thảm dài cao ~0.03)
      floor(world, [cx - rowW / 2 - 0.35, cx + rowW / 2 + 0.35, rowZ + dir * 1.95, rowZ + 1.15], soft, 0.034, "carpet");
      shelf(world, cx, rowZ + dir * 1.5, rowW, 0, 1.3);
      sign(world, se.name, cx, 1.6, rowZ + dir * 1.5, { size: 0.3, bg: "#1d6b6d", fg: "#ffffff" });
      list.forEach(function (c, i) {
        var x = cx + (i - (list.length - 1) / 2) * gap;
        var open = c.status === "open" && c.url;
        // bàn học: chân gỗ, mặt bàn, tấm ốp trước màu của chuỗi (khoá chưa mở thì nhạt màu)
        var deskCol = open ? sc : new THREE.Color(sc).lerp(new THREE.Color(0xc9d3d3), 0.75).getHex();
        [[-0.4, -0.27], [0.4, -0.27], [-0.4, 0.27], [0.4, 0.27]].forEach(function (q) { MS3D.box(0.07, 0.72, 0.07, C.woodDark, x + q[0], 0.36, rowZ + q[1], world.scene); });
        MS3D.box(1.0, 0.07, 0.72, C.wood, x, 0.76, rowZ, world.scene).castShadow = true;
        MS3D.box(0.92, 0.5, 0.04, deskCol, x, 0.47, rowZ + 0.32, world.scene);
        MS3D.box(0.92, 0.5, 0.04, deskCol, x, 0.47, rowZ - 0.32, world.scene);
        var bk = new THREE.Group(); bk.position.set(x, 0.86, rowZ); bk.rotation.x = -0.35; world.scene.add(bk);
        var col = open ? C.orange : 0x9aa5a5;
        MS3D.box(0.5, 0.06, 0.62, col, -0.25, 0, 0, bk).rotation.z = 0.2;
        MS3D.box(0.5, 0.06, 0.62, col, 0.25, 0, 0, bk).rotation.z = -0.2;
        MS3D.box(0.86, 0.04, 0.56, 0xffffff, 0, 0.05, 0, bk);
        if (open) {
          var star = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), MS3D.mat(C.orange, { emissive: 0x663300 }));
          star.position.set(x, 1.55, rowZ); world.scene.add(star);
          world.updaters.push(function (dt, t) { star.rotation.y = t * 2; star.position.y = 1.55 + Math.sin(t * 2 + i) * 0.08; });
          place(world, "khoa-" + c.id, c.code + " · " + c.title, zone.id, x, rowZ + 1.2);
        }
        var lab = sign(world, c.code, x, 1.95, rowZ, { size: 0.26, bg: open ? "#ff8300" : "#e9f3f3", fg: open ? "#1f1406" : "#4a5d5e" });
        world.courseLabels.push({ sprite: lab, course: c, x: x, z: rowZ, open: open });
        world.addBox(x - 0.45, x + 0.45, rowZ - 0.35, rowZ + 0.35);
        world.interactables.push({
          kind: "course", x: x, z: rowZ + 0.9, r: 1.4, disabled: !open,
          label: open ? "Mở khoá học" : "Sắp mở", sub: c.code + " · " + c.title, url: c.url, id: c.id, room: zone.id
        });
        world.pickArea(x, 0.95, rowZ, 1.0, 1.9, 0.8);
      });
    });
    // cây của cô Vi + góc học bàn (phía sau phòng)
    world.hocPlants = [MS3D.aloe(world, b[0] + 0.9, slot.door[1] - 1.0, 1.0), MS3D.monstera(world, b[1] - 1.0, slot.door[1] - 1.2, 1.0)];
    MS3D.monstera(world, b[0] + 1.0, b[2] + 1.0, 1.1);
    MS3D.monstera(world, b[1] - 1.0, b[2] + 1.0, 1.1);
    MS3D.aloe(world, cx - 2.6, b[2] + 0.6, 0.8);
    MS3D.aloe(world, cx + 2.6, b[2] + 0.6, 0.8);
    MS3D.hamburgerBoard(world, cx, b[2] + 0.3, zone.id);
    [-4.3, 4.3].forEach(function (dx, i) {
      MS3D.readingTable(world, cx + dx, b[2] + 3.4, 2.4, 0.9, { stools: [[-0.6, 0.75], [0.6, 0.75]], lamps: [i ? 0.85 : -0.85], books: [[0.1 * (i ? -1 : 1), 0.1, i ? 0xe86a92 : 0x50b1b3, 0.2]] });
    });
    place(world, "bang-hamburger", "Bảng bánh hamburger (Không gian học)", zone.id, cx, b[2] + 2.0);
    classroomDecor(world, b, cx, slot);
    // thảm dài từ cửa vào cuối phòng + tranh tục ngữ về việc học trên hai tường bên
    MS3D.box(2.6, 0.02, b[3] - b[2] - 3, C.teal, cx, 0.012, (b[2] + b[3]) / 2 - 0.5, world.scene);
    MS3D.box(2.2, 0.025, b[3] - b[2] - 3.4, 0xfff6ea, cx, 0.016, (b[2] + b[3]) / 2 - 0.5, world.scene);
    [["Học, học nữa, học mãi", 0xff8300], ["Có công mài sắt, có ngày nên kim", 0x50b1b3]].forEach(function (q, i) {
      wallPoster(world, b[0], slot.door[1] - 4 - i * 6, Math.PI / 2, q[0], q[1]);
    });
    [["Học thầy không tày học bạn", 0xe86a92], ["Ăn vóc học hay", 0x3d7dd8]].forEach(function (q, i) {
      wallPoster(world, b[1], slot.door[1] - 4 - i * 6, -Math.PI / 2, q[0], q[1]);
    });
  }

  /* Lớp học: cửa sổ có rèm (tường tây, nhìn ra trời), đồng hồ treo tường chạy theo giờ thật, dây cờ giăng ngang. */
  function classroomDecor(world, b, cx, slot) {
    var scene = world.scene;
    [slot.door[1] - 7, slot.door[1] - 13.5].forEach(function (z) {
      var w = wallSpot(world, b[0], z, Math.PI / 2), g = w.g;
      MS3D.box(1.8, 1.35, 0.08, 0xfffaf0, 0, 1.65, 0.24, g);
      var glass = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.15), new THREE.MeshBasicMaterial({ color: 0xbfe8f5 }));
      glass.position.set(0, 1.65, 0.29); g.add(glass);
      MS3D.ball(0.18, 0xffffff, -0.35, 1.9, 0.295, g, 0).scale.set(1.6, 0.6, 0.1);   // mây
      MS3D.box(0.05, 1.15, 0.03, 0xfffaf0, 0, 1.65, 0.3, g); MS3D.box(1.6, 0.05, 0.03, 0xfffaf0, 0, 1.65, 0.3, g);
      MS3D.box(2.0, 0.08, 0.2, C.wood, 0, 0.96, 0.32, g);                                 // bậu cửa
      MS3D.cyl(0.08, 0.06, 0.12, 8, 0xc8643b, 0.55, 1.06, 0.32, g); MS3D.ball(0.12, 0x6cbf5a, 0.55, 1.2, 0.32, g, 0);   // chậu cây nhỏ
      [-1, 1].forEach(function (sd) { MS3D.box(0.32, 1.6, 0.06, C.orange, sd * 1.05, 1.62, 0.34, g); });
      MS3D.box(2.5, 0.06, 0.06, C.woodDark, 0, 2.46, 0.36, g);                           // thanh treo rèm
    });
    // đồng hồ treo tường bắc
    var cw = wallSpot(world, cx + 3.6, b[2], 0), cg = cw.g;
    var face = MS3D.cyl(0.4, 0.4, 0.06, 24, 0xffffff, 0, 2.0, 0.28, cg); face.rotation.x = Math.PI / 2;
    var rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.04, 6, 24), MS3D.mat(C.orange)); rim.position.set(0, 2.0, 0.3); cg.add(rim);
    for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; MS3D.box(0.03, k % 3 ? 0.05 : 0.09, 0.01, 0x1b2a2b, Math.sin(a) * 0.32, 2.0 + Math.cos(a) * 0.32, 0.32, cg).rotation.z = -a; }
    function hand(len, wdt, col) { var p = new THREE.Group(); p.position.set(0, 2.0, 0.33); cg.add(p); MS3D.box(wdt, len, 0.01, col, 0, len / 2 - 0.03, 0, p); return p; }
    var hh = hand(0.2, 0.04, 0x1b2a2b), mh = hand(0.3, 0.03, 0x1b2a2b), sh = hand(0.32, 0.012, 0xe53935);
    MS3D.ball(0.03, 0x1b2a2b, 0, 2.0, 0.34, cg, 0);
    world.updaters.push(function () {
      var d = new Date(), sec = d.getSeconds() + d.getMilliseconds() / 1000, mn = d.getMinutes() + sec / 60, hr = (d.getHours() % 12) + mn / 60;
      sh.rotation.z = -sec / 60 * Math.PI * 2; mh.rotation.z = -mn / 60 * Math.PI * 2; hh.rotation.z = -hr / 12 * Math.PI * 2;
    });
    // dây cờ giăng ngang lớp (gần cửa và cuối lớp)
    var tri = new THREE.BufferGeometry(); tri.setAttribute("position", new THREE.Float32BufferAttribute([-0.13, 0, 0, 0.13, 0, 0, 0, -0.28, 0], 3)); tri.computeVertexNormals();
    var cols = [C.orange, C.teal, 0xf6c84c, 0xe86a92, 0x6cbf5a];
    [slot.door[1] - 2.4, b[2] + 4.6].forEach(function (z, li) {
      for (var i = 0; i <= 18; i++) {
        var t = i / 18, f = new THREE.Mesh(tri, new THREE.MeshLambertMaterial({ color: cols[(i + li) % cols.length], side: THREE.DoubleSide }));
        f.position.set(b[0] + 0.3 + t * (b[1] - b[0] - 0.6), 2.6 - Math.sin(t * Math.PI) * 0.4, z); scene.add(f);
      }
    });
  }

  MS3D.refreshCourseLabels = function (world) {
    (world.courseLabels || []).forEach(function (it) {
      var p = window.MS && MS.getProgress ? MS.getProgress(it.course.id) : null;
      var text = it.course.code + (p && p.best ? "  ★" + p.best : "");
      if (it.sprite.userData.text === text) return;
      var s = MS3D.label(text, { size: 0.26, bg: it.open ? "#ff8300" : "#e9f3f3", fg: it.open ? "#1f1406" : "#4a5d5e" });
      it.sprite.material.map.dispose(); it.sprite.material.dispose();
      it.sprite.material = s.material; it.sprite.scale.copy(s.scale);
      it.sprite.userData.text = text;
    });
    if (world.refreshBoard) world.refreshBoard();
    if (world.refreshTree) world.refreshTree();
  };

  /* ---------- VƯỜN ĐỌC SÁCH (đổi theo 4 mùa) ---------- */
  function buildVuon(world, slot, zone) {
    var b = slot.bounds;
    var grass = floor(world, b, C.grass, 0, "grass");
    var grassEntry = { mat: grass.material, day: C.grass, night: 0x4f7f5a };
    world.nightMats.push(grassEntry);
    var cx = (b[0] + b[1]) / 2 + 2, cz = (b[2] + b[3]) / 2 - 1;
    for (var i = 0; i < 7; i++) MS3D.cyl(0.45, 0.45, 0.05, 6, C.stone, b[0] + 1 + i * 1.3, 0.03, (i % 2) * 0.3 - 0.15, world.scene);
    MS3D.cyl(3.6, 3.7, 0.22, 20, C.stone, cx, 0.11, cz, world.scene);
    var water = MS3D.cyl(3.25, 3.25, 0.24, 20, C.water, cx, 0.13, cz, world.scene);
    water.material = new THREE.MeshLambertMaterial({ color: C.water, flatShading: true });
    world.nightMats.push({ mat: water.material, day: C.water, night: 0x2b5f8a });
    world.addCircle(cx, cz, 3.6);
    [[1.6, 0.8], [-1.2, -1.6], [-0.4, 1.9]].forEach(function (p) { MS3D.cyl(0.32, 0.32, 0.03, 7, 0x4f9d58, cx + p[0], 0.27, cz + p[1], world.scene); });

    // Cá Heo bơi quanh hồ, thỉnh thoảng nhảy lên
    var nem = MS3D.makeDolphin(); nem.scale.setScalar(0.75); world.scene.add(nem);
    world.dolphin = nem;
    world.updaters.push(function (dt, t) {
      var a = t * 0.55, R = 2.1;
      var x = cx + Math.cos(a) * R, z = cz + Math.sin(a) * R;
      var cyc = t % 7, jump = cyc > 5.6 ? Math.sin((cyc - 5.6) / 1.4 * Math.PI) : 0;
      nem.position.set(x, 0.2 + jump * 1.3 + Math.sin(t * 3) * 0.03, z);
      nem.rotation.y = Math.PI - a;
      nem.rotation.x = jump ? Math.cos((cyc - 5.6) / 1.4 * Math.PI) * -0.6 : 0;
      nem.userData.animate(dt);
    });
    world.interactables.push({ kind: "dolphin", x: cx - 3.9, z: cz, r: 1.6, label: "Chào Cá Heo", sub: "Linh vật chuỗi Nghị luận" });
    world.interactables.push({ kind: "dolphin", x: cx, z: cz + 3.9, r: 1.6, label: "Chào Cá Heo", sub: "Linh vật chuỗi Nghị luận" });
    world.pick(nem);

    // cây: tán và hoa dùng vật liệu riêng để đổi màu theo mùa
    var leafA = new THREE.MeshLambertMaterial({ color: 0x4f9d58, flatShading: true });
    var leafB = new THREE.MeshLambertMaterial({ color: 0x6cbf5a, flatShading: true });
    var bloomMat = new THREE.MeshLambertMaterial({ color: 0xf8a5c2, flatShading: true });
    var blooms = [], foliage = [];
    // góc tây nam để dành cho Góc kể chuyện (story-corner.js)
    [[b[0] + 3, b[2] + 2.5], [b[0] + 10.5, b[3] - 1.4], [b[0] + 9, b[2] + 2], [b[1] - 2.5, b[2] + 2.5], [b[1] - 2, b[3] - 3], [b[1] - 6, b[3] - 1.8], [b[0] + 12.5, b[2] + 1.8], [b[1] - 2.2, cz + 0.5]]
      .forEach(function (p, k) { tree(world, p[0], p[1], k, leafA, leafB, bloomMat, blooms, foliage); });
    var flowers = new THREE.Group(); world.scene.add(flowers);
    for (var f = 0; f < 18; f++) {
      var fx = b[0] + 1.5 + ((f * 53) % 19), fz = b[2] + 1 + ((f * 31) % 18);
      if (Math.hypot(fx - cx, fz - cz) < 4.3 || (Math.abs(fz) < 1.2 && fx < b[0] + 10) || (fx < b[0] + 7 && fz > b[3] - 7)) continue;
      MS3D.ball(0.12, BOOK_COLORS[f % 6], fx, 0.15, fz, flowers, 0);
    }
    if (MS3D.buildStoryCorner) MS3D.buildStoryCorner(world, b, { sign: sign, place: place });
    if (MS3D.buildGardenPlay) MS3D.buildGardenPlay(world, b, { sign: sign, place: place });   // xích đu, võng, bù nhìn, biển chỉ đường, cây thơ, thả diều
    // ghế gỗ + 3 cuốn sách mẫu; cả ba ghế trong vườn quay mặt vào hồ
    var by = b[2] + 3.4, bxx = b[0] + 6, br = faceRot(bxx, by, cx, cz), bc = Math.cos(br), bs = Math.sin(br);
    benchAt(world, bxx, by, br);
    [0xff8300, 0x50b1b3, 0xf6c84c].forEach(function (c, k) {
      var lx = -0.5 + k * 0.5, bk = MS3D.box(0.34, 0.08, 0.44, c, bxx + lx * bc, 0.54, by - lx * bs, world.scene); bk.rotation.y = br + (k - 1) * 0.15;
    });
    var fx0 = bxx - Math.sin(br) * 1.1, fz0 = by - Math.cos(br) * 1.1;   // chỗ đứng trước mặt ghế
    world.interactables.push({ kind: "link", x: fx0, z: fz0, r: 1.5, label: "Đọc đoạn mẫu", sub: "3 cuốn sách nhỏ trên ghế gỗ", url: "vuon-doc-sach.html", room: zone.id });
    world.pickArea(bxx, 0.6, by, 1.9, 1.0, 1.9);
    place(world, "ghe-da", "Ghế gỗ đọc đoạn mẫu", zone.id, fx0, fz0);
    [[cx + 1, b[3] - 1.2], [cx + 5.2, cz - 0.5]].forEach(function (p) { benchAt(world, p[0], p[1], faceRot(p[0], p[1], cx, cz)); });

    // đài phun nước nhỏ giữa hồ: hai tầng đá, tia nước bắn lên rơi xuống, gợn sóng lan ra
    MS3D.cyl(0.62, 0.7, 0.28, 14, C.stone, cx, 0.3, cz, world.scene);
    MS3D.cyl(0.52, 0.52, 0.03, 14, C.water, cx, 0.45, cz, world.scene);
    MS3D.cyl(0.1, 0.13, 0.6, 8, C.stone, cx, 0.75, cz, world.scene);
    MS3D.cyl(0.36, 0.22, 0.12, 12, C.stone, cx, 1.08, cz, world.scene);
    MS3D.cyl(0.3, 0.3, 0.02, 12, C.water, cx, 1.14, cz, world.scene);
    var jet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.55, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.7 }));
    jet.position.set(cx, 1.42, cz); world.scene.add(jet);
    var NP = 48, dropGeo = new THREE.BufferGeometry(), dp = new Float32Array(NP * 3);
    dropGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    var drops = new THREE.Points(dropGeo, new THREE.PointsMaterial({ color: 0xcff3ff, size: 0.09, transparent: true, opacity: 0.9 }));
    world.scene.add(drops);
    var rings = [0, 1].map(function () { var rg = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.66, 28), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false })); rg.rotation.x = -Math.PI / 2; rg.position.set(cx, 0.27, cz); world.scene.add(rg); return rg; });
    world.updaters.push(function (dt, t) {
      for (var i = 0; i < NP; i++) {   // mỗi giọt bay theo đường cong, lặp lại
        var ph = ((t * 0.9 + i / NP) % 1), a = i * 2.39996, v = 0.75 + (i % 3) * 0.12;
        dp[i * 3] = cx + Math.cos(a) * v * ph * 0.9; dp[i * 3 + 1] = 1.65 + 1.2 * ph - 2.6 * ph * ph; dp[i * 3 + 2] = cz + Math.sin(a) * v * ph * 0.9;
      }
      dropGeo.attributes.position.needsUpdate = true;
      jet.scale.y = 1 + Math.sin(t * 9) * 0.08;
      rings.forEach(function (rg, k) { var p = (t * 0.45 + k * 0.5) % 1; rg.scale.setScalar(1 + p * 1.8); rg.material.opacity = 0.5 * (1 - p); });
    });

    // đèn lồng: sáng khi trời tối
    var lampMat = new THREE.MeshLambertMaterial({ color: 0xffb347, emissive: 0x000000, flatShading: true });
    world.nightMats.push({ mat: lampMat, emissive: true, day: 0x000000, night: 0xff9a2e });
    var glowTex = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d");
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,190,90,.9)"); gr.addColorStop(1, "rgba(255,190,90,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
    })();
    var glows = [];
    [[b[0] + 1.6, 2.2], [b[0] + 1.6, -2.2], [cx - 4.4, cz - 3.2], [cx + 3.6, cz + 4.2], [b[1] - 1.5, b[2] + 6]].forEach(function (p) {
      MS3D.cyl(0.07, 0.09, 1.7, 6, 0x4a3424, p[0], 0.85, p[1], world.scene);
      var lamp = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), lampMat); lamp.scale.y = 1.3; lamp.position.set(p[0], 1.9, p[1]); world.scene.add(lamp);
      MS3D.box(0.3, 0.06, 0.3, 0xa85000, p[0], 2.22, p[1], world.scene);
      var gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      gl.scale.set(1.8, 1.8, 1); gl.position.set(p[0], 1.9, p[1]); gl.visible = false; world.scene.add(gl); glows.push(gl);
      world.addCircle(p[0], p[1], 0.18);
    });
    world.interactables.push({ kind: "time", x: b[0] + 2.4, z: 2.2, r: 1.2, label: "Đổi ngày/đêm", sub: "Bật đèn lồng trong vườn" });
    world.pickArea(b[0] + 1.6, 1.2, 2.2, 0.7, 2.4, 0.7);

    var sg = new THREE.BufferGeometry(), pts = [];
    for (var s = 0; s < 120; s++) pts.push(-20 + ((s * 97) % 80), 14 + ((s * 7) % 8), -45 + ((s * 61) % 30));
    sg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    var stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.25, fog: false }));
    stars.visible = false; world.scene.add(stars);
    var prev = world.onTime;
    world.onTime = function (t) {
      glows.forEach(function (g) { g.visible = t === "night"; });
      stars.visible = t === "night";
      if (prev) prev(t);
    };

    // hạt rơi theo mùa (cánh hoa / lá / tuyết)
    var fall = MS3D.fallingPoints(world.scene, [b[0] + 0.5, b[1] - 0.5, b[2] + 0.5, b[3] - 0.5], 0xffffff, 140);
    fall.visible = false;
    var fallSpeed = 0.5;
    world.updaters.push(function (dt, t) { if (fall.visible) fall.userData.fall(dt, t, fallSpeed, 0.4); });

    world.setSeason = function (id) {
      var s = MS3D.getSeason(id);
      leafA.color.setHex(s.leaf); leafB.color.setHex(s.leaf2);
      blooms.forEach(function (m) { m.visible = !!s.bloom; });
      if (s.bloom) bloomMat.color.setHex(s.bloom);
      foliage.forEach(function (m) { m.scale.setScalar(s.id === "dong" ? 0.75 : 1); });
      flowers.visible = s.flowers;
      grassEntry.day = s.grass;
      fall.visible = !!s.fall;
      if (s.fall) { fall.material.color.setHex(s.fall.color); fallSpeed = s.fall.speed; }
      world.season = s.id;
      world.setTime(world.time);
      return s;
    };
  }

  function tree(world, x, z, k, leafA, leafB, bloomMat, blooms, foliage) {
    MS3D.cyl(0.16, 0.22, 1.2, 6, 0x7a5232, x, 0.6, z, world.scene);
    var parts = [];
    if (k % 2) {
      var c1 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.6, 7), leafA); c1.position.set(x, 1.8, z); world.scene.add(c1); parts.push(c1);
      var c2 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.3, 7), leafB); c2.position.set(x, 2.6, z); world.scene.add(c2); parts.push(c2);
    } else {
      var b1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 0), leafA); b1.position.set(x, 2.0, z); world.scene.add(b1); parts.push(b1);
      var b2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), leafB); b2.position.set(x + 0.4, 2.5, z + 0.2); world.scene.add(b2); parts.push(b2);
      // hoa trên cây (đào mùa xuân, phượng mùa hạ)
      for (var i = 0; i < 9; i++) {
        var a = i * 2.4, bl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 0), bloomMat);
        bl.position.set(x + Math.cos(a) * 0.95, 1.8 + (i % 3) * 0.35, z + Math.sin(a) * 0.95); world.scene.add(bl); blooms.push(bl);
      }
    }
    Array.prototype.push.apply(foliage, parts);
    parts.forEach(function (m) { m.castShadow = true; });
    world.addCircle(x, z, 0.35);
  }

  /* ---------- KHÔNG GIAN ĐỌC (dựng ở doc-room.js) ---------- */
  function buildDoc(world, slot, zone) {
    MS3D.buildReadingRoom(world, slot, zone, { floor: floor, sign: sign, place: place, shelf: shelf, beanBag: beanBag, bookStand: bookStand, soonSign: soonSign, wallPoster: wallPoster });
  }

  /* Kệ trưng bày: bìa sách quay ra ngoài, chạm để chọn sách (tối đa 4 cuốn một kệ). */
  function bookStand(world, x, z, zone, list, shelfInfo) {
    var books = (list || MS3D.BOOKS).slice(0, 4), n = books.length, gap = 0.95, w = n * gap + 0.5;
    MS3D.box(w, 0.75, 0.8, C.wood, x, 0.375, z, world.scene).castShadow = true;
    MS3D.box(w + 0.1, 0.06, 0.9, C.woodDark, x, 0.78, z, world.scene);
    MS3D.box(w, 0.08, 0.12, C.orange, x, 0.86, z + 0.32, world.scene);  // gờ chặn sách
    sign(world, shelfInfo && shelfInfo.name ? shelfInfo.name : "Chọn sách", x, 1.95, z, { size: 0.34, bg: "#1d6b6d", fg: "#ffffff" });
    books.forEach(function (bk, i) {
      var bx = x + (i - (n - 1) / 2) * gap;
      var grp = new THREE.Group(); grp.position.set(bx, 0.82, z + 0.1); grp.rotation.x = -0.2; world.scene.add(grp);
      MS3D.box(0.66, 0.9, 0.09, new THREE.Color(bk.color || "#1d6b6d").getHex(), 0, 0.45, -0.05, grp);
      MS3D.box(0.6, 0.86, 0.07, 0xfffaf0, 0.02, 0.45, -0.06, grp);
      var tex = new THREE.CanvasTexture(MS3D.drawCover(bk, document.createElement("canvas")));
      var cover = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.9), new THREE.MeshBasicMaterial({ map: tex }));
      cover.position.set(0, 0.45, 0.0); grp.add(cover);
      world.interactables.push({ kind: "book", book: bk.id, x: bx, z: z + 1.15, r: 0.9, label: "Chọn sách", sub: bk.title, room: zone.id });
      world.pick(grp);
    });
    world.addBox(x - w / 2, x + w / 2, z - 0.4, z + 0.4);
    place(world, "ke-" + (shelfInfo && shelfInfo.id || "sach"), "Kệ " + (shelfInfo && shelfInfo.name ? shelfInfo.name.toLowerCase() : "sách") + " (Không gian đọc)", zone.id, x, z + 1.6);
  }

  /* ---------- PHÒNG CHIẾU PHIM NGẮN (dựng ở cinema.js) ---------- */
  function buildPhim(world, slot, zone) {
    MS3D.buildCinemaRoom(world, slot, zone, { sign: sign, place: place, floor: floor });
  }

  /* ---------- PHÒNG LỄ HỘI ---------- */
  function buildLeHoi(world, slot, zone) {
    var b = slot.bounds, cx = (b[0] + b[1]) / 2;
    floor(world, b, 0xf3eee6, 0, "tile");
    // thảm tròn lớn giữa phòng (màu đổi theo lễ) + viền vàng
    var rx = cx, rz = b[2] + 6.2, tex = MS3D.floorTexture("carpet").clone(); tex.needsUpdate = true; tex.repeat.set(5, 5);
    MS3D.cyl(3.95, 3.95, 0.02, 40, 0xf6c84c, rx, 0.012, rz, world.scene);
    var rug = new THREE.Mesh(new THREE.CylinderGeometry(3.75, 3.75, 0.025, 40), new THREE.MeshLambertMaterial({ color: 0xc62828, map: tex }));
    rug.position.set(rx, 0.02, rz); world.scene.add(rug);
    var ring = new THREE.Mesh(new THREE.RingGeometry(2.7, 2.85, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(rx, 0.036, rz); world.scene.add(ring);
    world.festivalFloor = rug;
    MS3D.buildFestivalRoom(world, { bounds: b });
    if (MS3D.spawnNPC) {   // hai bạn đi dạo, đổi mũ áo theo lễ hội
      var R = function (x, z, w, f) { return { x: b[0] + x, z: b[2] + z, wait: w || 0, face: f }; };
      MS3D.spawnNPC(world, "ban-na", { room: zone.id, route: [R(3.4, 7.3, 2.5, Math.PI / 2), R(7, 7.6, 1), R(10.6, 7.3, 2.5, -Math.PI / 2), R(7, 9.2, 1.5)] });
      MS3D.spawnNPC(world, "ban-bo", { room: zone.id, route: [R(10.2, 9.0, 2), R(7, 6.6, 2, 0), R(3.8, 9.0, 2), R(7, 8.4, 1)] });
    }
    world.interactables.push({ kind: "festival", x: cx, z: b[2] + 7.8, r: 1.3, label: "Đổi lễ hội", sub: "Tết · Trung thu · Halloween · Giáng sinh", room: zone.id });
  }

  function soonSign(world, zone, x, z) {
    MS3D.box(0.12, 1.4, 0.12, C.woodDark, x, 0.7, z, world.scene);
    sign(world, "Sắp mở", x, 1.75, z, { size: 0.42, bg: "#ff8300", fg: "#1f1406" });
    world.addCircle(x, z, 0.3);
    world.interactables.push({ kind: "soon", x: x, z: z + 1, r: 1.6, disabled: true, label: "Sắp mở", sub: zone.name + " đang được chuẩn bị", room: zone.id });
  }

  var BUILDERS = { hoc: buildHoc, vuon: buildVuon, doc: buildDoc, phim: buildPhim, "le-hoi": buildLeHoi };

  /* ---------- Dựng toàn bộ bản đồ ---------- */
  MS3D.buildWorld = function (world) {
    var zones = ((window.MS && MS.ZONES) || []).slice(0, SLOTS.length);
    world.places = [];
    world.doors = {};
    buildLobby(world);
    var gaps = { n: [], s: [], e: [], w: [] };
    zones.forEach(function (z, i) { var s = SLOTS[i]; gaps[s.side].push(s.side === "n" || s.side === "s" ? s.door[0] : s.door[1]); });
    var L = LOBBY;
    wallGaps(world, true, L[2], L[0], L[1], gaps.n);
    wallGaps(world, true, L[3], L[0], L[1], gaps.s);
    wallGaps(world, false, L[1], L[2], L[3], gaps.e);
    wallGaps(world, false, L[0], L[2], L[3], gaps.w);

    zones.forEach(function (zone, i) {
      var slot = SLOTS[i], b = slot.bounds, skip = slot.skip || [];
      var garden = zone.id === "vuon";
      var o = garden ? { h: 1.1, color: 0x3f8a4e, trim: 0x2f6e3c, noFade: true } : {};
      if (slot.side !== "s" && skip.indexOf("n") < 0) wall(world, b[0], b[2], b[1], b[2], o);
      if (slot.side !== "n" && skip.indexOf("s") < 0) wall(world, b[0], b[3], b[1], b[3], o);
      if (slot.side !== "e" && skip.indexOf("w") < 0) wall(world, b[0], b[2], b[0], b[3], o);
      if (slot.side !== "w" && skip.indexOf("e") < 0) wall(world, b[1], b[2], b[1], b[3], o);
      // phòng rộng hơn sảnh: xây nốt phần cạnh giáp sảnh nằm ngoài tường sảnh
      if (slot.side === "n" || slot.side === "s") {
        var ez = slot.side === "n" ? b[3] : b[2];
        if (b[0] < L[0]) wall(world, b[0], ez, L[0], ez, o);
        if (b[1] > L[1]) wall(world, L[1], ez, b[1], ez, o);
      } else {
        var ex = slot.side === "e" ? b[0] : b[1];
        if (b[2] < L[2]) wall(world, ex, b[2], ex, L[2], o);
        if (b[3] > L[3]) wall(world, ex, L[3], ex, b[3], o);
      }
      (BUILDERS[zone.id] || function (w, s, z) { floor(w, s.bounds, 0xf2f2f2); soonSign(w, z, (s.bounds[0] + s.bounds[1]) / 2, (s.bounds[2] + s.bounds[3]) / 2); })(world, slot, zone);
      doorFrame(world, slot, zone);

      var dx = slot.door[0], dz = slot.door[1], inw = INWARD[slot.side];
      var outside = [dx - inw[0] * 1.5, dz - inw[1] * 1.5], inside = [dx + inw[0] * 1.5, dz + inw[1] * 1.5];
      world.doors[zone.id] = { door: [dx, dz], lobby: outside, room: inside };
      world.interactables.push({ kind: "door", target: zone.id, x: outside[0], z: outside[1], r: 1.6, label: "Vào phòng", sub: zone.name + (zone.status === "open" ? "" : " · Sắp mở") });
      world.interactables.push({ kind: "door", target: "sanh", x: inside[0], z: inside[1], r: 1.6, label: "Ra sảnh", sub: "Về sảnh chính" });
      // bấm vào khung cửa: đang ở trong phòng thì ra sảnh, ở ngoài thì vào phòng
      var horizD = slot.side === "n" || slot.side === "s";
      world.pickArea(dx, 1.4, dz, horizD ? DOOR_W + 0.6 : 0.6, 2.9, horizD ? 0.6 : DOOR_W + 0.6, null, { kind: "door-click", target: zone.id, label: zone.name });
      world.rooms.push({ id: zone.id, name: zone.name, status: zone.status, url: zone.url, bounds: b, spawn: slot.spawn, face: slot.face });
      place(world, "phong-" + zone.id, zone.name, zone.id, slot.spawn[0] + inw[0] * 1.5, slot.spawn[1] + inw[1] * 1.5);
    });
    if (window.MS && MS.ZONES && MS.ZONES.length > SLOTS.length && window.console) console.info("[3D] Bản đồ mới có chỗ cho " + SLOTS.length + " phòng; các phòng còn lại chỉ hiện ở bản 2D.");
    buildPaths(world, zones);
    spawnCoVi(world);
    spawnTeachers(world);
    MS3D.refreshCourseLabels(world);
    if (MS3D.SHADOWS) world.scene.traverse(function (o) { if (o.isMesh) o.receiveShadow = true; });
  };

  /* Cô Vi đi khắp nơi: Không gian đọc → sảnh (ngắm Cây Mở Sách) → Vườn → Phòng Lễ hội → sân khấu
     → Không gian học → Phòng chiếu → về Không gian đọc. Luôn đi qua đúng cửa phòng (world.doors). */
  function spawnCoVi(world) {
    if (!MS3D.spawnNPC || !world.coViDocRoute) return;
    var D = world.doors, R = [];
    function pt(x, z, o) { var p = { x: x, z: z }; for (var k in (o || {})) p[k] = o[k]; R.push(p); }
    function exit(id) { var d = D[id]; if (d) { pt(d.room[0], d.room[1]); pt(d.door[0], d.door[1]); pt(d.lobby[0], d.lobby[1]); } }
    function enter(id) { var d = D[id]; if (d) { pt(d.lobby[0], d.lobby[1]); pt(d.door[0], d.door[1]); pt(d.room[0], d.room[1]); } }
    function faceTo(x, z, tx, tz) { return Math.atan2(-(tx - x), -(tz - z)); }
    var doc = MS3D.getRoom(world, "doc"), db = doc && doc.bounds;

    world.coViDocRoute.forEach(function (p) { R.push(p); });
    if (db) { pt(db[0] + 3, -0.9); pt(db[1] - 2.5, -0.4); }
    exit("doc");
    // sảnh: ngắm Cây Mở Sách
    pt(-4.5, 1.8);
    pt(-1.5, 1.7, { wait: 3.2, act: "chat", face: faceTo(-1.5, 1.7, 0, 0), say: "Cây Mở Sách lại mọc thêm lá rồi, các con giỏi quá!" });
    pt(4.5, 1.8);
    if (D.vuon) {   // vườn: chào Cá Heo, đọc sách ở ghế gỗ
      enter("vuon");
      pt(19.4, -0.6, { wait: 3.4, act: "chat", face: -Math.PI / 2, say: "Cá Heo ơi, hôm nay bơi có vui không?" });
      pt(17, -4.3, { wait: 4.5, act: "read", face: Math.PI, say: "Ngồi ghế gỗ đọc sách, gió mát ghê!" });
      pt(13.6, -1);
      exit("vuon");
    }
    if (D["le-hoi"]) {   // phòng lễ hội: ghé xem các bạn hoá trang
      pt(7.6, -4);
      enter("le-hoi");
      pt(6.2, -12.2, { wait: 3.4, act: "chat", face: faceTo(6.2, -12.2, 7, -13.6), say: "Na với Bo hoá trang dễ thương quá!" });
      exit("le-hoi");
    }
    // sân khấu: đứng nghe Mi kể chuyện
    pt(4.6, -4.8);
    pt(-0.9, -4.7, { wait: 3.4, act: "watch", face: 0, say: "Sắp tới giờ Mi kể chuyện rồi nè!" });
    pt(-6, -5);
    if (D.hoc && world.hocPlants && MS3D.waterStop) {   // không gian học: tưới cây hai bên cửa
      enter("hoc");
      R.push(MS3D.waterStop(world.hocPlants[0], -11.4, -11));
      pt(-7, -11.8, { wait: 3.4, act: "chat", face: Math.PI, say: "Hôm nay lớp mình học bài nào rồi con?" });
      R.push(MS3D.waterStop(world.hocPlants[1], -2.6, -11));
      exit("hoc");
    }
    if (D.phim) {   // phòng chiếu: nhắc xem phim rồi viết cảm nhận
      pt(-3.6, -2.6); pt(-3.2, 2.6); pt(-0.8, 6.6);
      enter("phim");
      pt(1.4, 13, { wait: 3.6, act: "chat", face: faceTo(1.4, 13, -4.8, 9.2), say: "Xem phim xong, các con nhớ viết vài dòng cảm nhận nha!" });
      exit("phim");
      pt(-3.2, 2.6);
    }
    // về lại Không gian đọc
    pt(-7.6, 0.6);
    enter("doc");
    if (db) { pt(db[1] - 2.5, -0.4); pt(db[0] + 3, -0.9); }
    MS3D.spawnNPC(world, "co-vi", { room: "doc", roam: true, route: R });
  }

  /* Các cô Mở Sách ở từng phòng (cô Vi đi khắp nơi ở spawnCoVi, cô Châu kể chuyện ở story-corner.js).
     Toạ độ tính theo khung phòng nên dời phòng vẫn đúng. */
  function spawnTeachers(world) {
    if (!MS3D.spawnNPC) return;
    function faceTo(x, z, tx, tz) { return Math.atan2(-(tx - x), -(tz - z)); }
    function B(id) { var r = MS3D.getRoom(world, id); return r && r.bounds; }
    var b, cx;
    if ((b = B("hoc"))) {   // cô Hà: đi giữa hai bàn đọc và hàng khoá học
      cx = (b[0] + b[1]) / 2;
      var tz = b[2] + 3.4, lz = tz + 1.4;
      MS3D.spawnNPC(world, "co-ha", { room: "hoc", route: [
        { x: cx - 2.3, z: lz, wait: 3.5, act: "chat", face: faceTo(cx - 2.3, lz, cx - 4.3, tz), say: "Bài này con làm tốt lắm!" },
        { x: cx + 2.3, z: lz, wait: 3.5, act: "read", face: faceTo(cx + 2.3, lz, cx + 4.3, tz), say: "Đọc kỹ đề trước khi làm nha con." },
        { x: b[1] - 0.9, z: lz }, { x: b[1] - 0.9, z: b[3] - 3.8 },
        { x: cx, z: b[3] - 3.8, wait: 3, act: "watch", face: Math.PI, say: "Sắp tới giờ học rồi các con ơi!" },
        { x: b[0] + 0.8, z: b[3] - 3.8 }, { x: b[0] + 0.8, z: lz }
      ] });
    }
    // cô Mai: sảnh chính, quanh bục Thử thách, sân khấu và góc ghế lười
    var L = LOBBY, sz = (L[3] + DOOR_W / 2) / 2;
    MS3D.spawnNPC(world, "co-mai", { room: "sanh", route: [
      { x: L[1] - 5.6, z: sz - 2.3, wait: 4, act: "chat", face: faceTo(L[1] - 5.6, sz - 2.3, L[1] - 2.7, sz), say: "Ai muốn thử Thử thách tiếng Việt nào?" },
      { x: 3.2, z: -2.2 },   // đi vòng ngoài ghế quanh Cây Mở Sách
      { x: 2.6, z: -4.4, wait: 3, act: "watch", face: 0, say: "Sắp tới giờ Mi kể chuyện rồi!" },
      { x: -2.8, z: -3.2 },
      { x: L[0] + 5.8, z: sz - 2.7, wait: 4, act: "chat", face: faceTo(L[0] + 5.8, sz - 2.7, L[0] + 4, sz), say: "Góc ghế lười êm ghê, nằm đọc sách là nhất!" }
    ] });
    if ((b = B("phim"))) {   // cô Mỹ Anh: ngồi ở Góc viết cảm nhận (cinema.js: tâm bàn b[1]-3.4, b[2]+5.4)
      var wx = b[1] - 3.4, wz = b[2] + 5.4, sx = wx + Math.sin(2.1) * 1.25, szz = wz + Math.cos(2.1) * 1.25;
      MS3D.spawnNPC(world, "co-my-anh", { room: "phim", sit: { x: sx, z: szz, y: 0.3, face: faceTo(sx, szz, wx, wz) } });
    }
    if ((b = B("doc"))) {    // cô Minh: tủ Kinh điển và bảng sách đọc nhiều nhất
      var mz = b[2] + 2.1;
      MS3D.spawnNPC(world, "co-minh", { room: "doc", route: [
        { x: b[0] + 5.6, z: mz, wait: 4.5, act: "shelf", face: 0, say: "Để cô sắp lại tủ Kinh điển nhé." },
        { x: b[0] + 9.4, z: mz + 0.2, wait: 3, act: "read", face: Math.PI },
        { x: b[1] - 3.0, z: mz, wait: 3.5, act: "chat", face: 0, say: "Tháng này sách nào đứng đầu nhỉ?" },
        { x: b[0] + 9.4, z: mz - 0.1 }
      ] });
    }
    if ((b = B("le-hoi"))) {  // cô Thuỷ Vy: đi giữa các gian hàng lễ hội
      cx = (b[0] + b[1]) / 2;
      var g1 = [b[0] + 1, b[2] + 3.8], g2 = [b[1] - 1, b[2] + 3.8], qz = b[2] + 5.6;
      MS3D.spawnNPC(world, "co-thuy-vy", { room: "le-hoi", route: [
        { x: b[0] + 2.8, z: qz, wait: 3.5, act: "chat", face: faceTo(b[0] + 2.8, qz, g1[0], g1[1]), say: "Gian này kể chuyện hay lắm đó con!" },
        { x: cx, z: qz + 1.2 },
        { x: b[1] - 2.8, z: qz, wait: 3.5, act: "chat", face: faceTo(b[1] - 2.8, qz, g2[0], g2[1]), say: "Con chơi đố vui chưa? Có vòng quay nữa nè!" },
        { x: cx, z: b[3] - 2.8, wait: 3, act: "watch", face: 0, say: "Cả phòng sáng đèn đẹp quá!" }
      ] });
    }
  }

  MS3D.getRoom = function (world, id) {
    for (var i = 0; i < world.rooms.length; i++) if (world.rooms[i].id === id) return world.rooms[i];
    return null;
  };
})();
