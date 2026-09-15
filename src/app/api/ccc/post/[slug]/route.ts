import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Optional: caching the file in memory to avoid reading 7MB on every request
let cachedData: any = null;

function getCCCData() {
  if (cachedData) return cachedData;
  const filePath = path.join(process.cwd(), 'public', 'giao-ly-cong-giao', 'ccc-data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedData = JSON.parse(fileContents);
  return cachedData;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const data = getCCCData();
    const post = data.posts.find((p: any) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching CCC post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
