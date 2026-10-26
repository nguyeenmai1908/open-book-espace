/* ==========================================================
   SẢNH 3D MỞ SÁCH — npc-content.js: nhân vật trong phòng và lời trò chuyện
   Tên học sinh chỉ ghi tên (không thêm "Bạn", "Bé"); giáo viên ghi "Cô …".
   Sửa lời nói: sửa mảng lines. lines có thể là mảng, hoặc theo lễ hội { tet: [...], _: [...] } (_ = mặc định).
   look: giống nhân vật người trong characters.js (shirt, pants, skin, hair, style: short/long/longer/pony/cap/bun),
         thêm apron (tạp dề), glasses (gọng kính), noBag, scale,
         dress { mini, base, petals, center, belt, shoe } (đầm hoa, thay cho shirt/pants; mini: váy ngắn), watch (màu dây đồng hồ thông minh).
   dress: phụ kiện theo lễ hội (id trong MS3D.ACCESSORIES).
   Đường đi của từng nhân vật nằm ở file dựng phòng (doc-room.js, rooms.js).
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  MS3D.NPC_DATA = {
    // ----- 7 cô Mở Sách (theo ảnh tập thể, từ trái qua: Vi, Hà, Mai, Mỹ Anh, Châu, Minh, Thuỷ Vy). Cô xưng "cô", gọi học sinh "con". -----
    // Cô Vi: tóc dài, đeo kính, đầm mini đỏ hoa vàng, đeo Apple Watch. Xưng "cô", gọi học sinh là "con".
    // Cô đi khắp các phòng: lộ trình trong Không gian đọc ở doc-room.js, vòng qua các phòng khác ở rooms.js (spawnCoVi).
    "co-vi": {
      name: "Cô Vi", props: ["can", "book", "cup"],
      look: { skin: 0xf2c9a0, hair: 0x2b1d14, style: "longer", glasses: 0x2b1d14, noBag: true, scale: 1.08,
              dress: { mini: true, plain: true, sleeveless: true, base: 0xd8322a, belt: null, shoe: 0x8a4b3a },
              watch: 0xf4efe6 },
      lines: [
        "Chào con! Hôm nay con đọc cuốn gì rồi, kể cô nghe với?",
        "Con đọc mệt thì ra bình nước uống một ngụm nhé. Cô cũng vừa uống xong nè.",
        "Lá monstera có những lỗ thủng để nắng và gió lọt xuống, cho cả những lá bên dưới cùng được sống đó con.",
        "Cây lô hội ít cần nước lắm con ạ. Tưới nhiều quá là cây bị úng rễ đó.",
        "Cô vừa xem đồng hồ, vẫn còn sớm mà. Con cứ thong thả đọc thêm vài trang nhé.",
        "Đọc xong một cuốn, con nhớ ghi lại vài dòng suy nghĩ của mình. Cô rất muốn được đọc!",
        "Con xem bảng “Sách đọc nhiều nhất tháng” chưa? Tháng này Cây khế đang dẫn đầu đó.",
        "Gặp từ khó thì con cứ hỏi cô, hoặc ra bục Thử thách tiếng Việt ngoài sảnh chơi thử nha.",
        "Sách đọc xong con nhớ để lại đúng kệ giúp cô nhé, để bạn sau còn tìm được.",
        "Cô thích mặc đầm hoa đỏ lắm, nhìn vui mắt như một góc vườn vậy đó con."
      ]
    },
    // Cô Hà: áo trắng, đeo kính, tóc thẳng ngang vai. Ở Không gian học.
    "co-ha": {
      name: "Cô Hà",
      look: { shirt: 0xf6f3ee, collar: 0xffffff, pants: 0xcdbfa8, skin: 0xf2c9a0, hair: 0x241812, style: "shoulder", glasses: 0x6b5a50, noBag: true, scale: 1.04 },
      lines: [
        "Con học tới khoá mấy rồi? Chỗ nào khó, cô giảng lại cho nè.",
        "Bàn đọc bên này có đèn, con ngồi đây học cho sáng mắt nhé.",
        "Sai không sao đâu con, sửa lại là giỏi hơn hôm qua rồi!",
        "Học xong một bài, con nghỉ tay uống ngụm nước rồi học tiếp nha."
      ]
    },
    // Cô Mai: tóc nâu sáng, đeo kính, áo sẫm chấm nhỏ. Ở sảnh chính, gần bục Thử thách và góc ghế lười.
    "co-mai": {
      name: "Cô Mai",
      look: { shirt: 0xb5835a, pants: 0x34507e, blazer: { color: 0xb5835a, inner: 0xf6f1e7, lapel: 0x8f6440, button: 0x5b3a22 },
              jeans: { cuff: 0x5b79a8, stitch: 0xd9a35a, belt: 0x5b3a22, buckle: 0xd8c08a }, shoe: 0x5b3a22, skin: 0xf5d2b0, hair: 0x8a5a3a, style: "shoulder", glasses: 0x9a7b5f, noBag: true, scale: 1.04 },
      lines: [
        "Chào con! Chào mừng con đến Không gian Mở Sách nha.",
        "Con thử bục Thử thách tiếng Việt chưa? Mỗi lần ghé là câu mới đó.",
        "Cây Mở Sách giữa sảnh lớn lên nhờ Sao Biển của các con đó.",
        "Con thích nhất phòng nào trong đây? Kể cô nghe với."
      ]
    },
    // Cô Mỹ Anh: áo len xanh lá, quần trắng, đeo kính. Ngồi ở Góc viết cảm nhận, Phòng chiếu.
    "co-my-anh": {
      name: "Cô Mỹ Anh", prop: "book",
      look: { shirt: 0x3fae5e, collar: 0xf3efe6, pants: 0xf3efe6, skin: 0xf2c9a0, hair: 0x1a1210, style: "shoulder", glasses: 0x222222, noBag: true, scale: 1.0 },
      lines: [
        "Xem phim xong, con ngồi đây viết vài dòng cảm nhận với cô nhé.",
        "Không cần viết dài đâu con, viết thật lòng là hay rồi.",
        "Con thích nhân vật nào nhất trong phim? Vì sao vậy?",
        "Bắp rang ở xe bên kia đó, lấy một bịch rồi xem phim nha!"
      ]
    },
    // Cô Châu: da hơi ngăm, kính gọng đen, tóc xoăn qua vai, ốm và hơi cao. Đọc, kể chuyện có thật cho các bé ở Vườn.
    "co-chau": {
      name: "Cô Châu", prop: "book",
      look: { shirt: 0xc97a86, pants: 0xe9dcc6, skin: 0xc48a5c, hair: 0x231710, style: "curly", glasses: 0x111111, noBag: true, scale: 1.06, slim: true },
      lines: [
        "Lại đây ngồi nghe cô kể chuyện nè con!",
        "Chuyện cô kể đều là chuyện có thật đó con.",
        "Con thích chuyện nào nhất? Lần sau cô kể lại cho nghe.",
        "Nghe xong, con thử kể lại cho bạn bên cạnh nghe nhé.",
        "Sách hay giống người bạn tốt, đọc hoài không chán đâu con."
      ],
      // mỗi chuyện: câu đầu là tên chuyện; mỗi câu hiện ~3,4 giây thành bóng thoại (giữ dưới ~45 chữ cái)
      stories: [
        ["Chuyện có thật: Ông Trạng thả diều", "Ngày xưa có cậu bé Nguyễn Hiền nhà rất nghèo.", "Cậu phải bỏ học để đi chăn trâu.", "Cậu đứng ngoài cửa lớp nghe thầy giảng bài.", "Đi thi, cậu làm bài lên lá chuối khô.", "Năm 13 tuổi, cậu đỗ Trạng nguyên.", "Ham học thì nghèo khó cũng không cản được."],
        ["Chuyện có thật: Cậu bé Louis Braille", "Louis bị mù từ năm lên ba tuổi.", "Cậu rất muốn tự mình đọc sách.", "Năm 15 tuổi, Louis nghĩ ra chữ bằng chấm nổi.", "Người mù sờ tay lên các chấm để đọc.", "Ngày nay, chữ ấy mang tên chữ Braille.", "Khó khăn có thể thành ý tưởng tuyệt vời!"],
        ["Chuyện có thật: Chú chó Hachiko", "Ở Nhật Bản có chú chó tên Hachiko.", "Chiều nào chú cũng ra ga đón chủ đi làm về.", "Một hôm, người chủ không bao giờ trở về nữa.", "Hachiko vẫn ra ga đợi suốt gần 10 năm.", "Người ta dựng tượng chú ngay tại nhà ga.", "Đó là câu chuyện về lòng chung thuỷ."],
        ["Chuyện có thật: Thầy Nguyễn Ngọc Ký", "Năm 4 tuổi, cậu Ký bị liệt cả hai tay.", "Cậu vẫn muốn đi học như các bạn.", "Cậu tập kẹp bút bằng chân để viết.", "Chữ cậu dần dần ngay ngắn, đẹp đẽ.", "Lớn lên, cậu trở thành thầy giáo giỏi.", "Có ý chí thì việc khó mấy cũng làm được."],
        ["Chuyện có thật: Cô bé Helen Keller", "Helen không nhìn, không nghe được từ bé.", "Cô giáo Anne đánh vần chữ vào tay Helen.", "Một hôm, cô cho nước chảy qua tay Helen.", "Helen hiểu ra: chữ “nước” là thứ mát lạnh ấy!", "Về sau, Helen học đại học và viết sách.", "Thầy cô và sự kiên trì làm nên phép màu."]
      ]
    },
    // Cô Minh: áo vàng, đeo kính, tóc ngắn ngang cằm. Ở Không gian đọc, lo tủ Kinh điển.
    "co-minh": {
      name: "Cô Minh",
      look: { shirt: 0xf2c94c, pants: 0x4a4a5a, skin: 0xf5d2b0, hair: 0x241812, style: "bob", glasses: 0x333333, noBag: true, scale: 1.0 },
      lines: [
        "Con muốn tìm sách gì? Cô tìm giúp cho nè.",
        "Tủ Kinh điển Đông – Tây có tóm tắt nhiều tác phẩm hay lắm đó con.",
        "Đọc xong, con nhớ để sách lại đúng kệ giúp cô nha.",
        "Tháng này sách nào đứng đầu bảng, con xem chưa?"
      ]
    },
    // Cô Thuỷ Vy: áo sọc đỏ trắng, quần jean, tóc gợn sóng qua vai, da ngăm. Ở Phòng Lễ hội.
    "co-thuy-vy": {
      name: "Cô Thuỷ Vy",
      look: { pattern: { kind: "stripes", a: 0xffffff, b: 0xc8282e }, shirt: 0xffffff, pants: 0x26304a, skin: 0xc98e62, hair: 0x231710, style: "wavy", noBag: true, scale: 1.04 },
      lines: [
        "Chào con! Con ghé hết các gian hàng lễ hội chưa?",
        "Mỗi gian có một chuyện hay về ngày lễ đó con.",
        "Chơi đố vui xong, con ra Góc viết viết vài dòng nha.",
        "Cô thích nhất là lúc cả phòng sáng đèn nhấp nháy!"
      ]
    },
    // ----- 4 bé tiểu học ngồi nghe cô Châu kể chuyện ở Vườn (áo trắng, quàng khăn đỏ) -----
    "be-bin": { name: "Bin", look: { shirt: 0xffffff, pants: 0x1f3b73, scarf: 0xd8322a, skin: 0xf2c9a0, hair: 0x1a1210, style: "short", noBag: true, scale: 0.72 },
      lines: ["Suỵt! Cô Châu đang kể tới đoạn hay nhất.", "Tớ thích chuyện chú chó Hachiko nhất!"] },
    "be-su": { name: "Su", look: { shirt: 0xffffff, pants: 0x1f3b73, scarf: 0xd8322a, skin: 0xf5d2b0, hair: 0x2b1d14, style: "pony", noBag: true, scale: 0.7 },
      lines: ["Cậu ngồi nghe chung với tụi tớ nha!", "Lớn lên tớ cũng muốn kể chuyện hay như cô Châu."] },
    "be-mit": { name: "Mít", look: { shirt: 0xffffff, pants: 0x1f3b73, scarf: 0xd8322a, skin: 0xc98e62, hair: 0x111111, style: "cap", capColor: 0xffc83d, noBag: true, scale: 0.7 },
      lines: ["Ông Trạng thả diều giỏi ghê, 13 tuổi đã đỗ Trạng nguyên!", "Nghe xong tớ về kể cho em tớ nghe."] },
    "be-gao": { name: "Gạo", look: { shirt: 0xffffff, pants: 0x1f3b73, scarf: 0xd8322a, skin: 0xf2c9a0, hair: 0x3a2418, style: "bob", noBag: true, scale: 0.68 },
      lines: ["Chữ nổi Braille sờ tay là đọc được, hay quá trời!", "Hôm nay cô Châu kể chuyện gì vậy ta?"] },
    "ban-minh": {
      name: "Minh", prop: "book",
      look: { shirt: 0x6cbf5a, pants: 0x2f3b52, skin: 0xe8b98f, hair: 0x1a1210, style: "short", scale: 0.92 },
      lines: [
        "Mình đang tìm Tây Du Ký. Tôn Ngộ Không 72 phép biến hoá, ngầu nhất luôn!",
        "Cậu đọc Robinson Crusoe chưa? Sống một mình 28 năm trên đảo, nghĩ thôi đã thấy phục.",
        "Tủ kinh điển có cả sách phương Đông lẫn phương Tây. Chạm vào gáy sách là mở được đó.",
        "Đọc mệt thì ra bình nước uống một ngụm rồi đọc tiếp!",
        "Mình đang cố leo lên bảng xếp hạng… à nhầm, sách mới leo bảng chứ mình thì không!"
      ]
    },
    "ban-thao": {
      name: "Thảo", prop: "book",
      look: { shirt: 0xf6c84c, pants: 0x46365e, skin: 0xf5d2b0, hair: 0x2b1d14, style: "long", scale: 0.92 },
      lines: [
        "Suỵt… mình đang tới đoạn hay nhất.",
        "Alice vừa uống lọ nước và bé tí lại. Buồn cười ghê!",
        "Cậu ngồi đọc cùng không? Ghế lười bên kia êm lắm.",
        "Mình thích đọc ở bàn này vì có đèn bàn màu cam, nhìn ấm áp ghê."
      ]
    },
    // Mi: lên sân khấu sảnh chính kể chuyện. stories: mỗi chuyện là một mảng câu ngắn (câu đầu là tên chuyện),
    // mỗi câu hiện ~3 giây thành bóng thoại; giữ mỗi câu dưới ~40 chữ cái cho dễ đọc.
    "ban-mi": {
      name: "Mi",
      look: { shirt: 0x3d7dd8, pants: 0x2b2b2b, skin: 0xf2c9a0, hair: 0x3a2418, style: "pony", scale: 0.92 },
      lines: [
        "Mình là Mi, mê kể chuyện lắm! Chờ mình lên sân khấu nha.",
        "Cậu cũng lên sân khấu thử đi, bấm “Lên sân khấu” đó.",
        "Mỗi lần lên sân khấu mình kể một chuyện khác.",
        "Kể chuyện hay là phải có mở đầu, diễn biến và kết thúc đó!"
      ],
      stories: [
        ["Chuyện: Thỏ và Rùa", "Ngày xưa, Thỏ chê Rùa chậm chạp.", "Rùa bèn rủ Thỏ thi chạy.", "Thỏ chạy vèo, rồi nằm ngủ giữa đường.", "Rùa cứ chậm rãi bò, không nghỉ.", "Thỏ tỉnh dậy thì Rùa đã về đích!", "Chậm mà chắc còn hơn nhanh mà ẩu."],
        ["Chuyện: Con quạ khát nước", "Quạ khát nước, tìm thấy một cái bình.", "Nước ít quá, mỏ quạ không chạm tới.", "Quạ nhặt từng viên sỏi thả vào bình.", "Nước dâng lên dần, dần…", "Quạ uống được nước mát lành!", "Chịu khó nghĩ thì sẽ tìm ra cách."],
        ["Chuyện: Đeo chuông cho mèo", "Họ nhà chuột họp bàn cách trị mèo.", "Một chú chuột nói: đeo chuông cho mèo!", "Mèo đến là chuông kêu, cả nhà chạy trốn.", "Ai cũng khen hay… rồi im lặng.", "Vì chẳng ai dám đi đeo chuông cả!", "Nói thì dễ, làm mới khó."],
        ["Chuyện: Kiến và Châu chấu", "Mùa hè, Kiến chăm chỉ tha mồi về tổ.", "Châu chấu chỉ ca hát, cười Kiến dại.", "Mùa đông tới, đồng cỏ phủ đầy sương.", "Châu chấu đói run, Kiến có đủ ăn.", "Lo xa hôm nay, mai đỡ phải lo."]
      ]
    },
    "ban-na": {
      name: "Na",
      look: { shirt: 0xe86a92, pants: 0x46365e, skin: 0xf5d2b0, hair: 0x2b1d14, style: "pony", scale: 0.92 },
      dress: { tet: { top: "non-la" }, "trung-thu": { back: "den-ong-sao" }, halloween: { top: "mu-phu-thuy" }, "giang-sinh": { top: "mu-noel" } },
      lines: {
        tet: ["Chúc mừng năm mới! Cậu ghé hết các gian hàng Tết chưa?", "Mai vàng ở miền Nam, đào hồng ở miền Bắc. Phòng mình có cả hai luôn!", "Mình thích Tết nhất vì được sum họp cả nhà… và có bánh mứt nữa."],
        "trung-thu": ["Đèn ông sao năm cánh này mình tự làm đó!", "Trăng rằm tháng Tám là tròn và sáng nhất năm.", "Rước đèn cùng mình một vòng không?"],
        halloween: ["Hù! Có sợ không? Mình chỉ là phù thuỷ thân thiện thôi.", "Quả bí ngô khắc mặt cười có tên là Jack-o'-lantern đó.", "Ghé gian hàng đi, Halloween có từ hơn 2.000 năm trước lận!"],
        "giang-sinh": ["Giáng sinh an lành! Cậu đã treo tất chưa?", "Mình đang tập hát Jingle Bells, nghe thử không?", "Cây thông lấp lánh quá, mình đếm được nhiều ngôi sao lắm."],
        _: ["Chào cậu! Phòng Lễ hội đổi trang trí theo từng dịp đó.", "Cậu thích lễ nào nhất trong năm?"]
      }
    },
    "ban-bo": {
      name: "Bo",
      look: { shirt: 0x50b1b3, pants: 0x2b2b2b, skin: 0xc98e62, hair: 0x111111, style: "cap", capColor: 0xff8300, scale: 0.94 },
      dress: { tet: { neck: "no-cam" }, "trung-thu": { top: "mu-len" }, halloween: { eyes: "kinh-tron" }, "giang-sinh": { top: "mu-noel" } },
      lines: {
        tet: ["Bánh chưng vuông, bánh tét tròn dài. Cậu thích bánh nào hơn?", "Làm đố vui đi! Đủ điểm là có huy hiệu Tết đó.", "Năm mới mình hứa sẽ đọc thêm 10 cuốn sách!"],
        "trung-thu": ["Chú Cuội ngồi gốc cây đa… cậu tìm thấy chú chưa?", "Bánh nướng hay bánh dẻo? Mình chọn cả hai!", "Mâm cỗ Trung thu có bưởi, hồng, cốm… thơm phức."],
        halloween: ["Trick or treat! Cho kẹo hay bị ghẹo nào?", "Mình hoá trang làm nhà khoa học, đeo kính tròn nè.", "Góc viết đang có đề hay lắm, thử viết vài câu đi!"],
        "giang-sinh": ["Ông già Noel đi xe tuần lộc, chắc lạnh lắm nhỉ.", "Viết một tấm thiệp ở Góc viết đi, cảm ơn một người cậu thương.", "Tuyết rơi trong phòng luôn, đẹp ghê!"],
        _: ["Ê, chơi đố vui với mình không?", "Mấy gian hàng có nhiều chuyện hay lắm đó."]
      }
    }
  };
})();
