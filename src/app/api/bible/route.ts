import { NextResponse } from 'next/server';
import { getBilingualChapter, getChaptersForBook } from '@/lib/bible-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book');
  const chapterStr = searchParams.get('chapter');
  const lang = searchParams.get('lang') || 'nabre';
  
  if (!book) {
    return NextResponse.json({ error: 'Book parameter is required' }, { status: 400 });
  }

  if (!chapterStr) {
    // If no chapter is provided, return the list of available chapters for the book
    const chapters = await getChaptersForBook(book);
    return NextResponse.json({ chapters });
  }

  const chapter = parseInt(chapterStr, 10);
  if (isNaN(chapter)) {
    return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 });
  }

  try {
    const chapterData = await getBilingualChapter(book, chapter, lang);
    return NextResponse.json(chapterData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
