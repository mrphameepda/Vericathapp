'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { CanonLawNode } from '@/lib/giao-luat-server';

interface CanonLawSearchProps {
  isOpen: boolean;
  onClose: () => void;
  books: CanonLawNode[];
}

export default function CanonLawSearch({ isOpen, onClose, books }: CanonLawSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ bookSlug: string; canon: CanonLawNode }[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const found: { bookSlug: string; canon: CanonLawNode }[] = [];

    const searchNode = (node: CanonLawNode, bookSlug: string) => {
      if (node.type === 'ĐIỀU') {
        const textToSearch = `${node.id} ${node.title} ${node.content} ${node.content_en || ''}`.toLowerCase();
        if (textToSearch.includes(q) || node.id.toString() === q) {
          found.push({ bookSlug, canon: node });
        }
      }
      if (Array.isArray(node.content)) {
        node.content.forEach(child => searchNode(child, bookSlug));
      }
    };

    books.forEach(book => searchNode(book, book.slug!));
    setResults(found.slice(0, 50)); // limit to 50 results
  }, [query, books]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#111c3a] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <Search className="w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-4 text-gray-900 dark:text-gray-100 text-lg placeholder-gray-400"
            placeholder="Tìm theo số Điều (vd: 1055) hoặc từ khóa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {query && results.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Không tìm thấy kết quả nào cho "{query}"
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((res, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      router.push(`/giao-luat/${res.bookSlug}#${res.canon.id}`);
                      onClose();
                    }}
                  >
                    <div className="font-bold text-blue-700 dark:text-blue-400">Điều {res.canon.id}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                      {res.canon.content as string}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
