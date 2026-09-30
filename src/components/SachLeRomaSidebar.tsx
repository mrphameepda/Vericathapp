"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, ChevronRight, X } from 'lucide-react';
import { SACH_LE_ROMA_TABS } from '@/lib/sach-le-roma-tabs';

interface SachLeRomaSidebarProps {
  className?: string;
}

export default function SachLeRomaSidebar({ className }: SachLeRomaSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const closeSidebar = () => setIsOpen(false);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed left-4 bottom-24 z-50 p-3 bg-red-800 text-white rounded-full shadow-lg hover:bg-red-700 transition-all active:scale-95"
        aria-label="Menu Sách Lễ Rô-ma"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Book className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-20 left-0 h-[100dvh] lg:h-[calc(100vh-5rem)] w-72 md:w-80 bg-white/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-r border-red-100/50 transform transition-transform duration-300 ease-in-out z-40 flex flex-col shadow-2xl lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${className || ""}`}
      >
        <div className="p-6 border-b border-red-100/50 lg:hidden">
          <h2 className="text-xl font-bold text-red-900 font-serif flex items-center gap-2">
            <Book className="w-6 h-6" />
            Sách Lễ Rô-ma
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar px-3">
          <div className="space-y-1">
            {SACH_LE_ROMA_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname.includes(`/sach-le-roma/${tab.id}`);
              
              return (
                <Link
                  key={tab.id}
                  href={`/sach-le-roma/${tab.id}`}
                  onClick={closeSidebar}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-red-800 text-white shadow-md shadow-red-900/10" : "text-slate-700 hover:bg-red-50 hover:text-red-900"}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "text-red-200 scale-110" : "text-slate-400 group-hover:text-red-600"}`} />
                    <span className={`font-medium line-clamp-2 leading-tight ${isActive ? "font-semibold" : ""}`}>
                      {tab.name}
                    </span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
