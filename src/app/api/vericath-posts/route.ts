import { NextResponse } from 'next/server';
import { getVericathPosts } from '@/lib/vericath';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get('cat') || '281,27,55,48,56';
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  try {
    const posts = await getVericathPosts(cat, limit);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching vericath posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}
