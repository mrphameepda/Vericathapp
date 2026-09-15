import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu | Vericath',
  description: 'Giới thiệu về Vericath - Kho tàng tra cứu & học thuật Công Giáo.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b132b] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">Về Vericath</h1>
        
        <div className="prose prose-blue dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            <strong>Vericath</strong> (viết tắt của Veritas Catholica) là nền tảng thần học và học thuật trực tuyến, được xây dựng nhằm cung cấp một hệ thống tra cứu chuẩn xác, đồng bộ và toàn vẹn các văn kiện huấn quyền, thần học và giáo luật của Hội Thánh Công Giáo.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">Sứ mạng</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sứ mạng của Vericath là tạo ra một không gian học thuật số hóa chất lượng cao cho cộng đồng dân Chúa, đặc biệt là các linh mục, tu sĩ, chủng sinh và những ai đam mê nghiên cứu thần học. Chúng tôi hướng tới việc bảo tồn và lưu truyền kho tàng tri thức Công Giáo thông qua các công cụ tìm kiếm hiện đại, giúp việc tra cứu các nguồn tài liệu đa ngữ (Latinh, Hy Lạp, Anh, Việt) trở nên dễ dàng và hiệu quả hơn bao giờ hết.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">Hệ sinh thái dữ liệu</h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
            <li><strong>Thánh Kinh Song Ngữ:</strong> Đối chiếu các bản dịch chuẩn mực (Vulgata, NABRE, Bản dịch tiếng Việt).</li>
            <li><strong>Giáo Luật Công Giáo 1983:</strong> Toàn bộ 7 quyển với công cụ tra cứu chéo theo từng Điều khoản.</li>
            <li><strong>Văn kiện Vatican 2:</strong> 16 văn kiện của Thánh Công Đồng được số hóa hoàn toàn.</li>
            <li><strong>Sách Giáo Lý Hội Thánh Công Giáo (CCC):</strong> Hệ thống tra cứu theo Số giáo lý và đề mục.</li>
            <li><strong>Phụng Vụ:</strong> Cập nhật Lịch Phụng Vụ, Bài Đọc Hằng Ngày, và Các Giờ Kinh Phụng Vụ.</li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-8 text-center text-sm text-blue-800 dark:text-blue-300">
            Xin phó thác dự án này cho sự cầu bầu của Đức Trinh Nữ Maria và các Thánh Giáo Phụ.
          </div>
        </div>
      </div>
    </div>
  );
}
