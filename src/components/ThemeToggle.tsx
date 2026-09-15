"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && document.documentElement.classList.contains('dark'))) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!mounted) return <div className="w-8 h-8"></div>;

  return (
    <button 
      onClick={toggleTheme} 
      className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-gray-800 transition-colors"
      title="Bật/Tắt chế độ Tối"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
