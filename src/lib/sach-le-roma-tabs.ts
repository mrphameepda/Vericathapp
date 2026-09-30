import { Book, Scroll, FileText, HandHeart, Activity, Star, BookOpen } from 'lucide-react';

/**
 * Danh sách các Tab chính trong Sách Lễ Rôma.
 */
export const SACH_LE_ROMA_TABS = [
  { id: 'nghi-thuc-thanh-le', name: 'Nghi Thức Thánh Lễ', icon: Activity },
  { id: 'loi-nguyen', name: 'Lời Nguyện', icon: HandHeart },
  { id: 'bai-doc', name: 'Bài Đọc', icon: BookOpen },
  { id: 'dan-le-va-loi-nguyen-giao-dan', name: 'Dẫn Lễ và LN Giáo Dân', icon: Scroll },
  { id: 'kinh-tien-tung', name: 'Kinh Tiền Tụng', icon: Book },
  { id: 'kinh-nguyen-thanh-the', name: 'Kinh Nguyện Thánh Thể', icon: FileText },
  { id: 'phep-lanh-cuoi-le', name: 'Phép Lành Cuối Lễ', icon: Star },
  { id: 'thanh-le-co-nghi-thuc-rieng', name: 'Thánh Lễ Có Nghi Thức Riêng', icon: Scroll },
  { id: 'nghi-thuc-an-tang', name: 'Nghi Thức An Táng', icon: Activity },
];
