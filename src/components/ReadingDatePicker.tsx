'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';

export default function ReadingDatePicker() {
  const router = useRouter();
  const params = useParams();
  
  // Try to get current date from params if valid
  const defaultDate = params.date && typeof params.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
    ? params.date
    : new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      setDate(selectedDate);
      router.push(`/bai-doc-hang-ngay/${selectedDate}`);
    }
  };

  return (
    <div className="relative group">
      <input 
        type="date" 
        value={date}
        onChange={handleDateChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm px-4 py-2 rounded-full font-medium text-gray-700 dark:text-gray-300 transition-colors">
        <CalendarIcon size={16} className="text-blue-600 dark:text-blue-400" /> 
        Chọn Ngày Khác
        <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
      </button>
    </div>
  );
}
