"use client";

import React, { useState, useEffect } from 'react';
import bookMapping from '@/data/book-mapping.json';
import { UnifiedVerse } from '@/lib/bible-service';
import { BookOpen, ChevronLeft, ChevronRight, Home, Menu } from 'lucide-react';
import Link from 'next/link';
import BibleSidebar from './BibleSidebar';

export default function BibleReader({
  initialBook,
  initialChapter,
  initialVerses,
  initialFootnotesVi,
  initialAvailableChapters
}: {
  initialBook: string;
  initialChapter: number;
  initialVerses: UnifiedVerse[];
  initialFootnotesVi: Record<string, string>;
  initialAvailableChapters: number[];
}) {
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [availableChapters, setAvailableChapters] = useState<number[]>(initialAvailableChapters);
  const [verses, setVerses] = useState<UnifiedVerse[]>(initialVerses);
  const [footnotesVi, setFootnotesVi] = useState<Record<string, string>>(initialFootnotesVi);
  const [showFootnotes, setShowFootnotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [languageMode, setLanguageMode] = useState<'bilingual' | 'vi' | 'secondary'>('bilingual');
  const [secondaryLang, setSecondaryLang] = useState('nabre');
  const [missingBook, setMissingBook] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Skip fetching on initial render if selected matches initial props
    if (selectedBook === initialBook) return;

    const fetchChapters = async () => {
      try {
        const res = await fetch(`/api/bible?book=${selectedBook}`);
        const data = await res.json();
        if (data.chapters) {
          setAvailableChapters(data.chapters);
          // If current selected chapter is not in the new book's chapters, reset to 1
          if (!data.chapters.includes(selectedChapter)) {
            setSelectedChapter(1);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chapters", err);
      }
    };
    fetchChapters();
  }, [selectedBook]);

  useEffect(() => {
    // Skip fetching on initial render if selected matches initial props and default language
    if (selectedBook === initialBook && selectedChapter === initialChapter && secondaryLang === 'nabre') return;

    const fetchVerses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bible?book=${selectedBook}&chapter=${selectedChapter}&lang=${secondaryLang}`);
        const data = await res.json();
        if (data.verses) {
          setVerses(data.verses);
          setFootnotesVi(data.footnotesVi || {});
          setMissingBook(data.missingSecondaryBook || false);
        }
      } catch (err) {
        console.error("Failed to fetch verses", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (availableChapters.includes(selectedChapter) || selectedChapter === 1) {
       fetchVerses();
    }
  }, [selectedBook, selectedChapter, availableChapters, secondaryLang]);

  const handleNextChapter = () => {
    if (selectedChapter < Math.max(...availableChapters)) {
      setSelectedChapter(prev => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="text-blue-600" size={24} />
            <h1 className="text-xl font-bold text-gray-800">Vericath</h1>
          </Link>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {availableChapters.map(ch => (
                <option key={ch} value={ch}>Chương {ch}</option>
              ))}
            </select>

            <select
              value={secondaryLang}
              onChange={(e) => setSecondaryLang(e.target.value)}
              className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="nabre">Tiếng Anh (NABRE)</option>
              <option value="zh_ncv">Tiếng Trung Quốc (NCV)</option>
              <option value="el_greek">Tiếng Hy Lạp (Greek)</option>
              <option value="ar_svd">Tiếng Ả Rập (SVD)</option>
              <option value="ko_ko">Tiếng Hàn Quốc (Korean)</option>
              <option value="fi_pr">Tiếng Phần Lan (Finnish)</option>
              <option value="es_rvr">Tiếng Tây Ban Nha (RVR)</option>
              <option value="la_latin">Tiếng Latinh (Vulgata)</option>
            </select>

            <select
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value as any)}
              className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="bilingual">Song ngữ</option>
              <option value="vi">Chỉ Tiếng Việt</option>
              <option value="secondary">Chỉ Bản Đối Chiếu</option>
            </select>
          </div>
        </div>
      </header>

      {/* Missing Book Warning */}
      {missingBook && languageMode !== 'vi' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-auto max-w-6xl mt-4 w-full">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Bản dịch đối chiếu mà bạn chọn ( Kinh Thánh 66 cuốn ) không hỗ trợ sách này (thuộc Đệ nhị quy điển). Nội dung đối chiếu sẽ bị trống.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 w-full relative">
        <BibleSidebar 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          onOpen={() => setIsDrawerOpen(true)}
          selectedBook={selectedBook} 
          onSelectBook={setSelectedBook} 
        />
        
        <div className="flex-1 w-full min-w-0 flex flex-col relative">
          {/* Main Reader Area */}
          <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 relative">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {verses.map(verse => (
              <div key={verse.verseNumber} className="relative group">
                
                {/* Render Headings */}
                {(verse.viHeadings || verse.enHeadings) && (
                  <div className="flex flex-col md:flex-row gap-2 md:gap-8 mt-6 mb-2">
                    <div className="flex-1">
                      {verse.viHeadings?.map((h, i) => (
                        <h3 key={i} className="text-xl md:text-2xl font-bold text-blue-800 mb-2">{h}</h3>
                      ))}
                    </div>
                    {(languageMode === 'bilingual' || languageMode === 'secondary') && (
                      <div className="flex-1">
                        {verse.enHeadings?.map((h, i) => (
                          <h3 key={i} className="text-xl md:text-2xl font-bold text-blue-800 mb-2">{h}</h3>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <span className="absolute -left-6 sm:-left-8 top-1 text-xs font-bold text-gray-400 select-none">
                  {verse.verseNumber}
                </span>
                
                {/* Desktop: Side by Side, Mobile: Stacked */}
                {languageMode === 'bilingual' ? (
                  <div className="flex flex-col md:flex-row gap-2 md:gap-8 border-b border-gray-100 pb-2 last:border-0">
                    <div className="flex-1">
                      <div className="text-[1.1rem] leading-relaxed text-gray-800 vi-verse" dangerouslySetInnerHTML={{ __html: verse.textVi || '' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[1.1rem] leading-relaxed text-gray-700 font-serif md:font-sans">{verse.textEn}</p>
                    </div>
                  </div>
                ) : languageMode === 'vi' ? (
                  <div className="text-[1.1rem] leading-relaxed text-gray-800 vi-verse" dangerouslySetInnerHTML={{ __html: verse.textVi || '' }} />
                ) : (
                  <p className="text-[1.1rem] leading-relaxed text-gray-800 font-serif md:font-sans">{verse.textEn}</p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Footnotes Panel */}
        {Object.keys(footnotesVi).length > 0 && languageMode !== 'secondary' && (
          <div className="mt-12 pt-6 border-t border-gray-300">
            <button 
              onClick={() => setShowFootnotes(!showFootnotes)}
              className="font-semibold text-blue-700 mb-4 hover:underline focus:outline-none"
            >
              {showFootnotes ? 'Ẩn chú thích' : 'Hiện chú thích (' + Object.keys(footnotesVi).length + ')'}
            </button>
            
            {showFootnotes && (
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner text-sm text-gray-700 space-y-3">
                {Object.entries(footnotesVi).map(([id, html]) => (
                  <div key={id} className="flex gap-2">
                    <span className="font-bold text-blue-800 min-w-[24px]">[{id.match(/\d+/)?.[0]}]</span>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / Pagination */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={handlePrevChapter}
            disabled={selectedChapter <= 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Trước
          </button>
          
          <span className="text-sm text-gray-500 font-medium">
            Chương {selectedChapter} / {Math.max(...availableChapters, 1)}
          </span>
          
          <button 
            onClick={handleNextChapter}
            disabled={selectedChapter >= Math.max(...availableChapters)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Tiếp <ChevronRight size={16} />
          </button>
        </div>
      </footer>
        </div>
      </div>
    </div>
  );
}
