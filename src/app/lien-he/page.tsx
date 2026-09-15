import { Metadata } from 'next';
import { Mail, User, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Liên hệ | Vericath',
  description: 'Liên hệ với Tác giả Vericath.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b132b] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Thông tin tác giả */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            Thông tin Tác giả
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Phát triển & Duy trì bởi</p>
                <p className="text-xl font-bold">Giuse Phạm Duy Ái, SDS</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Email hỗ trợ & Góp ý</p>
                <a href="mailto:mrphamee@gmail.com" className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  mrphamee@gmail.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            "Mọi đóng góp về chuyên môn Thần học, báo lỗi hệ thống, hoặc gợi ý tính năng mới đều được trân trọng tiếp nhận."
          </div>
        </div>
        
        {/* Khung gửi phản hồi */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Gửi Phản Hồi Trực Tiếp
          </h2>
          <form className="space-y-4" action="mailto:mrphamee@gmail.com" method="post" encType="text/plain">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên của bạn
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent text-gray-900 dark:text-white"
                placeholder="Nguyễn Văn A"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chủ đề
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent text-gray-900 dark:text-white"
                placeholder="Góp ý bản dịch..."
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nội dung
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-transparent text-gray-900 dark:text-white resize-none"
                placeholder="Chi tiết phản hồi của bạn..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              Gửi Qua Email <Send size={18} />
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Hành động này sẽ mở ứng dụng Email mặc định của bạn.
            </p>
          </form>
        </div>
        
      </div>
    </div>
  );
}
