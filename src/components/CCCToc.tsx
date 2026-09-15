"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function CCCToc({ onNavigate }: { onNavigate?: () => void }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Give DOM a little time to render the new page content
    const timeout = setTimeout(() => {
      const wrapper = document.querySelector('.ccc-content-wrapper');
      if (!wrapper) return;

      const headings = Array.from(wrapper.querySelectorAll('h1, h2, h3, h4, h5'));
      const items: TocItem[] = [];

      headings.forEach((heading, idx) => {
        const text = heading.textContent || '';
        // Skip empty headings
        if (!text.trim()) return;

        // Assign an ID if it doesn't have one
        if (!heading.id) {
          heading.id = `toc-${idx}`;
        }

        let level = parseInt(heading.tagName.replace('H', ''), 10);
        
        items.push({
          id: heading.id,
          text,
          level,
        });
      });

      setToc(items);
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (onNavigate) onNavigate();
    }
  };

  if (toc.length === 0) {
    return (
      <div className="p-4 text-slate-500 text-sm italic">
        Đang cập nhật mục lục...
      </div>
    );
  }

  // Find the minimum level to normalize indentation (e.g. if highest is h3, level 3 becomes indent 0)
  const minLevel = Math.min(...toc.map(item => item.level));

  return (
    <div className="p-4">
      <ul className="flex flex-col gap-1">
        {toc.map((item, idx) => (
          <li 
            key={idx} 
            style={{ paddingLeft: `${(item.level - minLevel) * 0.75}rem` }}
          >
            <a 
              href={`#${item.id}`} 
              onClick={(e) => handleClick(e, item.id)}
              className="text-sm text-slate-700 hover:text-red-700 hover:bg-slate-100 block p-2 rounded-lg leading-snug transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
