/* ==========================================================
   SẢNH 3D MỞ SÁCH — festival-content.js
   Nội dung "phòng khám phá" cho từng lễ hội (dữ liệu, tách khỏi code).
   Mỗi lễ: 6 gian hàng (boards) + Đố vui (quiz) + Góc viết (write).
   - board: { id, title (≤ 16 ký tự, hiện trên bảng của gian hàng), pages: [{ h, p: [câu…] }], fact, words: [[tiếng Anh, nghĩa]] }
   - quiz:  { q, options: [đáp án đúng ĐỨNG ĐẦU, …], why }  (thứ tự hiển thị được xáo trộn)
   - write: { prompt } — đề nghị luận ngắn, gắn với chuỗi Nghị luận Vỡ Lòng.
   Giọng: "mình – bạn", câu ngắn, hợp lớp 5–7.
   Nguồn tham khảo (đọc 16/10/2026): DOGOnews "Exploring Halloween's fun traditions" (2024);
   Báo Văn Hoá "Nguồn gốc và ý nghĩa Tết Trung Thu ở Việt Nam" (2025);
   VOH "10 phong tục văn hoá đẹp ngày Tết Nguyên đán" ; The Conversation
   "How Christmas became an American holiday tradition" (2021). Mai/cô giáo nên duyệt lại trước khi dùng chính thức.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};

  MS3D.FESTIVAL_CONTENT = {
    /* ------------------------------ TẾT NGUYÊN ĐÁN ------------------------------ */
    tet: {
      boards: [
        { id: "nguon-goc", title: "Tết là gì?", pages: [
          { h: "Tết Nguyên Đán", p: ["Tết Nguyên Đán là Tết đầu năm theo âm lịch, lễ lớn nhất trong năm của người Việt.", "“Nguyên” là bắt đầu, “Đán” là buổi sáng sớm. Nguyên Đán là buổi sáng đầu tiên của năm mới."] },
          { h: "Đông qua, xuân tới", p: ["Tết thường rơi vào cuối tháng 1 hoặc tháng 2 dương lịch.", "Lúc ấy mùa đông vừa qua, mùa xuân vừa tới, cây cối bắt đầu đâm chồi."] }
        ], fact: "Người ta còn gọi Tết Nguyên Đán là “Tết Cả”, vì đây là Tết lớn nhất năm.", words: [["Lunar New Year", "Tết Âm lịch"], ["spring", "mùa xuân"]] },
        { id: "ong-tao", title: "Ông Công ông Táo", pages: [
          { h: "Ngày 23 tháng Chạp", p: ["Theo tín ngưỡng dân gian, ông Công ông Táo là các vị thần trông coi bếp lửa trong nhà.", "Ngày 23 tháng Chạp, các ông về trời kể chuyện một năm của gia đình."] },
          { h: "Cá chép đưa ông Táo", p: ["Nhà nhà làm mâm cúng tiễn ông Táo, rồi thả cá chép ra sông, hồ.", "Người xưa tin cá chép sẽ đưa ông Táo về trời."] }
        ], fact: "Sau ngày ông Táo về trời, nhà nhà rộn ràng dọn dẹp, trang trí, sắm Tết.", words: [["kitchen god", "ông Táo"], ["carp", "cá chép"]] },
        { id: "banh-chung", title: "Bánh chưng", pages: [
          { h: "Sự tích Lang Liêu", p: ["Truyện kể rằng hoàng tử Lang Liêu làm bánh từ gạo nếp, đậu xanh, thịt lợn, gói lá dong, dâng lên vua cha.", "Bánh hình vuông tượng trưng cho đất, gọi là bánh chưng."] },
          { h: "Bánh chưng, bánh tét", p: ["Miền Bắc thường gói bánh chưng vuông, miền Nam gói bánh tét hình trụ dài.", "Cả nhà quây quần gói bánh, canh nồi bánh là một kỷ niệm đáng nhớ."] }
        ], fact: "Bánh chưng phải luộc nhiều giờ liền, nên nhiều nhà thức canh nồi bánh cả đêm.", words: [["sticky rice", "gạo nếp"], ["family", "gia đình"]] },
        { id: "hoa-qua", title: "Hoa & ngũ quả", pages: [
          { h: "Đào hồng, mai vàng", p: ["Miền Bắc chuộng hoa đào hồng, miền Nam chuộng hoa mai vàng.", "Hoa nở là báo hiệu mùa xuân đã về."] },
          { h: "Mâm ngũ quả", p: ["“Ngũ” nghĩa là năm. Mâm ngũ quả gồm nhiều loại quả, bày lên bàn thờ tổ tiên.", "Mâm quả thể hiện lòng biết ơn ông bà và mong một năm mới đủ đầy."] }
        ], fact: "Mỗi miền bày mâm ngũ quả một kiểu, tuỳ loại quả có ở địa phương.", words: [["peach blossom", "hoa đào"], ["fruit", "trái cây"]] },
        { id: "giao-thua", title: "Giao thừa", pages: [
          { h: "Đêm giao thừa", p: ["Giao thừa là lúc năm cũ chuyển sang năm mới.", "Cả nhà sum họp, thắp hương tưởng nhớ tổ tiên và cùng đón năm mới."] },
          { h: "Xông đất, chúc Tết, lì xì", p: ["Người đầu tiên bước vào nhà sau giao thừa là người “xông đất”.", "Mọi người chúc nhau sức khoẻ, may mắn. Người lớn lì xì cho trẻ em phong bao đỏ kèm lời chúc."] }
        ], fact: "Màu đỏ của bao lì xì tượng trưng cho niềm vui và may mắn.", words: [["lucky money", "tiền lì xì"], ["wish", "lời chúc"]] },
        { id: "cau-doi", title: "Câu đối", pages: [
          { h: "Câu đối đỏ", p: ["Ngày Tết, nhiều nhà treo câu đối: hai câu đối nhau về ý và về chữ, chúc năm mới tốt lành."] },
          { h: "Xin chữ đầu năm", p: ["Đầu năm, nhiều người đi xin chữ ông đồ, như chữ “Tâm”, “An”, “Học”.", "Phong tục này cho thấy người Việt rất quý chữ và hiếu học."] }
        ], fact: "Mở Sách cũng “xin chữ” theo cách riêng: đầu năm, đọc một cuốn sách hay!", words: [["calligraphy", "thư pháp"], ["couplet", "câu đối"]] }
      ],
      quiz: [
        { q: "Ông Công ông Táo về trời vào ngày nào?", options: ["23 tháng Chạp", "30 tháng Chạp", "Mùng 1 Tết", "Rằm tháng Giêng"], why: "Ngày 23 tháng Chạp, nhà nhà cúng tiễn ông Táo và thả cá chép." },
        { q: "Bánh chưng hình vuông tượng trưng cho gì?", options: ["Đất", "Trời", "Mặt trăng", "Biển"], why: "Theo sự tích Lang Liêu, bánh vuông tượng trưng cho đất." },
        { q: "Người đầu tiên vào nhà sau giao thừa gọi là gì?", options: ["Người xông đất", "Ông đồ", "Ông Táo", "Người hái lộc"], why: "Người ấy “xông đất”, mang không khí năm mới vào nhà." },
        { q: "“Nguyên Đán” nghĩa là gì?", options: ["Buổi sáng đầu tiên của năm", "Đêm cuối năm", "Mùa xuân", "Ngày rằm"], why: "“Nguyên” là bắt đầu, “Đán” là buổi sáng sớm." }
      ],
      write: { prompt: "Có ý kiến cho rằng: “Tết bây giờ không cần gói bánh chưng nữa, vì ra chợ mua là có.” Bạn đồng ý hay không đồng ý? Viết 3–5 câu nêu ý kiến của bạn." }
    },

    /* ------------------------------ TẾT TRUNG THU ------------------------------ */
    "trung-thu": {
      boards: [
        { id: "nguon-goc", title: "Rằm tháng Tám", pages: [
          { h: "Giữa mùa thu", p: ["Tết Trung thu diễn ra ngày 15 tháng 8 âm lịch, khi trăng tròn.", "“Trung thu” nghĩa là giữa mùa thu."] },
          { h: "Gắn với nghề nông", p: ["Lúc ấy trời mát, mùa màng vừa thu hoạch xong. Mọi người nghỉ ngơi, vui chơi, ngắm trăng.", "Từ thời Lý, ở kinh thành Thăng Long đã có múa rối nước, rước đèn dịp Trung thu."] }
        ], fact: "Trăng rằm tròn đầy tượng trưng cho sự trọn vẹn, đủ đầy.", words: [["Mid-Autumn Festival", "Tết Trung thu"], ["full moon", "trăng rằm"]] },
        { id: "chu-cuoi", title: "Cuội & chị Hằng", pages: [
          { h: "Chú Cuội ngồi gốc cây đa", p: ["Truyện kể chú Cuội có một cây đa quý chữa được bệnh.", "Một hôm cây đa bay lên trời, Cuội níu rễ bay theo lên cung trăng. Vì thế, nhìn trăng ta như thấy bóng Cuội ngồi gốc đa."] },
          { h: "Chị Hằng và thỏ ngọc", p: ["Chị Hằng (Hằng Nga) là nàng tiên sống trên cung trăng.", "Nhiều truyện kể chị có chú thỏ ngọc bầu bạn."] }
        ], fact: "Ngắm trăng xong, thử kể lại chuyện chú Cuội cho em nhỏ trong nhà nghe nhé!", words: [["legend", "truyền thuyết"], ["moon", "mặt trăng"]] },
        { id: "den-long", title: "Đèn ông sao", pages: [
          { h: "Đèn ông sao", p: ["Đèn ông sao có năm cánh, làm từ nan tre và giấy bóng kính đỏ, vàng.", "Tối rằm, các bạn nhỏ rước đèn đi khắp xóm."] },
          { h: "Đèn kéo quân", p: ["Đèn kéo quân có hình người, ngựa dán quanh một trục.", "Khi thắp đèn, hơi nóng làm trục quay, bóng hình chạy vòng quanh như đoàn quân."] }
        ], fact: "Bạn có thể tự làm đèn ông sao bằng que tre và giấy màu. Nhờ người lớn giúp phần cắt nhé!", words: [["lantern", "đèn lồng"], ["star", "ngôi sao"]] },
        { id: "mua-lan", title: "Múa lân", pages: [
          { h: "Tùng tùng xoè!", p: ["Múa lân rộn ràng theo tiếng trống. Con lân được xem là con vật mang lại may mắn, bình an.", "Đi cùng lân thường có ông Địa bụng to, cầm quạt, làm trò vui nhộn."] }
        ], fact: "Người múa lân phải tập rất nhiều để bước chân khớp với nhịp trống.", words: [["lion dance", "múa lân"], ["drum", "cái trống"]] },
        { id: "pha-co", title: "Bánh & phá cỗ", pages: [
          { h: "Bánh nướng, bánh dẻo", p: ["Bánh Trung thu tròn như mặt trăng, tượng trưng cho sự sum vầy.", "Bánh nướng có vỏ vàng nâu, bánh dẻo có vỏ trắng mềm."] },
          { h: "Phá cỗ", p: ["Mâm cỗ Trung thu có bánh và hoa quả như bưởi, hồng, na.", "Ngắm trăng xong, các bạn nhỏ cùng “phá cỗ”, chia nhau bánh kẹo."] }
        ], fact: "Nhiều nhà xếp múi bưởi thành hình chú chó bông để bày mâm cỗ.", words: [["mooncake", "bánh trung thu"], ["share", "chia sẻ"]] },
        { id: "y-nghia", title: "Ý nghĩa", pages: [
          { h: "Tết của thiếu nhi", p: ["Trung thu còn được gọi là Tết thiếu nhi: các bạn nhỏ được vui chơi, rước đèn, nhận quà."] },
          { h: "Tết đoàn viên", p: ["Gia đình quây quần, cùng ngắm trăng, cảm ơn một mùa vụ đã qua.", "Trung thu nhắc mình nhớ về gia đình và quê hương."] }
        ], fact: "Ở nhiều nơi, các bạn nhỏ còn tự làm đèn và mâm cỗ để tặng nhau.", words: [["children", "thiếu nhi"], ["reunion", "đoàn viên"]] }
      ],
      quiz: [
        { q: "Tết Trung thu diễn ra vào ngày nào?", options: ["15 tháng 8 âm lịch", "1 tháng 1 âm lịch", "31 tháng 10", "25 tháng 12"], why: "Trung thu là ngày rằm tháng Tám, khi trăng tròn." },
        { q: "Ai ngồi dưới gốc cây đa trên cung trăng?", options: ["Chú Cuội", "Ông Táo", "Ông đồ", "Ông già Noel"], why: "Chú Cuội níu rễ đa bay lên cung trăng." },
        { q: "Đèn ông sao có mấy cánh?", options: ["5 cánh", "3 cánh", "4 cánh", "6 cánh"], why: "Đèn ông sao là ngôi sao năm cánh." },
        { q: "Bánh Trung thu hình tròn tượng trưng cho điều gì?", options: ["Sự sum vầy, đoàn viên", "Mặt trời", "Đồng tiền", "Quả bóng"], why: "Bánh tròn như trăng rằm, tượng trưng cho sự sum vầy." }
      ],
      write: { prompt: "Có bạn cho rằng: “Trung thu nên mua đèn điện tử cho tiện, không cần tự làm đèn ông sao.” Bạn đồng ý hay không đồng ý? Viết 3–5 câu nêu ý kiến của bạn." }
    },

    /* ------------------------------ HALLOWEEN ------------------------------ */
    halloween: {
      boards: [
        { id: "nguon-goc", title: "Nguồn gốc", pages: [
          { h: "Từ lễ hội mùa thu xưa", p: ["Halloween bắt nguồn từ lễ Samhain của người Celt, sống ở vùng nay là Ireland và một phần nước Pháp, cách đây hơn 2.000 năm.", "Samhain đánh dấu cuối mùa thu hoạch, khi mùa đông lạnh giá sắp tới."] },
          { h: "Cái tên Halloween", p: ["Vào thế kỷ 8, ngày 1/11 được chọn làm Lễ Các Thánh (All Saints' Day).", "Buổi tối hôm trước gọi là All Hallows' Eve. Đọc nhanh dần, tên ấy thành “Halloween”."] }
        ], fact: "Halloween diễn ra vào tối 31/10 hằng năm.", words: [["Halloween", "lễ hội 31/10"], ["harvest", "mùa thu hoạch"]] },
        { id: "bi-ngo", title: "Đèn bí ngô", pages: [
          { h: "Jack-o'-lantern", p: ["Đèn bí ngô có tên tiếng Anh là jack-o'-lantern.", "Người ta khoét rỗng quả bí, khắc mặt cười hoặc mặt nhăn, rồi đặt đèn bên trong."] },
          { h: "Từ củ cải đến bí ngô", p: ["Ở Ireland ngày xưa, người ta khắc đèn từ củ cải và khoai tây.", "Khi sang Mỹ, họ thấy bí ngô to, dễ trồng và dễ khắc hơn. Thế là bí ngô thành biểu tượng của Halloween."] }
        ], fact: "Khi khắc bí ngô, hãy nhờ người lớn cầm dao và dùng đèn LED thay cho nến nhé.", words: [["pumpkin", "bí ngô"], ["carve", "khắc, chạm"]] },
        { id: "trang-phuc", title: "Hoá trang", pages: [
          { h: "Vì sao lại hoá trang?", p: ["Người Celt xưa tin rằng đêm Samhain, linh hồn có thể trở về. Họ đốt lửa lớn và khoác da, đầu thú để tự bảo vệ.", "Ngày nay, hoá trang chỉ để vui: bạn có thể là phù thuỷ, siêu anh hùng, con vật hay một nhân vật trong sách."] },
          { h: "Hoá trang lịch sự", p: ["Chọn trang phục vui vẻ, không chế giễu ai.", "Mặt nạ nên dễ thở và giúp bạn nhìn rõ đường đi."] }
        ], fact: "Nhiều bạn hoá trang thành nhân vật trong cuốn sách mình thích. Bạn sẽ chọn nhân vật nào?", words: [["costume", "trang phục hoá trang"], ["witch", "phù thuỷ"]] },
        { id: "to-chuc", title: "Trick or treat", pages: [
          { h: "Cho kẹo hay bị ghẹo!", p: ["Tối 31/10, trẻ em hoá trang đi gõ cửa hàng xóm và nói “Trick or treat!”, nghĩa là “Cho kẹo hay bị ghẹo!”.", "Chủ nhà tặng kẹo cho các bạn."] },
          { h: "Phong tục ngày xưa", p: ["Ngày xưa, trẻ em ở Ireland và Scotland hoá trang, hát hoặc đọc thơ để được nhận quà, bánh.", "Người di cư mang phong tục này sang Mỹ, rồi nó thành trò “trick or treat” ngày nay."] },
          { h: "Những hoạt động khác", p: ["Trang trí nhà bằng bí ngô, mạng nhện giả. Tổ chức tiệc hoá trang, kể chuyện ma vui.", "Chơi trò cắn táo nổi trong chậu nước (bobbing for apples)."] }
        ], fact: "Ở nhiều nơi, nhà nào đặt đèn bí ngô trước cửa là nhà sẵn sàng đón các bạn đi xin kẹo.", words: [["trick or treat", "cho kẹo hay bị ghẹo"], ["neighbour", "hàng xóm"]] },
        { id: "bieu-tuong", title: "Biểu tượng", pages: [
          { h: "Cam và đen", p: ["Màu cam gợi mùa thu hoạch và quả bí ngô. Màu đen gợi màn đêm."] },
          { h: "Hình ảnh quen thuộc", p: ["Dơi, mèo đen, nhện, ma, phù thuỷ, bộ xương… là hình ảnh để trang trí cho vui.", "Chúng giống nhân vật trong truyện thôi, không có gì đáng sợ đâu!"] }
        ], fact: "Màu cam của bí ngô cũng là màu của Mở Sách đó!", words: [["bat", "con dơi"], ["ghost", "con ma"], ["spider", "con nhện"]] },
        { id: "viet-nam", title: "Ở Việt Nam", pages: [
          { h: "Một lễ hội từ nước ngoài", p: ["Halloween không phải lễ truyền thống của Việt Nam.", "Vài năm gần đây, nhiều bạn trẻ ở các thành phố tổ chức tiệc hoá trang ở trường, trung tâm tiếng Anh và khu vui chơi."] },
          { h: "Học hỏi mà vẫn giữ mình", p: ["Tìm hiểu lễ hội của nước khác giúp mình hiểu thêm thế giới.", "Mình vẫn yêu và giữ các lễ của Việt Nam như Tết Nguyên Đán, Tết Trung thu."] }
        ], fact: "Trung thu cũng có rước đèn và hoá trang lân, ông Địa. Bạn thấy hai lễ giống và khác nhau ở đâu?", words: [["festival", "lễ hội"], ["culture", "văn hoá"]] }
      ],
      quiz: [
        { q: "Halloween diễn ra vào ngày nào?", options: ["31 tháng 10", "25 tháng 12", "1 tháng 6", "Rằm tháng Tám"], why: "Halloween là tối 31/10, trước Lễ Các Thánh 1/11." },
        { q: "Halloween bắt nguồn từ lễ hội nào?", options: ["Lễ Samhain của người Celt", "Tết Trung thu", "Lễ Giáng sinh", "Lễ hội hoa đào"], why: "Samhain là lễ cuối mùa thu hoạch của người Celt." },
        { q: "Ở Ireland ngày xưa, người ta khắc đèn từ gì?", options: ["Củ cải và khoai tây", "Dưa hấu", "Trái dừa", "Quả bưởi"], why: "Sang Mỹ, người ta mới đổi sang bí ngô." },
        { q: "“Trick or treat” nghĩa là gì?", options: ["Cho kẹo hay bị ghẹo", "Chúc ngủ ngon", "Chúc mừng năm mới", "Cảm ơn bạn"], why: "Trẻ em nói câu này khi gõ cửa xin kẹo." }
      ],
      write: { prompt: "Có bạn cho rằng: “Học sinh Việt Nam không nên tổ chức Halloween, vì đây là lễ hội của nước ngoài.” Bạn đồng ý hay không đồng ý? Viết 3–5 câu nêu ý kiến của bạn." }
    },

    /* ------------------------------ GIÁNG SINH ------------------------------ */
    "giang-sinh": {
      boards: [
        { id: "nguon-goc", title: "Ngày 25/12", pages: [
          { h: "Lễ Giáng sinh", p: ["Giáng sinh, hay lễ Noel, là ngày người theo đạo Kitô kỷ niệm ngày sinh của Chúa Giê-su.", "Đêm 24/12 là đêm Giáng sinh. Nhiều gia đình sum họp và đi lễ nhà thờ."] },
          { h: "Lễ hội của nhiều người", p: ["Ngày nay, nhiều người trên thế giới, kể cả người không theo đạo, cũng vui đón Giáng sinh.", "Mọi người tặng quà, trang trí nhà cửa và gặp gỡ bạn bè."] }
        ], fact: "“Noel” là từ tiếng Pháp chỉ lễ Giáng sinh. Người Việt quen gọi theo.", words: [["Christmas", "Giáng sinh"], ["Christmas Eve", "đêm Giáng sinh"]] },
        { id: "cay-thong", title: "Cây thông Noel", pages: [
          { h: "Từ nước Đức", p: ["Phong tục trang trí cây thông dịp Giáng sinh có từ nước Đức, rồi lan ra khắp thế giới."] },
          { h: "Trang trí cây thông", p: ["Người ta treo quả châu, dây kim tuyến, đèn nháy, và gắn một ngôi sao trên ngọn cây."] }
        ], fact: "Cây thông xanh cả trong mùa đông lạnh giá, nên được xem là biểu tượng của sức sống.", words: [["pine tree", "cây thông"], ["ornament", "đồ trang trí"]] },
        { id: "ong-gia-noel", title: "Ông già Noel", pages: [
          { h: "Thánh Nicholas", p: ["Ông già Noel lấy cảm hứng từ Thánh Nicholas, một vị giám mục sống hơn 1.600 năm trước.", "Ông nổi tiếng tốt bụng và hay giúp đỡ trẻ em."] },
          { h: "Áo đỏ, xe tuần lộc", p: ["Hình ảnh ông già râu trắng, áo đỏ, đi xe tuần lộc phát quà là do các hoạ sĩ, nhà văn sau này vẽ và kể lại."] }
        ], fact: "Tên tiếng Anh của ông già Noel là Santa Claus.", words: [["Santa Claus", "ông già Noel"], ["reindeer", "tuần lộc"]] },
        { id: "qua-tang", title: "Quà & tất", pages: [
          { h: "Tặng quà", p: ["Giáng sinh là dịp tặng quà cho người thân, bạn bè.", "Món quà nhỏ nhưng chứa nhiều yêu thương."] },
          { h: "Chiếc tất treo", p: ["Ở nhiều nước, trẻ em treo tất dài bên lò sưởi hoặc đầu giường.", "Các bạn mong sáng hôm sau có quà bên trong."] }
        ], fact: "Một cuốn sách hay là món quà Giáng sinh tuyệt vời, đọc được nhiều lần!", words: [["gift", "món quà"], ["stocking", "chiếc tất dài"]] },
        { id: "bai-hat", title: "Bài hát & thiệp", pages: [
          { h: "Những bài hát quen thuộc", p: ["“Jingle Bells” và “Silent Night” (Đêm thánh vô cùng) là hai bài hát Giáng sinh nổi tiếng khắp thế giới."] },
          { h: "Thiệp Giáng sinh", p: ["Mọi người gửi thiệp chúc nhau “Merry Christmas”, nghĩa là “Chúc mừng Giáng sinh”."] }
        ], fact: "Bài “Silent Night” ra đời ở nước Áo năm 1818.", words: [["Merry Christmas", "Chúc mừng Giáng sinh"], ["card", "tấm thiệp"]] },
        { id: "viet-nam", title: "Ở Việt Nam", pages: [
          { h: "Phố phường rực rỡ", p: ["Ở Việt Nam, dịp Giáng sinh nhiều nơi trang trí đèn và cây thông.", "Đêm 24/12, nhiều người đi dạo phố, ngắm nhà thờ, chụp ảnh."] },
          { h: "Giáng sinh mùa nào?", p: ["Ở Bắc bán cầu, Giáng sinh rơi vào mùa đông, có nơi có tuyết.", "Ở Úc (Nam bán cầu), Giáng sinh lại vào mùa hè. Nhiều người ra bãi biển!"] }
        ], fact: "Dịp Giáng sinh, miền Bắc Việt Nam trời se lạnh, còn miền Nam vẫn nắng ấm.", words: [["snow", "tuyết"], ["winter", "mùa đông"]] }
      ],
      quiz: [
        { q: "Ngày lễ Giáng sinh là ngày nào?", options: ["25 tháng 12", "31 tháng 10", "1 tháng 1", "Rằm tháng Tám"], why: "Giáng sinh là 25/12, đêm Giáng sinh là tối 24/12." },
        { q: "Phong tục trang trí cây thông có từ nước nào?", options: ["Nước Đức", "Việt Nam", "Nước Úc", "Nhật Bản"], why: "Cây thông Noel có từ nước Đức rồi lan ra thế giới." },
        { q: "Ông già Noel lấy cảm hứng từ ai?", options: ["Thánh Nicholas", "Chú Cuội", "Ông Táo", "Lang Liêu"], why: "Thánh Nicholas là vị giám mục tốt bụng, hay giúp trẻ em." },
        { q: "Ở nước Úc, Giáng sinh rơi vào mùa nào?", options: ["Mùa hè", "Mùa đông", "Mùa xuân", "Mùa thu"], why: "Úc ở Nam bán cầu nên tháng 12 là mùa hè." }
      ],
      write: { prompt: "Có ý kiến cho rằng: “Món quà tự làm có ý nghĩa hơn món quà mua ở cửa hàng.” Bạn đồng ý hay không đồng ý? Viết 3–5 câu nêu ý kiến của bạn." }
    }
  };

  // Gợi ý viết theo mô hình hamburger (chuỗi Nghị luận Vỡ Lòng)
  MS3D.WRITE_HINTS = [
    ["Câu chủ đề", "Mình đồng ý / không đồng ý vì…"],
    ["Lý lẽ", "Lý do thứ nhất là…"],
    ["Bằng chứng", "Ví dụ, …"],
    ["Phân tích", "Điều đó cho thấy…"],
    ["Kết đoạn", "Vì vậy, …"]
  ];
})();
