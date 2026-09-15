import React from 'react';
import { getReadingIndex } from '@/lib/loi-chua';
import ReadingSidebar from '@/components/ReadingSidebar';


export default function DailyReadingLayout({ children }: { children: React.ReactNode }) {
  const indexData = getReadingIndex();

  return (
    <div className="flex flex-col flex-1 transition-colors duration-200">
      <div className="flex flex-1 items-start w-full">
        {/* Left Sidebar (Desktop static, Mobile Drawer) */}
        <ReadingSidebar indexData={indexData} />
        
        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
