import React from 'react';
import { getBookBySlug, getAllBooks } from '@/lib/giao-luat-server';
import { notFound } from 'next/navigation';
import CanonLawViewer from '@/components/CanonLawViewer';
import ScrollToMuc from '@/components/ScrollToMuc';
import { Metadata } from 'next';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const book = getBookBySlug(resolvedParams.slug);
  if (!book) {
    return { title: 'Không tìm thấy' };
  }
  return {
    title: `${book.title} | Giáo Luật Công Giáo 1983`,
    description: `Nội dung ${book.title} - Bộ Giáo Luật Công Giáo 1983 song ngữ Việt - Anh.`,
  };
}

export function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export default async function CanonLawBookPage({ params }: PageProps) {
  const resolvedParams = await params;
  const book = getBookBySlug(resolvedParams.slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Suspense fallback={null}>
        <ScrollToMuc />
      </Suspense>
      <div className="bg-white dark:bg-[#111c3a] border-b border-gray-200 dark:border-gray-800 sticky top-[64px] z-20">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400">
            {book.title}
          </h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <CanonLawViewer node={book} />
        </div>
      </div>
    </div>
  );
}
