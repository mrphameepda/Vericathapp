'use client';

import React, { useState } from 'react';
import { Check, ExternalLink, Lock, BookOpen, ChevronRight, Clock } from 'lucide-react';

export default function KinhPhungVuSection() {
  const [showWebview, setShowWebview] = useState(false);

  return (
    <section className="bg-white dark:bg-gray-800 py-8 px-4 sm:px-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* ULTRA-CLEAN & MINIMAL KINH PHỤNG VỤ BANNER */}
        <div
          onClick={() => setShowWebview(true)}
          className="group relative bg-[#0b132b] text-white rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-1.5 z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                Cầu nguyện liên lỉ cùng Hội Thánh
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-yellow-400 transition-colors">
              Kinh Phụng Vụ
            </h2>
            
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Các Giờ Kinh Phụng Vụ Hằng Ngày (Kinh Sáng, Kinh Trưa, Kinh Chiều, Kinh Tối) đối chiếu chuẩn xác.
            </p>
          </div>

          {/* Action Button */}
          <div className="z-10 flex items-center gap-2 bg-yellow-500 group-hover:bg-yellow-400 text-gray-950 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex-shrink-0 group-hover:translate-x-0.5">
            <BookOpen size={18} />
            <span>Mở Giờ Kinh (kpv.vn)</span>
            <ChevronRight size={16} />
          </div>
        </div>

      </div>

      {/* WEBVIEW SLIDE-UP POPUP MODAL FOR KPV.VN */}
      {showWebview && (
        <div
          onClick={() => setShowWebview(false)}
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
                onClick={() => setShowWebview(false)}
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
                  <span className="font-semibold tracking-wide">kpv.vn/liturgy/hours</span>
                </div>
              </div>

              {/* Right: External Browser Button */}
              <div className="flex items-center gap-1">
                <a
                  href="https://kpv.vn/liturgy/hours"
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
                src="https://kpv.vn/liturgy/hours"
                className="w-full h-full border-none"
                title="Kinh Phụng Vụ"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
