import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b132b] text-gray-400 py-12 px-4 sm:px-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">Vericath</h2>
            <span className="bg-red-900 text-red-200 text-[10px] px-2 py-0.5 font-bold rounded">CATHOLICA</span>
          </div>
          <div className="text-xs text-gray-400">
            <p>&copy; 2026 VERICATH. bản quyền thuộc về Bách Khoa Công Giáo.</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Về Vericath</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link href="/gioi-thieu" className="hover:text-yellow-500 transition-colors">Giới thiệu chung</Link></li>
            <li><Link href="/lien-he" className="hover:text-yellow-500 transition-colors">Liên hệ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Liên Kết Tòa Thánh</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="https://www.vatican.va/content/vatican/en.html" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">Vatican.va - Sancta Sedes</a></li>
            <li><a href="https://www.doctrinafidei.va/en.html" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">Bộ Giáo Lý Đức Tin (CDF)</a></li>
            <li><a href="https://www.cultodivino.va/en.html" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">Bộ Phụng Tự & Kỷ Luật Bí Tích</a></li>
            <li><a href="https://hdgmvietnam.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">Hội đồng Giám mục Việt Nam (HDGMVN)</a></li>
            <li><a href="https://gcatholic.org/calendar/2026/General-A-en" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">Lịch Phụng Vụ Toàn Cầu & Địa Phương</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
