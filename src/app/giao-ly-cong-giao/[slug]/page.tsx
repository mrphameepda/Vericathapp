import React from 'react';
import { notFound } from 'next/navigation';
import ScrollToMuc from '@/components/ScrollToMuc';

export default async function CCCPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Need to fetch from absolute URL because it's a server component fetching its own API route
  // Better yet, just import the data reading logic directly if we are in a server component.
  // Wait, Next.js allows fetching API routes with absolute URL, but reading directly is faster.
  
  // Since we are Server-side, let's just read the file directly instead of hitting the API route.
  // Actually, Next.js fetch with absolute URL is fine, but we can't reliably get the absolute URL in production without knowing the host.
  // So I'll fetch via a server utility or direct file system access.
  const fs = await import('fs');
  const path = await import('path');
  
  let post = null;
  try {
    const filePath = path.join(process.cwd(), 'public', 'giao-ly-cong-giao', 'ccc-data.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    post = data.posts.find((p: any) => p.slug === slug);
  } catch (error) {
    console.error('Error reading CCC data directly:', error);
  }

  if (!post) {
    notFound();
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
