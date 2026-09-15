"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react';

interface MenuItem {
  title: string;
  slug: string;
  level: number;
  kind: string;
  paragraph_start: number | null;
  paragraph_end: number | null;
  children?: MenuItem[];
}

export default function CCCSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/ccc/menu')
      .then(res => res.json())
      .then(data => {
        setMenu(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load menu:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4">
        {menu.map((item, idx) => (
          <MenuNode key={idx} item={item} currentPath={pathname} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function MenuNode({ item, currentPath, onNavigate }: { item: MenuItem, currentPath: string, onNavigate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  // Auto open if a child is active
  useEffect(() => {
    if (hasChildren && currentPath) {
      const isChildActive = checkActiveRecursive(item, currentPath);
      if (isChildActive) setIsOpen(true);
    }
  }, [currentPath, hasChildren, item]);

  const isActive = currentPath === `/giao-ly-cong-giao/${item.slug}`;

  return (
    <div className="mb-1">
      <div 
        className={`flex items-start p-2 rounded-lg transition-colors ${
          isActive ? 'bg-red-50 text-red-700' : 'hover:bg-slate-100 text-slate-700'
        }`}
      >
        {hasChildren ? (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="mt-1 mr-1 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-5" /> // spacer
        )}
        
        {/* If item has slug, it's a link, otherwise just a label */}
        {item.slug ? (
          <Link 
            href={`/giao-ly-cong-giao/${item.slug}`} 
            className={`flex-1 text-sm ${isActive ? 'font-semibold' : ''}`}
            onClick={onNavigate}
          >
            {item.title}
          </Link>
        ) : (
          <span className="flex-1 text-sm font-medium text-slate-800">{item.title}</span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-4 pl-2 border-l border-slate-200 mt-1">
          {item.children!.map((child, idx) => (
            <MenuNode key={idx} item={child} currentPath={currentPath} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

function checkActiveRecursive(node: MenuItem, path: string): boolean {
  if (`/giao-ly-cong-giao/${node.slug}` === path) return true;
  if (node.children) {
    for (const child of node.children) {
      if (checkActiveRecursive(child, path)) return true;
    }
  }
  return false;
}
