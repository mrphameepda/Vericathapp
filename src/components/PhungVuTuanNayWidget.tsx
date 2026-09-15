'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LiturgyDay } from '@/lib/liturgy';
import { BookOpen, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface Props {
  weekLiturgy: LiturgyDay[];
  todayStr: string;
}

export default function PhungVuTuanNayWidget({ weekLiturgy, todayStr }: Props) {
  // Default selected day is today (or first day if today not found)
  const initialSelected = weekLiturgy.find((d) => d.ngay === todayStr) || weekLiturgy[0] || null;
  const [selectedDay, setSelectedDay] = useState<LiturgyDay | null>(initialSelected);

  if (!weekLiturgy || weekLiturgy.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 text-center text-sm text-gray-500">
        Đang cập nhật lịch phụng vụ tuần này...
      </div>
    );
  }

  const activeDay = selectedDay || weekLiturgy[0];

  // Helper for Day Abbreviation (CN, T2, T3, T4, T5, T6, T7)
  const getDayAbbr = (thu: string) => {
    if (thu.includes('Chúa Nhật') || thu.includes('Chúa nhật')) return 'CN';
    if (thu.includes('Hai')) return 'T2';
    if (thu.includes('Ba')) return 'T3';
    if (thu.includes('Tư')) return 'T4';
    if (thu.includes('Năm')) return 'T5';
    if (thu.includes('Sáu')) return 'T6';
    if (thu.includes('Bảy')) return 'T7';
    return 'T2';
  };

  // Helper for Season Pill Color
  const getSeasonBadgeStyle = (mua: string | null, color: string) => {
    if (color === 'Tím' || (mua && mua.toLowerCase().includes('chay'))) {
      return 'bg-purple-600 text-white';
    }
    if (color === 'Đỏ') {
      return 'bg-red-600 text-white';
    }
    if (color === 'Trắng') {
      return 'bg-amber-500 text-gray-950 font-bold';
    }
    return 'bg-emerald-600 text-white'; // Default Thường Niên
  };

  // Helper for Liturgical Dot Color below Date Number
  const getDotColor = (day: LiturgyDay) => {
    if (day.thu.includes('Chúa Nhật')) return 'bg-emerald-500';
    if (day.mau_sac === 'Đỏ') return 'bg-red-500';
    if (day.mau_sac === 'Tím') return 'bg-purple-500';
    if (day.mau_sac === 'Trắng') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // Format date display: e.g. "15 tháng 9, 2026"
  const formatFullDateDisplay = (day: LiturgyDay) => {
    return `${day.ngay.split('-')[2]} tháng ${day.thang}, ${day.nam}`;
  };

  return (
    <div className="w-full bg-[#f1f3f5] dark:bg-gray-800/80 rounded-3xl p-4 sm:p-6 border border-gray-200/90 dark:border-gray-700/80 shadow-md space-y-5">
      
      {/* 1. TOP HORIZONTAL WEEK CALENDAR STRIP (MATCHING HÌNH 2) */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {weekLiturgy.map((day) => {
          const isToday = day.ngay === todayStr;
          const isSelected = activeDay?.ngay === day.ngay;
          const isSunday = day.thu.includes('Chúa Nhật');
          const dayNum = day.ngay.split('-')[2];
          const abbr = getDayAbbr(day.thu);

          return (
            <button
              key={day.ngay}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[48px] sm:min-w-[56px] flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-200 relative ${
                isSelected
                  ? 'bg-white dark:bg-gray-900 border-2 border-amber-500 shadow-md scale-105 z-10'
                  : 'hover:bg-white/60 dark:hover:bg-gray-700/60 border border-transparent'
              }`}
            >
              {/* Day Abbreviation */}
              <span
                className={`text-xs font-bold ${
                  isSunday
                    ? 'text-red-600 dark:text-red-400'
                    : isSelected
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {abbr}
              </span>

              {/* HÔM NAY Badge inside active today item */}
              {isToday && (
                <span className="text-[8px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-tighter -my-0.5">
                  HÔM NAY
                </span>
              )}

              {/* Date Number */}
              <span
                className={`text-base sm:text-lg font-bold font-serif my-0.5 ${
                  isSunday
                    ? 'text-red-600 dark:text-red-400'
                    : isSelected
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {dayNum}
              </span>

              {/* Status Dot */}
              <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(day)}`}></span>
            </button>
          );
        })}
      </div>

      {/* 2. SELECTED DAY DETAILS CARD (MATCHING HÌNH 2) */}
      {activeDay && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-4">
          
          {/* Header Row: Book Icon + Day Name + Date vs Season Badge */}
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex items-center gap-3">
              {/* Soft Book Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                <BookOpen size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {activeDay.thu}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {formatFullDateDisplay(activeDay)}
                </p>
              </div>
            </div>

            {/* Season Badge (e.g. THƯỜNG NIÊN / MÙA CHAY) */}
            <div
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm flex-shrink-0 ${getSeasonBadgeStyle(
                activeDay.mua_phung_vu,
                activeDay.mau_sac
              )}`}
            >
              {activeDay.mua_phung_vu || activeDay.tuan || 'THƯỜNG NIÊN'}
            </div>

          </div>

          {/* Feast Info Row */}
          <div className="pt-2 flex items-center flex-wrap gap-2.5">
            {activeDay.bac_le && (
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold">
                {activeDay.bac_le}
              </span>
            )}

            <span className="text-base sm:text-lg font-serif font-bold text-emerald-700 dark:text-emerald-400">
              {activeDay.ten_le || activeDay.tuan || 'Ngày Thường Phụng Vụ'}
            </span>
          </div>

          {/* Readings Citation Row */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="space-y-1">
              {activeDay.phuc_am?.trich_dan && (
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Phúc Âm:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{activeDay.phuc_am.trich_dan}</span>
                </div>
              )}
              {activeDay.bai_doc_1?.trich_dan && (
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Bài đọc 1:</span>
                  <span className="font-mono">{activeDay.bai_doc_1.trich_dan}</span>
                </div>
              )}
            </div>

            <Link
              href="/bai-doc-hang-ngay"
              className="inline-flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-400 hover:underline text-xs uppercase tracking-wider self-end sm:self-auto"
            >
              <span>Xem bài đọc ngày này</span>
              <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
