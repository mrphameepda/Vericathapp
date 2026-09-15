'use client';

import React, { useState } from 'react';
import { Vatican2Document } from '@/lib/vatican2-server';
import { ChevronLeft, List } from 'lucide-react';
import Link from 'next/link';

interface Vatican2SidebarProps {
  document: Vatican2Document;
}

export default function Vatican2Sidebar({ document }: Vatican2SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = window.document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const blocks = document.blocks || [];
  const tocBlocks = blocks.filter((b) => b.type === 'chapter' || b.type === 'section');

  return (
    <>
      {/* Mobile Floating Action Button (Left side) */}
      <div className="md:hidden fixed left-4 top-[65%] -translate-y-1/2 flex flex-col gap-3 z-30">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors border border-blue-500"
          aria-label="Mục lục"
          title="Mục lục"
        >
          <List className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky top-0 md:top-[73px] left-0 z-50 md:z-10 h-[100dvh] md:h-[calc(100vh-73px)] w-80 md:w-80 md:flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur z-10 flex flex-col">
          <Link 
            href="/van-kien-vatican-2"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-max"
          >
            <ChevronLeft size={16} />
            Quay lại danh sách
          </Link>
          <h2 className="mt-4 font-bold text-gray-900 dark:text-white line-clamp-2" title={document.title_vi}>
            {document.title_vi}
          </h2>
          <span className="inline-block mt-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase w-max">
            {document.kind}
          </span>
        </div>
        
        <nav className="p-2 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pb-20">
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">
            Mục lục nhanh
          </div>
          {tocBlocks.length > 0 ? (
            tocBlocks.map((b, idx) => {
              const isChapter = b.type === 'chapter';
              return (
                <a
                  key={idx}
                  href={`#${b.id}`}
                  onClick={(e) => b.id && handleLinkClick(b.id, e)}
                  className={`block px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isChapter 
                      ? 'font-bold text-blue-700 dark:text-blue-400 mt-2' 
                      : 'text-gray-600 dark:text-gray-400 pl-6'
                  }`}
                >
                  {b.title}
                </a>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500 italic">Văn kiện này không chia chương</div>
          )}
        </nav>
      </aside>
    </>
  );
}
