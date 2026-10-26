/* ==========================================================
   SẢNH 3D MỞ SÁCH — daily-content.js
   Kho câu đố cho bục "Thử thách tiếng Việt" ở sảnh chính: ca dao, tục ngữ, thành ngữ, từ vựng, cách dùng từ.
   Viết cho cả học sinh tiểu học. Mỗi lần ghé bục rút 3 câu CHƯA gặp (2 trắc nghiệm + 1 xếp chữ);
   gặp hết kho thì quay vòng lại từ đầu.

   Hai dạng câu:
   1) Trắc nghiệm: { q: "câu hỏi", options: ["đáp án ĐÚNG", "sai", "sai", "sai"], why: "giải thích ngắn" }
      (đáp án đúng luôn để đầu tiên; khi hiện ra sẽ được xáo trộn)
   2) Xếp chữ kiểu Vua tiếng Việt: { type: "xep", answer: "thư viện", hint: "gợi ý", why: "giải thích" }
      - mặc định xếp CHỮ CÁI thành từ (dấu thanh giữ nguyên trên chữ cái)
      - unit: "word" thì xếp TỪNG TIẾNG thành câu ca dao, tục ngữ (answer viết thường, không dấu câu)
   Kho càng nhiều câu thì học trò càng lâu gặp lại câu cũ.
   ========================================================== */
