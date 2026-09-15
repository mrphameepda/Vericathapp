import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, User, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { getSingleVericathPost } from '@/lib/vericath';

export const metadata = {
  title: 'Đọc Bài Viết | Vericath',
  description: 'Cổng thông tin & tra cứu học thuật Công Giáo',
};

interface PageProps {
  searchParams: Promise<{ url?: string; id?: string }>;
}

export default async function ArticleReaderPage({ searchParams }: PageProps) {
  const { url, id } = await searchParams;
  const target = url || id || '';

  const post = target ? await getSingleVericathPost(target) : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h1 className="text-xl font-bold mb-2 font-serif">Không tìm thấy bài viết</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Bài viết bạn yêu cầu không tồn tại hoặc có thể đã bị di chuyển.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0b132b] text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors duration-200">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Trang Chủ</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="font-serif font-bold text-base tracking-wide text-gray-900 dark:text-white">
              VERICATH
            </span>
          </div>

          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs shadow"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Trang gốc Vericath.org</span>
          </a>
        </div>
      </header>

      {/* ARTICLE CONTENT BODY */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <article className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 sm:p-10 shadow-sm">
          {/* Category Tag */}
          <div className="mb-4">
            <span className="bg-yellow-500/90 text-gray-900 font-bold text-xs uppercase px-3 py-1 rounded tracking-wider shadow-sm inline-block">
              {post.categoryName}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4 leading-snug">
            {post.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium pb-6 mb-8 border-b border-gray-100 dark:border-gray-700/60">
            <span className="flex items-center gap-1.5">
              <User size={15} className="text-yellow-600 dark:text-yellow-500" />
              {post.authorName}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar size={15} />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Featured Image Banner */}
          {post.imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden max-h-[450px] w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Text Content */}
          {post.content ? (
            <div
              className="article-reader-content prose dark:prose-invert max-w-none font-serif text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-gray-500 italic py-8 text-center">Không thể tải nội dung bài viết.</p>
          )}

          {/* Bottom Actions Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              <span>Quay lại trang chủ</span>
            </Link>

            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl shadow transition-transform hover:scale-105 flex items-center justify-center gap-2 text-sm"
            >
              <ExternalLink size={16} />
              <span>Xem bài viết trên trang gốc Vericath.org</span>
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}
