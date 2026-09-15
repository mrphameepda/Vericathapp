import fs from 'fs/promises';
import path from 'path';

export type UnifiedVerse = {
  verseNumber: number;
  textVi?: string;
  textEn?: string;
  viHeadings?: string[];
  enHeadings?: string[];
};

export type ChapterData = {
  book: string;
  chapter: number;
  verses: UnifiedVerse[];
  footnotesVi?: Record<string, string>;
  missingSecondaryBook?: boolean;
};

export async function getBilingualChapter(bookVi: string, chapter: number, lang: string = 'nabre'): Promise<ChapterData> {
  const baseUnifiedPath = path.join(process.cwd(), 'public', 'bible', 'unified', bookVi, `${chapter}.json`);
  try {
    const rawData = await fs.readFile(baseUnifiedPath, 'utf-8');
    const data: ChapterData = JSON.parse(rawData);

    if (lang && lang !== 'nabre') {
      const secondaryPath = path.join(process.cwd(), 'public', 'bible', 'unified', lang, bookVi, `${chapter}.json`);
      try {
        const secondaryRaw = await fs.readFile(secondaryPath, 'utf-8');
        const secondaryData = JSON.parse(secondaryRaw);
        
        // Merge secondary verses into textEn
        const secondaryVerseMap = new Map(secondaryData.verses.map((v: any) => [v.verseNumber, v.textEn]));
        data.verses.forEach(v => {
          v.textEn = (secondaryVerseMap.get(v.verseNumber) || '') as string;
          v.enHeadings = []; // clear English headings since they don't apply to the other language
        });
      } catch (secError) {
        // Book not found in secondary language (e.g. deuterocanonical books in protestant bibles)
        data.missingSecondaryBook = true;
        data.verses.forEach(v => {
          v.textEn = '';
          v.enHeadings = [];
        });
      }
    }

    return data;
  } catch (e) {
    console.error(`Failed to read unified data for ${bookVi} chapter ${chapter}`, e);
    return { book: bookVi, chapter, verses: [] };
  }
}

export async function getChaptersForBook(bookVi: string): Promise<number[]> {
  const unifiedDir = path.join(process.cwd(), 'public', 'bible', 'unified', bookVi);
  try {
    const files = await fs.readdir(unifiedDir);
    const chapters = files
      .filter(f => f.endsWith('.json'))
      .map(f => parseInt(f.replace('.json', ''), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
    return chapters;
  } catch (e) {
    console.error(`Failed to read available chapters for ${bookVi}`, e);
    return [];
  }
}
