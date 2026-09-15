import React from 'react';
import SachLeRomaSidebar from '@/components/SachLeRomaSidebar';

export const metadata = {
  title: 'Sách Lễ Rô-ma | Bách Khoa Công Giáo',
  description: 'Tra cứu các cử hành phụng vụ, bài đọc, lời nguyện trong Sách Lễ Rô-ma',
};

export default function SachLeRomaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row relative">
          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0 border-r border-slate-200 bg-white/50 z-30">
            <SachLeRomaSidebar />
          </div>
          
          {/* Main Content Area */}
          <main className="flex-1 w-full relative">
            <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8 xl:p-12 transition-all duration-300">
              <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-red-900 prose-a:text-red-700 hover:prose-a:text-red-800">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
