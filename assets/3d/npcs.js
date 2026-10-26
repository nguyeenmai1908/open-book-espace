/* ==========================================================
   SẢNH 3D MỞ SÁCH — npcs.js: nhân vật tự đi lại trong phòng (cô Vi, các bạn)
   MS3D.spawnNPC(world, id, opts)
     opts.room   id phòng
     opts.route  [{ x, z, wait (giây), face (góc quay khi dừng), plant (cây để tưới),
                   y (độ cao điểm đến, vd. lên sân khấu), act, say (câu hiện thành bóng thoại khi dừng) }, ...] đi vòng lặp
                 act: "story" (kể một chuyện trong d.stories), "watch" (xem đồng hồ), "read" (đọc sách),
                      "shelf" (xếp sách lên kệ), "drink" (uống nước), "chat" (hỏi chuyện)
     Đồ cầm tay: d.prop "can"/"book" (luôn cầm) hoặc d.props ["can","book","cup"] (chỉ cầm khi làm việc tương ứng).
     opts.sit    { x, z, y, face }  ngồi yên một chỗ (đọc sách)
     opts.tell   true: đang ngồi thì kể lần lượt các chuyện trong d.stories (bóng thoại), nghỉ 6 giây giữa hai chuyện
   Chạm vào nhân vật: dừng lại, quay sang vẫy tay, nói một câu (play.html hiện bằng toast).
   Dữ liệu ngoại hình + lời nói: npc-content.js. Cần world.player (play.html gán).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  var SPEED = 1.15;

  function wateringCan(parent) {
    var g = new THREE.Group(); g.position.set(0, -0.56, -0.06); parent.add(g);
    MS3D.cyl(0.1, 0.11, 0.2, 10, 0x3f8a4e, 0, 0, -0.08, g);
    MS3D.box(0.04, 0.14, 0.2, 0x2f6e3c, 0, 0.12, -0.04, g);                    // quai
    var sp = MS3D.cyl(0.018, 0.03, 0.3, 6, 0x3f8a4e, 0, 0.04, -0.28, g); sp.rotation.x = -1.0;
    var tip = new THREE.Object3D(); tip.position.set(0, 0.13, -0.4); g.add(tip);
    return { g: g, tip: tip };
  }
  function bookInHand(parent) {
    var g = new THREE.Group(); parent.add(g);
    MS3D.box(0.24, 0.3, 0.05, 0xff8300, 0, -0.5, -0.1, g);
    MS3D.box(0.22, 0.28, 0.052, 0xfffaf0, 0.015, -0.5, -0.1, g);
    return g;
  }
  function cupInHand(parent) {
    var g = new THREE.Group(); parent.add(g);
    MS3D.cyl(0.06, 0.05, 0.12, 8, 0xffffff, 0, -0.52, -0.1, g);
    MS3D.cyl(0.05, 0.05, 0.01, 8, 0x8fd3f4, 0, -0.46, -0.1, g);
    return g;
  }

  MS3D.spawnNPC = function (world, id, opts) {
    var d = (MS3D.NPC_DATA || {})[id]; if (!d || !MS3D.makeHuman) return null;
    opts = opts || {};
    var look = { kind: "human" }; for (var k in d.look) look[k] = d.look[k];
    var grp = new THREE.Group(); world.scene.add(grp);
    var m = MS3D.makeHuman(look), sc0 = look.scale || 1; grp.add(m);
    if (look.slim) m.scale.set(sc0 * 0.9, sc0 * 1.07, sc0 * 0.9); else m.scale.setScalar(sc0);   // slim: ốm và hơi cao
    var tag = MS3D.label(d.name, { size: 0.2, bg: "#ffffff", fg: "#1d6b6d", border: "#50b1b3" });
    tag.position.y = 1.95 * (look.scale || 1); grp.add(tag);
    var arms = m.userData.arms || {}, can = null, drops = [], props = d.props || [], book = null, cup = null;
    if ((d.prop === "can" || props.indexOf("can") >= 0) && arms.R) {
      can = wateringCan(arms.R); can.g.visible = d.prop === "can";
      var dm = new THREE.MeshBasicMaterial({ color: 0x7cc8f0 });
      for (var i = 0; i < 7; i++) { var dr = new THREE.Mesh(new THREE.SphereGeometry(0.025, 5, 4), dm); dr.visible = false; world.scene.add(dr); drops.push(dr); }
    }
    if ((d.prop === "book" || props.indexOf("book") >= 0) && arms.L) { book = bookInHand(arms.L); book.visible = d.prop === "book"; }
    if (props.indexOf("cup") >= 0 && arms.R) { cup = cupInHand(arms.R); cup.visible = false; }
    MS3D.shadow(m);

    var route = opts.route || [], sit = opts.sit, wi = 0, wait = 0, talkT = 0, acting = null, heading = 0, lineI = Math.floor(Math.random() * 3);
    var start = sit || route[0] || { x: 0, z: 0 };
    grp.position.set(start.x, sit ? (sit.y || 0) : 0, start.z);
    if (sit) { heading = sit.face || 0; m.userData.setSit(true); }
    else if (route.length > 1) wi = 1;
    grp.rotation.y = heading;
    var it = { kind: "npc", npc: id, x: start.x, z: start.z, r: 1.4, label: "Trò chuyện", sub: d.name, room: opts.room };
    world.interactables.push(it);
    world.pick(m, it);
    var col = { x: start.x, z: start.z, r: 0.3 };
    if (!sit) world.colliders.push(col);
    var lastFest = null, tmp = new THREE.Vector3();
    // kể chuyện trên sân khấu: mỗi câu hiện thành bóng thoại trên đầu
    var STORY_STEP = 3.4, tellPause = 1.5, story = null, storyI = -1, storyT = 0, storyN = 0, bubble = null;
    function say(text) {
      if (bubble) { grp.remove(bubble); bubble.material.map.dispose(); bubble.material.dispose(); bubble = null; }
      if (!text) return;
      bubble = MS3D.label(text, { size: 0.22, bg: "#ffffff", fg: "#1f1406", border: "#ff8300" });
      bubble.position.y = 2.4 * (look.scale || 1); grp.add(bubble);
    }
    function startStory() {
      var all = d.stories || []; if (!all.length) return 0;
      story = all[storyN++ % all.length]; storyI = -1; storyT = 0; acting = "story";
      if (world.stage) world.stage.setShow(true);
      return story.length * STORY_STEP + 0.4;
    }
    function endStory() {
      say(""); story = null; acting = null; resetArms(); if (arms.R) arms.R.rotation.x = 0;
      if (world.stage) { world.stage.setShow(false); world.stage.cheer(); }
    }

    function turnTo(want, dt, k) {
      var diff = ((want - heading + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      heading += diff * Math.min(1, dt * (k || 8)); grp.rotation.y = heading;
    }
    function resetArms() {
      if (arms.R) { arms.R.rotation.z = 0; } if (can) can.g.rotation.x = 0;
      if (acting && acting !== "story") {   // xong việc: cất đồ chỉ cầm khi làm việc, tắt bóng thoại
        if (arms.L) { arms.L.rotation.z = 0; arms.L.rotation.x = 0; } if (arms.R) arms.R.rotation.x = 0;
        if (can && d.prop !== "can") can.g.visible = false;
        if (book && d.prop !== "book") book.visible = false;
        if (cup) cup.visible = false;
        say("");
      }
    }
    // tư thế khi đang làm việc (gọi mỗi khung hình lúc dừng chờ)
    function pose(t) {
      var L = arms.L, R = arms.R; if (!L || !R) return;
      if (acting === "watch") { L.rotation.x = 1.55; L.rotation.z = 0.7; }
      else if (acting === "read") { L.rotation.x = 1.05; R.rotation.x = 1.05; L.rotation.z = 0.3; R.rotation.z = -0.3; }
      else if (acting === "shelf") { R.rotation.x = 2.5 + Math.sin(t * 4) * 0.25; L.rotation.x = 1.9 + Math.cos(t * 4) * 0.2; }
      else if (acting === "drink") { R.rotation.x = 2.25; R.rotation.z = -0.55; }
      else if (acting === "chat") { R.rotation.x = 0.9 + Math.sin(t * 3) * 0.3; R.rotation.z = -0.15; }
    }

    var npc = {
      id: id, name: d.name, group: grp, room: opts.room,
      talk: function () {
        var L = d.lines;
        if (!Array.isArray(L)) L = L[world.festival] || L._ || [];
        talkT = 3.2;
        return L.length ? L[lineI++ % L.length] : "";
      },
      update: function (dt, t) {
        // phụ kiện theo lễ hội
        if (d.dress && world.festival !== lastFest) { lastFest = world.festival; MS3D.dress(m, d.dress[lastFest] || {}); MS3D.shadow(m); }
        var p = world.player && world.player.position;
        if (talkT > 0) {
          talkT -= dt;
          if (p) turnTo(Math.atan2(-(p.x - grp.position.x), -(p.z - grp.position.z)), dt, 10);
          m.userData.animate(dt, 0);
          if (arms.R && !sit) { arms.R.rotation.x = 2.7; arms.R.rotation.z = Math.sin(t * 12) * 0.35; }
          if (talkT <= 0) { if (arms.R) arms.R.rotation.z = 0; if (can) can.g.rotation.x = 0; }   // trò chuyện xong: làm tiếp việc đang dở
          drops.forEach(function (dr) { dr.visible = false; });
          return;
        }
        if (sit) {
          m.userData.animate(dt, 0);
          if (opts.tell) {   // ngồi kể chuyện liên tục: kể xong một chuyện, nghỉ một lúc rồi kể chuyện tiếp
            var all = d.stories || [];
            if (!story) { tellPause -= dt; if (tellPause <= 0 && all.length) { story = all[storyN++ % all.length]; storyI = -1; storyT = 0; } return; }
            storyT += dt;
            var ti = Math.floor(storyT / STORY_STEP);
            if (ti >= story.length) { say(""); story = null; tellPause = 6; if (arms.R) arms.R.rotation.x = 0; return; }
            if (ti !== storyI) { storyI = ti; say(story[ti]); }
            if (arms.R) arms.R.rotation.x = 1.2 + Math.sin(t * 2.2) * 0.35;   // tay phải diễn tả khi kể, tay trái cầm sách
          }
          return;
        }
        if (wait > 0) {
          wait -= dt;
          var wp0 = route[(wi - 1 + route.length) % route.length];
          if (wp0 && wp0.face !== undefined) turnTo(wp0.face, dt, 6);
          m.userData.animate(dt, 0);
          if (acting === "water" && can) {        // nghiêng bình tưới, nước rơi vào chậu
            arms.R.rotation.x = 1.25; can.g.rotation.x = 0.7;
            can.tip.getWorldPosition(tmp);
            drops.forEach(function (dr, i) {
              var ph = (t * 1.8 + i / drops.length) % 1;
              dr.visible = true;
              dr.position.set(tmp.x - Math.sin(heading) * ph * 0.25, tmp.y - ph * ph * 0.9, tmp.z - Math.cos(heading) * ph * 0.25);
            });
          }
          pose(t);
          if (acting === "story" && story) {
            storyT += dt;
            var si = Math.min(story.length - 1, Math.floor(storyT / STORY_STEP));
            if (si !== storyI) { storyI = si; say(story[si]); }
            if (arms.R) { arms.R.rotation.x = 1.4 + Math.sin(t * 2.5) * 0.35; arms.R.rotation.z = -0.2; }
          }
          if (wait <= 0) { if (acting === "story") endStory(); resetArms(); acting = null; if (can && d.prop !== "can") can.g.visible = false; drops.forEach(function (dr) { dr.visible = false; }); }
          return;
        }
        if (!route.length) { m.userData.animate(dt, 0); return; }
        var wp = route[wi], dx = wp.x - grp.position.x, dz = wp.z - grp.position.z, dist = Math.hypot(dx, dz);
        // nhường đường: người chơi đứng ngay phía trước thì chờ
        if (p) {
          var px = p.x - grp.position.x, pz = p.z - grp.position.z, pd = Math.hypot(px, pz);
          if (pd < 0.95 && (px * dx + pz * dz) > 0) { m.userData.animate(dt, 0); return; }
        }
        if (dist < 0.06) {
          wi = (wi + 1) % route.length;
          wait = wp.wait || 0;
          if (wp.y !== undefined) grp.position.y = wp.y;
          if (wp.act === "story") wait = startStory();
          else if (wp.act) {
            acting = wp.act;
            if (wp.act === "read" && book) book.visible = true;
            if (wp.act === "drink" && cup) cup.visible = true;
          }
          if (wp.say && wp.act !== "story") say(wp.say);
          if (wp.plant && wp.plant.userData.water) { acting = "water"; wp.plant.userData.water(); if (can) can.g.visible = true; }
          m.userData.animate(dt, 0);
          return;
        }
        var step = Math.min(dist, SPEED * dt);
        grp.position.x += dx / dist * step; grp.position.z += dz / dist * step;
        if (wp.y !== undefined) grp.position.y += (wp.y - grp.position.y) * step / dist;
        turnTo(Math.atan2(-dx, -dz), dt, 9);
        m.userData.animate(dt, 0.6);
        it.x = col.x = grp.position.x; it.z = col.z = grp.position.z;
        if (opts.roam && world.roomAt) { var rr = world.roomAt(grp.position.x, grp.position.z); if (rr) npc.room = it.room = rr.id; }
      }
    };
    world.npcs = world.npcs || [];
    world.npcs.push(npc);
    if (!world._npcLoop) {
      world._npcLoop = true;
      world.updaters.push(function (dt, t) { for (var i = 0; i < world.npcs.length; i++) world.npcs[i].update(dt, t); });
    }
    return npc;
  };
  MS3D.getNPC = function (world, id) { var l = world.npcs || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; };
})();
