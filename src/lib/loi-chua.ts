import fs from 'fs';
import path from 'path';
import { getDayLiturgy, LiturgyDay } from './liturgy';

/**
 * Cấu trúc bài đọc Lời Chúa Hằng Ngày theo Phụng vụ Công giáo.
 */
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

/**
 * Lấy chuỗi ngày hôm nay theo định dạng YYYY-MM-DD chuẩn múi giờ Việt Nam.
 */
export function getTodayDateStr(timeZone = 'Asia/Ho_Chi_Minh'): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * Lấy nội dung Lời Chúa theo ngày (YYYY-MM-DD) hoặc theo mã định danh (slug).
 */
export function getLoiChuaByDate(dateOrSlug: string): { liturgy: LiturgyDay | null; readings: LoiChuaDay | null; error?: string } {
  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(dateOrSlug);
  let ma_dinh_danh = dateOrSlug;
  let liturgy: LiturgyDay | null = null;

  if (isDate) {
    liturgy = getDayLiturgy(dateOrSlug);
    if (!liturgy) return { liturgy: null, readings: null, error: 'Không tìm thấy dữ liệu lịch phụng vụ cho ngày này.' };
    ma_dinh_danh = liturgy.xem_bai_doc_hom_nay?.ma_dinh_danh || '';
    if (!ma_dinh_danh) return { liturgy, readings: null, error: 'Bài đọc cho ngày này đang được cập nhật.' };
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'loi-chua-hom-nay', 'days', `${ma_dinh_danh}.json`);
  if (!fs.existsSync(filePath)) {
    return { liturgy, readings: null, error: isDate ? 'Bài đọc cho ngày này đang được cập nhật.' : 'Không tìm thấy bài đọc này.' };
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!isDate) {
      liturgy = {
        ngay: data.thong_tin_ngay?.ngay || dateOrSlug,
        thu: data.thong_tin_ngay?.thu || '',
        mua_phung_vu: data.thong_tin_ngay?.mua_phung_vu || '',
        tuan: data.thong_tin_ngay?.tuan || '',
        mau_sac: data.thong_tin_ngay?.mau_sac || '',
        bac_le: data.thong_tin_ngay?.bac_le || '',
        ten_le: data.tieu_de || '',
      } as LiturgyDay;
    }
    return { liturgy, readings: data };
  } catch {
    return { liturgy, readings: null, error: 'Lỗi hệ thống khi đọc dữ liệu.' };
  }
}

/**
 * Cấu trúc mục lục bài đọc.
 */
export interface ReadingIndexItem {
  ma_dinh_danh: string;
  tieu_de: string;
  thong_tin_ngay: {
    ngay: string | null;
    mua_phung_vu: string | null;
    tuan: string | null;
    thu: string | null;
    mau_sac: string | null;
    bac_le: string | null;
  };
}

/**
 * Lấy danh sách mục lục tất cả bài đọc Lời Chúa Hằng Ngày.
 */
export function getReadingIndex(): ReadingIndexItem[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'loi-chua-hom-nay', 'index.json');
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}
