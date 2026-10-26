/* ==========================================================
   SẢNH 3D MỞ SÁCH — guide.js
   Cá Heo dẫn đường: một chú cá heo nhỏ bay lơ lửng đi trước, chờ khi bạn tụt lại,
   đưa bạn tới một điểm trong world.places (khoá học, góc đọc, bảng vàng...).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};

  MS3D.createGuide = function (world) {
    var fish = MS3D.makeDolphin(); fish.scale.setScalar(0.45); fish.visible = false; world.scene.add(fish);
    // vệt sáng nhỏ phía sau
    var trail = [];
    for (var i = 0; i < 6; i++) {
      var d = MS3D.ball(0.06, 0xffc83d, 0, -5, 0, world.scene, 0);
      d.material = new THREE.MeshBasicMaterial({ color: 0xffc83d, transparent: true, opacity: 0.8 - i * 0.12 });
      d.visible = false; trail.push(d);
    }
    var path = [], target = null, active = false, done = 0, hist = [];
    var LOBBY_DETOUR = [0, 3.4]; // đi vòng Cây Mở Sách giữa sảnh

    function roomOf(x, z) { var r = world.roomAt(x, z); return r ? r.id : "sanh"; }
    function segNearCenter(a, b) {
      var dx = b[0] - a[0], dz = b[1] - a[1], L = dx * dx + dz * dz || 1;
      var t = Math.max(0, Math.min(1, -(a[0] * dx + a[1] * dz) / L));
      return Math.hypot(a[0] + dx * t, a[1] + dz * t) < 2.2;
    }
    function plan(from, place) {
      var pts = [], r0 = roomOf(from.x, from.z), r1 = place.room || roomOf(place.x, place.z);
      if (r0 !== r1) {
        if (r0 !== "sanh" && world.doors[r0]) { var d0 = world.doors[r0]; pts.push(d0.room, d0.door, d0.lobby); }
        if (r1 !== "sanh" && world.doors[r1]) { var d1 = world.doors[r1]; pts.push(d1.lobby, d1.door, d1.room); }
      }
      pts.push([place.x, place.z]);
      // trong sảnh: chèn điểm vòng nếu đường đi cắt qua tượng giữa
      var out = [], prev = [from.x, from.z];
      pts.forEach(function (p) {
        if (roomOf(prev[0], prev[1]) === "sanh" && roomOf(p[0], p[1]) === "sanh" && segNearCenter(prev, p)) out.push(LOBBY_DETOUR);
        out.push(p); prev = p;
      });
      return out;
    }

    var api = {
      onArrive: null,
      start: function (from, place) {
        target = place; path = plan(from, place); active = true; done = 0;
        fish.visible = true; fish.position.set(from.x + 0.8, 1.7, from.z - 0.8);
        hist = [];
        trail.forEach(function (d) { d.visible = true; });
      },
      stop: function () {
        active = false; target = null; path = []; fish.visible = false;
        trail.forEach(function (d) { d.visible = false; });
      },
      isActive: function () { return active; },
      target: function () { return target; },
      update: function (dt, t, player) {
        if (!fish.visible) return;
        fish.userData.animate(dt);
        if (done > 0) {           // tới nơi: nhảy một vòng rồi biến mất
          done -= dt; fish.rotation.y += dt * 8; fish.position.y = 1.7 + Math.sin((1.2 - done) * Math.PI / 1.2) * 0.8;
          if (done <= 0) api.stop();
          return;
        }
        if (!active) return;
        var p = player.position, next = path[0];
        var distPlayer = Math.hypot(p.x - fish.position.x, p.z - fish.position.z);
        if (next) {
          var dx = next[0] - fish.position.x, dz = next[1] - fish.position.z, d = Math.hypot(dx, dz);
          var wait = distPlayer > 3.2;              // chờ bạn theo kịp
          if (!wait && d > 0.05) {
            var step = Math.min(d, dt * 3.4);
            fish.position.x += dx / d * step; fish.position.z += dz / d * step;
            fish.rotation.y = Math.atan2(-dx, -dz);
          } else if (wait) {
            fish.rotation.y = Math.atan2(-(p.x - fish.position.x), -(p.z - fish.position.z));
          }
          if (d < 0.3 && path.length > 1) path.shift();
        }
        fish.position.y = 1.7 + Math.sin(t * 3) * 0.1;
        hist.unshift([fish.position.x, fish.position.y, fish.position.z]); if (hist.length > 30) hist.pop();
        trail.forEach(function (dd, i) { var h = hist[Math.min(hist.length - 1, (i + 1) * 4)]; if (h) dd.position.set(h[0], h[1] - 0.05, h[2]); });
        if (target && Math.hypot(p.x - target.x, p.z - target.z) < 1.6) {
          active = false; done = 1.2;
          trail.forEach(function (d) { d.visible = false; });
          if (api.onArrive) api.onArrive(target);
        }
      }
    };
    return api;
  };
})();
