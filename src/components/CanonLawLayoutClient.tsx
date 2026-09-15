'use client';

import React, { useState } from 'react';
import CanonLawSidebar from '@/components/CanonLawSidebar';
import CanonLawSearch from '@/components/CanonLawSearch';
import { CanonLawNode } from '@/lib/giao-luat-server';

export default function CanonLawLayoutClient({
  children,
  books,
}: {
  children: React.ReactNode;
  books: CanonLawNode[];
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col flex-1 transition-colors duration-200">
      <div className="flex flex-1 w-full relative h-[calc(100vh-73px)]">
        <CanonLawSidebar books={books} onSearchClick={() => setIsSearchOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full lg:w-[calc(100%-20rem)] min-w-0 bg-white dark:bg-gray-900 shadow-sm relative">
          {children}
        </main>
      </div>

      <CanonLawSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        books={books} 
      />
    </div>
  );
}
