"use client";

import React, { useState, useEffect } from 'react';
import { Menu, BookOpen, Search, X } from 'lucide-react';
import CCCSidebar from './CCCSidebar';
import CCCToc from './CCCToc';
import { useRouter } from 'next/navigation';

export default function CCCLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // On desktop, open TOC by default
    if (window.innerWidth >= 768) {
      setIsTocOpen(true);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/giao-ly-cong-giao?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/giao-ly-cong-giao`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .ccc-content-wrapper hr { display: none !important; }
        .ccc-content-wrapper p:has(> span[id^="so-"]) { 
          margin-top: 1.5rem;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .ccc-content-wrapper span[id^="so-"] { 
          font-size: 0.95rem; 
          font-weight: 700; 
          color: #991b1b; /* text-red-800 */
          background-color: #fee2e2; /* bg-red-100 */
          padding: 0.15rem 0.5rem;
          border-radius: 0.25rem;
        }
        .ccc-content-wrapper a[id^="backtono"] { 
          font-size: 0.85rem; 
          color: #dc2626; /* text-red-600 */
          text-decoration: none; 
          font-weight: 600;
        }
        .ccc-content-wrapper h1, 
        .ccc-content-wrapper h2, 
        .ccc-content-wrapper h3, 
        .ccc-content-wrapper h4, 
        .ccc-content-wrapper h5,
        .ccc-content-wrapper h6 { 
          color: #7f1d1d !important; /* text-red-900 */
          font-weight: 800 !important; 
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
      `}} />

      {/* Desktop Search Header */}
      <div className="hidden md:block sticky top-[4rem] md:top-[5rem] z-30 bg-white/90 backdrop-blur border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm trong Sách Giáo Lý..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-slate-50"
            />
            <Search className="absolute left-4 top-2.5 w-5 h-5 text-slate-400" />
          </form>
        </div>
      </div>

      <div className="w-full mx-auto relative flex justify-center min-h-[calc(100vh-8rem)] items-start">
        
        {/* --- DESKTOP TOC COLUMN --- */}
        <aside 
          className={`hidden md:block flex-shrink-0 transition-all duration-300 overflow-hidden sticky top-[9rem] h-[calc(100vh-9rem)] ${isTocOpen ? 'w-80 opacity-100 border-r border-slate-200' : 'w-0 opacity-0 border-r-0'}`}
        >
          <div className="w-80 h-full flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg uppercase tracking-wide">Mục Lục Bài</h2>
              <button onClick={() => setIsTocOpen(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <CCCToc />
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="w-full max-w-4xl min-w-0 transition-all duration-300 relative">
          
          {/* STICKY TOGGLE BUTTONS WRAPPER (OUTER EDGE) */}
          <div className="sticky top-[10rem] z-20 h-0 w-full overflow-visible">
            
            {/* Toggle Button for TOC (Shows when TOC is closed) */}
            {!isTocOpen && (
              <button 
                onClick={() => setIsTocOpen(true)}
                className="hidden md:flex absolute left-0 top-0 bg-white border border-slate-200 border-l-0 shadow-md p-2 rounded-r-lg text-slate-500 hover:text-red-700 hover:bg-slate-50 transition-all"
                title="Hiện Mục Lục Bài"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            )}

            {/* Toggle Button for Menu (Shows when Menu is closed) */}
            {!isMenuOpen && (
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="hidden md:flex absolute right-0 top-0 bg-white border border-slate-200 border-r-0 shadow-md p-2 rounded-l-lg text-slate-500 hover:text-red-700 hover:bg-slate-50 transition-all"
                title="Hiện Danh Mục Sách"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

          </div>

          <div className="px-4 md:px-6 lg:px-8 xl:px-12 py-8 relative z-10">
            <div className="mt-4">
              {children}
            </div>
          </div>
        </main>

        {/* --- DESKTOP MENU COLUMN --- */}
        <aside 
          className={`hidden md:block flex-shrink-0 transition-all duration-300 overflow-hidden sticky top-[9rem] h-[calc(100vh-9rem)] ${isMenuOpen ? 'w-[350px] opacity-100 border-l border-slate-200' : 'w-0 opacity-0 border-l-0'}`}
        >
          <div className="w-[350px] h-full flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg uppercase tracking-wide">Mục Lục Sách</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <CCCSidebar onNavigate={() => {}} />
            </div>
          </div>
        </aside>

        {/* --- MOBILE: FLOATING BUTTONS (Right Edge Centered) --- */}
        <div className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
          {/* Mobile: Search Button */}
          <button 
            className="bg-red-700 text-white p-2.5 rounded-l-md shadow-lg flex items-center justify-center opacity-85 hover:opacity-100"
            onClick={() => {
              const q = window.prompt("Nhập từ khóa tìm kiếm:");
              if (q) router.push(`/giao-ly-cong-giao?q=${encodeURIComponent(q)}`);
            }}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile: TOC Button */}
          <button 
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="bg-slate-800 text-white p-2.5 rounded-l-md shadow-lg flex items-center justify-center opacity-85 hover:opacity-100"
            title="Mục lục bài"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Mobile: Menu Hamburger */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-red-900 text-white p-2.5 rounded-l-md shadow-lg flex items-center justify-center opacity-85 hover:opacity-100"
            title="Danh mục Giáo Lý"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* --- MOBILE: SIDEBARS (Slide-out panels) --- */}
        
        {/* Mobile TOC Sidebar (Slides from Right) */}
        <div className={`md:hidden fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${isTocOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-lg uppercase">Mục Lục Bài</h2>
            <button onClick={() => setIsTocOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
            <CCCToc onNavigate={() => setIsTocOpen(false)} />
          </div>
        </div>

        {/* Mobile Main Menu Sidebar (Slides from Right) */}
        <div className={`md:hidden fixed inset-y-0 right-0 w-80 bg-slate-50 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white">
            <h2 className="font-bold text-slate-800 text-lg uppercase">Mục Lục Sách</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
            <CCCSidebar onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>

        {/* Backdrops for Mobile */}
        {isTocOpen && (
          <div className="md:hidden fixed inset-0 bg-black/20 z-[55]" onClick={() => setIsTocOpen(false)} />
        )}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/20 z-[55]" onClick={() => setIsMenuOpen(false)} />
        )}
        
      </div>
    </div>
  );
}
