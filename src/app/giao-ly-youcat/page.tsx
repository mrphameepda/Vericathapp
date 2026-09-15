'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ALL_YOUCAT_ITEMS,
  getYoucatMenuTree,
  searchYoucat,
  getPartByQuestionId,
  YoucatItem,
  YoucatPartGroup,
  YoucatSectionGroup,
} from '@/lib/youcat';
import YoucatModal from '@/components/YoucatModal';
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  X,
  Hash,
  ListTree,
  FolderOpen,
  Layers,
  CheckCircle2,
  BookMarked,
} from 'lucide-react';

function YoucatPortalContent() {
  const searchParams = useSearchParams();

  const menuTree = useMemo(() => getYoucatMenuTree(), []);

  // Active States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartId, setSelectedPartId] = useState<string>('all'); // 'all', 'part1', 'part2', 'part3', 'part4'
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>({
    part1: true,
    part2: true,
    part3: true,
    part4: true,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [jumpInput, setJumpInput] = useState('');
  const [displayLimit, setDisplayLimit] = useState(30);

  // Sync open question modal from URL query param e.g. ?c=25
  useEffect(() => {
    const cParam = searchParams.get('c');
    if (cParam) {
      const num = parseInt(cParam, 10);
      if (!isNaN(num) && num >= 1 && num <= ALL_YOUCAT_ITEMS.length) {
        setSelectedId(num);
      }
    }
  }, [searchParams]);

  // Open modal & sync URL
  const handleOpenModal = (id: number) => {
    setSelectedId(id);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('c', id.toString());
    window.history.pushState({}, '', newUrl.toString());
  };

  // Close modal & sync URL
  const handleCloseModal = () => {
    setSelectedId(null);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('c');
    window.history.pushState({}, '', newUrl.toString());
  };

  const handleSelectModalId = (id: number) => {
    setSelectedId(id);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('c', id.toString());
    window.history.pushState({}, '', newUrl.toString());
  };

  // Toggle Part accordion expansion
  const togglePartExpand = (partId: string) => {
    setExpandedParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  // Handle section selection from menu
  const handleSelectSection = (partId: string, secId: string) => {
    setSelectedPartId(partId);
    setSelectedSectionId(secId);
    setDisplayLimit(30);
  };

  const handleSelectPart = (partId: string) => {
    setSelectedPartId(partId);
    setSelectedSectionId(null);
    setDisplayLimit(30);
  };

  // Computed active items list based on search, part, and section selection
  const activeItems = useMemo(() => {
    if (searchQuery.trim()) {
      return searchYoucat(searchQuery, selectedPartId);
    }

    if (selectedSectionId) {
      // Find items in selected section
      for (const part of menuTree) {
        for (const sec of part.sections) {
          if (sec.id === selectedSectionId) {
            return sec.items;
          }
        }
      }
    }

    if (selectedPartId !== 'all') {
      const partObj = menuTree.find((p) => p.id === selectedPartId);
      if (partObj) {
        return ALL_YOUCAT_ITEMS.filter(
          (i) => i.id >= partObj.range[0] && i.id <= partObj.range[1]
        );
      }
    }

    return ALL_YOUCAT_ITEMS;
  }, [searchQuery, selectedPartId, selectedSectionId, menuTree]);

  // Handle direct question jump submit
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= ALL_YOUCAT_ITEMS.length) {
      handleOpenModal(num);
    }
  };

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return ALL_YOUCAT_ITEMS.find((i) => i.id === selectedId) || null;
  }, [selectedId]);

  // Find active section details for breadcrumb
  const activeSectionInfo = useMemo(() => {
    if (!selectedSectionId) return null;
    for (const part of menuTree) {
      for (const sec of part.sections) {
        if (sec.id === selectedSectionId) {
          return { part, section: sec };
        }
      }
    }
    return null;
  }, [selectedSectionId, menuTree]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-gradient-to-b from-[#0b132b] via-[#1c2541] to-[#0b132b] text-white py-10 px-4 sm:px-8 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-yellow-400 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft size={14} /> Trang Chủ Vericath
            </Link>
            <span className="text-gray-600 dark:text-gray-400 text-xs">/</span>
            <span className="text-yellow-400 text-xs font-semibold">Giáo Lý Youcat (Menu Từng Phần)</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2.5 border border-yellow-500/30">
                <Sparkles size={14} />
                <span>Mục Lục Giáo Lý Phân Cấp</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-3">
                Tra Cứu Giáo Lý YOUCAT
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Hệ thống 527 câu hỏi được sắp xếp khoa học theo 4 Phần, từng Đoạn & Chương. Chọn mục cần đọc từ Menu hoặc sử dụng ô tìm kiếm nhanh bên dưới.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400 font-serif">527</div>
                <div className="text-[11px] text-gray-300 font-medium">Câu Hỏi & Đáp</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400 font-serif">4</div>
                <div className="text-[11px] text-gray-300 font-medium">Phần Giáo Lý</div>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-serif">8</div>
                <div className="text-[11px] text-gray-300 font-medium">Đoạn Mục Lục</div>
              </div>
            </div>
          </div>

          {/* SEARCH & JUMP BAR */}
          <div className="mt-7 grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Main Search Input */}
            <div className="md:col-span-9 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    setSelectedSectionId(null);
                  }
                }}
                placeholder="Tìm kiếm nội dung (vd: Bí Tích, Cầu Nguyện, Tội Lỗi, Thánh Thể, 25...)"
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-lg transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Direct Question Jump Box */}
            <form onSubmit={handleJumpSubmit} className="md:col-span-3 flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Hash size={16} />
                </div>
                <input
                  type="number"
                  min={1}
                  max={527}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  placeholder="Nhập số câu..."
                  className="w-full pl-9 pr-3 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white focus:text-gray-900 text-white placeholder-gray-400 text-sm font-semibold border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold text-sm rounded-xl transition-colors shadow-md flex-shrink-0"
              >
                Mở
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* 2. MAIN LAYOUT: SIDEBAR MENU + CONTENT AREA */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: MENU PHẦN & ĐOẠN */}
          <aside className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-5 sticky top-6">
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                <ListTree size={18} className="text-yellow-600 dark:text-yellow-400" />
                <span>Mục Lục 4 Phần YOUCAT</span>
              </div>
              <button
                onClick={() => {
                  setSelectedPartId('all');
                  setSelectedSectionId(null);
                  setSearchQuery('');
                }}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  selectedPartId === 'all' && !selectedSectionId && !searchQuery
                    ? 'bg-yellow-500 text-gray-950'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Tất cả (527)
              </button>
            </div>

            {/* PARTS & SECTIONS LIST */}
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {menuTree.map((part) => {
                const isPartSelected = selectedPartId === part.id && !selectedSectionId;
                const isExpanded = expandedParts[part.id];

                return (
                  <div
                    key={part.id}
                    className="rounded-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden bg-gray-50/50 dark:bg-gray-900/40"
                  >
                    {/* Part Header */}
                    <div
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isPartSelected
                          ? 'bg-[#0b132b] text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/60 text-gray-900 dark:text-gray-100'
                      }`}
                      onClick={() => handleSelectPart(part.id)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 ${part.badgeBg} ${part.badgeText}`}>
                          {part.title}
                        </span>
                        <div className="truncate text-xs sm:text-sm font-bold">
                          {part.subtitle}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[11px] font-semibold opacity-75">
                          {part.count} câu
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePartExpand(part.id);
                          }}
                          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Section Items Submenu */}
                    {isExpanded && (
                      <div className="p-2 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700/60">
                        {part.sections.map((sec) => {
                          const isSecSelected = selectedSectionId === sec.id;

                          return (
                            <div
                              key={sec.id}
                              onClick={() => handleSelectSection(part.id, sec.id)}
                              className={`p-2.5 rounded-lg text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                                isSecSelected
                                  ? 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-300 font-bold border-l-4 border-yellow-500 pl-3'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:pl-3'
                              }`}
                            >
                              <div className="flex items-start gap-1.5 min-w-0">
                                <FolderOpen size={14} className="mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                <span className="leading-snug">{sec.sectionTitle}</span>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded flex-shrink-0">
                                {sec.range[0]}-{sec.range[1]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </aside>

          {/* RIGHT MAIN CONTENT AREA: QUESTIONS LIST OF SELECTED PART / SECTION */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TOP STATUS & BREADCRUMB */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider mb-1">
                  <Layers size={14} />
                  <span>
                    {searchQuery
                      ? 'Kết Quả Tìm Kiếm'
                      : activeSectionInfo
                      ? `${activeSectionInfo.part.title} > ${activeSectionInfo.section.sectionTitle}`
                      : selectedPartId !== 'all'
                      ? menuTree.find((p) => p.id === selectedPartId)?.subtitle
                      : 'Tất Cả 527 Câu Hỏi YOUCAT'}
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
                  {searchQuery
                    ? `Từ khóa: "${searchQuery}"`
                    : activeSectionInfo
                    ? activeSectionInfo.section.sectionTitle
                    : selectedPartId !== 'all'
                    ? menuTree.find((p) => p.id === selectedPartId)?.title
                    : 'Toàn Bộ Mục Lục Giáo Lý'}
                </h2>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                  {activeItems.length} câu hỏi
                </span>

                {(searchQuery || selectedSectionId || selectedPartId !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPartId('all');
                      setSelectedSectionId(null);
                    }}
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <X size={14} /> Xóa lọc
                  </button>
                )}
              </div>

            </div>

            {/* COMPACT QUESTIONS LIST VIEW (NO ANSWER SNIPPETS - CLEAN & ELEGANT) */}
            {activeItems.length > 0 ? (
              <>
                <div className="space-y-2.5">
                  {activeItems.slice(0, displayLimit).map((item) => {
                    const partObj = getPartByQuestionId(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenModal(item.id)}
                        className="group bg-white dark:bg-gray-800 rounded-xl px-4 py-3.5 border border-gray-200/80 dark:border-gray-700/80 shadow-sm hover:shadow-md hover:border-yellow-400 dark:hover:border-yellow-500/70 hover:bg-yellow-50/30 dark:hover:bg-gray-700/40 transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer"
                      >
                        {/* Left Info: Question Number, Part Badge, Question Title */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          
                          {/* Question Number Badge */}
                          <span className="px-2.5 py-1 bg-[#0b132b] text-yellow-400 font-serif font-bold text-xs rounded-lg flex-shrink-0 shadow-sm">
                            Câu {item.id}
                          </span>

                          {/* Part Pill */}
                          <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${partObj.badgeBg} ${partObj.badgeText}`}>
                            {partObj.title}
                          </span>

                          {/* Question Title */}
                          <h3 className="text-sm sm:text-base font-serif font-bold text-gray-900 dark:text-gray-100 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors leading-snug truncate">
                            {item.question}
                          </h3>

                        </div>

                        {/* Right Info: KKCG Reference & Arrow */}
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          {item.references && item.references.length > 0 && (
                            <span className="hidden md:inline-block bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                              KKCG {item.references[0]}
                            </span>
                          )}

                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-yellow-500 group-hover:text-gray-950 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-colors">
                            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* LOAD MORE BUTTON */}
                {activeItems.length > displayLimit && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setDisplayLimit((prev) => prev + 30)}
                      className="px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-bold text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-md inline-flex items-center gap-2"
                    >
                      <BookOpen size={16} className="text-yellow-500" />
                      <span>Xem thêm ({activeItems.length - displayLimit} câu tiếp theo)</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Không tìm thấy câu hỏi trong mục này
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Thử chọn phần khác ở Menu bên trái hoặc tìm kiếm từ khóa khác.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPartId('all');
                    setSelectedSectionId(null);
                  }}
                  className="px-6 py-2.5 bg-[#0b132b] text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Xem tất cả câu hỏi
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* 3. INTERACTIVE YOUCAT READER MODAL */}
      <YoucatModal
        item={selectedItem}
        onClose={handleCloseModal}
        onSelectId={handleSelectModalId}
      />

    </div>
  );
}

export default function YoucatPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b132b] text-white flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-serif text-yellow-400">Đang tải Mục Lục Giáo Lý YOUCAT...</p>
          </div>
        </div>
      }
    >
      <YoucatPortalContent />
    </Suspense>
  );
}
