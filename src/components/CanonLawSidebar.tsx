'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CanonLawNode } from '@/lib/giao-luat-server';
import { ChevronDown, ChevronRight, FileText, Search } from 'lucide-react';

interface SidebarProps {
  books: CanonLawNode[];
  onSearchClick: () => void;
}

export default function CanonLawSidebar({ books, onSearchClick }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedBooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentBookSlug = pathname?.split('/')[2];

  // Helper to render nested sidebar items
  const renderTree = (node: CanonLawNode, level: number = 0, index: number = 0) => {
    const nodeId = node.slug || node.id.toString();
    const isExpanded = !!expandedBooks[nodeId] || (level === 0 && currentBookSlug === node.slug);
    
    const hasChildren = Array.isArray(node.content) && node.content.length > 0;
    
    // For top-level books, link to their page. For inner, link to hash on current page
    const isBook = level === 0;
    const href = isBook ? `/giao-luat-cong-giao/${node.slug}` : `?muc=${nodeId}`;

    const handleNodeClick = (e: React.MouseEvent) => {
      if (isBook) {
        setIsOpen(false);
        return;
      }
      
      e.preventDefault();
      window.history.pushState(null, '', `?muc=${nodeId}`);
      
      const element = document.getElementById(nodeId.toString());
      if (element) {
        // Find header offset to not hide behind sticky header
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      
      if (!hasChildren) setIsOpen(false);
    };

    let titleStyle = 'text-xs text-gray-700 dark:text-gray-300';
    if (isBook) {
      titleStyle = 'font-bold text-sm uppercase text-blue-900 dark:text-blue-300';
    } else if (node.type === 'PHẦN') {
      titleStyle = 'font-semibold text-xs uppercase text-blue-800 dark:text-blue-400';
    } else if (node.type === 'THIÊN') {
      titleStyle = 'font-medium text-xs text-blue-700 dark:text-blue-400';
    } else if (node.type === 'ĐỀ MỤC') {
      titleStyle = 'font-medium text-xs text-gray-800 dark:text-gray-200';
    } else if (node.type === 'CHƯƠNG') {
      titleStyle = 'font-normal text-xs text-gray-700 dark:text-gray-300';
    } else if (node.type === 'TIẾT') {
      titleStyle = 'font-normal text-[11px] italic text-gray-500 dark:text-gray-400';
    }

    return (
      <li key={`${node.type || 'NODE'}-${nodeId}-${index}`} className="flex flex-col">
        <div
          style={{ paddingLeft: `${level * 10 + 6}px` }}
          className={`flex items-center justify-between rounded-md py-1.5 pr-2 transition-colors ${
            (isBook && currentBookSlug === node.slug) ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Link
            href={href}
            className={`flex-1 leading-snug ${titleStyle} ${
              (isBook && currentBookSlug === node.slug) ? 'font-bold text-blue-800 dark:text-blue-400' : ''
            }`}
            onClick={handleNodeClick}
          >
            {node.title}
          </Link>
          {hasChildren && (
            <button
              onClick={(e) => toggleNode(nodeId, e)}
              className="p-1 ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <ul className="mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-800 ml-3">
            {(node.content as CanonLawNode[]).map((child, idx) => renderTree(child, level + 1, idx))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile Floating Action Buttons */}
      <div className="lg:hidden fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Mục lục"
        >
          <FileText className="w-6 h-6" />
        </button>
        <button
          onClick={onSearchClick}
          className="p-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          aria-label="Tìm kiếm"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[64px] left-0 z-50 lg:z-30 h-[100dvh] lg:h-[calc(100vh-64px)] w-80 bg-white dark:bg-[#0a1128] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 hidden lg:flex justify-between items-center bg-gray-50 dark:bg-[#111c3a]">
          <h2 className="font-bold text-lg text-blue-900 dark:text-blue-400">Mục Lục</h2>
          <button
            onClick={onSearchClick}
            className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded-full transition-colors"
            title="Tìm kiếm Giáo luật"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {/* Introductory links */}
          <div className="mb-3 border-b border-gray-200 dark:border-gray-800 pb-2 space-y-1">
            <Link
              href="/giao-luat-cong-giao#dan-nhap"
              className="block px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              ĐÔI LỜI DẪN NHẬP VÀ CÁM ƠN
            </Link>
            <Link
              href="/giao-luat-cong-giao#tong-hien"
              className="block px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              TÔNG HIẾN SACRAE DISCIPLINAE LEGES
            </Link>
            <Link
              href="/giao-luat-cong-giao#loi-tua"
              className="block px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              LỜI TỰA
            </Link>
          </div>

          <ul className="space-y-1">
            {books.map((book, idx) => renderTree(book, 0, idx))}
          </ul>
        </div>
      </aside>
    </>
  );
}
