/* ==========================================================
   SẢNH 3D MỞ SÁCH — story-corner.js
   Góc kể chuyện trong Vườn đọc sách (góc tây nam vườn): lều vải, thảm tròn, cô Châu ngồi ghế đẩu
   kể chuyện có thật (npc-content.js, "co-chau".stories), 4 bé tiểu học ngồi đệm nghe,
   một đệm trống để học trò ngồi nghe cùng. Thêm bướm bay quanh vườn cho vui.
   h: { sign, place } từ rooms.js.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  var C = MS3D.COLORS;

  function faceTo(x, z, tx, tz) { return Math.atan2(-(tx - x), -(tz - z)); }

  // lều vải hình nón, sọc cam – kem, cửa lều quay về phía (dx, dz)
  function teepee(world, x, z, dx, dz) {
    var c = document.createElement("canvas"); c.width = 64; c.height = 64; var g = c.getContext("2d");
    g.fillStyle = "#fff1d6"; g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#ff8300"; for (var i = 0; i < 64; i += 16) { g.beginPath(); g.moveTo(0, i + 4); for (var k = 0; k <= 64; k += 8) g.lineTo(k, i + 4 + (k % 16 ? 5 : 0)); g.lineTo(64, i + 9); g.lineTo(0, i + 9); g.fill(); }
    g.fillStyle = "#50b1b3"; g.fillRect(0, 54, 64, 5);
    var tex = new THREE.CanvasTexture(c); tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(3, 1); tex.magFilter = THREE.NearestFilter;
    var tent = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.5, 8), new THREE.MeshLambertMaterial({ map: tex, flatShading: true }));
    tent.position.set(x, 1.25, z); tent.castShadow = true; world.scene.add(tent);
    [0, 2.1, 4.2].forEach(function (a) {   // ba cây sào ló lên đỉnh lều
      var p = MS3D.cyl(0.03, 0.03, 0.8, 5, 0x7a5232, x + Math.cos(a) * 0.12, 2.6, z + Math.sin(a) * 0.12, world.scene);
      p.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35);
    });
    var L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L;   // cửa lều: tam giác tối, mép vải vén
    var door = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.2, 3), MS3D.mat(0x5a3a22));
    door.position.set(x + ux * 0.62, 0.6, z + uz * 0.62); door.rotation.y = Math.atan2(ux, uz); door.scale.z = 0.2; world.scene.add(door);
    world.addCircle(x, z, 1.15);
  }

  MS3D.buildStoryCorner = function (world, b, h) {
    var cx = b[0] + 2.4, cz = b[3] - 3.6;          // ghế cô Châu
    var rx = cx + 1.2, rz = cz;                     // tâm thảm
    // thảm tròn hai lớp
    MS3D.cyl(2.75, 2.75, 0.02, 28, C.orange, rx, 0.012, rz, world.scene);
    MS3D.cyl(2.5, 2.5, 0.025, 28, 0xfff1d6, rx, 0.018, rz, world.scene);
    MS3D.cyl(1.0, 1.0, 0.03, 20, 0xffe0a8, rx, 0.022, rz, world.scene);
    teepee(world, b[0] + 1.3, b[3] - 1.3, 1, -1);
    // ghế đẩu của cô Châu + thùng sách
    MS3D.cyl(0.26, 0.3, 0.4, 8, C.woodDark, cx, 0.2, cz, world.scene).castShadow = true;
    MS3D.box(0.6, 0.38, 0.45, C.wood, cx - 0.1, 0.19, cz - 1.0, world.scene).castShadow = true;
    [0xff8300, 0x50b1b3, 0xe86a92, 0xf6c84c].forEach(function (col, i) { MS3D.box(0.1, 0.32, 0.26, col, cx - 0.32 + i * 0.13, 0.48, cz - 1.0, world.scene); });
    world.addBox(cx - 0.42, cx + 0.22, cz - 1.25, cz - 0.75);
    // dây đèn từ đỉnh lều sang một cột gỗ
    var px = b[0] + 6.2, pz = b[3] - 1.0;
    MS3D.cyl(0.05, 0.06, 2.4, 6, 0x7a5232, px, 1.2, pz, world.scene);
    world.addCircle(px, pz, 0.12);
    var bulbs = [], tx = b[0] + 1.3, tz = b[3] - 1.3;
    for (var i = 1; i < 12; i++) {
      var t = i / 12, bm = new THREE.MeshBasicMaterial({ color: [0xffe08a, 0xff9a33, 0x9be3e0][i % 3] });
      var bl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), bm);
      bl.position.set(tx + (px - tx) * t, 2.35 - Math.sin(t * Math.PI) * 0.45, tz + (pz - tz) * t); world.scene.add(bl); bulbs.push(bm);
    }
    world.updaters.push(function (dt, tt) { bulbs.forEach(function (bm, k) { bm.color.setHex(Math.sin(tt * 2 + k) > -0.2 ? [0xffe08a, 0xff9a33, 0x9be3e0][k % 3] : 0x8a7a50); }); });
    h.sign(world, "Góc kể chuyện", b[0] + 1.3, 3.2, b[3] - 1.3, { size: 0.3, bg: "#ff8300", fg: "#1f1406" });

    // các bé ngồi đệm quanh cô (cung tròn trước mặt cô), chừa đệm giữa cho học trò
    var R = 2.2, kids = ["be-bin", "be-su", "be-mit", "be-gao"], angs = [-62, -30, 30, 62], cushions = [0xe86a92, 0x50b1b3, 0xf6c84c, 0x6cbf5a];
    angs.forEach(function (deg, i) {
      var a = deg * Math.PI / 180, x = cx + Math.cos(a) * R, z = cz + Math.sin(a) * R;
      MS3D.cyl(0.32, 0.34, 0.14, 10, cushions[i], x, 0.07, z, world.scene);
      world.addCircle(x, z, 0.35);
      if (MS3D.spawnNPC) MS3D.spawnNPC(world, kids[i], { room: "vuon", sit: { x: x, z: z, y: 0.1, face: faceTo(x, z, cx, cz) } });
    });
    var sx = cx + R, sz = cz;   // đệm trống cho học trò
    MS3D.cyl(0.36, 0.38, 0.14, 10, 0xff8300, sx, 0.07, sz, world.scene);
    var seat = { x: sx, z: sz, face: faceTo(sx, sz, cx, cz), stand: [sx + 1.1, sz], listen: true, msg: "Ngồi xuống nghe cô Châu kể chuyện nào! Đi để đứng dậy nhé." };
    world.interactables.push({ kind: "seat", x: sx + 0.9, z: sz, r: 1.1, label: "Ngồi nghe kể chuyện", sub: "Góc kể chuyện của cô Châu", seat: seat, room: "vuon" });
    world.pickArea(sx, 0.2, sz, 0.8, 0.4, 0.8);
    if (MS3D.spawnNPC) MS3D.spawnNPC(world, "co-chau", { room: "vuon", tell: true, sit: { x: cx, z: cz, y: 0.42, face: faceTo(cx, cz, rx + 1, rz) } });
    h.place(world, "goc-ke-chuyen", "Góc kể chuyện (Vườn đọc sách)", "vuon", sx + 1.2, sz);

    // bướm bay quanh vườn (ẩn vào mùa đông và ban đêm)
    var flies = [];
    [[0xffc83d, 4, 2], [0xe86a92, 9, -4], [0x50b1b3, 15, 5], [0xff8300, 18, -6], [0xffffff, 7, 6]].forEach(function (q, k) {
      var bf = new THREE.Group(); world.scene.add(bf);
      var mat = new THREE.MeshLambertMaterial({ color: q[0], side: THREE.DoubleSide });
      var wg = new THREE.PlaneGeometry(0.2, 0.16); wg.rotateX(-Math.PI / 2);   // cánh nằm ngang, đập quanh thân
      var wl = new THREE.Mesh(wg, mat), wr = new THREE.Mesh(wg, mat);
      wl.position.x = -0.1; wr.position.x = 0.1;
      var pl = new THREE.Group(), pr = new THREE.Group(); pl.add(wl); pr.add(wr); bf.add(pl); bf.add(pr);
      MS3D.box(0.03, 0.03, 0.14, 0x2b1d14, 0, 0, 0, bf);
      flies.push({ g: bf, pl: pl, pr: pr, ox: b[0] + q[1], oz: (b[2] + b[3]) / 2 + q[2], k: k });
    });
    world.updaters.push(function (dt, t) {
      var show = world.season !== "dong" && world.time !== "night";
      flies.forEach(function (f) {
        f.g.visible = show; if (!show) return;
        var a = t * 0.5 + f.k * 1.3;
        f.g.position.set(f.ox + Math.sin(a) * 2.2, 1.0 + Math.sin(t * 1.7 + f.k) * 0.35, f.oz + Math.sin(a * 2) * 1.2);
        f.g.rotation.y = Math.cos(a) > 0 ? 0.4 : -2.7;
        var fl = Math.sin(t * 16 + f.k) * 0.9; f.pl.rotation.z = -fl; f.pr.rotation.z = fl;
      });
    });
  };
})();
