/* ==========================================================
   SẢNH 3D MỞ SÁCH — scene.js
   Cảnh, máy quay, ánh sáng, ngày/đêm, va chạm và các hàm dựng khối.
   Cần: three@0.149.0 (UMD, biến toàn cục THREE) + assets/ms.js.
   Mọi thứ 3D gom trong window.MS3D.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};

  MS3D.COLORS = {
    orange: 0xff8300, teal: 0x50b1b3, tealInk: 0x1d6b6d, cream: 0xfff6ea,
    wood: 0xc58a4f, woodDark: 0x8a5a2e, wall: 0xe9e1d3, floor: 0xeee3cf,
    grass: 0x8fcf7a, water: 0x5fc6d6, stone: 0xb9bdb7, ink: 0x1b2a2b
  };

  var SKY = {
    day:   { bg: 0xdff3f2, fog: 0xdff3f2, hemiSky: 0xffffff, hemiGround: 0xb8c9b0, hemi: 0.55, sun: 0.72, sunColor: 0xfff2dc },
    night: { bg: 0x16233d, fog: 0x16233d, hemiSky: 0x8fa6d8, hemiGround: 0x2a3550, hemi: 0.55, sun: 0.18, sunColor: 0x9fb4ff }
  };

  /* ---------- Vân sàn: ảnh xám nhạt, nhân với màu sàn (nên đổi màu theo mùa/đêm vẫn đúng) ----------
     kind: "tile" (gạch lớn), "wood" (ván gỗ), "carpet" (thảm hoa văn), "grass" (cỏ lốm đốm).
     size: số đơn vị thế giới mà một ô ảnh phủ (rooms.js đặt repeat theo kích thước sàn). */
  var FLOOR_TEX = {}, FLOOR_SIZE = { tile: 2.4, wood: 3.2, carpet: 1.6, grass: 3.5 };
  MS3D.floorTexture = function (kind) {
    if (FLOOR_TEX[kind]) return FLOOR_TEX[kind];
    var c = document.createElement("canvas"); c.width = c.height = 128; var g = c.getContext("2d");
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function gray(v) { v = Math.round(v); return "rgb(" + v + "," + v + "," + v + ")"; }
    if (kind === "tile") {        // 2×2 gạch, hơi lệch tông, ron mảnh
      [[0, 0, 255], [64, 0, 248], [0, 64, 248], [64, 64, 255]].forEach(function (t) { g.fillStyle = gray(t[2]); g.fillRect(t[0], t[1], 64, 64); });
      g.fillStyle = gray(222); g.fillRect(0, 0, 128, 2); g.fillRect(0, 64, 128, 2); g.fillRect(0, 0, 2, 128); g.fillRect(64, 0, 2, 128);
    } else if (kind === "wood") { // 8 hàng ván hẹp, dài; mối nối so le, vân gỗ mảnh
      for (var r = 0; r < 8; r++) {
        var off = [0, 72, 30, 100, 50, 12, 86, 40][r];
        for (var x = -128; x < 128; x += 128) {
          g.fillStyle = gray(236 + rnd() * 19); g.fillRect(x + off, r * 16, 128, 16);
          g.fillStyle = gray(212); g.fillRect(x + off, r * 16, 2, 16);
        }
        for (var k = 0; k < 2; k++) { g.fillStyle = gray(230 + rnd() * 12); g.fillRect(0, r * 16 + 4 + rnd() * 9, 128, 1); }
        g.fillStyle = gray(206); g.fillRect(0, r * 16, 128, 1);
      }
    } else if (kind === "carpet") { // nền + hoa văn hình thoi nhỏ
      g.fillStyle = gray(228); g.fillRect(0, 0, 128, 128);
      g.fillStyle = gray(255);
      for (var yy = 0; yy < 128; yy += 32) for (var xx = 0; xx < 128; xx += 32) {
        var cx = xx + ((yy / 32) % 2 ? 16 : 0) + 8, cy = yy + 8;
        g.beginPath(); g.moveTo(cx, cy - 5); g.lineTo(cx + 5, cy); g.lineTo(cx, cy + 5); g.lineTo(cx - 5, cy); g.closePath(); g.fill();
      }
    } else {                        // cỏ: đốm sáng tối ngẫu nhiên
      g.fillStyle = gray(244); g.fillRect(0, 0, 128, 128);
      for (var i = 0; i < 260; i++) { g.fillStyle = gray(rnd() < 0.5 ? 222 + rnd() * 14 : 252); g.fillRect(rnd() * 128, rnd() * 128, 2 + rnd() * 3, 2 + rnd() * 3); }
    }
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy = 8;
    tex.userData = { size: FLOOR_SIZE[kind] || 2 };
    return (FLOOR_TEX[kind] = tex);
  };

  /* ---------- Thế giới: nơi các file khác đăng ký vật thể ---------- */
  function World() {
    this.colliders = [];      // {minX,maxX,minZ,maxZ} hoặc {x,z,r}
    this.interactables = [];  // {x,z,r,label,sub,action,disabled,room}
    this.updaters = [];       // function(dt, t)
    this.fadeWalls = [];      // tường có thể làm mờ khi che nhân vật
    this.rooms = [];          // {id,name,bounds,spawn,status}
    this.pickables = [];      // vật bấm/chạm trực tiếp được bằng chuột hoặc ngón tay
    this.nightMats = [];      // vật liệu đổi theo ngày/đêm: {mat, day, night}
    this.time = "day";
  }
  World.prototype.addBox = function (minX, maxX, minZ, maxZ) { this.colliders.push({ minX: minX, maxX: maxX, minZ: minZ, maxZ: maxZ }); };
  /* Gắn một vật 3D với vật tương tác (mặc định: cái vừa thêm vào interactables) để bấm thẳng vào vật. */
  World.prototype.pick = function (obj, it) {
    it = it || this.interactables[this.interactables.length - 1];
    obj.traverse(function (o) { o.userData.it = it; });
    this.pickables.push(obj); return obj;
  };
  var PICK_MAT = null;
  /* Vùng bấm vô hình (cho vật dựng từ nhiều khối rời). */
  World.prototype.pickArea = function (x, y, z, w, h, d, parent, it) {
    PICK_MAT = PICK_MAT || new THREE.MeshBasicMaterial({ visible: false });
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), PICK_MAT);
    m.position.set(x, y, z); (parent || this.scene).add(m);
    return this.pick(m, it);
  };
  World.prototype.addCircle = function (x, z, r) { this.colliders.push({ x: x, z: z, r: r }); };
  World.prototype.roomAt = function (x, z) {
    for (var i = 0; i < this.rooms.length; i++) {
      var b = this.rooms[i].bounds;
      if (x >= b[0] && x <= b[1] && z >= b[2] && z <= b[3]) return this.rooms[i];
    }
    return null;
  };

  /* Di chuyển hình tròn bán kính r, trượt dọc tường (tách trục x / z). */
  World.prototype.move = function (pos, dx, dz, r) {
    var self = this;
    function hit(x, z) {
      for (var i = 0; i < self.colliders.length; i++) {
        var c = self.colliders[i];
        if (c.r !== undefined) {
          var ddx = x - c.x, ddz = z - c.z, rr = c.r + r;
          if (ddx * ddx + ddz * ddz < rr * rr) return true;
        } else if (x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ) return true;
      }
      return false;
    }
    // chia bước nhỏ để không xuyên tường khi khung hình chậm
    var steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / 0.15));
    var sx = dx / steps, sz = dz / steps;
    for (var s = 0; s < steps; s++) {
      if (!hit(pos.x + sx, pos.z)) pos.x += sx;
      if (!hit(pos.x, pos.z + sz)) pos.z += sz;
    }
  };

  /* ---------- Hàm dựng khối (vật liệu dùng chung để nhẹ) ---------- */
  var matCache = {};
  function mat(color, opts) {
    var key = color + "|" + (opts ? JSON.stringify(opts) : "");
    if (!matCache[key]) {
      var o = { color: color, flatShading: true };
      if (opts) for (var k in opts) o[k] = opts[k];
      matCache[key] = new THREE.MeshLambertMaterial(o);
    }
    return matCache[key];
  }
  MS3D.mat = mat;
  /* Cho vật đổ bóng (chỉ dùng cho đồ đứng: nhân vật, cây, kệ, bàn ghế). */
  MS3D.shadow = function (obj) {
    if (obj && MS3D.SHADOWS !== false) obj.traverse(function (o) { if (o.isMesh && o.material && o.material.visible !== false && !o.material.transparent) o.castShadow = true; });
    return obj;
  };

  MS3D.box = function (w, h, d, color, x, y, z, parent, opts) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), opts && opts.unique ? new THREE.MeshLambertMaterial({ color: color, flatShading: true }) : mat(color, opts && opts.mat));
    m.position.set(x || 0, y || 0, z || 0);
    if (parent) parent.add(m);
    return m;
  };
  MS3D.cyl = function (rt, rb, h, seg, color, x, y, z, parent) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 8), mat(color));
    m.position.set(x || 0, y || 0, z || 0);
    if (parent) parent.add(m);
    return m;
  };
  MS3D.ball = function (r, color, x, y, z, parent, detail) {
    var m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, detail === undefined ? 1 : detail), mat(color));
    m.position.set(x || 0, y || 0, z || 0);
    if (parent) parent.add(m);
    return m;
  };

  /* Biển chữ ngắn (tên phòng, "Sắp mở"). Không dùng cho chữ dài. */
  MS3D.label = function (text, opts) {
    opts = opts || {};
    var fs = 56, pad = 26;
    var c = document.createElement("canvas"), g = c.getContext("2d");
    var font = "700 " + fs + "px 'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif";
    g.font = font;
    var w = Math.ceil(g.measureText(text).width) + pad * 2, h = fs + pad * 1.4;
    c.width = w; c.height = h;
    g.font = font;
    var bg = opts.bg || "#ffffff", fg = opts.fg || "#1d6b6d";
    g.fillStyle = bg;
    var rad = h / 2;
    g.beginPath(); g.moveTo(rad, 0); g.lineTo(w - rad, 0); g.arc(w - rad, rad, rad, -Math.PI / 2, Math.PI / 2); g.lineTo(rad, h); g.arc(rad, rad, rad, Math.PI / 2, Math.PI * 1.5); g.fill();
    if (opts.border) { g.lineWidth = 6; g.strokeStyle = opts.border; g.stroke(); }
    g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(text, w / 2, h / 2 + 3);
    var tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 2;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false }));
    var scale = (opts.size || 0.6) / fs * 1.0;
    sp.scale.set(w * scale, h * scale, 1);
    return sp;
  };

  /* ---------- Khởi tạo cảnh ---------- */
  MS3D.createScene = function (canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: dpr < 2, powerPreference: "high-performance" });
    renderer.setPixelRatio(dpr);
    // giữ màu hex đúng như thiết kế (không đổi sang sRGB ở r149)
    // Bóng đổ: 1 đèn mặt trời, vùng bóng nhỏ đi theo nhân vật. Tắt bằng ?nhe=1 (máy yếu).
    var touchDev = MS3D.isTouch ? MS3D.isTouch() : false;
    MS3D.SHADOWS = !/[?&]nhe=1/.test(location.search);
    renderer.shadowMap.enabled = MS3D.SHADOWS;
    renderer.shadowMap.type = touchDev ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(SKY.day.bg);
    scene.fog = new THREE.Fog(SKY.day.fog, 28, 60);

    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);

    var hemi = new THREE.HemisphereLight(SKY.day.hemiSky, SKY.day.hemiGround, SKY.day.hemi);
    scene.add(hemi);
    var sun = new THREE.DirectionalLight(SKY.day.sunColor, SKY.day.sun);
    sun.position.set(8, 14, 6);
    scene.add(sun); scene.add(sun.target);
    if (MS3D.SHADOWS) {
      sun.castShadow = true;
      var sz = touchDev ? 1024 : 2048, sc = sun.shadow.camera;
      sun.shadow.mapSize.set(sz, sz);
      sc.left = -15; sc.right = 15; sc.top = 15; sc.bottom = -15; sc.near = 1; sc.far = 45;
      sun.shadow.bias = -0.0012; sun.shadow.normalBias = 0.03;
    }

    var world = new World();
    world.scene = scene;

    world.setTime = function (t) {
      var s = SKY[t] || SKY.day;
      world.time = t;
      scene.background.setHex(s.bg);
      scene.fog.color.setHex(s.fog);
      hemi.color.setHex(s.hemiSky); hemi.groundColor.setHex(s.hemiGround); hemi.intensity = s.hemi;
      sun.color.setHex(s.sunColor); sun.intensity = s.sun;
      world.nightMats.forEach(function (n) {
        if (n.emissive) { n.mat.emissive.setHex(t === "night" ? n.night : n.day); }
        else n.mat.color.setHex(t === "night" ? n.night : n.day);
      });
      if (world.onTime) world.onTime(t);
    };

    function resize() {
      var w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    /* Máy quay đi theo nhân vật, góc nhìn chéo từ phía sau-trên.
       Màn dọc (điện thoại) lùi xa hơn một chút để thấy rộng. */
    var camTarget = new THREE.Vector3();
    var overview = false;
    /* Nhìn toàn bộ không gian từ trên cao (MS3D.WORLD_BOUNDS do rooms.js đặt). */
    function overviewPose() {
      var B = MS3D.WORLD_BOUNDS || [-30, 36, -28, 26];
      var cx = (B[0] + B[1]) / 2, cz = (B[2] + B[3]) / 2, w = B[1] - B[0] + 4, d = B[3] - B[2] + 4;
      var half = Math.tan(camera.fov * Math.PI / 360);
      var h = Math.max(d, w / camera.aspect) / 2 / half * 1.02;
      return { pos: new THREE.Vector3(cx, h, cz + h * 0.22), look: new THREE.Vector3(cx, 0, cz) };
    }
    function setOverview(on) {
      overview = !!on;
      camera.far = overview ? 600 : 120; camera.updateProjectionMatrix();
      scene.fog.far = overview ? 900 : 60; scene.fog.near = overview ? 800 : 28;
      for (var i = 0; i < world.fadeWalls.length; i++) { world.fadeWalls[i].material.opacity = 1; world.fadeWalls[i].material.transparent = false; }
    }
    /* Phóng to / thu nhỏ: hai ngón tay trên điện thoại, chụm/mở trên trackpad, hoặc lăn chuột.
       zoom < 1: máy quay lại gần; > 1: lùi xa. Không áp dụng khi đang nhìn từ trên cao. */
    var ZMIN = 0.45, ZMAX = 1.7, zoom = 1, zoomSmooth = 1;
    function setZoom(z) { zoom = Math.max(ZMIN, Math.min(ZMAX, z)); }
    (function zoomInput(el) {
      el.addEventListener("wheel", function (e) {
        if (overview) return;
        e.preventDefault();   // trackpad chụm (ctrlKey) không phóng to cả trang
        var d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        setZoom(zoom * Math.exp(d * (e.ctrlKey ? 0.01 : 0.0015)));
      }, { passive: false });
      var pts = {}, startDist = 0, startZoom = 1;
      function dist() { var k = Object.keys(pts); return k.length < 2 ? 0 : Math.hypot(pts[k[0]].x - pts[k[1]].x, pts[k[0]].y - pts[k[1]].y); }
      el.addEventListener("pointerdown", function (e) {
        if (e.pointerType !== "touch") return;
        pts[e.pointerId] = { x: e.clientX, y: e.clientY };
        if (Object.keys(pts).length === 2) { startDist = dist(); startZoom = zoom; }
      });
      el.addEventListener("pointermove", function (e) {
        if (!pts[e.pointerId]) return;
        pts[e.pointerId] = { x: e.clientX, y: e.clientY };
        if (Object.keys(pts).length === 2 && startDist > 20 && !overview) setZoom(startZoom * startDist / Math.max(20, dist()));
      });
      function up(e) { if (!pts[e.pointerId]) return; delete pts[e.pointerId]; startDist = 0; if (Object.keys(pts).length >= 2) { startDist = dist(); startZoom = zoom; } }
      el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
      // Safari trên Mac: chụm trackpad gửi "gesture…" thay vì wheel (trên iPhone thì đã xử lý bằng pointer ở trên)
      var gZoom = 1;
      el.addEventListener("gesturestart", function (e) { e.preventDefault(); gZoom = zoom; });
      el.addEventListener("gesturechange", function (e) { e.preventDefault(); if (!overview && !Object.keys(pts).length && e.scale) setZoom(gZoom / e.scale); });
    })(renderer.domElement);
    function follow(target, dt, snap) {
      if (overview) {
        var o = overviewPose(), kk = snap ? 1 : 1 - Math.pow(0.02, dt);
        camera.position.lerp(o.pos, kk); camTarget.lerp(o.look, kk); camera.lookAt(camTarget);
        return;
      }
      // nắng chếch trái: bóng đổ sang phải, máy quay thấy được
      if (MS3D.SHADOWS) { sun.position.set(target.x - 8, 14, target.z + 3); sun.target.position.set(target.x, 0, target.z); }
      zoomSmooth += (zoom - zoomSmooth) * (snap ? 1 : Math.min(1, dt * 10));
      var far = (camera.aspect < 1 ? 1.45 : 1) * zoomSmooth;
      var want = new THREE.Vector3(target.x, target.y + 8.2 * far, target.z + 8.6 * far);
      var k = snap ? 1 : 1 - Math.pow(0.002, dt);
      camera.position.lerp(want, k);
      camTarget.lerp(new THREE.Vector3(target.x, target.y + 1, target.z), k);
      camera.lookAt(camTarget);
      // làm mờ tường phía trước nhân vật
      for (var i = 0; i < world.fadeWalls.length; i++) {
        var wl = world.fadeWalls[i], b = wl.userData.b;
        var near = b.minZ > target.z - 0.3 && b.minZ - target.z < 3.2 && target.x > b.minX - 2 && target.x < b.maxX + 2;
        var o = near ? 0.28 : 1;
        wl.material.opacity += (o - wl.material.opacity) * Math.min(1, dt * 8);
        wl.material.transparent = wl.material.opacity < 0.99;
      }
    }

    return { renderer: renderer, scene: scene, camera: camera, world: world, follow: follow, resize: resize, setOverview: setOverview, setZoom: setZoom, getZoom: function () { return zoom; }, isOverview: function () { return overview; } };
  };
})();
