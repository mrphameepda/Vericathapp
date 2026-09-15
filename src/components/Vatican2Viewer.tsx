'use client';

import React from 'react';
import { Vatican2Document, Vatican2Block } from '@/lib/vatican2-server';
import { BookOpen } from 'lucide-react';

interface Vatican2ViewerProps {
  document: Vatican2Document;
}

export default function Vatican2Viewer({ document }: Vatican2ViewerProps) {
  const renderBlock = (block: Vatican2Block, index: number) => {
    const keyId = `${block.type}-${block.id || index}`;

    if (block.type === 'chapter') {
      return (
        <h2 key={keyId} id={block.id} className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-10 mb-6 uppercase text-center scroll-mt-24">
          {block.title}
        </h2>
      );
    }

    if (block.type === 'section') {
      return (
        <h3 key={keyId} id={block.id} className="text-xl font-bold text-blue-800 dark:text-blue-400 mt-8 mb-4 scroll-mt-24">
          {block.title}
        </h3>
      );
    }

    if (block.type === 'paragraph') {
      return (
        <p key={keyId} className="text-gray-600 dark:text-gray-400 italic text-sm mb-4 leading-relaxed text-center">
          {block.text}
        </p>
      );
    }

    if (block.type === 'article') {
      return (
        <div key={keyId} id={block.id} className="mb-6 scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
              Số {block.n}
            </span>
          </div>
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-justify">
            {/* Split by [n] and render footnotes nicely if needed, or just let them be text */}
            {block.text}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white dark:bg-[#1a233a] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Document Header */}
      <div className="bg-blue-900 dark:bg-blue-950 p-6 md:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BookOpen size={120} className="text-white" />
        </div>
        
        <span className="inline-block bg-blue-800 text-blue-100 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          {document.kind}
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
          {document.title_vi}
        </h1>
        <h2 className="text-lg md:text-xl text-blue-200 font-serif italic mb-6">
          {document.title_la}
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-100/80">
          <span>Công bố: {document.promulgated_vi}</span>
          <span>•</span>
          <span>{document.article_count} số</span>
        </div>
      </div>

      <div className="p-4 md:p-10 max-w-4xl mx-auto">
        {/* Preamble */}
        {document.preamble && document.preamble.length > 0 && (
          <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
            {document.preamble.map((p, idx) => (
              <p key={idx} className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium italic mb-2 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Blocks */}
        <div className="vatican2-content">
          {document.blocks && document.blocks.map((block, index) => renderBlock(block, index))}
        </div>

        {/* Footnotes */}
        {document.footnotes && document.footnotes.length > 0 && (
          <div className="mt-16 pt-8 border-t-2 border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase">
              Chú thích
            </h3>
            <div className="space-y-3">
              {document.footnotes.map((note, idx) => (
                <div key={idx} id={`note-${note.n}`} className="flex gap-3 text-sm scroll-mt-24">
                  <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    [{note.n}]
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {note.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
