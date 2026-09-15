'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Check, Lock, User, Calendar } from 'lucide-react';
import { WPPostItem } from '@/lib/vericath';

interface Props {
  initialBlock1Posts?: WPPostItem[];
  initialBlock2Posts?: WPPostItem[];
}

const FALLBACK_BLOCK1_POSTS: WPPostItem[] = [
  {
    id: 9901,
    title: 'Đức Mẹ Pắc Nặm - Quan Thầy Giáo Phận Bắc Ninh',
    link: 'https://vericath.org/duc-me-pac-nam/',
    date: '2026-08-30',
    categoryName: 'BẠN CÓ BIẾT?',
    authorName: 'Vericath Editor',
    imageUrl: 'https://vericath.org/wp-content/uploads/2026/08/duc-me-pac-nam.jpg',
    content: '',
  },
  {
    id: 9902,
    title: 'Những nhà khoa học nổi tiếng tin vào Thiên Chúa',
    link: 'https://vericath.org/nhung-nha-khoa-hoc-noi-tieng-tin-vao-thien-chua/',
    date: '2026-06-28',
    categoryName: 'BẠN CÓ BIẾT?',
    authorName: 'Vericath Editor',
    imageUrl: 'https://vericath.org/wp-content/uploads/2026/06/khoa-hoc-tin-vao-thien-chua.jpg',
    content: '',
  },
  {
    id: 9903,
    title: 'Phương pháp Synchronic (Đọc Kinh Thánh theo chương)',
    link: 'https://vericath.org/phuong-phap-synchronic/',
    date: '2026-05-15',
    categoryName: 'KINH THÁNH & CHÚ GIẢI',
    authorName: 'Vericath Editor',
    imageUrl: 'https://vericath.org/wp-content/uploads/2026/05/phuong-phap-synchronic.jpg',
    content: '',
  },
];

const FALLBACK_BLOCK2_POSTS: WPPostItem[] = [
  {
    id: 9904,
    title: 'Chia sẻ Font Tiếng Việt dành riêng cho thiết kế Công Giáo',
    link: 'https://vericath.org/chia-se-font-tieng-viet-cong-giao/',
    date: '2026-04-10',
    categoryName: 'FONT VIỆT HÓA',
    authorName: 'Vericath Editor',
    imageUrl: 'https://vericath.org/wp-content/uploads/2026/04/font-viet-hoa-cong-giao.jpg',
    content: '',
  },
  {
    id: 9905,
    title: 'Mẫu bằng ân nhân Công giáo',
    link: 'https://vericath.org/mau-bang-an-nhan-cong-giao/',
    date: '2025-03-05',
    categoryName: 'THIẾT KẾ',
    authorName: 'Giuse Phạm Duy Ái, SDS',
    imageUrl: 'https://vericath.org/wp-content/uploads/2025/03/mau-bang-an-nhan.jpg',
    content: '',
  },
  {
    id: 9906,
    title: 'Mẫu Giấy Khen Giáo Lý Công Giáo',
    link: 'https://vericath.org/mau-giay-khen-giao-ly-cong-giao/',
    date: '2025-03-05',
    categoryName: 'THIẾT KẾ',
    authorName: 'Giuse Phạm Duy Ái, SDS',
    imageUrl: 'https://vericath.org/wp-content/uploads/2025/03/giay-khen-giao-ly.jpg',
    content: '',
  },
];

