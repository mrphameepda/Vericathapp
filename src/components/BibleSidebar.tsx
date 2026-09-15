"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Book, Bookmark, History, ChevronRight, Library } from 'lucide-react';
import bookMapping from '@/data/book-mapping.json';

type BookItem = { vi: string; en: string; name: string };

const deuterocanonical = ["tb", "gđt", "1 mcb", "2 mcb", "kn", "hc", "br"];

const CATEGORIES = {
  OT: {
    title: "CỰU ƯỚC",
    total: 46,
    groups: [
      { id: "ot-nguthu", name: "Ngũ Thư", keys: ["st", "xh", "lv", "ds", "đnl"] },
      { id: "ot-lichsu", name: "Lịch Sử", keys: ["gs", "tl", "r", "1 sm", "2 sm", "1 v", "2 v", "1 sb", "2 sb", "er", "nk", "tb", "gđt", "et", "1 mcb", "2 mcb"] },
      { id: "ot-khonngoan", name: "Khôn Ngoan", keys: ["g", "tv", "cn", "gv", "dc", "kn", "hc"] },
      { id: "ot-ngonsu", name: "Ngôn Sứ", keys: ["is", "gr", "ac", "br", "ed", "đn", "hs", "ge", "am", "ôv", "gn", "mk", "nkm", "kb", "xp", "kg", "dcr", "ml"] },
    ]
  },
  NT: {
    title: "TÂN ƯỚC",
    total: 27,
    groups: [
      { id: "nt-phucam", name: "Phúc Âm", keys: ["mt", "mc", "lc", "ga"] },
      { id: "nt-congvu", name: "Công Vụ", keys: ["cv"] },
      { id: "nt-thuphaolo", name: "Thư Phaolô", keys: ["rm", "1 cr", "2 cr", "gl", "ep", "pl", "cl", "1 tx", "2 tx", "1 tm", "2 tm", "tt", "plm", "hr"] },
      { id: "nt-thuchung", name: "Thư Chung & KH", keys: ["gc", "1 pr", "2 pr", "1 ga", "2 ga", "3 ga", "gđ", "kh"] },
    ]
  }
};

