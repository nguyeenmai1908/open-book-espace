/* ==========================================================
   PHÒNG CHIẾU PHIM NGẮN — danh sách phim (sảnh 3D).
   Thêm phim: thêm 1 khối vào window.MS_FILMS. Mỗi phim đi theo 3 bước: Xem → Nghĩ → Viết.
   Gắn phim thật (chọn MỘT):
     youtube:  "mã video"           vd. "abc123XYZ" (phần sau watch?v=), phát qua youtube-nocookie
     video:    "assets/phim/x.mp4"  file phim đặt trong folder web
     facebook: "link bài/reel"      vd. "https://www.facebook.com/reel/123…" (bài phải để Công khai)
     vertical: true                 phim quay dọc (Reel, TikTok…): khung xem dựng đứng
     by:       "Phim của …"         chữ trên poster cho phim thật (thay nhãn MINH HOẠ)
   Để trống cả youtube/video/facebook = phim minh hoạ (demo: true): HS xem "kịch bản tranh" (scenes) thay cho phim.
   (22/10/2026: đã xoá 3 phim minh hoạ cũ; chỉ còn phim thật.)
   think: câu hỏi chạm chọn. Có "best" (số thứ tự đáp án, từ 0) thì có đáp án đúng;
          không có "best" thì là câu cảm nhận, đáp án nào cũng được, mỗi lựa chọn có lời đáp riêng.
   ========================================================== */
