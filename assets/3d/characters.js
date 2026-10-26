/* ==========================================================
   SẢNH 3D MỞ SÁCH — characters.js
   12 nhân vật dựng bằng khối hình: người, con vật, rau củ, trái cây.
   + Cá Heo (linh vật chuỗi Nghị luận, tên tạm).
   Thêm nhân vật: thêm 1 dòng vào MS3D.CHARACTERS
   (kind = người dùng chung khung người; kind khác cần hàm dựng trong BUILD).
   Sau này có thể thay bằng model CC0 (Kenney, Quaternius).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};

  MS3D.CHARACTER_GROUPS = [
    { id: "nguoi", name: "Người" },
    { id: "convat", name: "Con vật" },
    { id: "raucu", name: "Rau củ" },
    { id: "traicay", name: "Trái cây" }
  ];

  // group: nhóm hiển thị; kind: cách dựng; màu dùng trong HUD là `color`.
  MS3D.CHARACTERS = [
    { id: "cam",   group: "nguoi", kind: "human", name: "Cam",  color: 0xff8300, shirt: 0xff8300, pants: 0x34495e, skin: 0xf2c9a0, hair: 0x2b1d14, style: "short" },
    { id: "ngoc",  group: "nguoi", kind: "human", name: "Ngọc", color: 0x50b1b3, shirt: 0x50b1b3, pants: 0x2f3b52, skin: 0xf5d2b0, hair: 0x1a1210, style: "long" },
    { id: "bien",  group: "nguoi", kind: "human", name: "Biển", color: 0x3d7dd8, shirt: 0x3d7dd8, pants: 0x2b2b2b, skin: 0xc98e62, hair: 0x111111, style: "cap", capColor: 0xff8300 },
    { id: "hoa",   group: "nguoi", kind: "human", name: "Hoa",  color: 0xe86a92, shirt: 0xe86a92, pants: 0x46365e, skin: 0xf5d2b0, hair: 0x2b1d14, style: "pony" },
    { id: "meo",       group: "convat", kind: "cat",      name: "Mèo Mướp",   color: 0xf0a04b },
    { id: "gau-truc",  group: "convat", kind: "panda",    name: "Gấu Trúc",   color: 0x333333 },
    { id: "tho",       group: "convat", kind: "bunny",    name: "Thỏ Bông",   color: 0xf4f0ec },
    { id: "canh-cut",  group: "convat", kind: "penguin",  name: "Cánh Cụt",   color: 0x2c3e50 },
    { id: "ca-rot",    group: "raucu",  kind: "carrot",   name: "Cà Rốt",     color: 0xff7a1a },
    { id: "sup-lo",    group: "raucu",  kind: "broccoli", name: "Súp Lơ",     color: 0x4f9d58 },
    { id: "thanh-long",group: "traicay",kind: "dragonfruit", name: "Thanh Long", color: 0xe0337a },
    { id: "dua-hau",   group: "traicay",kind: "watermelon",  name: "Dưa Hấu",    color: 0xe8474c }
  ];

  MS3D.getCharacter = function (id) {
    for (var i = 0; i < MS3D.CHARACTERS.length; i++) if (MS3D.CHARACTERS[i].id === id) return MS3D.CHARACTERS[i];
    return MS3D.CHARACTERS[0];
  };

  var INK = 0x1b2a2b, BLUSH = 0xf08a7a;

  /* Khung chung: thân + 2 chân + 2 tay xoay quanh khớp, để mọi nhân vật đi được.
     o: { legColor, legLen, legW, legX, hipY, armColor, armLen, armW, armX, shoulderY, shoe, hand } */
  function rig(o) {
    var box = MS3D.box;
    var g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    function limb(w, h, color, x, y) {
      var p = new THREE.Group(); p.position.set(x, y, 0);
      box(w, h, w, color, 0, -h / 2, 0, p); body.add(p); return p;
    }
    var legLen = o.legLen || 0.5, legW = o.legW || 0.2, hipY = o.hipY || legLen + 0.02;
    var legL = limb(legW, legLen, o.legColor, -(o.legX || 0.13), hipY);
    var legR = limb(legW, legLen, o.legColor, o.legX || 0.13, hipY);
    if (o.shoe !== false) {
      box(legW + 0.02, 0.08, legW + 0.08, o.shoe || 0x333333, 0, -legLen, -0.04, legL);
      box(legW + 0.02, 0.08, legW + 0.08, o.shoe || 0x333333, 0, -legLen, -0.04, legR);
    }
    var armL = null, armR = null;
    if (o.armColor !== undefined) {
      var al = o.armLen || 0.48, aw = o.armW || 0.14;
      armL = limb(aw, al, o.armColor, -(o.armX || 0.34), o.shoulderY || 1.04);
      armR = limb(aw, al, o.armColor, o.armX || 0.34, o.shoulderY || 1.04);
      if (o.hand !== undefined) {
        box(aw - 0.01, 0.12, aw - 0.01, o.hand, 0, -al, 0, armL);
        box(aw - 0.01, 0.12, aw - 0.01, o.hand, 0, -al, 0, armR);
      }
    }
    var phase = 0, sitting = false;
    g.userData.arms = { L: armL, R: armR };
    g.userData.legs = { L: legL, R: legR, len: legLen, w: legW };
    g.userData.setSit = function (v) { sitting = !!v; };
    g.userData.animate = function (dt, speed) {
      if (sitting) {   // ngồi ghế lười: duỗi chân ra trước, tay cầm sách
        legL.rotation.x += (1.4 - legL.rotation.x) * 0.3; legR.rotation.x += (1.4 - legR.rotation.x) * 0.3;
        if (armL) { armL.rotation.x += (1.0 - armL.rotation.x) * 0.3; armR.rotation.x += (1.0 - armR.rotation.x) * 0.3; }
        body.position.y += (-0.3 - body.position.y) * 0.3;
        return;
      }
      var moving = speed > 0.05;
      phase += dt * (moving ? 10 : 2);
      var sw = moving ? Math.sin(phase) * 0.7 : 0;
      legL.rotation.x += (sw - legL.rotation.x) * 0.4;
      legR.rotation.x += (-sw - legR.rotation.x) * 0.4;
      if (armL) { armL.rotation.x += (-sw * 0.8 - armL.rotation.x) * 0.4; armR.rotation.x += (sw * 0.8 - armR.rotation.x) * 0.4; }
      body.position.y = moving ? Math.abs(Math.sin(phase)) * 0.06 : Math.sin(phase) * 0.012;
    };
    return { g: g, body: body };
  }

  /* Vải hoa văn cho áo: { kind: "stripes" | "dots", a: màu nền, b: màu sọc/chấm } */
  var PATTERN = {};
  function patternMat(p) {
    var key = [p.kind, p.a, p.b].join(",");
    if (PATTERN[key]) return PATTERN[key];
    var cv = document.createElement("canvas"); cv.width = cv.height = 32; var g = cv.getContext("2d");
    var hex = function (n) { return "#" + ("000000" + n.toString(16)).slice(-6); };
    g.fillStyle = hex(p.a); g.fillRect(0, 0, 32, 32); g.fillStyle = hex(p.b);
    if (p.kind === "stripes") { g.fillRect(0, 0, 32, 8); g.fillRect(0, 16, 32, 8); }
    else { [[8, 8], [24, 24], [24, 8], [8, 24]].forEach(function (d, i) { if (i < 2 || p.dense) { g.beginPath(); g.arc(d[0], d[1], 3, 0, 7); g.fill(); } }); }
    var tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.NearestFilter;
    tex.repeat.set(1, p.kind === "stripes" ? 2.2 : 2);
    return (PATTERN[key] = new THREE.MeshLambertMaterial({ map: tex, flatShading: true }));
  }

  /* Vải hoa cho đầm: nền + hoa 5 cánh nhỏ, dùng chung cho áo, váy, tay áo. d: { base, petals: [..], center } */
  var FLORAL = {};
  function floralMat(d) {
    if (d.plain) return MS3D.mat(d.base);   // đầm trơn một màu, không hoạ tiết
    var key = [d.base].concat(d.petals || []).join(",");
    if (FLORAL[key]) return FLORAL[key];
    var cv = document.createElement("canvas"); cv.width = cv.height = 64; var g = cv.getContext("2d");
    var hex = function (n) { return "#" + ("000000" + n.toString(16)).slice(-6); };
    g.fillStyle = hex(d.base); g.fillRect(0, 0, 64, 64);
    var petals = d.petals || [0xffffff], spots = [[10, 10], [42, 8], [26, 30], [54, 34], [8, 46], [38, 54], [20, 58], [58, 60]];
    spots.forEach(function (p, i) {
      g.fillStyle = hex(petals[i % petals.length]);
      for (var k = 0; k < 5; k++) { var a = k * 1.2566 + i; g.beginPath(); g.arc(p[0] + Math.cos(a) * 3.2, p[1] + Math.sin(a) * 3.2, 2.6, 0, 6.3); g.fill(); }
      g.fillStyle = hex(d.center || 0xffd23f); g.beginPath(); g.arc(p[0], p[1], 1.6, 0, 6.3); g.fill();
    });
    var tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1.5, 1.5);
    tex.magFilter = THREE.NearestFilter;
    return (FLORAL[key] = new THREE.MeshLambertMaterial({ map: tex, flatShading: true }));
  }

  /* Mặt: 2 mắt + má hồng + miệng, đặt trên mặt phẳng z (mặt trước nhìn về -z). */
  function face(parent, y, z, s, opts) {
    s = s || 1; opts = opts || {};
    var box = MS3D.box, dx = 0.1 * s;
    box(0.06 * s, 0.08 * s, 0.02, opts.eye || INK, -dx, y + 0.02 * s, z, parent);
    box(0.06 * s, 0.08 * s, 0.02, opts.eye || INK, dx, y + 0.02 * s, z, parent);
    if (opts.blush !== false) {
      box(0.08 * s, 0.04 * s, 0.02, opts.blush || BLUSH, -dx - 0.06 * s, y - 0.08 * s, z, parent);
      box(0.08 * s, 0.04 * s, 0.02, opts.blush || BLUSH, dx + 0.06 * s, y - 0.08 * s, z, parent);
    }
    if (opts.mouth !== false) box(0.1 * s, 0.03 * s, 0.02, opts.mouth || 0x8a2b2b, 0, y - 0.1 * s, z, parent);
  }

  function mesh(geo, color, x, y, z, parent) {
    var m = new THREE.Mesh(geo, MS3D.mat(color)); m.position.set(x, y, z); parent.add(m); return m;
  }

  /* Điểm gắn phụ kiện (toạ độ trong thân): đỉnh đầu, mắt (mặt trước), cổ (mặt trước), lưng. */
  function anchors(r, body, top, eyes, neck, back) {
    var a = {};
    [["top", top], ["eyes", eyes], ["neck", neck], ["back", back]].forEach(function (p) {
      var o = new THREE.Object3D(); o.position.set(p[1][0], p[1][1], p[1][2]); body.add(o); a[p[0]] = o;
    });
    r.g.userData.anchors = a;
    return r.g;
  }

  var BUILD = {
    /* ---------- NGƯỜI ---------- */
    human: function (c) {
      var box = MS3D.box, ball = MS3D.ball;
      var dm = c.dress ? floralMat(c.dress) : null;   // đầm hoa: chân trần, tay áo ngắn, váy xoè
      var r = rig({ legColor: dm ? c.skin : c.pants, armColor: dm ? c.skin : c.shirt, hand: c.skin, shoe: dm ? (c.dress.shoe || 0x8a4b3a) : c.shoe });
      var body = r.body, arms = r.g.userData.arms;
      if (dm) {
        var top = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.56, 0.32), dm); top.position.y = 0.8; body.add(top);
        var skm = dm.map ? dm.userData.skirt : dm;   // váy tròn: lặp hoa nhiều hơn theo chiều ngang để hoa không bị kéo dãn (đầm trơn dùng luôn vải thân)
        if (!skm) { skm = dm.userData.skirt = dm.clone(); skm.map = dm.map.clone(); skm.map.needsUpdate = true; skm.map.repeat.set(5, 1.2); }
        var skirt = c.dress.mini   // đầm mini: váy ngắn trên gối, xoè nhẹ
          ? new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.37, 0.27, 8), skm)
          : new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.44, 0.44, 8), skm);
        skirt.position.y = c.dress.mini ? 0.44 : 0.34; body.add(skirt);
        if (c.dress.belt !== null) box(0.54, 0.06, 0.34, c.dress.belt || 0xffffff, 0, 0.55, 0, body);
        if (!c.dress.sleeveless) [arms.L, arms.R].forEach(function (a) { var sl = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.18, 0.17), dm); sl.position.y = -0.07; a.add(sl); });
      } else if (c.pattern) {   // áo hoa văn (sọc, chấm): thân áo + tay áo dài cùng vải
        var pm = patternMat(c.pattern);
        var shirt = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.56, 0.32), pm); shirt.position.y = 0.8; body.add(shirt);
        [arms.L, arms.R].forEach(function (a) { var sl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.4, 0.16), pm); sl.position.y = -0.2; a.add(sl); });
      } else box(0.52, 0.56, 0.32, c.shirt, 0, 0.8, 0, body);
      if (c.blazer) {   // áo blazer mở: lộ áo trong hình chữ V, ve áo đậm màu, túi hai bên
        var bz = c.blazer;
        box(0.2, 0.46, 0.02, bz.inner, 0, 0.84, -0.166, body);
        [-1, 1].forEach(function (sd) {
          var lp = box(0.07, 0.3, 0.02, bz.lapel || bz.color, sd * 0.11, 0.92, -0.172, body); lp.rotation.z = sd * 0.25;
          box(0.12, 0.025, 0.02, bz.lapel || bz.color, sd * 0.17, 0.66, -0.168, body);
        });
        if (bz.button) box(0.035, 0.035, 0.02, bz.button, 0.11, 0.7, -0.175, body);
      }
      if (c.jeans) {   // quần jeans: gấu xắn lộ mắt cá, đường chỉ ngoài, thắt lưng da
        var lg = r.g.userData.legs, jn = c.jeans;
        [lg.L, lg.R].forEach(function (leg, k) {
          box(lg.w + 0.02, 0.06, lg.w + 0.02, jn.cuff, 0, -lg.len + 0.15, 0, leg);
          box(lg.w + 0.006, 0.07, lg.w + 0.006, c.skin, 0, -lg.len + 0.085, 0, leg);   // mắt cá chân
          box(0.012, lg.len - 0.2, 0.012, jn.stitch, (k ? 1 : -1) * (lg.w / 2 + 0.002), -lg.len / 2 + 0.06, 0, leg);
        });
        box(0.53, 0.05, 0.33, jn.belt, 0, 0.55, 0, body);
        box(0.07, 0.05, 0.02, jn.buckle, 0, 0.55, -0.168, body);
      }
      if (c.collar) box(0.3, 0.07, 0.04, c.collar, 0, 1.05, -0.165, body);   // cổ áo
      if (c.scarf) {   // khăn quàng đỏ của học sinh
        box(0.34, 0.07, 0.34, c.scarf, 0, 1.06, 0, body);
        var kn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 3), MS3D.mat(c.scarf)); kn.position.set(0, 0.95, -0.18); kn.rotation.x = Math.PI; body.add(kn);
      }
      if (c.watch && arms.L) {   // đồng hồ thông minh ở cổ tay trái, mặt đồng hồ quay ra trước
        box(0.16, 0.07, 0.16, c.watch, 0, -0.38, 0, arms.L);
        box(0.1, 0.11, 0.03, 0x1a1a1a, 0, -0.38, -0.085, arms.L);
        var scr = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.01), new THREE.MeshBasicMaterial({ color: 0x5ee0c8 }));
        scr.position.set(0, -0.38, -0.102); arms.L.add(scr);
      }
      if (!c.noBag) box(0.36, 0.38, 0.14, 0xfff6ea, 0, 0.84, 0.22, body); // ba lô
      if (c.apron) { box(0.44, 0.5, 0.04, c.apron, 0, 0.74, -0.17, body); box(0.2, 0.1, 0.03, 0xfff6ea, 0, 0.72, -0.19, body); } // tạp dề có túi
      var head = new THREE.Group(); head.position.y = 1.36; body.add(head);
      box(0.44, 0.42, 0.4, c.skin, 0, 0, 0, head);
      face(head, 0, -0.205, 1, { mouth: false });
      var h = c.hair;
      box(0.48, 0.14, 0.44, h, 0, 0.24, 0.01, head);
      box(0.48, 0.3, 0.1, h, 0, 0.08, 0.2, head);
      box(0.08, 0.22, 0.4, h, -0.24, 0.12, 0.02, head);
      box(0.08, 0.22, 0.4, h, 0.24, 0.12, 0.02, head);
      if (c.style === "short") box(0.44, 0.08, 0.08, h, 0, 0.17, -0.2, head);
      if (c.style === "long" || c.style === "longer") { box(0.5, 0.56, 0.12, h, 0, -0.14, 0.22, head); box(0.44, 0.1, 0.08, h, 0.04, 0.18, -0.2, head); }
      if (c.style === "longer") {   // tóc dài quá vai, hai lọn trước vai
        box(0.5, 0.42, 0.12, h, 0, -0.6, 0.2, head);
        box(0.1, 0.46, 0.1, h, -0.25, -0.3, 0.02, head); box(0.1, 0.46, 0.1, h, 0.25, -0.3, 0.02, head);
      }
      if (c.style === "bob") {        // tóc ngắn ngang cằm, mái thưa
        box(0.5, 0.34, 0.12, h, 0, -0.07, 0.22, head);
        box(0.08, 0.36, 0.36, h, -0.25, -0.06, 0.02, head); box(0.08, 0.36, 0.36, h, 0.25, -0.06, 0.02, head);
        box(0.44, 0.08, 0.08, h, 0, 0.18, -0.2, head);
      }
      if (c.style === "shoulder") {   // tóc thẳng ngang vai, mái rẽ một bên
        box(0.5, 0.62, 0.12, h, 0, -0.2, 0.22, head);
        box(0.08, 0.56, 0.3, h, -0.25, -0.16, 0.05, head); box(0.08, 0.56, 0.3, h, 0.25, -0.16, 0.05, head);
        box(0.3, 0.08, 0.08, h, 0.07, 0.18, -0.2, head);
      }
      if (c.style === "wavy" || c.style === "curly") {   // tóc gợn sóng / xoăn qua vai: nền + các lọn tròn
        var big = c.style === "curly", rr = big ? 0.11 : 0.09;
        box(0.5, big ? 0.78 : 0.7, 0.14, h, 0, big ? -0.3 : -0.26, 0.22, head);
        for (var yy = 0.14, k = 0; yy > (big ? -0.7 : -0.62); yy -= 0.13, k++) {
          [-1, 1].forEach(function (sd) { ball(rr, h, sd * (0.27 + (k % 2) * 0.03), yy, 0.08 + (k % 2) * 0.04, head, 0); });
          [-0.16, 0, 0.16].forEach(function (x) { ball(rr, h, x + (k % 2) * 0.05, yy, 0.3, head, 0); });
        }
        if (big) [-0.18, 0, 0.18].forEach(function (x) { ball(0.12, h, x, 0.3, 0.06, head, 0); });
        box(0.26, 0.08, 0.08, h, -0.09, 0.18, -0.2, head);
      }
      if (c.style === "pony") { box(0.14, 0.4, 0.14, h, 0, -0.02, 0.3, head); ball(0.07, 0xff8300, 0, 0.2, 0.28, head, 0); }
      if (c.style === "bun") { box(0.22, 0.2, 0.2, h, 0, 0.28, 0.2, head); box(0.44, 0.08, 0.08, h, 0, 0.17, -0.2, head); }
      if (c.glasses) [-0.1, 0.1].forEach(function (x) {   // gọng kính: viền trên/dưới/hai bên, chừa mắt
        box(0.16, 0.025, 0.02, c.glasses, x, 0.085, -0.22, head); box(0.16, 0.025, 0.02, c.glasses, x, -0.045, -0.22, head);
        box(0.025, 0.13, 0.02, c.glasses, x - 0.07, 0.02, -0.22, head); box(0.025, 0.13, 0.02, c.glasses, x + 0.07, 0.02, -0.22, head);
      });
      if (c.style === "cap") { box(0.5, 0.16, 0.46, c.capColor, 0, 0.3, 0, head); box(0.4, 0.04, 0.24, c.capColor, 0, 0.24, -0.32, head); }
      return anchors(r, body, [0,1.67,0],[0,1.38,-0.215],[0,1.1,-0.17],[0,0.84,0.3]);
    },

    /* ---------- CON VẬT ---------- */
    cat: function () {
      var box = MS3D.box, F = 0xf0a04b, S = 0xc9782b, W = 0xfff3e2;
      var r = rig({ legColor: F, legLen: 0.4, armColor: F, armLen: 0.38, shoulderY: 0.92, shoe: W });
      var b = r.body;
      box(0.5, 0.5, 0.36, F, 0, 0.66, 0, b);
      box(0.3, 0.36, 0.04, W, 0, 0.64, -0.18, b);                 // bụng trắng
      box(0.52, 0.06, 0.38, S, 0, 0.78, 0, b); box(0.52, 0.06, 0.38, S, 0, 0.6, 0, b); // sọc
      var tail = new THREE.Group(); tail.position.set(0, 0.5, 0.2); tail.rotation.x = 0.9; b.add(tail);
      box(0.1, 0.5, 0.1, F, 0, 0.25, 0, tail); box(0.11, 0.1, 0.11, S, 0, 0.42, 0, tail);
      var hd = new THREE.Group(); hd.position.y = 1.18; b.add(hd);
      box(0.56, 0.44, 0.44, F, 0, 0, 0, hd);
      box(0.58, 0.06, 0.46, S, 0, 0.14, 0, hd);
      box(0.24, 0.14, 0.04, W, 0, -0.12, -0.22, hd);              // mõm
      box(0.06, 0.05, 0.03, 0xe86a92, 0, -0.07, -0.245, hd);      // mũi
      face(hd, 0.04, -0.225, 1.05, { mouth: false });
      [-1, 1].forEach(function (s) {
        var e = mesh(new THREE.ConeGeometry(0.11, 0.2, 4), F, s * 0.18, 0.3, 0, hd); e.rotation.y = Math.PI / 4;
        box(0.18, 0.015, 0.015, 0xffffff, s * 0.22, -0.11, -0.24, hd); // râu
      });
      return anchors(r, b, [0,1.43,0],[0,1.22,-0.235],[0,0.92,-0.19],[0,0.66,0.18]);
    },
    panda: function () {
      var box = MS3D.box, ball = MS3D.ball, W = 0xf7f7f2, K = 0x2b2b2b;
      var r = rig({ legColor: K, legLen: 0.4, legW: 0.22, armColor: K, armLen: 0.4, armW: 0.16, shoulderY: 0.98, armX: 0.36, shoe: false });
      var b = r.body;
      box(0.6, 0.6, 0.44, W, 0, 0.7, 0, b);
      box(0.62, 0.16, 0.46, K, 0, 0.92, 0, b);                     // vai đen
      ball(0.08, W, 0, 0.5, 0.24, b, 0);                           // đuôi
      var hd = new THREE.Group(); hd.position.y = 1.28; b.add(hd);
      box(0.56, 0.46, 0.46, W, 0, 0, 0, hd);
      ball(0.1, K, -0.24, 0.26, 0, hd, 0); ball(0.1, K, 0.24, 0.26, 0, hd, 0); // tai
      box(0.14, 0.12, 0.03, K, -0.12, 0.02, -0.235, hd); box(0.14, 0.12, 0.03, K, 0.12, 0.02, -0.235, hd); // quầng mắt
      box(0.05, 0.05, 0.02, 0xffffff, -0.12, 0.04, -0.252, hd); box(0.05, 0.05, 0.02, 0xffffff, 0.12, 0.04, -0.252, hd);
      box(0.08, 0.06, 0.03, K, 0, -0.1, -0.24, hd);
      box(0.08, 0.04, 0.02, BLUSH, -0.2, -0.1, -0.235, hd); box(0.08, 0.04, 0.02, BLUSH, 0.2, -0.1, -0.235, hd);
      return anchors(r, b, [0,1.51,0],[0,1.31,-0.255],[0,1.0,-0.23],[0,0.72,0.22]);
    },
    bunny: function () {
      var box = MS3D.box, ball = MS3D.ball, W = 0xf4f0ec, P = 0xf3b6c4;
      var r = rig({ legColor: W, legLen: 0.4, armColor: W, armLen: 0.36, shoulderY: 0.9, shoe: P });
      var b = r.body;
      box(0.48, 0.5, 0.36, W, 0, 0.66, 0, b);
      box(0.28, 0.32, 0.04, 0xffffff, 0, 0.62, -0.18, b);
      ball(0.12, 0xffffff, 0, 0.5, 0.22, b, 0);                   // đuôi bông
      var hd = new THREE.Group(); hd.position.y = 1.12; b.add(hd);
      box(0.5, 0.42, 0.42, W, 0, 0, 0, hd);
      [-1, 1].forEach(function (s) {
        var ear = new THREE.Group(); ear.position.set(s * 0.12, 0.2, 0.04); ear.rotation.z = -s * 0.15; hd.add(ear);
        box(0.12, 0.42, 0.08, W, 0, 0.21, 0, ear); box(0.06, 0.32, 0.02, P, 0, 0.21, -0.045, ear);
      });
      face(hd, 0.04, -0.215, 1, { mouth: false });
      box(0.06, 0.04, 0.02, P, 0, -0.06, -0.22, hd);
      box(0.08, 0.07, 0.02, 0xffffff, 0, -0.13, -0.215, hd);      // răng thỏ
      return anchors(r, b, [0,1.33,0],[0,1.18,-0.225],[0,0.9,-0.19],[0,0.66,0.18]);
    },
    penguin: function () {
      var K = 0x2c3e50, W = 0xfdfdfb, O = 0xff9a2e;
      var r = rig({ legColor: O, legLen: 0.16, legW: 0.12, legX: 0.14, hipY: 0.18, shoe: O });
      var b = r.body;
      var bd = mesh(new THREE.IcosahedronGeometry(0.42, 1), K, 0, 0.66, 0, b); bd.scale.set(1, 1.35, 0.95);
      var bl = mesh(new THREE.IcosahedronGeometry(0.34, 1), W, 0, 0.6, -0.2, b); bl.scale.set(0.95, 1.3, 0.8);
      [-1, 1].forEach(function (s) {
        var fl = MS3D.box(0.08, 0.42, 0.24, K, s * 0.42, 0.7, 0, b); fl.rotation.z = s * 0.35;
      });
      var beak = mesh(new THREE.ConeGeometry(0.07, 0.18, 4), O, 0, 1.0, -0.47, b); beak.rotation.x = -Math.PI / 2;
      face(b, 1.12, -0.41, 1, { mouth: false, blush: false });
      MS3D.box(0.08, 0.04, 0.02, BLUSH, -0.2, 1.0, -0.37, b); MS3D.box(0.08, 0.04, 0.02, BLUSH, 0.2, 1.0, -0.37, b);
      // khăn quàng cam thương hiệu
      MS3D.cyl(0.36, 0.38, 0.1, 10, 0xff8300, 0, 0.92, 0, b);
      return anchors(r, b, [0,1.2,0],[0,1.14,-0.43],[0,0.9,-0.4],[0,0.7,0.4]);
    },

    /* ---------- RAU CỦ ---------- */
    carrot: function () {
      var O = 0xff7a1a, G = 0x4f9d58, L = 0x2f6e3c;
      var r = rig({ legColor: L, legLen: 0.32, legW: 0.08, hipY: 0.34, armColor: L, armLen: 0.36, armW: 0.07, armX: 0.28, shoulderY: 1.0, shoe: O });
      var b = r.body;
      var bd = mesh(new THREE.ConeGeometry(0.34, 1.0, 8), O, 0, 0.78, 0, b); bd.rotation.x = Math.PI; // củ nhọn xuống
      MS3D.box(0.5, 0.03, 0.03, 0xd9600f, 0, 0.62, -0.2, b);
      MS3D.box(0.36, 0.03, 0.03, 0xd9600f, 0, 0.45, -0.14, b);
      [-0.14, 0, 0.14].forEach(function (x, k) {
        var lf = mesh(new THREE.ConeGeometry(0.08, 0.4, 4), k === 1 ? G : L, x, 1.45, 0, b); lf.rotation.z = -x * 2.4;
      });
      face(b, 1.06, -0.27, 1);
      return anchors(r, b, [0,1.3,0],[0,1.08,-0.28],[0,0.92,-0.25],[0,0.9,0.24]);
    },
    broccoli: function () {
      var S = 0x9ccc65, G = 0x3f8a4e, G2 = 0x4f9d58;
      var r = rig({ legColor: 0x7cb342, legLen: 0.3, legW: 0.1, hipY: 0.32, armColor: 0x7cb342, armLen: 0.34, armW: 0.08, armX: 0.3, shoulderY: 0.82, shoe: 0x5a8f2e });
      var b = r.body;
      MS3D.cyl(0.2, 0.26, 0.62, 8, S, 0, 0.62, 0, b);                // thân cuống
      face(b, 0.66, -0.24, 0.9);
      [[0, 1.2, 0, 0.32], [-0.26, 1.08, 0.02, 0.24], [0.26, 1.08, 0.02, 0.24], [-0.14, 1.32, 0.08, 0.2], [0.16, 1.3, 0.06, 0.22], [0, 1.1, -0.18, 0.2], [0, 1.1, 0.2, 0.22]]
        .forEach(function (p, k) { MS3D.ball(p[3], k % 2 ? G2 : G, p[0], p[1], p[2], b, 0); });
      return anchors(r, b, [0,1.48,0],[0,0.68,-0.25],[0,0.86,-0.21],[0,0.62,0.24]);
    },

    /* ---------- TRÁI CÂY ---------- */
    dragonfruit: function () {
      var M = 0xe0337a, G = 0x7cc35a;
      var r = rig({ legColor: 0x5a8f2e, legLen: 0.3, legW: 0.09, hipY: 0.32, armColor: 0x5a8f2e, armLen: 0.34, armW: 0.08, armX: 0.42, shoulderY: 0.86, shoe: G });
      var b = r.body;
      var bd = mesh(new THREE.IcosahedronGeometry(0.42, 1), M, 0, 0.82, 0, b); bd.scale.set(1, 1.25, 1);
      // vảy xanh chĩa ra ngoài
      [[0.3, 1.1, 0.2], [-0.3, 1.1, 0.2], [0.38, 0.75, 0.1], [-0.38, 0.75, 0.1], [0, 1.3, 0.1], [0.22, 0.5, 0.2], [-0.22, 0.5, 0.2], [0, 0.7, 0.4]].forEach(function (p) {
        var sc = mesh(new THREE.ConeGeometry(0.08, 0.24, 4), G, p[0], p[1], p[2], b);
        sc.lookAt(new THREE.Vector3(p[0] * 3, (p[1] - 0.82) * 3 + 0.82, p[2] * 3)); sc.rotateX(Math.PI / 2);
      });
      var top = mesh(new THREE.ConeGeometry(0.1, 0.24, 4), G, 0, 1.4, 0, b); void top;
      face(b, 0.9, -0.41, 1, { blush: 0xff9ac4 });
      return anchors(r, b, [0,1.36,0],[0,0.94,-0.43],[0,0.58,-0.38],[0,0.82,0.42]);
    },
    watermelon: function () {
      var R = 0xe8474c, G = 0x3f9a4a, P = 0xd8f0c0;
      var r = rig({ legColor: G, legLen: 0.3, legW: 0.1, hipY: 0.32, armColor: G, armLen: 0.34, armW: 0.08, armX: 0.46, shoulderY: 0.82, shoe: 0x2f6e3c });
      var b = r.body;
      // miếng dưa: nửa hình tròn đứng, mặt đỏ nhìn về phía trước
      var slice = new THREE.Group(); slice.position.y = 0.36; b.add(slice);
      var rind = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.3, 14, 1, false, -Math.PI / 2, Math.PI), MS3D.mat(G));
      rind.rotation.x = -Math.PI / 2; slice.add(rind);
      var pale = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.31, 14, 1, false, -Math.PI / 2, Math.PI), MS3D.mat(P));
      pale.rotation.x = -Math.PI / 2; slice.add(pale);
      var flesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.32, 14, 1, false, -Math.PI / 2, Math.PI), MS3D.mat(R));
      flesh.rotation.x = -Math.PI / 2; slice.add(flesh);
      // hạt
      [[-0.3, 0.12], [0.3, 0.12], [-0.16, 0.34], [0.18, 0.34], [0, 0.42]].forEach(function (p) { MS3D.box(0.04, 0.07, 0.02, INK, p[0], 0.36 + p[1], -0.165, b); });
      face(b, 0.58, -0.165, 1, { blush: 0xff9aa0 });
      return anchors(r, b, [0,0.98,0],[0,0.6,-0.175],[0,0.42,-0.17],[0,0.6,0.16]);
    }
  };

  /* ---------- PHỤ KIỆN (Tủ đồ) ----------
     need.stars: mở khi tổng Sao Biển đạt mốc (không trừ sao).
     need.theme: mở khi ghé Phòng Lễ hội lúc đang trang trí lễ đó. */
  MS3D.ACCESSORIES = [
    { id: "mu-tot-nghiep", slot: "top",  name: "Mũ tốt nghiệp", need: { stars: 0 } },
    { id: "kinh-tron",     slot: "eyes", name: "Kính tròn",      need: { stars: 0 } },
    { id: "no-cam",        slot: "neck", name: "Nơ cam",         need: { stars: 1 } },
    { id: "mu-len",        slot: "top",  name: "Mũ len",         need: { stars: 3 } },
    { id: "vuong-mien",    slot: "top",  name: "Vương miện sách", need: { stars: 5 } },
    { id: "ba-lo-sao",     slot: "back", name: "Ba lô Sao Biển", need: { stars: 8 } },
    { id: "non-la",        slot: "top",  name: "Nón lá",         need: { theme: "tet" } },
    { id: "den-ong-sao",   slot: "back", name: "Đèn ông sao",    need: { theme: "trung-thu" } },
    { id: "mu-phu-thuy",   slot: "top",  name: "Mũ phù thuỷ",    need: { theme: "halloween" } },
    { id: "mu-noel",       slot: "top",  name: "Mũ Noel",        need: { theme: "giang-sinh" } },
    // huy hiệu "Nhà khám phá": ghé đủ 6 gian hàng + làm xong đố vui của lễ đó
    { id: "hh-tet",        slot: "neck", name: "Huy hiệu Tết",       need: { explore: "tet" },        badge: [0xb71c1c, 0xffd02e] },
    { id: "hh-trung-thu",  slot: "neck", name: "Huy hiệu Trung thu", need: { explore: "trung-thu" },  badge: [0x253a6e, 0xffd02e] },
    { id: "hh-halloween",  slot: "neck", name: "Huy hiệu Halloween", need: { explore: "halloween" },  badge: [0x4a2f73, 0xff9a33] },
    { id: "hh-giang-sinh", slot: "neck", name: "Huy hiệu Giáng sinh", need: { explore: "giang-sinh" }, badge: [0x1b5e20, 0xffffff] }
  ];
  MS3D.SLOT_NAMES = { top: "Trên đầu", eyes: "Mắt", neck: "Cổ", back: "Sau lưng" };

  MS3D.starShape = function (R, r) {
    var s = new THREE.Shape();
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
      if (i === 0) s.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); else s.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    s.closePath(); return s;
  };

  var ACC = {
    "mu-tot-nghiep": function (g) {
      MS3D.box(0.3, 0.1, 0.3, 0x1b2a2b, 0, 0.05, 0, g);
      var t = MS3D.box(0.46, 0.04, 0.46, 0x1b2a2b, 0, 0.12, 0, g); t.rotation.y = Math.PI / 4;
      MS3D.box(0.02, 0.16, 0.02, 0xff8300, 0.2, 0.06, -0.12, g);
      MS3D.ball(0.035, 0xff8300, 0.2, -0.03, -0.12, g, 0);
    },
    "kinh-tron": function (g) {
      [-1, 1].forEach(function (s) { mesh(new THREE.TorusGeometry(0.075, 0.016, 6, 14), INK, s * 0.1, 0.01, -0.015, g); });
      MS3D.box(0.07, 0.016, 0.016, INK, 0, 0.02, -0.015, g);
    },
    "no-cam": function (g) {
      [-1, 1].forEach(function (s) { var c = mesh(new THREE.ConeGeometry(0.07, 0.13, 4), 0xff8300, s * 0.07, 0, -0.03, g); c.rotation.z = s * Math.PI / 2; });
      MS3D.ball(0.035, 0xa85000, 0, 0, -0.04, g, 0);
    },
    "mu-len": function (g) {
      MS3D.cyl(0.25, 0.26, 0.08, 12, 0xff8300, 0, 0.03, 0, g);
      var d = MS3D.ball(0.24, 0x50b1b3, 0, 0.1, 0, g, 1); d.scale.y = 0.75;
      MS3D.ball(0.07, 0xff8300, 0, 0.3, 0, g, 0);
    },
    "vuong-mien": function (g) {
      var gold = 0xffc83d;
      MS3D.cyl(0.19, 0.19, 0.08, 10, gold, 0, 0.04, 0, g);
      for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; mesh(new THREE.ConeGeometry(0.05, 0.14, 4), gold, Math.sin(a) * 0.16, 0.14, Math.cos(a) * 0.16, g); }
      var bk = MS3D.box(0.12, 0.08, 0.02, 0xff8300, 0, 0.05, -0.2, g); void bk;
    },
    "ba-lo-sao": function (g) {
      MS3D.box(0.34, 0.38, 0.16, 0xff8300, 0, 0, 0.08, g);
      MS3D.box(0.26, 0.14, 0.04, 0xa85000, 0, -0.08, 0.17, g);
      var st = new THREE.Mesh(new THREE.ExtrudeGeometry(MS3D.starShape(0.09, 0.04), { depth: 0.03, bevelEnabled: false }), MS3D.mat(0x50b1b3));
      st.position.set(0, 0.08, 0.16); g.add(st);
    },
    "non-la": function (g) {
      mesh(new THREE.ConeGeometry(0.42, 0.26, 16), 0xe8d6a0, 0, 0.11, 0, g);
      MS3D.cyl(0.25, 0.25, 0.02, 16, 0xc62828, 0, 0.0, 0, g);
    },
    "den-ong-sao": function (g) {
      var stick = MS3D.cyl(0.015, 0.015, 1.0, 5, 0x8a5a2e, 0.22, 0.4, 0.06, g); stick.rotation.z = -0.35;
      var st = new THREE.Mesh(new THREE.ExtrudeGeometry(MS3D.starShape(0.2, 0.09), { depth: 0.06, bevelEnabled: false }),
        new THREE.MeshLambertMaterial({ color: 0xe53935, emissive: 0x661010, flatShading: true }));
      st.position.set(0.4, 0.95, 0.04); g.add(st);
      MS3D.box(0.03, 0.18, 0.03, 0xffc83d, 0.4, 0.72, 0.07, g);
    },
    "mu-phu-thuy": function (g) {
      MS3D.cyl(0.38, 0.38, 0.03, 16, 0x4a2f73, 0, 0.0, 0, g);
      var c = mesh(new THREE.ConeGeometry(0.21, 0.52, 10), 0x4a2f73, 0, 0.28, 0, g); c.rotation.z = 0.15;
      MS3D.cyl(0.215, 0.22, 0.06, 10, 0xff8300, 0, 0.05, 0, g);
    },
    "mu-noel": function (g) {
      var c = mesh(new THREE.ConeGeometry(0.22, 0.44, 10), 0xd62828, 0.02, 0.24, 0, g); c.rotation.z = -0.3;
      MS3D.cyl(0.25, 0.25, 0.08, 12, 0xffffff, 0, 0.03, 0, g);
      MS3D.ball(0.07, 0xffffff, 0.14, 0.43, 0, g, 0);
    }
  };

  // huy hiệu tròn cài trước ngực, ngôi sao ở giữa
  MS3D.ACCESSORIES.forEach(function (it) {
    if (!it.badge) return;
    ACC[it.id] = function (g) {
      var d = MS3D.cyl(0.11, 0.11, 0.03, 14, it.badge[0], 0, -0.1, -0.02, g); d.rotation.x = Math.PI / 2;
      var st = new THREE.Mesh(new THREE.ExtrudeGeometry(MS3D.starShape(0.07, 0.03), { depth: 0.015, bevelEnabled: false }), MS3D.mat(it.badge[1]));
      st.position.set(0, -0.1, -0.05); st.rotation.y = Math.PI; g.add(st);
    };
  });

  /* Mặc phụ kiện lên nhân vật. equip = { top: id, eyes: id, neck: id, back: id } */
  MS3D.dress = function (charGroup, equip) {
    var a = charGroup && charGroup.userData.anchors; if (!a) return;
    Object.keys(a).forEach(function (slot) {
      var anc = a[slot];
      for (var i = anc.children.length - 1; i >= 0; i--) anc.remove(anc.children[i]);
      var id = equip && equip[slot];
      if (id && ACC[id]) { var g = new THREE.Group(); ACC[id](g); anc.add(g); }
    });
  };

  /* Trả về THREE.Group cao ~1.5 đơn vị, mặt nhìn về -z.
     group.userData.animate(dt, speed) để vung tay chân khi đi. */
  MS3D.makeCharacter = function (id) {
    var c = MS3D.getCharacter(id);
    var g = (BUILD[c.kind] || BUILD.human)(c);
    g.userData.info = c;
    return g;
  };

  /* NPC dạng người (cô giáo, bạn học): c giống một dòng CHARACTERS kind "human",
     thêm style "bun" (tóc búi), apron (màu tạp dề), glasses (màu gọng kính), noBag. */
  MS3D.makeHuman = function (c) { var g = BUILD.human(c); g.userData.info = c; return g; };

  /* Cá Heo: linh vật chuỗi Nghị luận (tên tạm), đội mũ tốt nghiệp nhỏ màu cam. Mặt nhìn về -z. */
  MS3D.makeDolphin = function () {
    var g = new THREE.Group(), C = 0x6fb7d6, belly = 0xe9f6fb;
    var body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 1), MS3D.mat(C));
    body.scale.set(0.7, 0.7, 1.6); g.add(body);
    var b2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 1), MS3D.mat(belly));
    b2.scale.set(0.6, 0.5, 1.4); b2.position.set(0, -0.12, -0.05); g.add(b2);
    var snout = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 6), MS3D.mat(C));
    snout.rotation.x = -Math.PI / 2; snout.position.set(0, -0.06, -0.92); g.add(snout);
    var fin = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 4), MS3D.mat(C));
    fin.position.set(0, 0.42, 0.1); fin.rotation.x = 0.5; g.add(fin);
    var tail = new THREE.Group(); tail.position.set(0, 0, 0.8); g.add(tail);
    MS3D.box(0.9, 0.06, 0.3, C, 0, 0, 0.18, tail);
    MS3D.box(0.06, 0.06, 0.06, INK, -0.2, 0.1, -0.6, g);
    MS3D.box(0.06, 0.06, 0.06, INK, 0.2, 0.1, -0.6, g);
    MS3D.box(0.32, 0.12, 0.32, 0xff8300, 0, 0.42, -0.42, g);
    var top = MS3D.box(0.5, 0.04, 0.5, 0xff8300, 0, 0.5, -0.42, g); top.rotation.y = Math.PI / 4;
    MS3D.ball(0.04, 0xffd36b, 0.18, 0.5, -0.28, g, 0);
    var t = 0;
    g.userData.animate = function (dt) { t += dt; tail.rotation.x = Math.sin(t * 6) * 0.35; };
    return g;
  };
})();
