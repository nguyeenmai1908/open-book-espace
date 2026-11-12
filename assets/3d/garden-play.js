/* ==========================================================
   SẢNH 3D MỞ SÁCH — garden-play.js
   Đồ chơi và trang trí thêm cho Vườn đọc sách:
   - Xích đu (bãi cỏ phía nam hồ) và võng (giữa hai cây góc đông nam): ngồi lên được, đung đưa.
   - Bù nhìn đọc sách giữa luống hướng dương (phía bắc hồ), hoa ẩn vào mùa đông.
   - Biển chỉ đường bằng gỗ ở lối vào vườn.
   - Cây thơ bốn mùa (cạnh ghế gỗ phía đông): thẻ thơ treo trên cây, bấm để đọc ca dao, thơ hợp mùa.
   - Giá diều (sát tường đông): viết điều ước lên diều rồi thả, diều bay trên vườn (tối đa 3 cái).
   - Câu cá chữ (cầu gỗ bờ bắc hồ, kind "fish"): play.html mở ao, câu cá mang chữ để xếp thành từ / tục ngữ.
   - Đom đóm ban đêm (kind "firefly"): chạm đom đóm để nghe một câu đố dân gian (play.html dùng bảng Đố vui).
   play.html mở bảng đọc thơ (kind "poem") và bảng thả diều (kind "kite"); gọi world.addKite để thêm diều.
   h: { sign, place } từ rooms.js.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  var C = MS3D.COLORS;

  /* Thơ, ca dao theo mùa (tác phẩm dân gian hoặc tác giả đã mất lâu, thuộc phạm vi công cộng).
     Thêm bài: { lines: ["câu 1", "câu 2", ...], by: "Ca dao" hoặc "Tác giả, tên bài" }. */
  MS3D.SEASON_POEMS = {
    xuan: [
      { lines: ["Ngày xuân con én đưa thoi,", "Thiều quang chín chục đã ngoài sáu mươi.", "Cỏ non xanh tận chân trời,", "Cành lê trắng điểm một vài bông hoa."], by: "Nguyễn Du, Truyện Kiều" },
      { lines: ["Tháng Giêng là tháng ăn chơi,", "Tháng Hai trồng đậu, trồng khoai, trồng cà."], by: "Ca dao" }
    ],
    he: [
      { lines: ["Rồi hóng mát thuở ngày trường,", "Hoè lục đùn đùn tán rợp giương.", "Thạch lựu hiên còn phun thức đỏ,", "Hồng liên trì đã tịn mùi hương."], by: "Nguyễn Trãi, Cảnh ngày hè" },
      { lines: ["Cày đồng đang buổi ban trưa,", "Mồ hôi thánh thót như mưa ruộng cày.", "Ai ơi bưng bát cơm đầy,", "Dẻo thơm một hạt, đắng cay muôn phần."], by: "Ca dao" }
    ],
    thu: [
      { lines: ["Ao thu lạnh lẽo nước trong veo,", "Một chiếc thuyền câu bé tẻo teo.", "Sóng biếc theo làn hơi gợn tí,", "Lá vàng trước gió khẽ đưa vèo."], by: "Nguyễn Khuyến, Thu điếu" },
      { lines: ["Trời thu xanh ngắt mấy tầng cao,", "Cần trúc lơ phơ gió hắt hiu.", "Nước biếc trông như tầng khói phủ,", "Song thưa để mặc bóng trăng vào."], by: "Nguyễn Khuyến, Thu vịnh" }
    ],
    dong: [
      { lines: ["Tháng Chạp là tháng trồng khoai,", "Tháng Giêng trồng đậu, tháng Hai trồng cà.", "Tháng Ba cày vỡ ruộng ra,", "Tháng Tư làm mạ, mưa sa đầy đồng."], by: "Ca dao" },
      { lines: ["Mùa hè cá sông, mùa đông cá bể."], by: "Tục ngữ" }
    ]
  };

  /* Câu cá chữ: mỗi lượt 2 từ (xếp chữ cái) + 1 câu tục ngữ (xếp tiếng). Thêm: { answer, hint, why, unit: "word" nếu là câu }. */
  MS3D.FISH_ROUNDS = [
    { answer: "cá heo", hint: "Linh vật hay bơi trong hồ này", why: "Cá heo rất thông minh và thân thiện." },
    { answer: "con ếch", hint: "Con vật kêu ộp ộp bên ao", why: "Ếch sống được cả dưới nước lẫn trên cạn." },
    { answer: "chuồn chuồn", hint: "Bay thấp thì mưa, bay cao thì nắng", why: "Ông bà ta nhìn chuồn chuồn bay để đoán thời tiết." },
    { answer: "lá sen", hint: "Lá to, tròn, giọt nước lăn trên đó như hạt ngọc", why: "Lá sen không thấm nước nên giọt nước lăn tròn." },
    { answer: "con cua", hint: "Con vật bò ngang, có hai cái càng", why: "Cua bò ngang vì chân của cua gập sang hai bên." },
    { answer: "ốc sên", hint: "Bò chậm rì, cõng nhà trên lưng", why: "Vỏ ốc là ngôi nhà che chở cho ốc sên." },
    { answer: "đom đóm", hint: "Con vật nhỏ phát sáng ban đêm", why: "Đom đóm phát sáng ở bụng để gọi bạn." },
    { answer: "con tôm", hint: "Râu dài, búng mình tanh tách dưới nước", why: "Tôm bơi giật lùi bằng cách búng đuôi." },
    { answer: "mặt trăng", hint: "Đêm rằm soi bóng tròn vành vạnh xuống hồ", why: "Đêm rằm, trăng tròn và sáng nhất." },
    { answer: "con thuyền", hint: "Thứ giúp người qua sông, đi trên mặt nước", why: "Thuyền nhỏ thì chèo, thuyền lớn thì có buồm hoặc máy." },
    { answer: "cây lúa", hint: "Cây cho hạt gạo, mọc trên ruộng nước", why: "Hạt gạo ta ăn mỗi ngày là từ cây lúa." },
    { answer: "giọt mưa", hint: "Rơi tí tách trên mái nhà", why: "Mưa là nước từ mây rơi xuống." },
    { unit: "word", answer: "nước chảy đá mòn", hint: "Tục ngữ: kiên trì thì việc khó mấy cũng làm được", why: "Nước chảy mãi thì đá cứng cũng mòn." },
    { unit: "word", answer: "uống nước nhớ nguồn", hint: "Tục ngữ về lòng biết ơn", why: "Nhớ ơn những người đã làm nên điều tốt cho mình." },
    { unit: "word", answer: "ăn quả nhớ kẻ trồng cây", hint: "Tục ngữ: biết ơn người làm ra thành quả", why: "Được hưởng quả ngọt thì nhớ người trồng cây." },
    { unit: "word", answer: "lá lành đùm lá rách", hint: "Tục ngữ về sự giúp đỡ nhau", why: "Người khá hơn giúp đỡ người gặp khó khăn." }
  ];
  MS3D.FISH_DECOYS = { letters: ["a", "ô", "n", "h", "t", "m", "ư", "i", "e", "b"], words: ["mây", "gió", "trăng", "sao", "nhà", "sông"] };

  /* Câu đố dân gian cho đom đóm (đáp án đúng để đầu, khi hiện sẽ xáo trộn). */
  MS3D.RIDDLES = [
    { q: "Da cóc mà bọc bột lọc, bột lọc mà bọc hòn than. Là quả gì?", options: ["Quả nhãn", "Quả vải", "Quả na"], why: "Vỏ nhãn sần như da cóc, cùi trắng như bột lọc, hạt đen như hòn than." },
    { q: "Ruột dài từ mũi đến chân, mũi mòn ruột cũng dần dần mòn theo. Là cái gì?", options: ["Cây bút chì", "Cây nến", "Cái thước kẻ"], why: "Gọt bút chì thì ruột chì mòn dần theo đầu bút." },
    { q: "Không sơn mà đỏ, không gõ mà kêu, không khều mà rụng. Là ba thứ gì?", options: ["Mặt trời, sấm, mưa", "Hoa, chuông, lá", "Lửa, trống, quả"], why: "Mặt trời đỏ tự nhiên, sấm tự kêu, mưa tự rơi xuống." },
    { q: "Thân em xưa ở bụi tre, mùa đông xếp lại, mùa hè mở ra. Là cái gì?", options: ["Cái quạt nan", "Cái nón lá", "Cái rổ tre"], why: "Quạt nan làm từ tre, mùa hè mở ra quạt cho mát." },
    { q: "Bằng cái vung, vùng xuống ao. Đào chẳng thấy, lấy chẳng được. Là gì?", options: ["Bóng mặt trăng", "Cái nồi", "Con cá"], why: "Trăng tròn như cái vung, soi bóng xuống ao nhưng chẳng ai lấy được." },
    { q: "Mình bằng hạt đỗ, ăn giỗ cả làng. Là con gì?", options: ["Con ruồi", "Con kiến", "Con muỗi"], why: "Con ruồi nhỏ xíu nhưng nhà nào có cỗ cũng bay đến." },
    { q: "Cái gì đi thì nằm, đứng cũng nằm, nhưng nằm lại đứng?", options: ["Bàn chân", "Cái giường", "Con mèo"], why: "Khi đi và đứng, bàn chân nằm sát đất; khi người nằm, bàn chân lại dựng đứng." },
    { q: "Xanh om cây lá, quả chín đỏ hoe. Trẻ con chớ nghe, ăn vào cay lắm. Là quả gì?", options: ["Quả ớt", "Quả cà chua", "Quả dâu"], why: "Ớt chín đỏ, ăn vào cay xè." },
    { q: "Con gì ăn no, bụng to mắt híp, mồm kêu ụt ịt, nằm thở phì phò?", options: ["Con lợn", "Con trâu", "Con chó"], why: "Lợn ăn no thì bụng to, kêu ụt ịt." }
  ];

  MS3D.buildGardenPlay = function (world, b, h) {
    var scene = world.scene, pondX = b[0] + 13, pondZ = (b[2] + b[3]) / 2 - 1;

    /* ---------- Xích đu ---------- */
    var sx = b[0] + 11.8, sz = b[3] - 3.6, TOP = 2.3, ROPE = 1.75;
    [-1.05, 1.05].forEach(function (dx) {
      [-0.5, 0.5].forEach(function (dz) {
        var leg = MS3D.cyl(0.06, 0.07, 2.4, 6, C.woodDark, sx + dx, 1.15, sz + dz * 0.5, scene); leg.rotation.x = -dz * 0.42;
        world.addCircle(sx + dx, sz + dz, 0.12);
      });
    });
    MS3D.cyl(0.07, 0.07, 2.3, 6, C.woodDark, sx, TOP, sz, scene).rotation.z = Math.PI / 2;
    var pivot = new THREE.Group(); pivot.position.set(sx, TOP, sz); scene.add(pivot);
    [-0.32, 0.32].forEach(function (dx) { MS3D.cyl(0.015, 0.015, ROPE, 4, 0xe8d6a0, dx, -ROPE / 2, 0, pivot); });
    MS3D.box(0.8, 0.07, 0.34, C.orange, 0, -ROPE, 0, pivot).castShadow = true;
    var swingSeat = { x: sx, z: sz, y: TOP - ROPE - 0.12, face: 0, stand: [sx, sz - 1.3], swing: true, msg: "Đung đưa nào! Đi để xuống xích đu nhé." };
    var swingIt = { kind: "seat", x: sx, z: sz - 1.2, r: 1.2, label: "Ngồi xích đu", sub: "Xích đu trong vườn", seat: swingSeat, room: "vuon" };
    world.interactables.push(swingIt);
    world.pickArea(sx, 1.2, sz, 2.2, 2.4, 0.8, null, swingIt);
    h.place(world, "xich-du", "Xích đu (Vườn đọc sách)", "vuon", sx, sz - 1.4);

    /* ---------- Võng giữa hai cây ---------- */
    var A = [b[1] - 5.8, b[3] - 1.85], Bp = [b[1] - 2.2, b[3] - 2.95], hm = new THREE.Group(); scene.add(hm);
    var mx = (A[0] + Bp[0]) / 2, mz = (A[1] + Bp[1]) / 2, len = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), ang = Math.atan2(-(Bp[1] - A[1]), Bp[0] - A[0]);
    hm.position.set(mx, 0, mz); hm.rotation.y = ang;
    var N = 9;
    for (var i = 0; i < N; i++) {
      var t = (i + 0.5) / N, x = (t - 0.5) * (len - 0.8), y = 1.0 - Math.sin(t * Math.PI) * 0.42;
      var seg = new THREE.Mesh(new THREE.BoxGeometry((len - 0.8) / N + 0.03, 0.04, 0.55), MS3D.mat(i % 2 ? 0x50b1b3 : 0xfff1d6));
      seg.position.set(x, y, 0); seg.rotation.z = Math.atan(-0.42 * Math.PI * Math.cos(t * Math.PI) / (len - 0.8)); hm.add(seg);
    }
    [-1, 1].forEach(function (s) {   // dây buộc vào thân cây
      var r = MS3D.cyl(0.015, 0.015, 0.55, 4, 0xe8d6a0, s * (len / 2 - 0.25), 1.15, 0, hm); r.rotation.z = s * 0.9;
    });
    var hammockSeat = { x: mx, z: mz, y: 0.48, face: ang, stand: [mx - Math.sin(ang) * 1.3, mz - Math.cos(ang) * 1.3], hammock: true, msg: "Nằm võng đọc sách, mát ghê! Đi để đứng dậy nhé." };
    var hamIt = { kind: "seat", x: hammockSeat.stand[0], z: hammockSeat.stand[1], r: 1.2, label: "Nằm võng", sub: "Võng giữa hai cây", seat: hammockSeat, room: "vuon" };
    world.interactables.push(hamIt);
    world.pickArea(mx, 0.8, mz, 2.6, 0.8, 0.8, null, hamIt);
    h.place(world, "vong", "Võng (Vườn đọc sách)", "vuon", hammockSeat.stand[0], hammockSeat.stand[1]);

    // đung đưa khi có người ngồi (play.html đặt world.sitting)
    world.updaters.push(function (dt, tt) {
      var p = world.player && world.player.position, on = world.sitting;
      var th = on === swingSeat ? Math.sin(tt * 2.1) * 0.42 : pivot.rotation.x * Math.max(0, 1 - dt * 2);
      pivot.rotation.x = th;
      if (on === swingSeat && p) { p.set(sx, TOP - ROPE * Math.cos(th) - 0.12, sz - ROPE * Math.sin(th)); }
      var sway = on === hammockSeat ? Math.sin(tt * 1.4) * 0.06 : 0;
      hm.position.set(mx + Math.sin(ang) * sway, 0, mz + Math.cos(ang) * sway);
      if (on === hammockSeat && p) p.set(mx + Math.sin(ang) * sway, 0.48, mz + Math.cos(ang) * sway);
    });

    /* ---------- Bù nhìn đọc sách + luống hướng dương ---------- */
    var bx = b[1] - 5.6, bz = b[2] + 1.3;
    MS3D.cyl(0.05, 0.05, 1.7, 6, 0x7a5232, bx, 0.85, bz, scene);
    MS3D.cyl(0.04, 0.04, 1.1, 6, 0x7a5232, bx, 1.35, bz, scene).rotation.z = Math.PI / 2;
    MS3D.box(0.5, 0.55, 0.3, 0x3d7dd8, bx, 1.25, bz, scene);           // áo
    MS3D.box(0.22, 0.12, 0.31, 0xe53935, bx + 0.08, 1.15, bz, scene);  // miếng vá
    MS3D.ball(0.2, 0xe2c48a, bx, 1.72, bz, scene, 1);                  // đầu bao bố
    MS3D.box(0.05, 0.05, 0.02, 0x2b1d14, bx - 0.07, 1.75, bz + 0.19, scene); MS3D.box(0.05, 0.05, 0.02, 0x2b1d14, bx + 0.07, 1.75, bz + 0.19, scene);
    MS3D.cyl(0.36, 0.36, 0.03, 12, 0xd9b45a, bx, 1.86, bz, scene);     // nón rơm
    var hat = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.26, 10), MS3D.mat(0xd9b45a)); hat.position.set(bx, 2.0, bz); scene.add(hat);
    [-1, 1].forEach(function (s) { MS3D.box(0.26, 0.05, 0.05, 0xf6c84c, bx + s * 0.58, 1.33, bz, scene); });   // rơm ló ở tay áo
    var bk = new THREE.Group(); bk.position.set(bx, 1.2, bz + 0.3); bk.rotation.x = -0.6; scene.add(bk);       // cuốn sách mở
    MS3D.box(0.22, 0.02, 0.3, 0xff8300, -0.11, 0, 0, bk).rotation.z = 0.2; MS3D.box(0.22, 0.02, 0.3, 0xff8300, 0.11, 0, 0, bk).rotation.z = -0.2;
    MS3D.box(0.4, 0.025, 0.27, 0xfffaf0, 0, 0.02, 0, bk);
    world.addCircle(bx, bz, 0.35);
    var heads = [];
    [-2.2, -1.6, -1.0, 1.0, 1.6, 2.2].forEach(function (dx, i) {
      var fx = bx + dx, fz = bz + (i % 2 ? -0.25 : 0.05), hgt = 1.2 + (i % 3) * 0.2;
      MS3D.cyl(0.03, 0.04, hgt, 5, 0x4f9d58, fx, hgt / 2, fz, scene);
      var lf = MS3D.box(0.22, 0.02, 0.1, 0x6cbf5a, fx + 0.1, hgt * 0.5, fz, scene); lf.rotation.z = 0.4;
      var hd = new THREE.Group(); hd.position.set(fx, hgt, fz + 0.04); hd.rotation.x = -0.25; scene.add(hd);
      var pet = MS3D.cyl(0.2, 0.2, 0.03, 12, 0xffc83d, 0, 0, 0, hd); pet.rotation.x = Math.PI / 2;
      var ctr = MS3D.cyl(0.11, 0.11, 0.05, 10, 0x6b3a1e, 0, 0, 0.02, hd); ctr.rotation.x = Math.PI / 2;
      heads.push(hd); world.addCircle(fx, fz, 0.12);
    });
    for (var f = 0; f < 11; f++) MS3D.box(0.06, 0.4, 0.04, 0xfff1d6, bx - 2.5 + f * 0.5, 0.2, bz + 0.55, scene);   // hàng rào nhỏ
    MS3D.box(5.2, 0.05, 0.04, 0xfff1d6, bx, 0.3, bz + 0.55, scene);
    world.addBox(bx - 2.6, bx + 2.6, bz + 0.5, bz + 0.6);
    var crowIt = { kind: "toast", x: bx, z: bz + 1.4, r: 1.3, label: "Chào bù nhìn", sub: "Bù nhìn đọc sách", room: "vuon",
      texts: ["Bù nhìn: Tớ đứng đây đọc sách cả ngày, chim sẻ còn ghé nghe ké!", "Bù nhìn: Tớ đọc chậm lắm, một trang mất cả mùa. Cậu đọc nhanh hơn tớ đó!", "Bù nhìn: Hoa hướng dương quay theo mặt trời, còn tớ quay theo… trang sách."] };
    world.interactables.push(crowIt);
    world.pickArea(bx, 1.2, bz, 0.9, 2.2, 0.6, null, crowIt);
    world.updaters.push(function () { var on = world.season !== "dong"; if (heads[0].visible !== on) heads.forEach(function (hh) { hh.visible = on; }); });

    /* ---------- Biển chỉ đường (lối vào vườn) ---------- */
    var px = b[0] + 3.6, pz = -1.5;
    MS3D.cyl(0.07, 0.08, 2.4, 6, 0x7a5232, px, 1.2, pz, scene);
    world.addCircle(px, pz, 0.12);
    [["← Góc kể chuyện", 2.15, -1, 0xff8300], ["Hồ Cá Heo · Cây thơ →", 1.75, 1, 0x50b1b3], ["Xích đu · Võng ↘", 1.35, 1, 0x6cbf5a], ["Bù nhìn · Ghế gỗ ↗", 0.95, 1, 0xe86a92]].forEach(function (s) {
      var c = document.createElement("canvas"); c.width = 256; c.height = 64; var g = c.getContext("2d");
      g.fillStyle = "#c58a4f"; g.fillRect(0, 0, 256, 64);
      g.fillStyle = "#" + ("000000" + s[3].toString(16)).slice(-6); g.fillRect(0, 0, 256, 8); g.fillRect(0, 56, 256, 8);
      g.fillStyle = "#fffaf0"; g.font = "700 26px 'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText((window.MS && MS.tr ? MS.tr(s[0]) : s[0]), 128, 34);
      var bd = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.32), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), side: THREE.DoubleSide }));
      bd.position.set(px + s[2] * 0.45, s[1], pz + 0.09); scene.add(bd);
    });

    /* ---------- Cây thơ bốn mùa: thẻ giấy treo dưới tán cây phía đông ---------- */
    var tx = b[1] - 2.2, tz = pondZ + 0.5;
    [0xfff1d6, 0xffe0a8, 0xd8f0ee, 0xf8d7e3].forEach(function (col, i) {
      for (var j = 0; j < 2; j++) {
        var a = (i * 2 + j) * 0.8 + 0.3, r = 1.22, cx = tx + Math.cos(a) * r, cz = tz + Math.sin(a) * r;   // treo ngoài mép tán cho dễ thấy
        MS3D.box(0.01, 0.2, 0.01, 0x8a7a50, cx, 1.05, cz, scene);
        var card = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.34), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
        card.position.set(cx, 0.8, cz); card.rotation.y = -a + Math.PI / 2; scene.add(card);
        [0.06, 0, -0.06].forEach(function (dy) { var ln = MS3D.box(0.16, 0.012, 0.005, 0x8a7a50, 0, dy, 0.004, card); void ln; });
        (function (card, k) { world.updaters.push(function (dt, tt) { card.rotation.z = Math.sin(tt * 1.6 + k) * 0.18; }); })(card, i * 2 + j);
      }
    });
    h.sign(world, "Cây thơ bốn mùa", tx, 3.1, tz, { size: 0.26, bg: "#ffffff", fg: "#1d6b6d", border: "#50b1b3" });
    var poemIt = { kind: "poem", x: tx - 1.3, z: tz + 1.0, r: 1.3, label: "Hái một bài thơ", sub: "Cây thơ bốn mùa", room: "vuon" };
    world.interactables.push(poemIt);
    world.pickArea(tx, 1.4, tz, 2.0, 2.8, 2.0, null, poemIt);
    h.place(world, "cay-tho", "Cây thơ bốn mùa (Vườn đọc sách)", "vuon", tx - 1.3, tz + 1.4);

    /* ---------- Giá diều + diều ước mơ ---------- */
    var kx = b[1] - 0.8, kz = b[3] - 6.2, KCOL = [0xff8300, 0x50b1b3, 0xe86a92, 0xf6c84c];
    [-0.7, 0.7].forEach(function (dz) { MS3D.cyl(0.05, 0.05, 1.6, 6, C.woodDark, kx, 0.8, kz + dz, scene); world.addCircle(kx, kz + dz, 0.1); });
    MS3D.cyl(0.04, 0.04, 1.6, 6, C.woodDark, kx, 1.55, kz, scene).rotation.x = Math.PI / 2;
    KCOL.slice(0, 3).forEach(function (col, i) {   // ba con diều treo trên giá
      var d = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), new THREE.MeshLambertMaterial({ color: col, side: THREE.DoubleSide }));
      d.position.set(kx - 0.04, 1.25, kz - 0.5 + i * 0.5); d.rotation.set(0, Math.PI / 2, Math.PI / 4); scene.add(d);
    });
    var kiteIt = { kind: "kite", x: kx - 1.3, z: kz, r: 1.3, label: "Thả diều ước mơ", sub: "Viết điều con mong ước lên diều", room: "vuon" };
    world.interactables.push(kiteIt);
    world.pickArea(kx, 1.0, kz, 0.6, 1.8, 1.8, null, kiteIt);
    h.place(world, "tha-dieu", "Thả diều ước mơ (Vườn đọc sách)", "vuon", kx - 1.4, kz);

    var kites = [], anchor = new THREE.Vector3(kx - 0.3, 1.3, kz);
    function kiteTexture(wish, col) {
      var c = document.createElement("canvas"); c.width = c.height = 160; var g = c.getContext("2d");
      g.fillStyle = "#" + ("000000" + col.toString(16)).slice(-6);
      g.beginPath(); g.moveTo(80, 0); g.lineTo(160, 80); g.lineTo(80, 160); g.lineTo(0, 80); g.closePath(); g.fill();
      g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 3; g.beginPath(); g.moveTo(80, 0); g.lineTo(80, 160); g.moveTo(0, 80); g.lineTo(160, 80); g.stroke();
      g.fillStyle = "#ffffff"; g.font = "700 15px 'Be Vietnam Pro', system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      var words = String(wish || "").split(" "), lines = [], cur = "";
      words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (g.measureText(t).width > 96 && cur) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur);
      lines.slice(0, 4).forEach(function (l, i, arr) { g.fillText(l, 80, 80 + (i - (arr.length - 1) / 2) * 18); });
      return new THREE.CanvasTexture(c);
    }
    world.addKite = function (wish, colorIdx, quiet) {
      var col = KCOL[(colorIdx || 0) % KCOL.length], n = kites.length;
      var grp = new THREE.Group(); scene.add(grp);
      var body = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ map: kiteTexture(wish, col), transparent: true, side: THREE.DoubleSide }));
      grp.add(body);
      var tail = [];
      for (var i = 0; i < 5; i++) { var bw = MS3D.box(0.1, 0.06, 0.02, [0xffffff, col][i % 2], 0, -0.62 - i * 0.18, 0, grp); tail.push(bw); }
      var lg = new THREE.BufferGeometry().setFromPoints([anchor.clone(), anchor.clone()]);
      var line = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xfff6ea })); scene.add(line);
      var k = { grp: grp, line: line, tail: tail, home: new THREE.Vector3(pondX - 4 + (n % 3) * 3.6, 4.6 + (n % 3) * 0.4, pondZ - 2 + (n % 3) * 1.6), rise: quiet ? 1 : 0 };
      kites.push(k);
      if (kites.length > 3) { var old = kites.shift(); scene.remove(old.grp); scene.remove(old.line); }
      kites.forEach(function (kk, i) { kk.home.set(pondX - 4 + i * 3.6, 4.6 + i * 0.4, pondZ - 2 + i * 1.6); });
    };
    /* ---------- Câu cá chữ: cầu gỗ bờ bắc hồ, cần câu, xô cá, cá chép bơi trong hồ ---------- */
    var dx = pondX + 0.4, dz0 = pondZ - 4.9, dz1 = pondZ - 2.9;
    MS3D.box(1.0, 0.1, dz1 - dz0, C.wood, dx, 0.3, (dz0 + dz1) / 2, scene).castShadow = true;
    for (var pl = 0; pl < 5; pl++) MS3D.box(1.02, 0.012, 0.04, C.woodDark, dx, 0.356, dz0 + 0.2 + pl * 0.4, scene);
    [[-0.45, dz1 - 0.1], [0.45, dz1 - 0.1], [-0.45, dz0 + 0.3], [0.45, dz0 + 0.3]].forEach(function (q) { MS3D.cyl(0.05, 0.05, 0.5, 6, C.woodDark, dx + q[0], 0.1, q[1], scene); });
    var rod = MS3D.cyl(0.015, 0.025, 2.0, 5, 0x7a5232, dx + 0.3, 1.1, dz1 - 0.3, scene); rod.rotation.x = 0.65;
    MS3D.cyl(0.13, 0.11, 0.22, 10, 0x50b1b3, dx - 0.3, 0.46, dz0 + 0.5, scene);   // xô cá
    MS3D.ball(0.05, 0xff8300, dx - 0.3, 0.6, dz0 + 0.5, scene, 0);
    var fishIt = { kind: "fish", x: dx, z: dz0 - 0.6, r: 1.3, label: "Câu cá chữ", sub: "Câu cá mang chữ, xếp thành từ", room: "vuon" };
    world.interactables.push(fishIt);
    world.pickArea(dx, 0.6, (dz0 + dz1) / 2, 1.1, 1.0, dz1 - dz0, null, fishIt);
    h.sign(world, "Câu cá chữ", dx, 2.2, dz0, { size: 0.26, bg: "#50b1b3", fg: "#ffffff" });
    h.place(world, "cau-ca", "Câu cá chữ (Vườn đọc sách)", "vuon", dx, dz0 - 1.0);
    var kois = [];
    [0xff8300, 0xffffff, 0xffc83d].forEach(function (col, i) {
      var kg = new THREE.Group(); scene.add(kg);
      var bd = MS3D.ball(0.16, col, 0, 0, 0, kg, 1); bd.scale.set(0.55, 0.4, 1.2);
      var tl = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 4), MS3D.mat(col)); tl.rotation.x = -Math.PI / 2; tl.position.z = 0.25; kg.add(tl);
      if (i === 1) MS3D.ball(0.06, 0xe53935, 0, 0.04, -0.05, kg, 0);   // cá chép trắng đốm đỏ
      kois.push({ g: kg, tl: tl, r: 1.25 + i * 0.55, sp: 0.35 + i * 0.12, ph: i * 2.1 });
    });

    /* ---------- Đom đóm ban đêm: chạm để nghe câu đố ---------- */
    var ffTex = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d");
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,190,1)"); gr.addColorStop(0.25, "rgba(220,255,120,.8)"); gr.addColorStop(1, "rgba(180,255,90,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
    })();
    var flies = [], FAR = 9999;
    for (var fi = 0; fi < 10; fi++) {
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ffTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      sp.scale.set(0.5, 0.5, 1); sp.visible = false; scene.add(sp);
      var ox = b[0] + 3 + (fi * 7.3) % (b[1] - b[0] - 6), oz = b[2] + 2 + (fi * 5.1) % (b[3] - b[2] - 4);
      if (Math.hypot(ox - pondX, oz - pondZ) < 4) ox = b[0] + 4 + fi * 0.8;   // không lượn trên hồ
      var fit = { kind: "firefly", x: FAR, z: FAR, r: 1.1, label: "Bắt đom đóm", sub: "Đom đóm đố con một câu", room: "vuon", fly: fi };
      world.interactables.push(fit);
      world.pick(sp, fit);
      flies.push({ sp: sp, it: fit, ox: ox, oz: oz, ph: fi * 1.7, gone: 0 });
    }
    world.catchFirefly = function (i) { var f = flies[i]; if (f) f.gone = 1; };
    var wasNight = false;
    world.updaters.push(function (dt, tt) {
      kois.forEach(function (k) {
        var a = tt * k.sp + k.ph, x = pondX + Math.cos(a) * k.r, z = pondZ + Math.sin(a) * k.r * 0.8;
        k.g.position.set(x, 0.29, z); k.g.rotation.y = -a;   // sát mặt nước (mặt hồ cao 0.25) k.tl.rotation.y = Math.sin(tt * 8 + k.ph) * 0.4;
      });
      var night = world.time === "night";
      if (night && !wasNight && world.player && world.roomAt) {
        var rr = world.roomAt(world.player.position.x, world.player.position.z);
        if (rr && rr.id === "vuon" && window.MS && MS.toast) MS.toast("Đom đóm ra rồi kìa! Chạm vào đom đóm để nghe câu đố nhé.");
      }
      wasNight = night;
      flies.forEach(function (f) {
        if (f.gone > 0) { f.gone += dt; f.sp.position.y += dt * 1.5; f.sp.material.opacity = Math.max(0, 1 - (f.gone - 1) * 1.2); if (f.gone > 20) { f.gone = 0; f.sp.material.opacity = 1; } }
        var on = night && f.gone === 0;
        f.sp.visible = night && (f.gone === 0 || f.gone < 2);
        if (f.gone === 0) {
          var x = f.ox + Math.sin(tt * 0.45 + f.ph) * 1.6, z = f.oz + Math.sin(tt * 0.33 + f.ph * 2) * 1.2, y = 1.0 + Math.sin(tt * 1.1 + f.ph) * 0.45;
          f.sp.position.set(x, y, z);
          var tw = 0.35 + 0.65 * Math.max(0, Math.sin(tt * 3 + f.ph * 3));
          f.sp.scale.set(0.3 + tw * 0.3, 0.3 + tw * 0.3, 1);
        }
        f.it.x = on ? f.sp.position.x : FAR; f.it.z = on ? f.sp.position.z : FAR;
      });
    });

    world.updaters.push(function (dt, tt) {
      kites.forEach(function (k, i) {
        k.rise = Math.min(1, k.rise + dt * 0.35);
        var e = 1 - Math.pow(1 - k.rise, 3);
        var x = anchor.x + (k.home.x - anchor.x) * e + Math.sin(tt * 0.7 + i) * 0.5, y = anchor.y + (k.home.y - anchor.y) * e + Math.sin(tt * 1.3 + i * 2) * 0.25, z = anchor.z + (k.home.z - anchor.z) * e;
        k.grp.position.set(x, y, z); k.grp.rotation.set(0, 0, Math.sin(tt * 1.1 + i) * 0.12);   // diều đã vẽ hình thoi sẵn
        k.tail.forEach(function (tb, j) { tb.position.x = Math.sin(tt * 3 + j * 0.6 + i) * 0.08 * j; });
        var pos = k.line.geometry.attributes.position; pos.setXYZ(1, x, y - 0.2, z); pos.needsUpdate = true;
      });
    });
  };
})();