export default function VericathArticles({
  initialBlock1Posts = [],
  initialBlock2Posts = [],
}: Props) {
  const [posts1, setPosts1] = useState<WPPostItem[]>(
    initialBlock1Posts.length > 0 ? initialBlock1Posts : FALLBACK_BLOCK1_POSTS
  );
  const [posts2, setPosts2] = useState<WPPostItem[]>(
    initialBlock2Posts.length > 0 ? initialBlock2Posts : FALLBACK_BLOCK2_POSTS
  );

  const [activePost, setActivePost] = useState<WPPostItem | null>(null);

  // Client-side fallback fetch if initial props were empty
  useEffect(() => {
    if (initialBlock1Posts.length === 0) {
      fetch('/api/vericath-posts?cat=281,27,55,48,56')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPosts1(data);
          }
        })
        .catch(() => {});
    }

    if (initialBlock2Posts.length === 0) {
      fetch('/api/vericath-posts?cat=53,51,42')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPosts2(data);
          }
        })
        .catch(() => {});
    }
  }, [initialBlock1Posts, initialBlock2Posts]);

  // Prevent background scrolling when reader modal is open & handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePost(null);
      }
    };

    if (activePost) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePost]);

  const renderPostCard = (post: WPPostItem) => {
    const formattedDate = post.date
      ? new Date(post.date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';

    return (
      <div
        key={post.id}
        onClick={() => setActivePost(post)}
        className="w-64 sm:w-72 flex-shrink-0 snap-start bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div>
          {/* Card Thumbnail */}
          <div className="relative h-36 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img
              src={post.imageUrl || '/fallback.jpg'}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                // Fallback image handling
                (e.target as HTMLImageElement).src =
                  'https://vericath.org/wp-content/uploads/2026/08/duc-me-pac-nam.jpg';
              }}
            />
            <span className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur-md text-gray-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider shadow-sm">
              {post.categoryName}
            </span>
          </div>

          {/* Card Content */}
          <div className="p-3.5">
            <h4 className="font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
              {post.title}
            </h4>
          </div>
        </div>

        {/* Card Footer (Author & Date) */}
        <div className="px-3.5 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 line-clamp-1 font-medium text-gray-700 dark:text-gray-300">
            <User size={12} className="text-yellow-600 dark:text-yellow-500" />
            {post.authorName}
          </span>
          {formattedDate && (
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Calendar size={11} />
              {formattedDate}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* KHỐI 1: Tri Thức & Đời Sống Thiêng Liêng */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              Tri Thức & Đời Sống Thiêng Liêng
            </h3>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory">
          {posts1.map(renderPostCard)}
        </div>
      </div>

      {/* KHỐI 2: Thiết Kế & Tủ Sách Công Giáo (Ưu tiên ID 51) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              Thiết Kế & Tủ Sách Công Giáo
            </h3>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory">
          {posts2.map(renderPostCard)}
        </div>
      </div>

      {/* IN-APP BROWSER / WEBVIEW SLIDE-UP POPUP MODAL */}
      {activePost && (
        <div
          onClick={() => setActivePost(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end transition-opacity animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl mx-auto h-[92vh] sm:h-[90vh] bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border-t border-x border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-300"
          >
            {/* IN-APP BROWSER HEADER BAR */}
            <div className="bg-gray-100 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700/80 shrink-0">
              {/* Left: Close Button (✓) */}
              <button
                onClick={() => setActivePost(null)}
                className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-gray-100 shadow-sm transition-transform active:scale-95"
                title="Đóng (✓)"
              >
                <Check size={20} className="stroke-[3]" />
              </button>

              {/* Center: Domain Name & Security Badge */}
              <div className="flex flex-col items-center min-w-0">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-1"></div>
                <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                  <Lock size={12} className="text-emerald-500" />
                  <span className="font-semibold tracking-wide">vericath.org</span>
                </div>
              </div>

              {/* Right: External Browser Button */}
              <div className="flex items-center gap-1">
                <a
                  href={activePost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-sm transition-transform active:scale-95"
                  title="Mở trong trình duyệt ngoài"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* WEBVIEW IFRAME CONTAINER */}
            <div className="flex-1 bg-white relative overflow-hidden">
              <iframe
                src={`/api/page-proxy?url=${encodeURIComponent(activePost.link)}`}
                className="w-full h-full border-none"
                title={activePost.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
