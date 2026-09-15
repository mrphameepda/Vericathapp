'use client';

import React, { useState } from 'react';
import { CanonLawNode } from '@/lib/giao-luat-server';
import { Globe, List, Columns } from 'lucide-react';

interface CanonLawViewerProps {
  node: CanonLawNode;
}

type ViewMode = 'vn' | 'en' | 'bi-row' | 'bi-col';

export default function CanonLawViewer({ node }: CanonLawViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('bi-row');

  // Helper function to render a Canon (ĐIỀU)
  const renderCanon = (canon: CanonLawNode, index: number) => {
    return (
      <div key={`canon-${canon.id}-${index}`} id={canon.id.toString()} className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 scroll-mt-24">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg text-blue-800 dark:text-blue-400">
            {canon.title}
          </span>
          <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">
            Can. {canon.id}
          </span>
        </div>

        {viewMode === 'vn' && (
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {canon.content as string}
          </div>
        )}

        {viewMode === 'en' && (
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">
            {canon.content_en || '(No English translation available)'}
          </div>
        )}

        {viewMode === 'bi-row' && (
          <div className="flex flex-col gap-3">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {canon.content as string}
            </div>
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap italic pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              {canon.content_en || '(No English translation available)'}
            </div>
          </div>
        )}

        {viewMode === 'bi-col' && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex-1 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {canon.content as string}
            </div>
            <div className="flex-1 text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap italic md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-6">
              {canon.content_en || '(No English translation available)'}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render headings (PHẦN, CHƯƠNG, etc.)
  const renderHeading = (child: CanonLawNode, index: number) => {
    // Generate an ID for scrolling if it has a slug or ID
    const sectionId = child.slug || child.id.toString();
    const keyId = `${child.type}-${sectionId}-${index}`;

    let headingClass = 'font-bold text-gray-900 dark:text-gray-100 mt-10 mb-6';
    let Tag: keyof React.JSX.IntrinsicElements = 'h2';

    switch (child.type) {
      case 'PHẦN':
        headingClass += ' text-2xl uppercase text-center text-blue-900 dark:text-blue-300';
        Tag = 'h2';
        break;
      case 'THIÊN':
      case 'ĐỀ MỤC':
        headingClass += ' text-xl uppercase text-blue-800 dark:text-blue-400';
        Tag = 'h3';
        break;
      case 'CHƯƠNG':
        headingClass += ' text-lg uppercase text-blue-700 dark:text-blue-500';
        Tag = 'h4';
        break;
      case 'TIẾT':
        headingClass += ' text-base font-semibold text-gray-800 dark:text-gray-300';
        Tag = 'h5';
        break;
      default:
        headingClass += ' text-base';
        Tag = 'h6';
    }

    return (
      <div key={keyId} id={sectionId} className="scroll-mt-24">
        <Tag className={headingClass}>{child.title as string}</Tag>
        {Array.isArray(child.content) && (
          <div className="ml-0">
            {child.content.map((grandchild, idx) => renderNode(grandchild, idx))}
          </div>
        )}
      </div>
    );
  };

  const renderNode = (child: CanonLawNode, index: number) => {
    if (child.type === 'ĐIỀU') {
      return renderCanon(child, index);
    }
    return renderHeading(child, index);
  };

  return (
    <div className="relative">
      {/* Floating Vertical Toolbar (Right side, fixed on Desktop & Mobile) */}
      <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl transition-all">
        <button
          onClick={() => setViewMode('vn')}
          title="Tiếng Việt"
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            viewMode === 'vn'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          VN
        </button>
        <button
          onClick={() => setViewMode('en')}
          title="English"
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
            viewMode === 'en'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          EN
        </button>
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-0.5" />
        <button
          onClick={() => setViewMode('bi-row')}
          title="Song ngữ (Dòng trên/dưới)"
          className={`p-2 rounded-lg transition-all ${
            viewMode === 'bi-row'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('bi-col')}
          title="Song ngữ (2 cột song song)"
          className={`p-2 rounded-lg transition-all ${
            viewMode === 'bi-col'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Columns className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="pb-24">
        {Array.isArray(node.content) && node.content.map((child, index) => renderNode(child, index))}
      </div>
    </div>
  );
}
