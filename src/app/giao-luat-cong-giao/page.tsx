import React from 'react';
import Link from 'next/link';
import { getAllBooks } from '@/lib/giao-luat-server';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Giáo Luật Công Giáo 1983 - Code of Canon Law',
  description: 'Tra cứu Bộ Giáo Luật Công Giáo 1983 song ngữ Việt - Anh. Đầy đủ 7 quyển, tra cứu dễ dàng.',
};

export default function CanonLawPage() {
  const books = getAllBooks();

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-4 tracking-tight">
          Bộ Giáo Luật Công Giáo 1983
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Code of Canon Law (Bản dịch song ngữ Việt - Anh)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book, index) => (
          <Link
            key={book.slug || index}
            href={`/giao-luat-cong-giao/${book.slug}`}
            className="block group bg-white dark:bg-[#1a233a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <BookOpen size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  Quyển {book.id}
                </h2>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {book.title.replace(`QUYỂN ${book.id}. `, '')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
