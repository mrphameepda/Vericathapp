import Link from 'next/link';
import {
  BookOpen,
  Search,
  BookMarked,
  Scale,
  Book,
  Calendar,
  ScrollText,
  Heart,
  Sunrise,
  Image as ImageIcon,
  ChevronRight,
} from 'lucide-react';
import { getDayLiturgy, getWeekLiturgy } from '@/lib/liturgy';
import VericathArticles from '@/components/VericathArticles';
import KinhPhungVuSection from '@/components/KinhPhungVuSection';
import PhungVuTuanNayWidget from '@/components/PhungVuTuanNayWidget';
import { getVericathPosts } from '@/lib/vericath';

export const metadata = {
  title: 'Vericath - Kho tàng tra cứu & học thuật Công Giáo',
  description: 'Cổng thông tin, tra cứu và học thuật Công Giáo.',
};

export default async function Home() {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const y = currentDate.getFullYear();
  const m = String(currentDate.getMonth() + 1).padStart(2, '0');
  const d = String(currentDate.getDate()).padStart(2, '0');
  const dateStringStr = `${y}-${m}-${d}`;

  const todayLiturgy = getDayLiturgy(dateStringStr);
  const weekLiturgy = getWeekLiturgy(dateStringStr);

  // Fetch posts on the server side
  const [block1Posts, block2Posts] = await Promise.all([
    getVericathPosts('281,27,55,48,56'),
    getVericathPosts('51,53,42', 10, '51'),
  ]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors duration-200">
      
      {/* 1. HERO SECTION: ARTICLES & LITURGY WEEK */}
      <section className="bg-stone-50 dark:bg-stone-900 text-gray-900 dark:text-gray-100 pt-8 pb-12 px-4 sm:px-8 border-b border-gray-200 dark:border-gray-800 relative overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Daily liturgical info banner */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              {todayLiturgy?.mau_sac && (
                <span
                  className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                    todayLiturgy.mau_sac === 'Tím'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                      : todayLiturgy.mau_sac === 'Trắng'
                      ? 'bg-gray-200 text-gray-800 dark:bg-gray-100 dark:text-gray-900'
                      : todayLiturgy.mau_sac === 'Đỏ'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  Màu Phụng Vụ: {todayLiturgy.mau_sac}
                </span>
              )}
              <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">
                {todayLiturgy?.ten_le || todayLiturgy?.mua_phung_vu || todayLiturgy?.tuan || 'Hôm Nay'}
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-medium sm:hidden line-clamp-1 max-w-[200px]">
                {todayLiturgy?.ten_le || todayLiturgy?.mua_phung_vu || 'Hôm Nay'}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <Calendar size={14} />{' '}
              <span className="hidden sm:inline" suppressHydrationWarning>
                {dateString}
              </span>
            </div>
          </div>

          {/* VERICATH ARTICLES (FULL WIDTH) */}
          <div className="w-full">
            <VericathArticles initialBlock1Posts={block1Posts} initialBlock2Posts={block2Posts} />
          </div>

          {/* PHỤNG VỤ TUẦN NÀY (HÌNH 2 MOBILE CALENDAR WIDGET DESIGN) */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-serif">
                  Phụng Vụ Tuần Này
                </h3>
              </div>
            </div>
            <PhungVuTuanNayWidget weekLiturgy={weekLiturgy} todayStr={dateStringStr} />
          </div>

        </div>
      </section>

      {/* 2. SEARCH BAR SECTION */}
      <section className="bg-white dark:bg-gray-800 py-12 px-4 sm:px-8 border-b border-gray-200 dark:border-gray-700 shadow-sm relative z-10 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2 block">
            Tra cứu nhanh mọi nguồn tư liệu huấn quyền
          </span>
          <h2 className="text-2xl font-serif text-gray-800 dark:text-gray-100 mb-8">
            Tìm kiếm chuẩn xác Kinh Thánh, Giáo Lý, Giáo Luật & Phụng Vụ
          </h2>

          <div className="relative mb-6 shadow-md group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              className="w-full pl-14 pr-32 py-5 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 transition-all"
              placeholder="Nhập từ khóa tìm kiếm..."
            />
            <button className="absolute inset-y-2 right-2 bg-[#0b132b] text-white px-8 rounded-full font-bold hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
              Tìm Kiếm <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY GRID */}
      <section className="bg-[#f8f9fa] dark:bg-gray-900 py-16 px-4 sm:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-gray-100">
                8 Danh Mục Tra Cứu Trọng Tâm
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm hidden md:block max-w-sm text-right">
              Hệ thống văn bản toàn vẹn với công cụ đối chiếu đa ngữ Latinh, Hy Lạp, Anh văn và chú giải học thuật.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Kinh Thánh */}
            <Link
              href="/kinh-thanh-cong-giao"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                Kinh Thánh Song Ngữ
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Đối chiếu song song bản Việt ngữ, Vulgata Clementina, Nova Vulgata & NABRE với hệ thống tra cứu siêu việt.
              </p>
              <div className="flex items-center text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wide">
                Tra cứu chương hồi <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: CCC */}
            <Link
              href="/giao-ly-cong-giao"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-red-300 dark:hover:border-red-500 transition-all flex flex-col h-full relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Book size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-red-700 dark:group-hover:text-red-400">
                Giáo Lý Hội Thánh (CCC)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Trọn bộ Sách Giáo Lý Hội Thánh Công Giáo 1992 với mục lục phân tích, tra cứu đề mục và đối chiếu Kinh Thánh.
              </p>
              <div className="flex items-center text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-wide">
                Khám phá 4 phần <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Canon Law */}
            <Link
              href="/giao-luat-cong-giao"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-500 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scale size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-400">
                Bộ Giáo Luật 1983
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Codex Iuris Canonici song ngữ Việt - Anh, tra cứu thuận tiện với mục lục phân cấp thông minh và từ khóa.
              </p>
              <div className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wide">
                Tra cứu theo 7 quyển <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Daily Word */}
            <Link
              href="/bai-doc-hang-ngay"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-500 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sunrise size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-orange-700 dark:group-hover:text-orange-400">
                Lời Chúa & Bài Giảng
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Bài đọc 1, Bài đọc 2, Phúc Âm hằng ngày theo Lịch Phụng Vụ Công Giáo.
              </p>
              <div className="flex items-center text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wide">
                Xem bài đọc hôm nay <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: Liturgy Calendar */}
            <Link
              href="/lich-phung-vu"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400">
                Lịch & Mùa Phụng Vụ
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Mùa Vọng, Mùa Giáng Sinh, Mùa Chay, Mùa Phục Sinh và Thường Niên cùng các bậc lễ trọng kính.
              </p>
              <div className="flex items-center text-xs font-bold text-purple-600 dark:text-purple-500 uppercase tracking-wide">
                Khám phá chu kỳ năm <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6: Youcat */}
            <Link
              href="/giao-ly-youcat"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-yellow-300 dark:hover:border-yellow-500 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded text-[10px] font-bold">
                  527 Câu Hỏi
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                Giáo Lý Youcat & Docat
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Sách Giáo Lý Cho Người Trẻ (527 câu hỏi) sắp xếp phân cấp theo 4 phần, từng đoạn & chương.
              </p>
              <div className="flex items-center text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wide">
                Tra cứu 527 câu hỏi <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 7: Missale Romanum */}
            <Link
              href="/sach-le-roma"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-red-300 dark:hover:border-red-500 transition-all flex flex-col h-full relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookMarked size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-red-700 dark:group-hover:text-red-400">
                Sách Lễ Rôma
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Nghi thức Thánh Lễ song ngữ Latinh - Việt, bản dịch Quy Chế Tổng Quát Sách Lễ (GIRM) và hệ thống các Kinh Tạ Ơn.
              </p>
              <div className="flex items-center text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-wide">
                Xem nghi thức thánh lễ <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 8: Magisterium */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm opacity-80 cursor-not-allowed flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <ScrollText size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                Huấn Quyền & Học Thuật
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                Thông điệp các Đức Giáo Hoàng, Công đồng Vaticanô II, trước tác Giáo phụ học và tài liệu thần học.
              </p>
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wide">
                Xem danh mục văn kiện <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KINH PHỤNG VỤ SECTION (MOBILE FIRST + WEBVIEW POPUP KPV.VN) */}
      <KinhPhungVuSection />

    </div>
  );
}
