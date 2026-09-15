LỜI CHÚA MỖI NGÀY — TỔNG GIÁO PHẬN HÀ NỘI (DỮ LIỆU JSON)
Nguồn: https://www.tonggiaophanhanoi.org/loi-chua-moi-ngay/
Tổng số bài (ngày): 613

CẤU TRÚC THƯ MỤC
- loi-chua-moi-ngay.json : mảng chứa toàn bộ 613 ngày.
- index.json            : danh sách tóm tắt (mã định danh, tiêu đề, thông tin ngày).
- days/<ma_dinh_danh>.json : mỗi ngày là 1 file độc lập (mã định danh = slug từ nguồn).

SCHEMA MỖI NGÀY
{
  "ma_dinh_danh": "chua-nhat-i-mua-vong-nam-a",   // định danh duy nhất của ngày
  "tieu_de": "...",
  "nguon_url": "...",
  "thong_tin_ngay": {
     "ngay": "01/01" | null,          // ngày dd/mm (lễ kính thánh)
     "mua_phung_vu": "Mùa Vọng" | ...,
     "tuan": "I".."XXXIV" | null,
     "thu": "Chúa Nhật" | "Thứ Hai" ... | null,
     "mau_sac": "Tím" | ...,
     "bac_le": "Chúa Nhật" | "Trọng" | "Nhớ" | ...
  },
  "ca_nhap_le": "...",
  "loi_nguyen_nhap_le": "...",
  "bai_doc": {
     "bai_doc_1":       { "ma_dinh_danh": "is-2-1-5", "trich_dan": "Is 2, 1-5", "chu_de": "...", "noi_dung": "..." },
     "bai_doc_1_nam_2": { ... },      // (tùy chọn) bài đọc I năm II cho ngày thường
     "bai_doc_2":       { ... },      // (tùy chọn) chỉ có ở Chúa Nhật / lễ trọng
     "dap_ca":          { "ma_dinh_danh": "tv-121-1-9", "trich_dan": "...", "cau_dap": "...", "cac_cau_xuong": ["...", "..."] },
     "dap_ca_nam_2":    { ... },      // (tùy chọn)
     "alleluia":        { "ma_dinh_danh": "tv-84-8", "trich_dan": "...", "noi_dung": "..." },
     "phuc_am":         { "ma_dinh_danh": "mt-24-37-44", "trich_dan": "...", "chu_de": "...", "noi_dung": "..." }
  },
  "loi_nguyen_tien_le": "...",
  "ca_hiep_le": "...",
  "loi_nguyen_hiep_le": "..."
}

QUY TẮC MÃ ĐỊNH DANH BÀI ĐỌC (ma_dinh_danh)
  <sách>-<chương>-<câu đầu>[-<câu cuối>]  (không dấu, viết thường)
  Ví dụ: "Is 2, 1-5" -> "is-2-1-5" ; "Tv 84, 8" -> "tv-84-8" ; "Mt 24, 37-44" -> "mt-24-37-44".

ĐÃ LOẠI BỎ THEO YÊU CẦU
- Phần "Suy niệm" / bài giảng chú giải.
- Phần "Lời tiền tụng" của các mùa.
- (Ngoài ra cũng bỏ: dẫn nhập, lời nguyện tín hữu, link MP3/PowerPoint, menu/danh mục.)

GHI CHÚ
- Một số lễ nhớ các thánh dùng "bài đọc theo ngày trong tuần" nên không có bài đọc/Phúc Âm riêng;
  khi đó trường tương ứng có { "ghi_chu": "Theo ngày trong tuần" } hoặc được bỏ trống.
