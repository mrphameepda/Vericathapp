"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { LiturgyDay } from '@/lib/liturgy';

export default function LiturgicalCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<LiturgyDay[]>([]);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    const fetchMonthData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/lich-phung-vu?month=${month}&year=${year}`);
        if (res.ok) {
          const data = await res.json();
          setMonthData(data);
        } else {
          setMonthData([]);
        }
      } catch (error) {
        console.error("Failed to fetch calendar", error);
        setMonthData([]);
      }
      setLoading(false);
    };
    
    fetchMonthData();
  }, [month, year]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  // Generate calendar grid
  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m - 1, 1).getDay();
    // JS getDay(): 0=Sun, 1=Mon. 
    return day === 0 ? 7 : day; // We'll make Monday=1, Sunday=7 for standard calendar or Sunday=0
  };

  // Let's use Sunday=0 for simplicity
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayData = (d: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return monthData.find(item => item.ngay === dateStr);
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'Tím': return 'text-purple-800 dark:text-purple-300';
      case 'Đỏ': return 'text-red-700 dark:text-red-400';
      case 'Trắng': return 'text-gray-900 dark:text-gray-100';
      case 'Xanh': return 'text-green-800 dark:text-green-400';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'Tím': return 'bg-purple-500';
      case 'Đỏ': return 'bg-red-500';
      case 'Trắng': return 'bg-gray-300 dark:bg-gray-500';
      case 'Xanh': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors duration-200">
      {/* HEADER */}
      <header className="w-full bg-[#0b132b] text-white border-b border-gray-800 py-4 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BookOpen className="text-yellow-500" size={28} />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">Vericath</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
             <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">Lịch Phụng Vụ</h1>
            <p className="text-gray-500 dark:text-gray-400">Tra cứu Lịch Công giáo, Bậc lễ và Bài đọc.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"><ChevronLeft size={20} /></button>
            <div className="font-bold min-w-[120px] text-center text-lg">
              Tháng {month} / {year}
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Days of week - Only visible on lg screens */}
          <div className="hidden lg:grid grid-cols-7 bg-[#0556b3] dark:bg-[#0b132b] text-white">
            {['CN', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'].map(day => (
              <div key={day} className={`py-4 text-center text-sm font-bold ${day === 'CN' ? 'text-red-300' : ''}`}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Days grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 relative">
            {loading && (
               <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="animate-pulse font-bold text-blue-600">Đang tải lịch...</div>
               </div>
            )}
            
            {blanks.map(b => (
              <div key={`blank-${b}`} className="hidden lg:block min-h-[140px] border-b border-r border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20"></div>
            ))}
            
            {days.map(d => {
              const data = getDayData(d);
              const isToday = d === new Date().getDate() && month === new Date().getMonth() + 1 && year === new Date().getFullYear();
              const isSunday = data?.thu === 'Chúa Nhật';
              
              return (
                <div key={d} className={`min-h-[140px] flex flex-col border-b lg:border-r border-gray-100 dark:border-gray-700/50 p-3 lg:p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 relative group ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${
                        isSunday || data?.bac_le === 'Trọng' ? 'text-red-600 dark:text-red-400' : 
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {d}
                      </span>
                      {/* Weekday for mobile */}
                      {data && (
                        <span className="lg:hidden text-sm font-bold text-gray-500 dark:text-gray-400">
                          {data.thu}
                        </span>
                      )}
                    </div>
                    {data?.mau_sac && (
                      <span className={`w-3 h-3 rounded-full ${getBadgeColor(data.mau_sac)}`} title={`Màu: ${data.mau_sac}`}></span>
                    )}
                  </div>
                  
                  {data && (
                    <div className="space-y-1.5 flex flex-col flex-1 mt-1">
                      {data.ten_le && (
                        <div className="flex flex-col">
                          {data.bac_le && <span className="text-[11px] italic text-gray-500 dark:text-gray-400 mb-0.5">Lễ {data.bac_le}</span>}
                          <div className={`text-[13px] leading-snug font-bold ${getColorClass(data.mau_sac)}`}>
                            {data.ten_le}
                          </div>
                        </div>
                      )}
                      {!data.ten_le && data.tuan && (
                         <div className={`text-[13px] leading-snug font-bold ${getColorClass(data.mau_sac)}`}>
                          {data.tuan}
                        </div>
                      )}
                      
                      {data.phuc_am?.trich_dan && (
                        <div className="mt-auto pt-3 flex flex-col gap-1.5 w-full">
                          <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md font-medium truncate">
                            TM: {data.phuc_am.trich_dan}
                          </span>
                          <Link 
                            href={`/bai-doc-hang-ngay/${data.ngay}`} 
                            className="flex items-center justify-center gap-1.5 w-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold py-1.5 rounded transition-colors"
                          >
                            <BookOpen size={12} /> Đọc Lời Chúa
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
