/* ==========================================================
   THƯ VIỆN MỞ SÁCH — danh sách sách cho Không gian đọc (sảnh 3D).
   Thêm sách: thêm 1 khối vào window.MS_BOOKS.
   Mỗi trang là MỘT trong hai dạng:
     { text: "…" }                       trang chữ
     { img: "assets/sach/<id>/01.webp" }  trang ảnh (dùng cho sách PDF: chuyển mỗi trang PDF thành 1 ảnh)
   Không đặt file PDF gốc vào folder web: trình đọc chỉ hiện từng trang, không có nút tải.
   Hai truyện dưới đây là truyện cổ tích dân gian Việt Nam, Mở Sách kể lại bằng lời mới (bản mẫu).
   ========================================================== */
// Các kệ trong Không gian đọc (mỗi kệ tối đa 4 cuốn)
window.MS_SHELVES = [
  { id: "co-tich", name: "Truyện cổ tích" },
  { id: "sach-tranh", name: "Sách tranh" },
  { id: "kinh-dien", name: "Kinh điển Đông – Tây", type: "case" }   // tủ sách dựng đứng, thấy gáy sách
];

/* paper: true = sách giấy có bản quyền của NXB. Không đưa trang sách lên mạng;
   trong 3D chỉ có thẻ giới thiệu + gợi ý đọc do Mở Sách viết, HS đọc sách giấy tại tủ sách.
   Bìa trong 3D là bìa vẽ đơn giản (không dùng ảnh bìa gốc). */
