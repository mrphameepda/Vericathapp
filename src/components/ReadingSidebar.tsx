'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, X, BookOpen, Calendar as CalendarIcon, Sunrise, Star, Heart } from 'lucide-react';
import { ReadingIndexItem } from '@/lib/loi-chua';

interface Props {
  indexData: ReadingIndexItem[];
}

type GroupedData = {
  thuongNien: Record<string, ReadingIndexItem[]>;
  muaPhungVu: Record<string, ReadingIndexItem[]>;
  leKinhChua: ReadingIndexItem[];
  thang: Record<string, ReadingIndexItem[]>;
};

export default function ReadingSidebar({ indexData }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'thuongNien': true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const grouped = useMemo(() => {
    const data: GroupedData = {
      thuongNien: {},
      muaPhungVu: {},
      leKinhChua: [],
      thang: {}
    };

    indexData.forEach(item => {
      const mua = item.thong_tin_ngay.mua_phung_vu;
      let tuan = item.thong_tin_ngay.tuan;
      const ngay = item.thong_tin_ngay.ngay;
      const tieuDe = item.tieu_de.toLowerCase();

      // Fix: "Chúa Giê-su chịu phép rửa" thuộc Tuần I Thường Niên theo yêu cầu
      if (tieuDe.includes('phép rửa')) {
        if (!data.thuongNien['Tuần I']) data.thuongNien['Tuần I'] = [];
        data.thuongNien['Tuần I'].push(item);
        return;
      }

      // Lễ Kính Chúa (Chúa Ba Ngôi, Mình Máu Thánh, Thánh Tâm)
      // Fix: Loại bỏ 'kitô vua' khỏi Lễ Kính Chúa để nó về Tuần XXXIV
      if (tieuDe.includes('ba ngôi') || tieuDe.includes('mình máu') || tieuDe.includes('thánh tâm')) {
        data.leKinhChua.push(item);
        return;
      }

      // Lễ kính các Thánh (dựa vào ngày ví dụ 01/01)
      if (ngay && ngay.includes('/')) {
        const month = ngay.split('/')[1];
        if (month) {
          const monthKey = `Tháng ${parseInt(month, 10)}`;
          if (!data.thang[monthKey]) data.thang[monthKey] = [];
          data.thang[monthKey].push(item);
        }
        return;
      }

      // Fix: Xử lý các ngày bị thiếu (mua_phung_vu bị null trong data)
      let resolvedMua = mua;
      if (!resolvedMua) {
        if (tieuDe.includes('thánh gia') || tieuDe.includes('hiển linh')) {
          resolvedMua = 'Mùa Giáng Sinh';
        } else if (tieuDe.includes('lễ tro') || tieuDe.includes('tuần thánh') || tieuDe.includes('lễ lá')) {
          resolvedMua = 'Mùa Chay';
        } else if (tieuDe.includes('ps') || tieuDe.includes('thăng thiên') || tieuDe.includes('hiện xuống') || tieuDe.includes('lòng thương xót')) {
          resolvedMua = 'Mùa Phục Sinh';
        }
      }

      // Fix: Ensure CN XXXIV is correctly identified
      if (tieuDe.includes('xxxiv tn')) {
        tuan = 'XXXIV';
      }

      if (resolvedMua === 'Mùa Thường Niên' || resolvedMua === 'Mùa thường niên' || tieuDe.includes('xxxiv tn')) {
        const tuanKey = tuan ? `Tuần ${tuan}` : 'Khác';
        if (!data.thuongNien[tuanKey]) data.thuongNien[tuanKey] = [];
        data.thuongNien[tuanKey].push(item);
      } else if (resolvedMua) {
        if (!data.muaPhungVu[resolvedMua]) data.muaPhungVu[resolvedMua] = [];
        data.muaPhungVu[resolvedMua].push(item);
      }
    });

    return data;
  }, [indexData]);

  const renderLinks = (items: ReadingIndexItem[]) => (
    <ul className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2 space-y-1 mt-1">
      {items.map(item => {
        const isActive = pathname === `/bai-doc-hang-ngay/${item.ma_dinh_danh}`;
        return (
          <li key={item.ma_dinh_danh}>
            <Link 
              href={`/bai-doc-hang-ngay/${item.ma_dinh_danh}`}
              onClick={() => setIsOpen(false)}
              className={`block py-1.5 px-3 rounded-md text-sm transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.tieu_de}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const AccordionItem = ({ title, icon: Icon, sectionId, children }: any) => {
    const isExpanded = expandedSections[sectionId];
    return (
      <div className="mb-2">
        <button 
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 text-sm">
            <Icon size={18} className="text-blue-600 dark:text-blue-400" />
            {title}
          </div>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        {isExpanded && <div className="mt-2 ml-2 pl-2 border-l-2 border-gray-100 dark:border-gray-800">{children}</div>}
      </div>
    );
  };

  const SubAccordion = ({ title, items, sectionId }: any) => {
    const isExpanded = expandedSections[sectionId];
    return (
      <div className="mb-1">
        <button 
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          {title}
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isExpanded && renderLinks(items)}
      </div>
    );
  };

  // Helper to safely extract week number for correct sorting (Tuần I, II, III...)
  const romanToInt = (s: string) => {
    const romanMap: Record<string, number> = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    let num = 0;
    for (let i = 0; i < s.length; i++) {
        if (i < s.length - 1 && romanMap[s[i]] < romanMap[s[i + 1]]) {
            num -= romanMap[s[i]];
        } else {
            num += romanMap[s[i]];
        }
    }
    return num;
  };

  return (
    <>
      {/* Mobile Toggle Button (Visible only on mobile) */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:relative top-0 lg:top-0 left-0 h-[100dvh] lg:h-auto w-[320px] bg-white dark:bg-[#111c3a] border-r border-gray-200 dark:border-gray-800 z-50 lg:z-10 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <button 
          type="button"
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full z-10"
        >
          <X size={20} />
        </button>
        
        <div className="flex-1 overflow-y-auto lg:overflow-visible pb-20 lg:pb-8 p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Danh Mục Lời Chúa</h2>
          </div>
          
          {/* MÙA THƯỜNG NIÊN */}
          <div className="mb-2">
            <button 
              type="button"
              onClick={() => toggleSection('thuongNien')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 text-sm">
                <Sunrise size={18} className="text-blue-600 dark:text-blue-400" />
                MÙA THƯỜNG NIÊN
              </div>
              {expandedSections['thuongNien'] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {expandedSections['thuongNien'] && (
              <div className="mt-2 ml-2 pl-2 border-l-2 border-gray-100 dark:border-gray-800">
                {Object.entries(grouped.thuongNien).sort((a,b) => {
                    const romanA = a[0].replace('Tuần ', '');
                    const romanB = b[0].replace('Tuần ', '');
                    return romanToInt(romanA) - romanToInt(romanB);
                }).map(([tuan, items]) => {
                  const sId = `tn-${tuan}`;
                  return (
                    <div className="mb-1" key={tuan}>
                      <button 
                        type="button"
                        onClick={() => toggleSection(sId)}
                        className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      >
                        {tuan}
                        {expandedSections[sId] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {expandedSections[sId] && renderLinks(items)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LỄ KÍNH CHÚA */}
          <div className="mb-2">
            <button 
              type="button"
              onClick={() => toggleSection('leKinhChua')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 text-sm">
                <Star size={18} className="text-blue-600 dark:text-blue-400" />
                LỄ KÍNH CHÚA
              </div>
              {expandedSections['leKinhChua'] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {expandedSections['leKinhChua'] && (
              <div className="mt-2 ml-2 pl-2 border-l-2 border-gray-100 dark:border-gray-800">
                {renderLinks(grouped.leKinhChua)}
              </div>
            )}
          </div>

          {/* CÁC MÙA PHỤNG VỤ */}
          <div className="mb-2">
            <button 
              type="button"
              onClick={() => toggleSection('muaPhungVu')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 text-sm">
                <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400" />
                CÁC MÙA PHỤNG VỤ
              </div>
              {expandedSections['muaPhungVu'] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {expandedSections['muaPhungVu'] && (
              <div className="mt-2 ml-2 pl-2 border-l-2 border-gray-100 dark:border-gray-800">
                {Object.entries(grouped.muaPhungVu).map(([mua, items]) => {
                  const sId = `mua-${mua}`;
                  return (
                    <div className="mb-1" key={mua}>
                      <button 
                        type="button"
                        onClick={() => toggleSection(sId)}
                        className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      >
                        {mua}
                        {expandedSections[sId] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {expandedSections[sId] && renderLinks(items)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LỄ KÍNH CÁC THÁNH */}
          <div className="mb-2">
            <button 
              type="button"
              onClick={() => toggleSection('thang')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 font-semibold text-gray-800 dark:text-gray-200 text-sm">
                <Heart size={18} className="text-blue-600 dark:text-blue-400" />
                LỄ KÍNH CÁC THÁNH
              </div>
              {expandedSections['thang'] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {expandedSections['thang'] && (
              <div className="mt-2 ml-2 pl-2 border-l-2 border-gray-100 dark:border-gray-800">
                {Object.entries(grouped.thang).sort((a,b) => {
                  const numA = parseInt(a[0].replace('Tháng ', ''));
                  const numB = parseInt(b[0].replace('Tháng ', ''));
                  return numA - numB;
                }).map(([thang, items]) => {
                  const sId = `thang-${thang}`;
                  return (
                    <div className="mb-1" key={thang}>
                      <button 
                        type="button"
                        onClick={() => toggleSection(sId)}
                        className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      >
                        {thang}
                        {expandedSections[sId] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {expandedSections[sId] && renderLinks(items)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
