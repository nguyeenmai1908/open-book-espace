/* ==========================================================
   SẢNH 3D MỞ SÁCH — decor.js: đồ trang trí dùng chung giữa các phòng
   Cây lô hội (aloe vera) và cây monstera của cô Vi, bình nước, bàn đọc, bảng hamburger.
   Mỗi cây có plant.userData.water(): lá rung lên, đất sẫm màu (cô Vi tưới cây gọi hàm này).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  var C = MS3D.COLORS;

  /* Tưới cây: đất ướt sẫm lại rồi khô dần, lá nảy nhẹ. */
  function makeWaterable(world, root, leaves, soilMat) {
    var wet = 0, bounce = 0, dry = soilMat.color.getHex(), dryC = new THREE.Color(dry), wetC = new THREE.Color(0x2e1d12);
    root.userData.water = function () { wet = 1; bounce = 1.4; };
    world.updaters.push(function (dt, t) {
      if (wet > 0) { wet = Math.max(0, wet - dt * 0.05); soilMat.color.copy(dryC).lerp(wetC, Math.min(1, wet * 1.5)); }
      if (bounce > 0) {
        bounce = Math.max(0, bounce - dt);
        var k = 1 + Math.sin(t * 14) * 0.05 * bounce;
        leaves.scale.set(k, 2 - k, k);
      }
    });
  }
  function pot(world, x, z, r, h, color, band) {
    var g = new THREE.Group(); g.position.set(x, 0, z); world.scene.add(g);
    MS3D.cyl(r, r * 0.75, h, 10, color, 0, h / 2, 0, g);
    MS3D.cyl(r * 1.06, r * 1.06, 0.06, 10, band || color, 0, h - 0.03, 0, g);
    var soilMat = new THREE.MeshLambertMaterial({ color: 0x6b4a2f, flatShading: true });
    var soil = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r * 0.92, 0.04, 10), soilMat);
    soil.position.y = h - 0.01; g.add(soil);
    return { g: g, soilMat: soilMat };
  }

  /* Cây lô hội: lá mọng, nhọn, xoè thành hình hoa thị, có đốm trắng nhỏ. */
  var aloeGeo = null;
  MS3D.aloe = function (world, x, z, s) {
    s = s || 1;
    var p = pot(world, x, z, 0.24 * s, 0.32 * s, 0xc8643b, 0xa84f2c);
    if (!aloeGeo) { aloeGeo = new THREE.ConeGeometry(0.07, 0.66, 4); aloeGeo.translate(0, 0.33, 0); }
    var leaves = new THREE.Group(); leaves.position.y = 0.3 * s; p.g.add(leaves);
    for (var i = 0; i < 11; i++) {
      var leaf = new THREE.Mesh(aloeGeo, MS3D.mat(i % 3 ? 0x7fae6a : 0x93c17c));
      var inner = i > 6;
      leaf.scale.set(s, s * (inner ? 0.8 : 1), s * 0.5);
      leaf.rotation.set(inner ? 0.25 : 0.7 + (i % 2) * 0.15, i * 2.4, 0, "YXZ");
      leaves.add(leaf);
      if (i % 2 === 0) { var dot = MS3D.box(0.025, 0.025, 0.025, 0xe8f3df, 0, 0.25, 0.03, leaf); dot.position.set(0, 0.22, 0.035); }
    }
    makeWaterable(world, p.g, leaves, p.soilMat);
    world.addCircle(x, z, 0.28 * s);
    MS3D.shadow(p.g);
    return p.g;
  };

  /* Cây monstera (trầu bà lá xẻ): lá to xẻ thuỳ, có lỗ. */
  var leafGeo = null;
  function monsteraLeafGeo() {
    if (leafGeo) return leafGeo;
    var R = [[0.18, 0.02], [0.32, 0.12], [0.37, 0.2], [0.19, 0.23], [0.4, 0.3], [0.4, 0.43], [0.2, 0.41], [0.35, 0.53], [0.29, 0.65], [0.12, 0.61], [0.15, 0.71], [0, 0.8]];
    var sh = new THREE.Shape(); sh.moveTo(0, 0);
    R.forEach(function (q) { sh.lineTo(q[0], q[1]); });
    for (var i = R.length - 2; i >= 0; i--) sh.lineTo(-R[i][0], R[i][1]);
    sh.lineTo(0, 0);
    [[0.11, 0.32], [-0.11, 0.32], [0.08, 0.5], [-0.08, 0.5]].forEach(function (h) {
      var hole = new THREE.Path(); hole.absellipse(h[0], h[1], 0.022, 0.04, 0, Math.PI * 2, false, 0); sh.holes.push(hole);
    });
    leafGeo = new THREE.ShapeGeometry(sh);
    return leafGeo;
  }
  MS3D.monstera = function (world, x, z, s) {
    s = s || 1;
    var p = pot(world, x, z, 0.34 * s, 0.5 * s, 0xf3efe7, C.teal);
    var leaves = new THREE.Group(); leaves.position.y = 0.48 * s; p.g.add(leaves);
    var leafMat = new THREE.MeshLambertMaterial({ color: 0x2f7d3b, side: THREE.DoubleSide, flatShading: true });
    var leafMat2 = new THREE.MeshLambertMaterial({ color: 0x3f9a4a, side: THREE.DoubleSide, flatShading: true });
    var geo = monsteraLeafGeo();
    for (var i = 0; i < 7; i++) {
      var a = i * 2.2 + 0.4, hgt = (0.35 + (i % 3) * 0.28) * s, out = 0.08 * s;
      var hx = Math.sin(a) * out, hz = Math.cos(a) * out;
      MS3D.cyl(0.015 * s, 0.02 * s, hgt, 5, 0x4f8a3a, hx / 2, hgt / 2, hz / 2, leaves);
      var holder = new THREE.Group(); holder.position.set(hx, hgt, hz); holder.rotation.y = a + Math.PI; leaves.add(holder);
      var leaf = new THREE.Mesh(geo, i % 2 ? leafMat : leafMat2);
      leaf.scale.setScalar(s * (0.85 + (i % 3) * 0.12));
      leaf.rotation.x = -(0.9 + (i % 2) * 0.35);
      holder.add(leaf);
    }
    makeWaterable(world, p.g, leaves, p.soilMat);
    world.addCircle(x, z, 0.38 * s);
    MS3D.shadow(p.g);
    return p.g;
  };

  /* Bình nước uống: chạm để rót, bong bóng nổi trong bình. */
  MS3D.waterCooler = function (world, x, z, room) {
    var g = new THREE.Group(); g.position.set(x, 0, z); world.scene.add(g);
    MS3D.box(0.55, 1.0, 0.5, 0xe9eef0, 0, 0.5, 0, g);
    MS3D.box(0.12, 0.08, 0.1, 0x3d7dd8, -0.1, 0.78, 0.28, g);
    MS3D.box(0.12, 0.08, 0.1, 0xe53935, 0.1, 0.78, 0.28, g);
    MS3D.box(0.4, 0.04, 0.2, 0x9aa5a5, 0, 0.45, 0.3, g);                   // khay hứng
    var bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 12), new THREE.MeshLambertMaterial({ color: 0x8fd3f4, transparent: true, opacity: 0.75 }));
    bottle.position.y = 1.32; g.add(bottle);
    MS3D.cyl(0.08, 0.08, 0.06, 8, 0x3d7dd8, 0, 1.65, 0, g);
    var cup = MS3D.cyl(0.05, 0.04, 0.1, 8, 0xffffff, 0.12, 0.52, 0.3, g);
    var bubbles = [];
    for (var i = 0; i < 4; i++) { var bb = MS3D.ball(0.04, 0xffffff, 0, 1.05, 0, g, 0); bb.visible = false; bubbles.push(bb); }
    var stream = MS3D.box(0.025, 0.24, 0.025, 0x8fd3f4, -0.1, 0.62, 0.3, g); stream.visible = false;
    var t0 = 0;
    world.updaters.push(function (dt, t) {
      bubbles.forEach(function (bb, i) {
        bb.visible = t0 > 0;
        if (t0 > 0) bb.position.set(Math.sin(t * 3 + i) * 0.08, 1.05 + ((t * 0.6 + i * 0.25) % 0.55), 0);
      });
      stream.visible = t0 > 0.6;
      if (t0 > 0) t0 -= dt;
    });
    MS3D.shadow(g);
    world.addBox(x - 0.3, x + 0.3, z - 0.3, z + 0.3);
    var it = { kind: "cooler", x: x, z: z + 1.0, r: 1.0, label: "Uống nước", sub: "Bình nước " + (room === "doc" ? "Không gian đọc" : "uống chung"), room: room, pour: function () { t0 = 1.8; } };
    world.interactables.push(it);
    world.pickArea(0, 0.85, 0, 0.65, 1.7, 0.6, g, it);
    return g;
  };

  /* Bàn đọc gỗ + ghế đẩu, có thể thêm đèn bàn. stools: [[dx, dz], ...] tính từ tâm bàn. */
  MS3D.readingTable = function (world, x, z, w, d, opts) {
    opts = opts || {};
    var g = new THREE.Group(); g.position.set(x, 0, z); world.scene.add(g);
    MS3D.box(w, 0.08, d, C.wood, 0, 0.74, 0, g);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { MS3D.box(0.08, 0.72, 0.08, C.woodDark, q[0] * (w / 2 - 0.12), 0.36, q[1] * (d / 2 - 0.1), g); });
    (opts.stools || []).forEach(function (q, i) {
      MS3D.cyl(0.22, 0.2, 0.08, 10, [C.orange, C.teal, 0xf6c84c, 0xe86a92][i % 4], q[0], 0.46, q[1], g);
      MS3D.cyl(0.04, 0.06, 0.42, 6, 0x555a5e, q[0], 0.21, q[1], g);
      world.addCircle(x + q[0], z + q[1], 0.22);
    });
    (opts.lamps || []).forEach(function (lx) {
      MS3D.cyl(0.1, 0.12, 0.03, 10, 0x333333, lx, 0.795, -d / 4, g);
      MS3D.cyl(0.015, 0.015, 0.36, 5, 0x333333, lx, 0.97, -d / 4, g);
      var shade = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.16, 10, 1, true), new THREE.MeshLambertMaterial({ color: 0xff8300, emissive: 0x6b3500, side: THREE.DoubleSide }));
      shade.position.set(lx, 1.15, -d / 4); g.add(shade);
    });
    (opts.books || []).forEach(function (b) {
      var bk = MS3D.box(0.3, 0.05, 0.4, b[2], b[0], 0.805, b[1], g); bk.rotation.y = b[3] || 0;
    });
    world.addBox(x - w / 2, x + w / 2, z - d / 2, z + d / 2);
    MS3D.shadow(g);
    return g;
  };

  /* Bảng trắng vẽ mô hình bánh hamburger của đoạn nghị luận. */
  MS3D.hamburgerBoard = function (world, x, z, room) {
    var c = document.createElement("canvas"); c.width = 640; c.height = 300; var g = c.getContext("2d");
    g.fillStyle = "#fbfdfd"; g.fillRect(0, 0, 640, 300);
    g.fillStyle = "#1d6b6d"; g.font = "800 34px 'Baloo 2', sans-serif"; g.textAlign = "left"; g.textBaseline = "middle";
    g.fillText("Đoạn nghị luận = bánh hamburger", 24, 34);
    var L = [["Câu chủ đề", "#e0a24e", 0.9], ["Lý lẽ", "#6cbf5a", 0.8], ["Bằng chứng", "#8a4b2a", 0.8], ["Phân tích", "#f6c84c", 0.8], ["Kết đoạn", "#e0a24e", 0.9]];
    L.forEach(function (l, i) {
      var y = 78 + i * 42, w = 230 * l[2];
      g.fillStyle = l[1]; g.beginPath();
      if (g.roundRect) g.roundRect(40 + (230 - w) / 2, y, w, 32, i === 0 ? [16, 16, 4, 4] : i === 4 ? [4, 4, 16, 16] : 6); else g.rect(40 + (230 - w) / 2, y, w, 32);
      g.fill();
      g.fillStyle = "#1b2a2b"; g.font = "700 26px 'Be Vietnam Pro', sans-serif"; g.fillText(l[0], 310, y + 17);
      g.fillStyle = "#a85000"; g.fillRect(290, y + 15, 10, 3);
    });
    var tex = new THREE.CanvasTexture(c);
    MS3D.box(4.3, 2.1, 0.08, 0x9aa5a5, x, 1.5, z, world.scene);
    var b = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 1.92), new THREE.MeshBasicMaterial({ map: tex }));
    b.position.set(x, 1.5, z + 0.05); world.scene.add(b);
    MS3D.box(4.0, 0.06, 0.16, 0x9aa5a5, x, 0.48, z + 0.08, world.scene);
    [[-0.4, 0xe53935], [-0.2, 0x3d7dd8], [0.1, 0x1b2a2b]].forEach(function (m) { MS3D.box(0.14, 0.035, 0.035, m[1], x + m[0], 0.53, z + 0.1, world.scene); });
    var it = { kind: "toast", x: x, z: z + 1.4, r: 1.4, label: "Xem bảng", sub: "Mô hình bánh hamburger", room: room,
      text: "Nắp bánh là câu chủ đề, xà lách là lý lẽ, thịt là bằng chứng, phô mai là phân tích, đế bánh là kết đoạn. Ngon lành!" };
    world.interactables.push(it);
    world.pick(b, it);
    return b;
  };
})();