export default function BibleSidebar({
  isOpen,
  onClose,
  onOpen,
  selectedBook,
  onSelectBook,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  selectedBook: string;
  onSelectBook: (book: string) => void;
}) {
  const [activeSegment, setActiveSegment] = useState<'OT' | 'NT'>('OT');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      const isNT = CATEGORIES.NT.groups.some(g => g.keys.includes(selectedBook));
      setActiveSegment(isNT ? 'NT' : 'OT');
      
      setTimeout(() => {
         const activeEl = document.getElementById(`book-${selectedBook}`);
         if (activeEl && contentRef.current) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
      }, 300);
    }
  }, [isOpen, selectedBook]);

  const activeCategories = CATEGORIES[activeSegment].groups;

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return activeCategories;
    const query = searchQuery.toLowerCase();
    
    return activeCategories.map(group => {
      const filteredKeys = group.keys.filter(key => {
        const book = bookMapping.find(b => b.vi === key);
        if (!book) return false;
        return key.includes(query) || book.name.toLowerCase().includes(query) || book.en.toLowerCase().includes(query);
      });
      return { ...group, keys: filteredKeys };
    }).filter(group => group.keys.length > 0);
  }, [searchQuery, activeCategories]);

  const scrollToGroup = (id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
       el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentCategoryObj = CATEGORIES[activeSegment];

  return (
    <>
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed left-4 top-[65%] -translate-y-1/2 flex flex-col gap-3 z-30">
        <button
          onClick={onOpen}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors border border-blue-500"
        >
          <Book className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}
      
      <aside className={`fixed lg:sticky top-0 lg:top-[73px] left-0 z-50 lg:z-10 h-[100dvh] lg:h-[calc(100vh-73px)] w-80 bg-[#fafafa] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Header */}
        <div className="pt-6 px-5 pb-3 bg-white dark:bg-gray-900 z-10 flex flex-col gap-4">
           <div className="flex justify-between items-start">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0b132b] dark:bg-yellow-600 text-yellow-500 dark:text-white rounded flex items-center justify-center">
                  <Book size={20} />
                </div>
                <div>
                   <h2 className="text-[17px] font-serif font-bold text-[#0b132b] dark:text-white leading-tight">
                      Mục Lục Kinh Thánh
                   </h2>
                   <p className="text-[11px] text-gray-500">Quy điển Hội Thánh: <span className="font-bold text-[#b44122]">73 Thư Tịch</span></p>
                </div>
             </div>
             <button onClick={onClose} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
               <X size={18} />
             </button>
          </div>

          <div className="relative group">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                placeholder="Tìm tên sách, viết tắt (vd: St, Ga, Tv, Rm, Hc...)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-[13px] focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 dark:text-gray-200 transition-shadow"
             />
             {searchQuery && (
               <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                 <X size={14} />
               </button>
             )}
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
             <button 
                onClick={() => setActiveSegment('OT')}
                className={`flex-1 py-1.5 text-[13px] font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all ${activeSegment === 'OT' ? 'bg-white dark:bg-gray-700 text-[#0b132b] shadow-sm' : 'text-gray-500'}`}
             >
                <div className={`w-1.5 h-1.5 rounded-full ${activeSegment === 'OT' ? 'bg-[#d97706]' : 'bg-transparent'}`}></div>
                Cựu Ước <span className={`text-[10px] px-1.5 py-0.5 rounded border ${activeSegment === 'OT' ? 'border-[#d97706]/30 text-[#d97706] bg-[#d97706]/5' : 'border-gray-300 text-gray-400'}`}>46</span>
             </button>
             <button 
                onClick={() => setActiveSegment('NT')}
                className={`flex-1 py-1.5 text-[13px] font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all ${activeSegment === 'NT' ? 'bg-white dark:bg-gray-700 text-[#0b132b] shadow-sm' : 'text-gray-500'}`}
             >
                <div className={`w-1.5 h-1.5 rounded-full ${activeSegment === 'NT' ? 'bg-[#d97706]' : 'bg-transparent'}`}></div>
                Tân Ước <span className={`text-[10px] px-1.5 py-0.5 rounded border ${activeSegment === 'NT' ? 'border-[#d97706]/30 text-[#d97706] bg-[#d97706]/5' : 'border-gray-300 text-gray-400'}`}>27</span>
             </button>
          </div>
        </div>

        {/* Anchor Pills */}
        {!searchQuery && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white border-b border-gray-100 shadow-sm hide-scrollbar overflow-x-auto z-10 sticky top-0">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">PHẦN:</span>
            {activeCategories.map(group => (
              <button 
                key={`pill-${group.id}`}
                onClick={() => scrollToGroup(group.id)}
                className="whitespace-nowrap px-2.5 py-1 bg-yellow-50 border border-yellow-200/60 rounded text-[11px] font-medium text-[#92400e] hover:bg-yellow-100 transition-colors"
              >
                {group.name} ({group.keys.length})
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4" ref={contentRef}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-100">
             <h3 className="text-[13px] font-serif font-bold text-[#78350f] uppercase tracking-wide">
               {activeSegment === 'OT' ? 'I. CỰU ƯỚC' : 'II. TÂN ƯỚC'}
             </h3>
             <span className="text-[10px] font-bold px-2 py-0.5 border border-[#d97706]/30 rounded-full text-[#d97706] bg-[#fef3c7]/30">
               Đủ {currentCategoryObj.total} cuốn
             </span>
          </div>

          {filteredGroups.length === 0 ? (
             <div className="text-center py-10 text-gray-400 text-sm">Không tìm thấy sách.</div>
          ) : (
            filteredGroups.map(group => (
              <div key={group.id} id={group.id} className="mb-6">
                 <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-1.5 text-[#57534e]">
                     <Library size={14} />
                     <h4 className="text-[12px] font-bold">{group.name}</h4>
                   </div>
                   <span className="text-[11px] text-gray-400">{group.keys.length} cuốn</span>
                 </div>
                 
                 <div className={group.id === 'ot-nguthu' || group.id === 'nt-phucam' ? "flex flex-col gap-1.5" : "grid grid-cols-2 gap-1.5"}>
                   {group.keys.map(key => {
                     const book = bookMapping.find(b => b.vi === key);
                     if (!book) return null;
                     const isSelected = selectedBook === key;
                     const isDeut = deuterocanonical.includes(key);
                     const isOneColumn = group.id === 'ot-nguthu' || group.id === 'nt-phucam';

                     if (isOneColumn) {
                       return (
                         <button
                           key={key}
                           id={`book-${key}`}
                           onClick={() => {
                             onSelectBook(key);
                             onClose();
                           }}
                           className={`group w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                             isSelected 
                               ? 'bg-blue-50/50' 
                               : 'bg-transparent hover:bg-gray-50'
                           }`}
                         >
                            <div className="flex items-center gap-3">
                               <div className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-[13px] uppercase transition-colors ${
                                 isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                               }`}>
                                 {book.vi}
                               </div>
                               <div className="flex flex-col items-start">
                                  <span className={`text-[14px] font-semibold ${isSelected ? 'text-blue-700' : 'text-[#334155]'}`}>
                                    {book.name}
                                  </span>
                                  {isDeut && <span className="text-[9px] text-[#b44122] font-semibold tracking-wider">THỨ QUY (ĐN)</span>}
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <ChevronRight size={14} className={isSelected ? 'text-blue-500' : 'text-gray-300'} />
                            </div>
                         </button>
                       );
                     } else {
                       // Compact 2-column layout
                       return (
                         <button
                           key={key}
                           id={`book-${key}`}
                           onClick={() => {
                             onSelectBook(key);
                             onClose();
                           }}
                           className={`w-full flex items-center justify-between py-2 px-1.5 rounded transition-all border-b border-gray-50 last:border-0 ${
                             isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                           }`}
                         >
                            <div className="flex items-center gap-1.5 truncate">
                               <span className={`text-[13px] font-bold capitalize whitespace-nowrap ${isSelected ? 'text-blue-600' : 'text-[#d97706]'}`}>
                                 {book.vi}
                               </span>
                               <span className={`text-[13px] truncate ${isSelected ? 'text-blue-700 font-semibold' : 'text-[#334155]'}`}>
                                 {book.name}
                               </span>
                               {isDeut && <span className="text-[9px] font-bold text-[#b44122] ml-0.5">ĐN</span>}
                            </div>
                         </button>
                       );
                     }
                   })}
                 </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-gray-100 flex flex-col gap-4">
           <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5 text-gray-500">
                 <div className="w-1.5 h-1.5 bg-[#d97706] rounded-full"></div>
                 <span>Chú thích: <span className="font-bold">ĐN</span> = Thứ quy (7 cuốn)</span>
              </div>
              <span className="text-gray-400">Quy chuẩn Vatican</span>
           </div>
           
           <div className="flex gap-2">
              <button className="flex-1 bg-[#0f172a] hover:bg-[#1e293b] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-[13px] font-bold transition-colors">
                <Bookmark size={16} className="text-yellow-500" /> Sách Đã Đánh Dấu
              </button>
              <button className="w-11 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors">
                <History size={18} />
              </button>
           </div>
        </div>
      </aside>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  );
}