(function () {
  var MS3D = window.MS3D = window.MS3D || {};
  MS3D.DAILY_QUIZ = [
    /* ----- Ca dao, tục ngữ: điền từ còn thiếu ----- */
    { q: "Điền từ còn thiếu: “Uống nước nhớ …”", options: ["nguồn", "sông", "mưa", "giếng"], why: "Uống nước nhớ nguồn: nhớ ơn những người đã làm nên điều tốt cho mình." },
    { q: "Điền từ còn thiếu: “Có công mài sắt, có ngày nên …”", options: ["kim", "dao", "búa", "đinh"], why: "Kiên trì mài mãi thì thanh sắt cũng thành cây kim: chăm chỉ ắt thành công." },
    { q: "“Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi …”", options: ["cao", "xanh", "to", "đẹp"], why: "Câu ca dao khuyên chúng ta đoàn kết thì sẽ làm được việc lớn." },
    { q: "“Bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng chung một …”", options: ["giàn", "nhà", "vườn", "cây"], why: "Bầu và bí cùng leo một giàn, như người cùng một đất nước phải thương nhau." },
    { q: "“Công cha như núi Thái Sơn, nghĩa mẹ như nước trong … chảy ra”", options: ["nguồn", "sông", "biển", "hồ"], why: "Công cha cao như núi, nghĩa mẹ dạt dào như nước từ nguồn chảy ra không bao giờ cạn." },
    { q: "Điền từ còn thiếu: “Gần mực thì đen, gần đèn thì …”", options: ["rạng", "tối", "mờ", "nóng"], why: "Chơi với bạn tốt thì mình cũng tốt lên, như đứng gần đèn thì được sáng." },
    { q: "Điền từ còn thiếu: “Lá lành đùm lá …”", options: ["rách", "xanh", "vàng", "khô"], why: "Người khá hơn giúp đỡ, che chở người gặp khó khăn." },
    { q: "Điền từ còn thiếu: “Tốt gỗ hơn tốt nước …”", options: ["sơn", "màu", "mưa", "giếng"], why: "Phẩm chất bên trong quý hơn vẻ đẹp bên ngoài." },
    { q: "“Đi một ngày đàng, học một … khôn”", options: ["sàng", "ngày", "thúng", "rổ"], why: "Đi nhiều nơi, gặp nhiều người thì học được nhiều điều hay." },
    { q: "“Chuồn chuồn bay thấp thì mưa, bay cao thì nắng, bay … thì râm”", options: ["vừa", "xa", "nhanh", "chậm"], why: "Ông bà ta nhìn chuồn chuồn bay để đoán thời tiết." },
    { q: "“Nhiễu điều phủ lấy giá gương, người trong một nước phải … nhau cùng”", options: ["thương", "giận", "quên", "tránh"], why: "Người cùng một đất nước phải yêu thương, đùm bọc nhau." },
    { q: "Điền từ còn thiếu: “Thương người như thể thương …”", options: ["thân", "cây", "hoa", "trời"], why: "Hãy thương người khác như thương chính bản thân mình." },
    { q: "Điền từ còn thiếu: “Học thầy không tày học …”", options: ["bạn", "sách", "chữ", "vở"], why: "Học hỏi từ bạn bè cũng quan trọng không kém học thầy." },
    { q: "Điền từ còn thiếu: “Có chí thì …”", options: ["nên", "thua", "mệt", "ngủ"], why: "Có ý chí, quyết tâm thì sẽ làm nên việc." },
    { q: "Câu nào nói về kinh nghiệm xem thời tiết?", options: ["Mau sao thì nắng, vắng sao thì mưa", "Ăn quả nhớ kẻ trồng cây", "Lá lành đùm lá rách", "Có chí thì nên"], why: "Đêm nhiều sao thì hôm sau nắng, ít sao thì dễ mưa." },
    { q: "Câu tục ngữ “Ăn quả nhớ kẻ trồng cây” khuyên ta điều gì?", options: ["Biết ơn người đã giúp mình", "Chăm trồng cây ăn quả", "Ăn nhiều trái cây", "Tiết kiệm thức ăn"], why: "“Quả” là điều tốt mình được hưởng, “kẻ trồng cây” là người làm ra nó." },
    { q: "Câu “Không thầy đố mày làm nên” đề cao ai?", options: ["Người thầy", "Cha mẹ", "Bạn bè", "Hàng xóm"], why: "Muốn thành công cần có thầy dạy dỗ, dẫn đường." },

    /* ----- Thành ngữ: hiểu nghĩa ----- */
    { q: "“Nhanh như cắt” nghĩa là gì?", options: ["Rất nhanh", "Rất sắc", "Cắt cỏ nhanh", "Chậm chạp"], why: "“Cắt” ở đây là chim cắt, bay lao rất nhanh." },
    { q: "Thành ngữ “Mẹ tròn con vuông” chỉ điều gì?", options: ["Mẹ và em bé đều khoẻ mạnh sau khi sinh", "Mẹ béo, con gầy", "Đồ chơi hình tròn và vuông", "Mẹ con giống hệt nhau"], why: "Đây là lời chúc khi một em bé chào đời bình an." },
    { q: "“Ếch ngồi đáy giếng” chỉ người như thế nào?", options: ["Hiểu biết ít mà tưởng mình giỏi", "Rất thích bơi lội", "Sống ở vùng quê", "Hay ngồi một chỗ"], why: "Ếch ở đáy giếng tưởng bầu trời chỉ to bằng miệng giếng." },
    { q: "Thành ngữ “Nước đổ đầu vịt” nói về điều gì?", options: ["Dạy mãi mà không vào", "Trời mưa rất to", "Làm việc rất nhanh", "Con vịt bơi giỏi"], why: "Nước đổ lên lông vịt trôi tuột đi, như lời khuyên không được nghe." },
    { q: "“Đầu voi đuôi chuột” chỉ cách làm việc thế nào?", options: ["Lúc đầu rầm rộ, về sau qua loa", "Làm chăm chỉ từ đầu đến cuối", "Nuôi nhiều con vật", "Vẽ con vật thật to"], why: "Mở đầu to như đầu voi, kết thúc nhỏ xíu như đuôi chuột." },
    { q: "“Chân cứng đá mềm” là lời chúc gì?", options: ["Đi đường bình an, vượt mọi khó khăn", "Học thật giỏi", "Ăn thật ngon", "Ngủ thật say"], why: "Chân cứng đến mức đá cũng phải mềm: chúc người đi xa vững vàng." },
    { q: "“Một nắng hai sương” nói về điều gì?", options: ["Sự vất vả của người lao động", "Thời tiết thất thường", "Trời nắng một ngày", "Sương mù buổi sáng"], why: "Làm lụng từ lúc sương sớm đến khi nắng gắt rồi sương đêm." },
    { q: "Điền từ còn thiếu: “Hiền như …”", options: ["bụt", "cọp", "lửa", "gió"], why: "“Hiền như bụt” khen người rất hiền lành, tốt bụng." },
    { q: "Điền từ còn thiếu: “Khoẻ như …”", options: ["voi", "sên", "kiến", "muỗi"], why: "Voi là con vật to khoẻ, nên ta nói “khoẻ như voi”." },
    { q: "Điền từ còn thiếu: “Chậm như …”", options: ["rùa", "sóc", "thỏ", "ngựa"], why: "Rùa bò rất chậm nên ta nói “chậm như rùa”." },

    /* ----- Từ vựng: đồng nghĩa, trái nghĩa, nghĩa của từ ----- */
    { q: "Từ nào trái nghĩa với “siêng năng”?", options: ["lười biếng", "chăm chỉ", "cần cù", "chịu khó"], why: "Chăm chỉ, cần cù, chịu khó đều gần nghĩa với siêng năng." },
    { q: "Từ nào gần nghĩa với “nhanh nhẹn”?", options: ["lanh lẹ", "chậm chạp", "uể oải", "lề mề"], why: "Lanh lẹ và nhanh nhẹn đều chỉ sự mau lẹ, hoạt bát." },
    { q: "Từ nào cùng nghĩa với “Tổ quốc”?", options: ["đất nước", "làng xóm", "trường học", "gia đình"], why: "Tổ quốc là đất nước của mình." },
    { q: "Từ nào trái nghĩa với “dũng cảm”?", options: ["hèn nhát", "gan dạ", "can đảm", "anh dũng"], why: "Gan dạ, can đảm, anh dũng đều gần nghĩa với dũng cảm." },
    { q: "“Thiếu nhi” là chỉ ai?", options: ["Trẻ em", "Người già", "Thầy cô", "Bộ đội"], why: "Thiếu nhi là các em nhỏ, như Tết Thiếu nhi 1 tháng 6." },
    { q: "Từ nào là từ Hán Việt có nghĩa là “sông núi”?", options: ["giang sơn", "ruộng đồng", "nhà cửa", "cây cối"], why: "“Giang” là sông, “sơn” là núi." },
    { q: "Từ “chân” trong câu nào mang nghĩa gốc?", options: ["Bé bị đau chân.", "Chân bàn bị gãy.", "Nhà ở dưới chân núi.", "Chân trời ửng hồng."], why: "Nghĩa gốc của “chân” là bộ phận cơ thể; các câu kia là nghĩa chuyển." },
    { q: "Từ nào là từ láy?", options: ["lấp lánh", "bàn ghế", "sách vở", "quần áo"], why: "“Lấp lánh” lặp lại âm đầu l; ba từ kia là từ ghép." },
    { q: "Từ nào là từ ghép?", options: ["xe đạp", "long lanh", "ríu rít", "lom khom"], why: "“Xe đạp” ghép hai tiếng có nghĩa; ba từ kia là từ láy." },
    { q: "Từ nào không cùng nhóm với các từ còn lại?", options: ["con mèo", "thước kẻ", "bút chì", "cục tẩy"], why: "Thước kẻ, bút chì, cục tẩy là đồ dùng học tập." },
    { q: "Từ nào tả tiếng chim hót?", options: ["líu lo", "lộp độp", "ầm ầm", "róc rách"], why: "Lộp độp là tiếng mưa, ầm ầm là tiếng sấm, róc rách là tiếng suối." },
    { q: "Điền từ: “Tiếng mưa rơi … trên mái tôn.”", options: ["lộp độp", "líu lo", "khúc khích", "ríu rít"], why: "“Lộp độp” là tiếng hạt mưa to rơi xuống mái." },

    /* ----- Cách dùng từ, chính tả ----- */
    { q: "Từ nào hợp nhất: “Nhân dịp Tết, em … ông bà một hộp bánh.”", options: ["biếu", "cho", "ném", "bán"], why: "Với người lớn tuổi, dùng “biếu” để thể hiện sự lễ phép." },
    { q: "Điền từ: “Mặt trời … sau dãy núi.”", options: ["lặn", "chìm", "rơi", "ngủ"], why: "Ta nói mặt trời mọc ở đằng đông và lặn ở đằng tây." },
    { q: "Điền từ chỉ đơn vị đúng: “một … sách”", options: ["cuốn", "con", "quả", "củ"], why: "Ta nói một cuốn sách (hoặc một quyển sách)." },
    { q: "Từ nào viết đúng chính tả?", options: ["sạch sẽ", "sạch sẻ", "xạch sẽ", "sạch xẽ"], why: "Viết là “sạch sẽ”: cả hai tiếng đều bắt đầu bằng s, “sẽ” có dấu ngã." },
    { q: "Từ nào viết đúng chính tả?", options: ["dành dụm", "giành dụm", "rành dụm", "dành giụm"], why: "“Dành dụm” là để dành từng chút; “giành” là tranh lấy." },
    { q: "Từ nào viết đúng chính tả?", options: ["xinh xắn", "sinh xắn", "xinh sắn", "sinh sắn"], why: "Viết là “xinh xắn”, cả hai tiếng bắt đầu bằng x." },
    { q: "Từ nào viết đúng chính tả?", options: ["trân trọng", "chân trọng", "trân chọng", "chân chọng"], why: "Viết là “trân trọng”, cả hai tiếng bắt đầu bằng tr." },
    { q: "Từ nào viết đúng chính tả?", options: ["chăm chỉ", "trăm chỉ", "chăm trỉ", "trăm trỉ"], why: "Cả hai tiếng đều viết với “ch”: chăm chỉ." },
    { q: "Câu “Ông trời mặc áo giáp đen ra trận” dùng cách nói nào?", options: ["Nhân hoá", "So sánh", "Liệt kê", "Điệp từ"], why: "Trời được gọi là “ông”, biết “mặc áo”, “ra trận” như con người." },
    { q: "Câu “Mặt trời xuống biển như hòn lửa” dùng cách nói nào?", options: ["So sánh", "Nhân hoá", "Liệt kê", "Điệp từ"], why: "Có từ “như” so sánh mặt trời với hòn lửa." },
    { q: "Câu nào là câu cảm thán?", options: ["Ôi, cánh đồng lúa đẹp quá!", "Cánh đồng lúa đã chín.", "Bạn đã ra đồng chưa?", "Hãy ra đồng xem lúa."], why: "Câu cảm thán bộc lộ cảm xúc, thường có “ôi”, “quá” và dấu chấm than." },

    /* ----- Vua tiếng Việt: xếp chữ cái thành từ ----- */
    { type: "xep", answer: "thư viện", hint: "Nơi có thật nhiều sách để mượn đọc", why: "Thư viện: “thư” là sách, “viện” là nơi chốn." },
    { type: "xep", answer: "học sinh", hint: "Em đến trường mỗi ngày, em là …", why: "Học sinh là người đi học ở trường." },
    { type: "xep", answer: "cầu vồng", hint: "Dải bảy màu hiện trên trời sau cơn mưa", why: "Cầu vồng có bảy màu: đỏ, cam, vàng, lục, lam, chàm, tím." },
    { type: "xep", answer: "gia đình", hint: "Bố, mẹ và em cùng sống chung một nhà", why: "Gia đình là tổ ấm của mỗi người." },
    { type: "xep", answer: "quê hương", hint: "Nơi em sinh ra và lớn lên", why: "“Quê hương là chùm khế ngọt…”" },
    { type: "xep", answer: "chăm chỉ", hint: "Trái nghĩa với lười biếng", why: "Chăm chỉ nghĩa là siêng năng, chịu khó." },
    { type: "xep", answer: "biết ơn", hint: "Uống nước nhớ nguồn là phải biết …", why: "Biết ơn là nhớ công lao của người đã giúp mình." },
    { type: "xep", answer: "đoàn kết", hint: "Một cây làm chẳng nên non, ba cây chụm lại …", why: "Đoàn kết là cùng nhau chung sức." },
    { type: "xep", answer: "kiên nhẫn", hint: "Có công mài sắt có ngày nên kim", why: "Kiên nhẫn là bền bỉ, không bỏ cuộc giữa chừng." },
    { type: "xep", answer: "từ điển", hint: "Cuốn sách để tra nghĩa của từ", why: "Gặp từ khó, em hãy tra từ điển nhé." },
    { type: "xep", answer: "sáng tạo", hint: "Nghĩ ra cái mới, cách làm mới", why: "Sáng tạo là tạo ra điều mới mẻ." },
    { type: "xep", answer: "trung thực", hint: "Thật thà, không nói dối", why: "Trung thực là ngay thẳng, thật thà." },
    { type: "xep", answer: "ông sao", hint: "Đèn … năm cánh rước đêm Trung thu", why: "Đèn ông sao là đồ chơi truyền thống dịp Trung thu." },
    { type: "xep", answer: "bánh chưng", hint: "Bánh vuông gói lá dong ngày Tết", why: "Bánh chưng gắn với truyền thuyết Lang Liêu." },
    { type: "xep", answer: "hoa sen", hint: "Loài hoa mọc trong đầm, “gần bùn mà chẳng hôi tanh”", why: "“Trong đầm gì đẹp bằng sen…”" },

    /* ----- Vua tiếng Việt: xếp các tiếng thành câu ca dao, tục ngữ ----- */
    { type: "xep", unit: "word", answer: "ăn vóc học hay", hint: "Câu tục ngữ khuyên chăm học: ăn thì khoẻ, học thì giỏi", why: "Ăn vóc học hay: ăn uống cho khoẻ người, học hành cho giỏi giang." },
    { type: "xep", unit: "word", answer: "chị ngã em nâng", hint: "Anh chị em trong nhà giúp đỡ nhau", why: "Khi người thân gặp khó, mình đỡ người ấy đứng dậy." },
    { type: "xep", unit: "word", answer: "tiên học lễ hậu học văn", hint: "Học lễ phép trước, học chữ sau", why: "“Tiên” là trước, “hậu” là sau." },
    { type: "xep", unit: "word", answer: "đói cho sạch rách cho thơm", hint: "Dù nghèo khó vẫn giữ mình trong sạch", why: "Hoàn cảnh khó khăn vẫn sống tử tế, đàng hoàng." },
    { type: "xep", unit: "word", answer: "ăn ngay nói thẳng", hint: "Sống thật thà, ngay thẳng", why: "Ăn ngay nói thẳng: không gian dối, quanh co." },
    { type: "xep", unit: "word", answer: "kính trên nhường dưới", hint: "Lễ phép với người lớn, nhường nhịn em nhỏ", why: "Kính trọng người trên, nhường nhịn người dưới." },
    { type: "xep", unit: "word", answer: "anh em như thể tay chân", hint: "Câu ca dao về tình anh em ruột thịt", why: "Anh em gắn bó với nhau như tay với chân trên một cơ thể." },
    { type: "xep", unit: "word", answer: "giấy rách phải giữ lấy lề", hint: "Dù khó khăn vẫn giữ nề nếp, phẩm giá", why: "Tờ giấy rách vẫn phải giữ lấy lề, như người dù khó vẫn giữ nếp tốt." },
    { type: "xep", unit: "word", answer: "một con ngựa đau cả tàu bỏ cỏ", hint: "Một người gặp nạn, cả tập thể cùng lo", why: "Câu tục ngữ nói về tình thương, sự đồng cảm trong tập thể." }
  ];
})();
