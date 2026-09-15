'use client';

import React, { useEffect, useState } from 'react';
import { YoucatItem, getPartByQuestionId, ALL_YOUCAT_ITEMS } from '@/lib/youcat';
import { X, ChevronLeft, ChevronRight, BookOpen, Quote, Share2, Copy, Check, Hash, Sparkles } from 'lucide-react';

interface YoucatModalProps {
  item: YoucatItem | null;
  onClose: () => void;
  onSelectId: (id: number) => void;
}

export default function YoucatModal({ item, onClose, onSelectId }: YoucatModalProps) {
  const [copied, setCopied] = useState(false);
  const [jumpInput, setJumpInput] = useState('');

  // Lock body scroll when modal is active
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
      setJumpInput(item.id.toString());
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && item.id > 1) {
        onSelectId(item.id - 1);
      } else if (e.key === 'ArrowRight' && item.id < ALL_YOUCAT_ITEMS.length) {
        onSelectId(item.id + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onSelectId]);

  if (!item) return null;

  const part = getPartByQuestionId(item.id);
  const totalCount = ALL_YOUCAT_ITEMS.length;

  const handlePrev = () => {
    if (item.id > 1) onSelectId(item.id - 1);
  };

  const handleNext = () => {
    if (item.id < totalCount) onSelectId(item.id + 1);
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= totalCount) {
      onSelectId(num);
    } else {
      setJumpInput(item.id.toString());
    }
  };

  const handleCopyContent = () => {
    const textToCopy = `[YOUCAT Câu ${item.id}]\n\n${item.question}\n\n• Trả lời:\n${item.answer}\n\n• Giải thích:\n${item.explanation}${
      item.quotes && item.quotes.length > 0 ? `\n\n• Trích dẫn:\n${item.quotes.join('\n')}` : ''
    }\n\nTra cứu tại Vericath Webapp`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn p-0 sm:p-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] border border-gray-200 dark:border-gray-800 z-10 animate-slideUp">
        
        {/* TOP HEADER */}
        <div className="bg-[#0b132b] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-gray-800 flex-shrink-0">
          
          {/* Left: Part badge & Nav */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${part.badgeBg} ${part.badgeText}`}>
              {part.title}
            </span>
            <span className="hidden md:inline text-xs text-gray-400 font-medium truncate max-w-[180px]">
              {part.subtitle}
            </span>
          </div>

          {/* Center: Question Navigation & Jump */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePrev}
              disabled={item.id <= 1}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Câu trước (←)"
            >
              <ChevronLeft size={18} />
            </button>

            <form onSubmit={handleJumpSubmit} className="flex items-center">
              <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Câu</span>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min={1}
                  max={totalCount}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  onBlur={handleJumpSubmit}
                  className="w-14 sm:w-16 px-1.5 py-0.5 text-center text-sm font-bold bg-white/10 hover:bg-white/15 focus:bg-white focus:text-gray-900 rounded border border-white/20 focus:outline-none transition-colors"
                />
              </div>
              <span className="text-xs text-gray-400 ml-1">/ {totalCount}</span>
            </form>

            <button
              onClick={handleNext}
              disabled={item.id >= totalCount}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Câu tiếp theo (→)"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Right: Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
            title="Đóng (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
          
          {/* Section Breadcrumb */}
          {item.hierarchy?.section && (
            <div className="flex items-center gap-2 text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider bg-yellow-50 dark:bg-yellow-950/30 px-3 py-1.5 rounded-lg border border-yellow-200/60 dark:border-yellow-900/40 w-fit">
              <BookOpen size={14} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <span>{item.hierarchy.section}</span>
            </div>
          )}

          {/* Question Title */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Hash size={14} className="text-yellow-500" /> CÂU HỎI {item.id}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-snug">
              {item.question}
            </h2>
          </div>

          {/* ICONIC YOUCAT GOLD ANSWER BOX */}
          <div className="relative bg-gradient-to-r from-amber-50 via-yellow-50/70 to-amber-50 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-amber-950/40 p-5 sm:p-6 rounded-2xl border border-amber-200 dark:border-amber-800/70 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl"></div>
            
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              <Sparkles size={16} className="text-amber-500" />
              <span>Tóm Tắt Trả Lời (Youcat)</span>
            </div>

            <p className="text-base sm:text-lg font-medium text-amber-950 dark:text-amber-100 leading-relaxed font-sans">
              {item.answer}
            </p>
          </div>

          {/* DETAILED EXPLANATION */}
          {item.explanation && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <BookOpen size={15} className="text-blue-600 dark:text-blue-400" />
                Giải Thích Chi Tiết
              </h3>
              <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 font-sans">
                {item.explanation.split('\n\n').map((para, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* QUOTES & SAINT SAYINGS */}
          {item.quotes && item.quotes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Quote size={15} className="text-yellow-600 dark:text-yellow-400" />
                Trích Dẫn & Lời Thánh
              </h3>
              <div className="space-y-3">
                {item.quotes.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 relative text-sm italic text-gray-700 dark:text-gray-200 leading-relaxed"
                  >
                    <Quote className="absolute top-3 right-3 text-gray-300 dark:text-gray-600 rotate-180 opacity-50" size={20} />
                    <p className="pr-6">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CCC REFERENCES */}
          {item.references && item.references.length > 0 && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">
                Tham chiếu Giáo Lý (CCC):
              </span>
              {item.references.map((ref, rIdx) => (
                <span
                  key={rIdx}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors cursor-pointer"
                  title={`Tra cứu CCC đoạn ${ref}`}
                >
                  KKCG {ref}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="bg-gray-50 dark:bg-gray-800/90 px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyContent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              <span>{copied ? 'Đã chép nội dung!' : 'Sao chép nội dung'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={item.id <= 1}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} /> <span className="hidden sm:inline">Câu trước</span>
            </button>
            <button
              onClick={handleNext}
              disabled={item.id >= totalCount}
              className="px-3 py-1.5 rounded-lg bg-[#0b132b] text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <span className="hidden sm:inline">Câu tiếp</span> <ChevronRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
