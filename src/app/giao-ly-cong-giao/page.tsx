import React from 'react';
import CCCSearchResults from '@/components/CCCSearchResults';
import ScrollToMuc from '@/components/ScrollToMuc';
import fs from 'fs';
import path from 'path';

export default async function CCCPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q;

  if (q) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CCCSearchResults query={q} />
      </div>
    );
  }

  // Load the default post (giao-ly-cong-giao)
  let post = null;
  try {
    const filePath = path.join(process.cwd(), 'public', 'giao-ly-cong-giao', 'ccc-data.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    post = data.posts.find((p: any) => p.slug === 'giao-ly-cong-giao');
  } catch (error) {
    console.error('Error reading CCC data directly:', error);
  }

  if (!post) {
    return <div>Không tìm thấy dữ liệu giới thiệu.</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ccc-content-wrapper">
      <ScrollToMuc />
      
      <div className="mb-8">
        <div className="text-sm font-medium text-red-600 mb-2 uppercase tracking-wider">
          {post.path}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-red-900 font-serif leading-tight">
          {post.title}
        </h1>
      </div>

      <div 
        className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-red-900 prose-a:text-red-700 hover:prose-a:text-red-800 prose-p:leading-relaxed prose-p:text-slate-800 prose-p:text-justify prose-li:text-slate-800"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  );
}