window.MS_BOOKS = [
  {
    id: "cay-khe", shelf: "co-tich",
    title: "Cây khế",
    author: "Truyện cổ tích Việt Nam · Mở Sách kể lại",
    grade: "Lớp 3–6", minutes: "5 phút",
    color: "#3f8a4e", accent: "#f6c84c", art: "khe",
    summary: "Hai anh em chia gia tài. Người em hiền lành chỉ được cây khế, nhưng một ngày có chú chim lạ bay đến…",
    pages: [
      { text: "Ngày xưa, có hai anh em mồ côi cha mẹ. Người anh tham lam. Người em hiền lành, chăm chỉ." },
      { text: "Khi chia gia tài, người anh lấy hết nhà cửa, ruộng vườn. Người em chỉ được một túp lều nhỏ và một cây khế." },
      { text: "Năm ấy, cây khế sai trĩu quả. Một hôm, có chú chim lạ bay đến ăn khế. Người em buồn rầu: “Chim ơi, nhà tôi chỉ có cây khế này thôi.”" },
      { text: "Chim bèn nói: “Ăn một quả, trả cục vàng. May túi ba gang, mang đi mà đựng.” Người em làm đúng như lời chim dặn." },
      { text: "Chim chở người em bay qua biển, tới một hòn đảo lấp lánh vàng bạc. Người em chỉ nhặt vừa đủ một túi nhỏ rồi về." },
      { text: "Từ đó, người em sống đầy đủ và hay giúp đỡ những người nghèo khó trong làng." },
      { text: "Người anh nghe chuyện, liền đòi đổi cả gia tài lấy cây khế. Khi chim đến, anh ta may hẳn một cái túi mười hai gang." },
      { text: "Ra đến đảo, người anh nhét vàng đầy túi, giắt thêm khắp người. Trên đường về, chim mỏi cánh. Người anh nặng quá, rơi tõm xuống biển." },
      { text: "Người xưa nhắn nhủ: tham thì thâm. Sống hiền lành và biết đủ, ta sẽ có được niềm vui thật sự." }
    ],
    question: "Vì sao người em chỉ may túi ba gang, còn người anh may túi mười hai gang? Bạn học được điều gì từ hai nhân vật này?"
  },
  {
    id: "vu-sua", shelf: "co-tich",
    title: "Sự tích cây vú sữa",
    author: "Truyện cổ tích Việt Nam · Mở Sách kể lại",
    grade: "Lớp 2–5", minutes: "5 phút",
    color: "#6b3f8a", accent: "#c9e6a0", art: "vusua",
    summary: "Một cậu bé ham chơi bỏ nhà đi. Khi quay về, cậu không thấy mẹ đâu, chỉ có một cây xanh lạ trong vườn…",
    pages: [
      { text: "Ngày xưa, có một cậu bé được mẹ thương yêu, chiều chuộng. Cậu rất ham chơi." },
      { text: "Một lần bị mẹ mắng, cậu giận dỗi bỏ nhà đi. Ở nhà, ngày nào mẹ cũng ra ngõ ngóng con." },
      { text: "Cậu đi lang thang khắp nơi. Đến khi vừa đói vừa lạnh, cậu mới nhớ đến mẹ và vội vàng tìm đường về nhà." },
      { text: "Về đến nơi, nhà cửa vẫn thế, nhưng không thấy mẹ đâu. Cậu gọi mẹ mãi, rồi ôm lấy một cây xanh trong vườn mà khóc." },
      { text: "Bỗng cây xanh khẽ rung. Những bông hoa nhỏ trắng như mây nở ra, hoa rụng xuống, rồi những quả tròn, xanh bóng xuất hiện." },
      { text: "Một quả rơi vào tay cậu. Cậu cắn thử, bên trong có dòng nước trắng, ngọt và thơm như sữa mẹ." },
      { text: "Lá cây một mặt xanh bóng, mặt kia đỏ như đôi mắt mẹ đã khóc nhiều vì nhớ con. Cành cây rủ xuống ôm lấy cậu, dịu dàng như vòng tay của mẹ." },
      { text: "Từ đó, người ta gọi đó là cây vú sữa. Câu chuyện nhắc chúng mình hãy yêu thương và biết ơn cha mẹ khi còn ở bên nhau." }
    ],
    question: "Nếu được nói một câu với mẹ của cậu bé, bạn sẽ nói gì? Vì sao?"
  },
  {
    id: "cau-be-an-sach", shelf: "sach-tranh", paper: true,
    title: "Cậu bé ăn sách phi thường",
    author: "Oliver Jeffers · Mộc Chi dịch · Nhã Nam",
    grade: "Lớp 1–6", minutes: "10 phút",
    color: "#a8432c", accent: "#f2d7a6", art: "an-sach",
    summary: "Henry không đọc sách mà… ăn sách! Càng ăn, cậu càng thấy mình thông minh hơn. Nhưng ăn quá nhiều thì chuyện gì sẽ xảy ra?",
    pages: [
      { text: "Đây là phần gợi ý đọc của Mở Sách. Sách giấy “Cậu bé ăn sách phi thường” có ở tủ sách của lớp: bạn mượn sách và đọc cùng cô hoặc cùng bạn nhé." },
      { text: "Trước khi đọc: nhìn tên sách, bạn đoán “ăn sách” nghĩa là gì? Có phải ăn thật không, hay là một cách nói vui?" },
      { text: "Trong khi đọc: để ý xem Henry thay đổi thế nào mỗi lần ăn thật nhiều sách. Cơ thể cậu, màu da cậu, và những điều cậu nói có gì lạ?" },
      { text: "Trong khi đọc: tìm trang Henry nhận ra mình bị “rối tung” kiến thức. Vì sao cậu nhớ nhầm hết mọi thứ?" },
      { text: "Sau khi đọc: Henry tìm ra một cách khác để “thưởng thức” sách. Đó là cách nào? Bạn có làm giống Henry không?" },
      { text: "Hoạt động: vẽ cuốn sách “ngon” nhất bạn từng đọc, rồi viết một câu giới thiệu vì sao nó ngon đến vậy." }
    ],
    question: "Theo bạn, muốn giỏi lên thì nên đọc thật nhiều sách thật nhanh, hay đọc chậm và hiểu kỹ từng cuốn? Vì sao?"
  },
  {
    id: "cao-dap-xe", shelf: "sach-tranh", paper: true,
    title: "Cáo đạp xe",
    author: "Corey R. Tabor · Hà Trang dịch · Sán Hô (song ngữ Anh – Việt)",
    grade: "Lớp 1–4", minutes: "10 phút",
    color: "#e0742f", accent: "#7cc35a", art: "xe-dap",
    summary: "Năm nào các con vật cũng đạp xe dã ngoại thật chậm, thật an toàn. Nhưng Cáo muốn phiêu lưu! Năm nay, chuyện gì xảy ra khi Cáo cầm lái?",
    pages: [
      { text: "Đây là phần gợi ý đọc của Mở Sách. Sách giấy “Cáo đạp xe” có ở tủ sách của lớp. Sách song ngữ: bạn có thể đọc tiếng Việt trước, rồi thử đọc tiếng Anh." },
      { text: "Trước khi đọc: nếu được đi dã ngoại cùng bạn bè, bạn thích đi chậm để ngắm cảnh, hay thích đi nhanh để phiêu lưu?" },
      { text: "Trong khi đọc: mỗi bạn trong nhóm lo một việc cho chuyến đi. Ai lo bản đồ, ai lo chụp ảnh, ai lo an toàn? Còn Cáo lo việc gì?" },
      { text: "Trong khi đọc: đếm xem cả nhóm đã đi qua bao nhiêu nơi bất ngờ. Nơi nào làm bạn bất ngờ nhất?" },
      { text: "Từ mới tiếng Anh: adventure (phiêu lưu), bike ride (chuyến đạp xe), snack (đồ ăn vặt), boring (chán)." },
      { text: "Hoạt động: vẽ bản đồ một chuyến đạp xe “trong mơ” của bạn, có ít nhất 3 điểm dừng." }
    ],
    question: "Cáo muốn phiêu lưu, còn các bạn khác muốn an toàn. Bạn đồng ý với ai hơn? Vì sao?"
  },
  /* ---------- KỆ KINH ĐIỂN ĐÔNG – TÂY ----------
     Tác phẩm đã hết bản quyền. Trang sách là BẢN TÓM TẮT do Mở Sách viết lại bằng lời mới
     (không dùng bản dịch có bản quyền). side: "dong" (phương Đông) | "tay" (phương Tây). */
  {
    id: "truyen-kieu", shelf: "kinh-dien", side: "dong",
    title: "Truyện Kiều",
    author: "Nguyễn Du (1766–1820) · Việt Nam · Mở Sách tóm tắt",
    grade: "Lớp 6–9", minutes: "6 phút",
    color: "#8e1b1b", accent: "#e8c15a", art: "classic",
    summary: "Nàng Kiều tài sắc vẹn toàn, vì cứu cha mà chịu mười lăm năm lưu lạc. Truyện thơ lục bát đẹp nhất của văn học Việt Nam.",
    pages: [
      { text: "Truyện Kiều là truyện thơ của đại thi hào Nguyễn Du, viết bằng chữ Nôm, gồm 3.254 câu thơ lục bát. Đây là bản tóm tắt ngắn để bạn làm quen trước khi đọc tác phẩm thật." },
      { text: "Thuý Kiều và Thuý Vân là hai chị em xinh đẹp. Kiều còn rất tài hoa: giỏi đàn, giỏi thơ, giỏi vẽ. Trong một buổi du xuân, Kiều gặp chàng thư sinh Kim Trọng. Hai người cảm mến và hẹn ước gắn bó." },
      { text: "Bỗng tai hoạ ập đến: cha và em trai của Kiều bị bắt oan. Để có tiền cứu cha, Kiều quyết định bán mình. Nàng nhờ em gái Thuý Vân thay mình giữ lời hẹn với Kim Trọng." },
      { text: "Suốt mười lăm năm, Kiều lưu lạc nơi đất khách, nhiều lần bị lừa gạt và chịu bao cay đắng. Có lúc nàng gặp Từ Hải, một người anh hùng, giúp nàng đền ơn những người tốt và trừng trị kẻ ác." },
      { text: "Cuối cùng, Kiều được đoàn tụ với gia đình và gặp lại Kim Trọng. Sau bao sóng gió, nàng chọn sống bình yên bên người thân." },
      { text: "Vì sao là kinh điển? Truyện Kiều có những câu lục bát rất đẹp, nhiều câu đã thành lời ăn tiếng nói hằng ngày của người Việt. Câu mở đầu nổi tiếng: “Trăm năm trong cõi người ta, Chữ tài chữ mệnh khéo là ghét nhau.”" }
    ],
    question: "Kiều chọn hi sinh tình yêu để cứu cha. Bạn nghĩ gì về lựa chọn ấy? Hãy nêu một lý do."
  },
  {
    id: "luc-van-tien", shelf: "kinh-dien", side: "dong",
    title: "Lục Vân Tiên",
    author: "Nguyễn Đình Chiểu (1822–1888) · Việt Nam · Mở Sách tóm tắt",
    grade: "Lớp 5–9", minutes: "5 phút",
    color: "#1f4e5f", accent: "#e8c15a", art: "classic",
    summary: "Chàng Vân Tiên đánh cướp cứu người mà không cần đền ơn. Câu chuyện về lòng nghĩa hiệp và sự thuỷ chung.",
    pages: [
      { text: "Lục Vân Tiên là truyện thơ lục bát của cụ Đồ Chiểu, nhà thơ mù đất Nam Bộ. Người miền Nam xưa thuộc lòng truyện này và thường “nói thơ Vân Tiên” cho nhau nghe." },
      { text: "Trên đường lên kinh đi thi, Vân Tiên gặp bọn cướp đang bắt người. Chàng bẻ cây làm gậy, một mình đánh tan bọn cướp, cứu được cô gái tên Kiều Nguyệt Nga." },
      { text: "Nguyệt Nga muốn mời chàng về nhà để cha đền ơn. Vân Tiên từ chối, vì theo chàng, thấy việc nghĩa mà không làm thì không phải người anh hùng. Giúp người là lẽ đương nhiên, không cần trả ơn." },
      { text: "Sau đó, Vân Tiên gặp nhiều hoạn nạn: mẹ mất, chàng khóc đến mù mắt, lại bị kẻ xấu ghen ghét hãm hại. May có những người tốt bụng như ông Ngư, ông Tiều ra tay cứu giúp." },
      { text: "Nguyệt Nga vẫn một lòng chờ Vân Tiên dù gặp nhiều ép buộc. Cuối cùng, Vân Tiên sáng mắt, thi đỗ, đánh thắng giặc và đoàn tụ với Nguyệt Nga. Người tốt được đền đáp, kẻ ác bị trừng trị." }
    ],
    question: "Vân Tiên giúp người mà không nhận đền ơn. Theo bạn, giúp đỡ người khác có cần được trả ơn không? Vì sao?"
  },
  {
    id: "tay-du-ky", shelf: "kinh-dien", side: "dong",
    title: "Tây Du Ký",
    author: "Ngô Thừa Ân (thế kỷ 16) · Trung Quốc · Mở Sách tóm tắt",
    grade: "Lớp 4–9", minutes: "6 phút",
    color: "#a0521d", accent: "#ffd36b", art: "classic",
    summary: "Bốn thầy trò Đường Tăng vượt 81 kiếp nạn để sang Tây Trúc thỉnh kinh. Có Tôn Ngộ Không 72 phép biến hoá!",
    pages: [
      { text: "Tây Du Ký là một trong bốn tác phẩm lớn của văn học cổ điển Trung Quốc. Truyện kể về hành trình đi lấy kinh Phật, đầy phép thuật và yêu quái." },
      { text: "Tôn Ngộ Không là chú khỉ sinh ra từ đá. Khỉ học được 72 phép biến hoá, một cú lộn nhào bay xa mười vạn tám nghìn dặm. Vì quá ngạo mạn, Ngộ Không đại náo thiên cung và bị đè dưới núi Ngũ Hành suốt 500 năm." },
      { text: "Nhà sư Đường Tăng lên đường sang Tây Trúc thỉnh kinh. Ngài cứu Ngộ Không ra khỏi núi và nhận làm đồ đệ. Sau đó có thêm Trư Bát Giới tham ăn, Sa Tăng hiền lành và Bạch Long Mã chở thầy." },
      { text: "Dọc đường, yêu quái kéo đến không ngớt vì nghe nói ăn thịt Đường Tăng sẽ được sống lâu. Ngộ Không dùng gậy Như Ý và trí thông minh để bảo vệ thầy, dù có lúc bị thầy hiểu lầm." },
      { text: "Sau 81 kiếp nạn, bốn thầy trò đến được Tây Trúc và mang kinh về. Mỗi người đều đã thay đổi: Ngộ Không bớt nóng nảy, Bát Giới bớt lười, cả nhóm biết dựa vào nhau." },
      { text: "Vì sao là kinh điển? Ai cũng có thể thấy mình trong một nhân vật. Và truyện nhắc chúng ta: đường xa đến mấy, kiên trì và đồng đội sẽ đưa ta tới đích." }
    ],
    question: "Trong bốn thầy trò, bạn thấy mình giống ai nhất? Hãy kể một việc bạn từng làm giống nhân vật đó."
  },
  {
    id: "tam-quoc", shelf: "kinh-dien", side: "dong",
    title: "Tam Quốc Diễn Nghĩa",
    author: "La Quán Trung (thế kỷ 14) · Trung Quốc · Mở Sách tóm tắt",
    grade: "Lớp 6–9", minutes: "6 phút",
    color: "#2e5a3a", accent: "#e8c15a", art: "classic",
    summary: "Ba nước Nguỵ, Thục, Ngô tranh hùng. Chuyện kết nghĩa vườn đào, ba lần mời Khổng Minh và trận Xích Bích lửa đỏ.",
    pages: [
      { text: "Cuối thời nhà Hán ở Trung Quốc, đất nước loạn lạc và chia thành ba nước: Nguỵ của Tào Tháo, Thục của Lưu Bị, Ngô của Tôn Quyền. Tam Quốc nghĩa là “ba nước”." },
      { text: "Lưu Bị, Quan Vũ và Trương Phi gặp nhau, cùng chí hướng giúp dân. Ba người kết làm anh em trong một vườn đào, thề sống chết có nhau. Tình nghĩa ấy giữ trọn suốt đời." },
      { text: "Nghe tin có người tài là Gia Cát Lượng (Khổng Minh), Lưu Bị ba lần đến lều cỏ mời ông. Hai lần đầu không gặp, lần thứ ba Lưu Bị kiên nhẫn đứng chờ ông ngủ dậy. Khổng Minh cảm động, nhận lời giúp." },
      { text: "Ở trận Xích Bích, Tào Tháo mang đại quân xuống phía nam. Lưu Bị và Tôn Quyền liên minh. Khổng Minh nhờ sương mù mà “mượn” được mười vạn mũi tên của đối phương bằng những chiếc thuyền chở đầy rơm, rồi quân đồng minh dùng lửa đánh thắng." },
      { text: "Ba nước giằng co nhiều năm. Cuối cùng cả ba đều suy yếu, và nhà Tấn thống nhất đất nước. Câu mở đầu của truyện nói rằng thiên hạ hợp lâu thì tan, tan lâu thì hợp." },
      { text: "Vì sao là kinh điển? Truyện có rất nhiều mưu kế hay, nhiều bài học về chữ tín, lòng trung thành và cách quý trọng người tài. Nhiều thành ngữ ta dùng hôm nay đến từ Tam Quốc." }
    ],
    question: "Lưu Bị ba lần đến mời Khổng Minh. Theo bạn, sự kiên trì ấy nói lên điều gì về Lưu Bị?"
  },
  {
    id: "nghin-le-mot-dem", shelf: "kinh-dien", side: "dong",
    title: "Nghìn lẻ một đêm",
    author: "Truyện dân gian Ả Rập – Ba Tư · Mở Sách tóm tắt",
    grade: "Lớp 4–8", minutes: "5 phút",
    color: "#5a2d82", accent: "#ffd36b", art: "classic",
    summary: "Nàng Sêhêrazát kể chuyện suốt 1001 đêm. Từ đó ra đời Alibaba, Aladdin và chàng thuỷ thủ Xinbát.",
    pages: [
      { text: "Ngày xưa, có một nhà vua vì giận dữ mà trở nên độc ác, ban ra những lệnh rất nghiệt ngã. Ai cũng sợ hãi." },
      { text: "Nàng Sêhêrazát thông minh và đọc rất nhiều sách. Nàng nghĩ ra một cách: mỗi đêm kể cho vua nghe một câu chuyện, và dừng lại đúng chỗ hay nhất. Vua tò mò muốn nghe tiếp, nên đêm sau lại mời nàng kể." },
      { text: "Chuyện Alibaba: anh tiều phu nghèo tình cờ nghe được câu thần chú “Vừng ơi, mở ra!” của bốn mươi tên cướp. Nhờ cô hầu gái Morgiana nhanh trí, Alibaba thoát khỏi bọn cướp." },
      { text: "Chuyện Aladdin và cây đèn thần, chuyện bảy chuyến đi biển của Xinbát… Chuyện nọ nối chuyện kia, kéo dài suốt một nghìn lẻ một đêm." },
      { text: "Qua những câu chuyện, nhà vua dần hiểu về lòng tốt, sự công bằng và trí tuệ. Ông thay đổi, trở thành một vị vua hiền. Câu chuyện cho thấy sức mạnh của việc kể chuyện." }
    ],
    question: "Sêhêrazát dùng câu chuyện thay cho vũ khí. Bạn có tin rằng một câu chuyện hay có thể thay đổi một người không? Vì sao?"
  },
  {
    id: "robinson", shelf: "kinh-dien", side: "tay",
    title: "Robinson Crusoe",
    author: "Daniel Defoe (1660–1731) · Anh · Mở Sách tóm tắt",
    grade: "Lớp 5–9", minutes: "5 phút",
    color: "#1d3557", accent: "#f1c27d", art: "classic",
    summary: "Đắm tàu, một mình trên hoang đảo suốt 28 năm. Robinson tự dựng nhà, trồng lúa, nuôi dê và không bao giờ bỏ cuộc.",
    pages: [
      { text: "Robinson Crusoe là chàng trai người Anh mê phiêu lưu. Cha khuyên anh ở nhà sống yên ổn, nhưng anh vẫn lên tàu ra biển." },
      { text: "Một trận bão lớn đánh chìm con tàu. Cả đoàn mất tích, chỉ còn Robinson dạt vào một hòn đảo hoang không một bóng người." },
      { text: "Robinson bơi ra xác tàu, mang về dụng cụ, lương thực, súng và cả giấy bút. Anh dựng nhà trong vách đá, trồng lúa mạch, nuôi dê, tự làm nồi đất. Mỗi ngày anh khắc một vạch lên cây cột gỗ để đếm ngày." },
      { text: "Có lúc Robinson buồn và sợ hãi. Anh viết nhật ký, liệt kê điều xấu và điều tốt của hoàn cảnh mình, và thấy mình vẫn còn nhiều điều để biết ơn." },
      { text: "Sau nhiều năm, Robinson cứu được một người khỏi nguy hiểm, đặt tên là Thứ Sáu. Hai người trở thành bạn. Sau 28 năm, một con tàu ghé đảo và đưa họ về nhà." }
    ],
    question: "Nếu phải sống một mình trên đảo hoang và chỉ được mang theo 3 thứ, bạn chọn gì? Giải thích vì sao."
  },
  {
    id: "khong-gia-dinh", shelf: "kinh-dien", side: "tay",
    title: "Không gia đình",
    author: "Hector Malot (1830–1907) · Pháp · Mở Sách tóm tắt",
    grade: "Lớp 5–9", minutes: "6 phút",
    color: "#5c2a3b", accent: "#f1c27d", art: "classic",
    summary: "Cậu bé Rê-mi theo đoàn hát rong của cụ Vitali đi khắp nước Pháp, cùng chú chó Capi tìm lại gia đình.",
    pages: [
      { text: "Rê-mi lớn lên ở một làng quê nước Pháp, được bà má nuôi hết lòng yêu thương. Một ngày, cậu biết mình chỉ là đứa trẻ bị bỏ rơi." },
      { text: "Vì nhà nghèo, Rê-mi bị giao cho cụ Vitali, một nghệ sĩ hát rong. Đoàn của cụ có chú chó thông minh Capi, hai chú chó nữa và chú khỉ Giôli Cơ." },
      { text: "Cụ Vitali nghiêm khắc mà nhân hậu. Cụ dạy Rê-mi đọc chữ, chơi đàn, và dạy cậu sống tự trọng. Cả đoàn đi bộ khắp nước Pháp, biểu diễn để kiếm sống." },
      { text: "Một mùa đông lạnh giá, cụ Vitali qua đời. Rê-mi đau buồn nhưng không gục ngã. Cậu kết bạn với Mát-chi-a, cùng nhau tiếp tục hát rong, có lần còn mắc kẹt trong hầm mỏ bị ngập nước." },
      { text: "Bằng lòng dũng cảm và tình bạn, Rê-mi vượt qua tất cả. Cuối cùng, cậu tìm được mẹ ruột và có một mái ấm thật sự." },
      { text: "Vì sao là kinh điển? Rê-mi cho thấy dù không có gì trong tay, ta vẫn có thể sống tử tế, chăm chỉ và giữ trọn tình bạn." }
    ],
    question: "Cụ Vitali dạy Rê-mi rất nhiều điều. Ai là người đã dạy bạn một điều quan trọng? Đó là điều gì?"
  },
  {
    id: "alice", shelf: "kinh-dien", side: "tay",
    title: "Alice ở xứ sở diệu kỳ",
    author: "Lewis Carroll (1832–1898) · Anh · Mở Sách tóm tắt",
    grade: "Lớp 3–7", minutes: "5 phút",
    color: "#0e5e6f", accent: "#ffd36b", art: "classic",
    summary: "Alice đuổi theo chú thỏ trắng đeo đồng hồ và rơi xuống một thế giới kỳ lạ, nơi chẳng có gì giống bình thường.",
    pages: [
      { text: "Một buổi chiều buồn chán, cô bé Alice thấy một chú thỏ trắng mặc áo gi lê, rút đồng hồ ra xem và kêu: “Muộn mất rồi!” Alice tò mò chạy theo và rơi tuột xuống hang thỏ." },
      { text: "Dưới hang là một thế giới lạ lùng. Alice uống một lọ nước thì nhỏ xíu, ăn một miếng bánh lại cao vọt lên tận trần nhà." },
      { text: "Cô gặp con mèo Cheshire biến mất dần, chỉ còn lại nụ cười. Cô dự bữa tiệc trà điên rồ của bác Thợ Mũ, nơi lúc nào cũng là sáu giờ chiều." },
      { text: "Rồi Alice đến khu vườn của Nữ hoàng Cơ, người hay quát tháo ra lệnh. Trong phiên toà kỳ quặc, Alice dũng cảm nói lên điều mình nghĩ là đúng." },
      { text: "Alice tỉnh dậy bên bờ sông: tất cả chỉ là một giấc mơ. Truyện là trò chơi của trí tưởng tượng, với rất nhiều câu đố và trò chơi chữ." }
    ],
    question: "Nếu được bước vào xứ sở diệu kỳ, bạn muốn gặp nhân vật nào nhất? Bạn sẽ hỏi nhân vật đó điều gì?"
  },
  {
    id: "don-ki-ho-te", shelf: "kinh-dien", side: "tay",
    title: "Đôn Ki-hô-tê",
    author: "Miguel de Cervantes (1547–1616) · Tây Ban Nha · Mở Sách tóm tắt",
    grade: "Lớp 6–9", minutes: "5 phút",
    color: "#7a5c1e", accent: "#f6e2b3", art: "classic",
    summary: "Một ông lão đọc quá nhiều truyện hiệp sĩ, tự phong mình là hiệp sĩ và lên đường đánh nhau với… cối xay gió.",
    pages: [
      { text: "Ở một làng nhỏ Tây Ban Nha, có một ông quý tộc nghèo mê truyện hiệp sĩ đến mức đọc ngày đọc đêm. Ông tin rằng mọi chuyện trong sách đều là thật." },
      { text: "Ông tự đặt tên mình là Đôn Ki-hô-tê, đội chiếc mũ sắt cũ, cưỡi con ngựa gầy Rô-xi-nan-tê và lên đường “cứu giúp người yếu”. Bác nông dân Xan-chô Pan-xa đi theo làm giám mã." },
      { text: "Thấy những chiếc cối xay gió trên đồi, Đôn Ki-hô-tê tưởng đó là những gã khổng lồ. Ông phi ngựa lao vào đánh và bị cánh quạt hất văng xuống đất." },
      { text: "Xan-chô thực tế, hay nói những câu tục ngữ dân dã. Đôn Ki-hô-tê thì mơ mộng. Hai thầy trò khác nhau mà ngày càng thương nhau." },
      { text: "Cuối đời, Đôn Ki-hô-tê tỉnh ngộ và trở về nhà. Truyện vừa buồn cười vừa cảm động: ước mơ đẹp, nhưng ta cũng cần nhìn đúng sự thật." }
    ],
    question: "Đôn Ki-hô-tê mơ mộng, Xan-chô thì thực tế. Một nhóm bạn có cần cả hai kiểu người không? Vì sao?"
  },
  {
    id: "hai-van-dam", shelf: "kinh-dien", side: "tay",
    title: "Hai vạn dặm dưới đáy biển",
    author: "Jules Verne (1828–1905) · Pháp · Mở Sách tóm tắt",
    grade: "Lớp 5–9", minutes: "5 phút",
    color: "#2f5d50", accent: "#9fe0d0", art: "classic",
    summary: "Một “quái vật biển” hoá ra là tàu ngầm Nau-ti-lút của thuyền trưởng Nê-mô. Chuyến du hành kỳ thú dưới lòng đại dương.",
    pages: [
      { text: "Năm 1866, nhiều tàu biển gặp một “quái vật” khổng lồ phát sáng. Giáo sư A-rô-nắc, người giúp việc Công-xây và thợ săn cá voi Nét Len lên tàu đi tìm nó." },
      { text: "“Quái vật” hoá ra là chiếc tàu ngầm Nau-ti-lút, do thuyền trưởng Nê-mô bí ẩn chỉ huy. Ba người bị giữ lại trên tàu." },
      { text: "Họ cùng Nê-mô đi hai vạn dặm dưới biển: dạo trong rừng san hô, đi bộ dưới đáy biển bằng bộ đồ lặn, nhìn thấy thành phố chìm, đến tận Nam Cực và chiến đấu với bầy mực khổng lồ." },
      { text: "Nét Len nhớ đất liền, luôn tìm cách trốn. Cuối cùng, khi tàu bị cuốn vào một xoáy nước lớn, ba người thoát ra được và trở về nhà." },
      { text: "Vì sao là kinh điển? Jules Verne viết về tàu ngầm hiện đại từ khi nó chưa thực sự tồn tại. Trí tưởng tượng của ông đã truyền cảm hứng cho nhiều nhà khoa học sau này." }
    ],
    question: "Jules Verne tưởng tượng ra tàu ngầm trước khi nó có thật. Bạn tưởng tượng ra một phát minh nào cho tương lai? Nó giúp gì cho mọi người?"
  }
];

/* Bảng xếp hạng “Sách được đọc nhiều nhất tháng” (Không gian đọc).
   Cô cập nhật mỗi tháng: id sách + số lượt đọc. demo: true = số liệu minh hoạ. */
window.MS_TOP_BOOKS = {
  month: "Tháng 10/2026", demo: true,
  list: [
    { id: "cay-khe", reads: 48 },
    { id: "tay-du-ky", reads: 41 },
    { id: "cau-be-an-sach", reads: 36 },
    { id: "robinson", reads: 29 },
    { id: "alice", reads: 24 }
  ]
};
