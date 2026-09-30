/**
 * DỊCH VỤ & MÔ HÌNH DỮ LIỆU MỤC VỤ CÔNG GIÁO (VERICATH TYPES)
 */

// --- 1. KINHS THÁNH (BIBLE) ---
export interface UnifiedVerse {
  verseNumber: number;
  textVi?: string;
  textEn?: string;
  viHeadings?: string[];
  enHeadings?: string[];
}

export interface ChapterData {
  book: string;
  chapter: number;
  verses: UnifiedVerse[];
  footnotesVi?: Record<string, string>;
  missingSecondaryBook?: boolean;
}

export interface BookMappingItem {
  id: string;
  vi: string;
  en: string;
  abbr: string;
  testament: 'OT' | 'NT';
  totalChapters: number;
  group: string;
}

// --- 2. LỜI CHÚA HẰNG NGÀY & PHỤNG VỤ (DAILY READINGS & LITURGY) ---
export interface LiturgyDay {
  ngay: string;
  thang: number;
  nam: number;
  thu: string;
  slug: string;
  ten_le: string | null;
  mua_phung_vu: string | null;
  tuan: string | null;
  mau_sac: string;
  bac_le: string | null;
  bai_doc_1: { ma_dinh_danh: string | null; trich_dan: string | null };
  bai_doc_2?: { ma_dinh_danh: string | null; trich_dan: string | null };
  dap_ca: { ma_dinh_danh: string | null; trich_dan: string | null };
  phuc_am: { ma_dinh_danh: string | null; trich_dan: string | null };
  nguon_url: string;
  xem_bai_doc_hom_nay: { ma_dinh_danh: string; duong_dan: string };
}

export interface LoiChuaDay {
  ma_dinh_danh: string;
  tieu_de: string;
  nguon_url: string;
  thong_tin_ngay: {
    ngay: string | null;
    mua_phung_vu: string | null;
    tuan: string | null;
    thu: string | null;
    mau_sac: string | null;
    bac_le: string | null;
  };
  ca_nhap_le?: string;
  loi_nguyen_nhap_le?: string;
  bai_doc: {
    bai_doc_1?: { trich_dan: string; chu_de?: string; noi_dung: string; ghi_chu?: string };
    bai_doc_1_nam_2?: { trich_dan: string; chu_de?: string; noi_dung: string; ghi_chu?: string };
    bai_doc_2?: { trich_dan: string; chu_de?: string; noi_dung: string; ghi_chu?: string };
    dap_ca?: { trich_dan: string; cau_dap?: string; cac_cau_xuong?: string[]; ghi_chu?: string };
    dap_ca_nam_2?: { trich_dan: string; cau_dap?: string; cac_cau_xuong?: string[]; ghi_chu?: string };
    alleluia?: { trich_dan: string; noi_dung?: string; ghi_chu?: string };
    phuc_am?: { trich_dan: string; chu_de?: string; noi_dung: string; ghi_chu?: string };
  };
  loi_nguyen_tien_le?: string;
  ca_hiep_le?: string;
  loi_nguyen_hiep_le?: string;
}

// --- 3. BÀI VIẾT MỤC VỤ VERICATH (POSTS) ---
export interface WPPostItem {
  id: number;
  title: string;
  link: string;
  date: string;
  categoryName: string;
  authorName: string;
  imageUrl: string;
  content: string;
}
