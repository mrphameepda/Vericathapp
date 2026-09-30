'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Vatican2Document } from '@/lib/vatican2-server';

interface Vatican2SearchProps {
  document: Vatican2Document;
}

export default function Vatican2Search({ document }: Vatican2SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    if (isOpen) {
      setQuery('');
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const allArticles = useMemo(() => {
    return document.blocks.filter((b) => b.type === 'article');
  }, [document.blocks]);

  const results = useMemo(() => {
    if (!query.trim()) return allArticles;
    const q = query.toLowerCase();
    return allArticles.filter((node) => {
      const textToSearch = `${node.n} ${node.text || ''}`.toLowerCase();
      return textToSearch.includes(q) || node.n === q;
    });
  }, [query, allArticles]);

  const handleResultClick = (id: string | undefined) => {
    if (!id) return;
    const element = window.document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed right-4 top-[65%] -translate-y-1/2 flex flex-col gap-3 z-30">
        <button
          onClick={toggleSearch}
          className="p-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          aria-label="Tìm kiếm số"
          title="Tìm kiếm số"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

          <div className="relative bg-white dark:bg-[#111c3a] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <Search className="w-6 h-6 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-4 text-gray-900 dark:text-gray-100 text-lg placeholder-gray-400"
                placeholder="Tìm từ khóa hoặc nhảy đến số (vd: 10)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {results.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  Không tìm thấy kết quả nào cho &quot;{query}&quot;
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {results.map((res, i) => (
                    <button
                      key={i}
                      className="px-2 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 shadow-sm"
                      onClick={() => handleResultClick(res.id)}
                      title={res.text ? res.text.substring(0, 150) + '...' : `Số ${res.n}`}
                    >
                      {res.n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
