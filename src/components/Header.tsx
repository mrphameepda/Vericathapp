"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronDown, Menu, X, ExternalLink, Check, Lock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTraCuuOpen, setIsTraCuuOpen] = useState(false);
  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);

  const handleOpenGameApp = () => {
    setWebviewUrl('https://vericath.org/game-sinh-hoat-cong-giao/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-[#0b132b] text-white border-b border-gray-800 py-4 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          
          {/* Mobile menu button (Left) */}
          <div className="lg:hidden flex items-center">
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-300 hover:text-white p-2 -ml-2"
             >
                <Menu size={24} />
             </button>
          </div>

          <Link href="/" className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none">
            <img src="/logo.png" alt="Vericath Logo" className="h-8 w-auto" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">Vericath</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest hidden sm:block">Ứng dụng tra cứu công giáo</p>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium ml-4">
            <Link href="/" className="text-yellow-500 hover:text-yellow-400">Trang chủ</Link>
            
            {/* Tra Cứu Dropdown */}
            <div className="relative group">
               <button className="hover:text-yellow-400 flex items-center gap-1 py-2">
                 Tra cứu <ChevronDown size={14} />
               </button>
               <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 shadow-xl rounded-md w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 border border-gray-100 z-50">
                 <Link href="/kinh-thanh-cong-giao" className="px-4 py-2 hover:bg-gray-100 font-medium">Kinh Thánh</Link>
                 <Link href="/giao-luat-cong-giao" className="px-4 py-2 hover:bg-gray-100 font-medium">Giáo luật</Link>
                 <Link href="/giao-ly-youcat" className="px-4 py-2 hover:bg-gray-100 font-medium text-yellow-600 font-bold">Giáo Lý Youcat</Link>
                 <Link href="/giao-ly-cong-giao" className="px-4 py-2 hover:bg-gray-100 font-medium">Giáo lý CCC</Link>
                 <Link href="/bai-doc-hang-ngay" className="px-4 py-2 hover:bg-gray-100 font-medium">Bài đọc hằng ngày</Link>
                 <Link href="/lich-phung-vu" className="px-4 py-2 hover:bg-gray-100 font-medium">Lịch Phụng Vụ</Link>
                 <Link href="/sach-le-roma" className="px-4 py-2 hover:bg-gray-100 font-medium">Sách lễ Rôma</Link>
               </div>
            </div>

            {/* Link Game & App */}
            <button
              onClick={handleOpenGameApp}
              className="hover:text-yellow-400 transition-colors cursor-pointer text-gray-200"
            >
              Game & App
            </button>
          </div>
          
          <div className="flex items-center gap-4 ml-auto lg:ml-0">
             <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Slide-out Menu */}
          <div className="relative w-4/5 max-w-sm bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <BookOpen className="text-yellow-500" size={24} />
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">Vericath</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-2"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Trang chủ
              </Link>
              
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsTraCuuOpen(!isTraCuuOpen)}
                  className="flex items-center justify-between px-4 py-3 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full text-left"
                >
                  Tra cứu
                  <ChevronDown size={18} className={`transition-transform ${isTraCuuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isTraCuuOpen && (
                  <div className="flex flex-col pl-8 pr-4 py-2 gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg mt-1 mx-2">
                    <Link href="/kinh-thanh-cong-giao" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 dark:text-gray-300 font-medium">Kinh Thánh</Link>
                    <Link href="/giao-luat-cong-giao" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 dark:text-gray-300 font-medium">Giáo luật</Link>
                    <Link href="/giao-ly-youcat" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-yellow-600 dark:text-yellow-400 font-bold">Giáo Lý Youcat</Link>
                    <Link href="/giao-ly-cong-giao" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 dark:text-gray-300 font-medium">Giáo lý CCC</Link>
                    <Link href="/bai-doc-hang-ngay" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 dark:text-gray-300 font-medium">Bài đọc hằng ngày</Link>
                    <Link href="/lich-phung-vu" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 dark:text-gray-300 font-medium">Lịch Phụng Vụ</Link>
                    <Link href="/sach-le-roma" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-700 dark:text-gray-300 font-medium">Sách lễ Rôma</Link>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleOpenGameApp}
                className="px-4 py-3 text-left text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Game & App
              </button>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Vericath
            </div>
          </div>
        </div>
      )}

      {/* WEBVIEW SLIDE-UP POPUP MODAL FOR GAME & APP */}
      {webviewUrl && (
        <div
          onClick={() => setWebviewUrl(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end transition-opacity animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl mx-auto h-[92vh] sm:h-[90vh] bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border-t border-x border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-300"
          >
            {/* IN-APP BROWSER HEADER BAR */}
            <div className="bg-gray-100 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700/80 shrink-0">
              {/* Left: Close Button (✓) */}
              <button
                onClick={() => setWebviewUrl(null)}
                className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-gray-100 shadow-sm transition-transform active:scale-95"
                title="Đóng (✓)"
              >
                <Check size={20} className="stroke-[3]" />
              </button>

              {/* Center: Domain Name & Security Badge */}
              <div className="flex flex-col items-center min-w-0">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-1"></div>
                <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                  <Lock size={12} className="text-emerald-500" />
                  <span className="font-semibold tracking-wide">vericath.org</span>
                </div>
              </div>

              {/* Right: External Browser Button */}
              <div className="flex items-center gap-1">
                <a
                  href={webviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-sm transition-transform active:scale-95"
                  title="Mở trong trình duyệt ngoài"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* WEBVIEW IFRAME CONTAINER */}
            <div className="flex-1 bg-white relative overflow-hidden">
              <iframe
                src={`/api/page-proxy?url=${encodeURIComponent(webviewUrl)}`}
                className="w-full h-full border-none"
                title="Game & App Sinh hoạt Công giáo"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