window.MS_FILMS = [
  {
    // Phim thật đầu tiên (Reel trang Mở Sách, 22/10/2026). Phần Nghĩ/Viết soạn theo chú thích bài đăng:
    // Mai xem lại cho khớp nội dung phim và thêm "scenes" (các cảnh chính) nếu muốn.
    id: "bon-nang-tien",
    title: "Bốn nàng tiên ở Vườn Sách",
    grade: "Lớp 2–6", minutes: "3 phút",
    color: "#3f8a4e", accent: "#ffc83d", art: "mua", by: "Phim Mở Sách",
    facebook: "https://www.facebook.com/reel/3830944940535274", vertical: true,
    summary: "Vào một ngày tháng 7 âm lịch, bốn nàng tiên Xuân, Hạ, Thu, Đông hẹn gặp nhau ở Vườn Sách.",
    scenes: [],
    think: [
      { q: "Xem xong, con thấy phim thế nào?", options: [
        { t: "Vui", r: "Cô cũng thấy vui! Bốn mùa gặp nhau thì náo nhiệt lắm." },
        { t: "Thú vị", r: "Đúng rồi, ai mà nghĩ bốn mùa lại hẹn nhau ở một vườn sách nhỉ." },
        { t: "Muốn xem lại", r: "Xem lại lần nữa đi con, lần hai thường thấy thêm nhiều chi tiết hay." }
      ] },
      { q: "Nếu được làm một nàng tiên trong phim, con chọn mùa nào?", options: [
        { t: "Mùa Xuân", r: "Mùa xuân có hoa đào, hoa mai, ấm áp. Con hợp với mùa xuân lắm!" },
        { t: "Mùa Hạ", r: "Mùa hạ có nắng, có phượng đỏ, được nghỉ hè đọc truyện. Tuyệt!" },
        { t: "Mùa Thu", r: "Mùa thu mát mẻ, lá vàng rơi, mùa tựu trường. Chọn hay đó con." },
        { t: "Mùa Đông", r: "Mùa đông lạnh, cuộn chăn đọc sách là nhất. Cô cũng thích!" }
      ] },
      { q: "Theo con, vì sao các nàng tiên hẹn nhau ở Vườn Sách?", options: [
        { t: "Để cùng đọc sách", r: "Có thể lắm! Đọc sách cùng bạn bè vui gấp đôi." },
        { t: "Để kể chuyện mùa của mình", r: "Hay ghê, mỗi mùa có bao nhiêu chuyện để kể." },
        { t: "Vì Vườn Sách đẹp", r: "Vườn Sách đẹp thật, có cây, có sách, ai cũng muốn ghé." }
      ] }
    ],
    write: { prompt: "Con thích mùa nào nhất trong năm? Viết 3–5 câu kể về mùa đó và một cuốn sách con muốn đọc vào mùa ấy." }
  },
  {
    // "Alike" (2015), phim hoạt hình ngắn không lời của Daniel Martínez Lara & Rafa Cano Méndez (Tây Ban Nha).
    // Bản YouTube này do kênh CGMeetup đăng lại. Thêm 22/10/2026; Mai xem lại phần Nghĩ/Viết.
    id: "alike",
    title: "Alike – Màu sắc của con",
    grade: "Lớp 3–9", minutes: "8 phút",
    color: "#6b7785", accent: "#ff8300", art: "alike", by: "Phim chọn lọc",
    youtube: "PDHIyrfMl_U",
    summary: "Phim hoạt hình không lời. Bố Copi và con trai Paste sống trong một thành phố xám, ngày nào cũng vội vã như nhau. Paste rực rỡ màu sắc và rất mê âm nhạc… cho đến khi màu sắc ấy nhạt dần.",
    scenes: [
      "Thành phố xám xịt, ai cũng vội vã làm những việc giống hệt nhau mỗi ngày.",
      "Bố Copi đi làm, con trai Paste đi học. Paste rực rỡ màu sắc và rất mê âm nhạc.",
      "Trên đường, Paste hay dừng lại nghe một người chơi vĩ cầm trong công viên.",
      "Ngày qua ngày lặp lại, màu sắc trên người Paste nhạt dần.",
      "Bố nhận ra con đã thay đổi, và tìm cách mang niềm vui, màu sắc trở lại cho con."
    ],
    think: [
      { q: "Xem xong, con thấy thế nào?", options: [
        { t: "Xúc động", r: "Cô cũng vậy. Phim không có lời nào mà vẫn làm mình thấy thương hai bố con." },
        { t: "Hơi buồn", r: "Đúng là lúc Paste mất màu sắc nhìn buồn lắm. Cảm xúc nào cũng đáng ghi lại." },
        { t: "Vui ở cuối phim", r: "Cái kết làm mình nhẹ lòng hẳn, phải không con?" }
      ] },
      { q: "Theo con, màu sắc trong phim tượng trưng cho điều gì?", best: 2, options: [
        { t: "Quần áo đẹp", r: "Phim không nói về quần áo đâu con. Thử nhìn lúc Paste mất màu, cậu đang cảm thấy gì?" },
        { t: "Thời tiết nắng hay mưa", r: "Chưa đúng rồi. Màu sắc thay đổi theo cảm xúc của nhân vật, không theo thời tiết." },
        { t: "Niềm vui và sự sáng tạo của mỗi người", r: "Chuẩn! Paste rực rỡ khi được làm điều mình yêu thích, và nhạt màu khi phải sống giống hệt mọi người." }
      ] },
      { q: "Vì sao màu sắc của Paste nhạt dần?", best: 0, options: [
        { t: "Vì cậu không còn được làm điều mình yêu thích", r: "Đúng rồi! Ngày nào cũng lặp lại, không có âm nhạc, Paste mất dần niềm vui." },
        { t: "Vì cậu bị ốm", r: "Phim không nói Paste bị ốm. Thử nghĩ về những việc cậu phải làm mỗi ngày nhé." },
        { t: "Vì trời tối", r: "Không phải đâu con. Màu sắc trong phim gắn với cảm xúc của nhân vật." }
      ] }
    ],
    write: { prompt: "Điều gì làm con thấy mình “rực rỡ màu sắc” nhất? Viết 3–5 câu kể về sở thích ấy và vì sao con muốn giữ nó." }
  },
  {
    // "The Present" (2014), phim hoạt hình ngắn của Jacob Frey (Filmakademie Baden-Württemberg, kênh chính thức),
    // dựa trên truyện tranh của Fabio Coala. Thêm 22/10/2026; Mai xem lại phần Nghĩ/Viết.
    id: "the-present",
    title: "The Present – Món quà",
    grade: "Lớp 3–9", minutes: "4 phút",
    color: "#2c6e8f", accent: "#e53935", art: "qua", by: "Phim chọn lọc",
    youtube: "3XA0bB79oGc",
    summary: "Một cậu bé suốt ngày ngồi trong nhà chơi điện tử. Một hôm, mẹ mang về cho cậu một món quà bất ngờ: chú chó con.",
    scenes: [
      "Cậu bé ngồi lì trong căn phòng tối, mải mê chơi điện tử.",
      "Mẹ mang về một chiếc hộp. Bên trong là một chú chó con.",
      "Cậu bé reo lên vui sướng, rồi khựng lại: chú chó chỉ có ba chân.",
      "Cậu đặt chú chó xuống, quay lại chơi game. Chú chó vẫn hăng hái chơi với quả bóng đỏ.",
      "Nhìn chú chó ngã rồi lại đứng dậy chơi tiếp, cậu bé dần mỉm cười.",
      "Cậu đứng dậy chống nạng, cùng chú chó ra sân chơi. Hoá ra cậu cũng chỉ có một chân."
    ],
    think: [
      { q: "Đến cảnh cuối, con thấy thế nào?", options: [
        { t: "Bất ngờ", r: "Cô cũng bất ngờ lắm! Phim giấu chi tiết ấy đến tận phút cuối." },
        { t: "Xúc động", r: "Cảnh hai bạn cùng ra sân chơi làm mình thấy ấm lòng, phải không con?" },
        { t: "Vui", r: "Đúng rồi, cuối cùng cậu bé cũng chịu ra ngoài chơi. Vui ghê!" }
      ] },
      { q: "Vì sao lúc đầu cậu bé không muốn chơi với chú chó?", best: 1, options: [
        { t: "Vì cậu không thích chó", r: "Lúc mở hộp cậu reo lên vui sướng mà. Thử xem lại khoảnh khắc cậu khựng lại nhé." },
        { t: "Vì thấy chú chó thiếu một chân", r: "Đúng rồi. Cậu thấy chú chó “không hoàn hảo” nên quay đi." },
        { t: "Vì chú chó quá ồn", r: "Phim không nói vậy đâu con. Điều gì làm cậu bé thay đổi nét mặt?" }
      ] },
      { q: "Chú chó đã giúp cậu bé hiểu ra điều gì?", best: 0, options: [
        { t: "Thiếu một chân vẫn có thể vui chơi hết mình", r: "Chuẩn! Chú chó ngã rồi lại đứng dậy chơi tiếp, và cậu bé nhìn thấy chính mình trong đó." },
        { t: "Chơi điện tử là vui nhất", r: "Cuối phim cậu bé tắt game và ra sân đó con. Thử nghĩ lại nhé." },
        { t: "Phải có đủ đồ chơi mới vui", r: "Chú chó chỉ cần một quả bóng đỏ thôi mà vẫn vui lắm." }
      ] }
    ],
    write: { prompt: "Con có từng đánh giá một người (hay một con vật) chỉ qua vẻ bề ngoài rồi sau đó nghĩ khác đi không? Viết 3–5 câu kể lại, có thể lấy cậu bé trong phim làm ví dụ." }
  }
];
