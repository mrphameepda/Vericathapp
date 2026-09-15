"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface SearchResult {
  number: number;
  heading: string;
  path: string;
  slug: string;
  snippet: string;
}

export default function CCCSearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/ccc/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setLoading(false);
      });
  }, [query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-red-600" />
        <p>Đang tìm kiếm "{query}"...</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p className="text-lg">Không tìm thấy kết quả nào cho "{query}".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 font-serif border-b border-slate-200 pb-4">
        Kết quả tìm kiếm cho: <span className="text-red-700">"{query}"</span> ({results.length} kết quả)
      </h2>
      
      <div className="space-y-8">
        {results.map((result, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:border-red-200 transition-colors">
            <Link href={`/giao-ly-cong-giao/${result.slug}#so-${result.number}`} className="block group">
              <div className="text-xs text-slate-500 mb-2 truncate">{result.path}</div>
              <h3 className="text-xl font-bold text-red-700 group-hover:text-red-800 mb-2 flex items-baseline gap-2">
                <span className="text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded-full shrink-0">Số {result.number}</span>
                <span>{result.heading || `Đoạn ${result.number}`}</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: highlight(result.snippet, query) }} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return text.replace(regex, '<mark className="bg-yellow-200 text-slate-900 font-semibold px-1 rounded">$1</mark>');
}
