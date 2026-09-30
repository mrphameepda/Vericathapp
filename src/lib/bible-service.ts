import fs from 'fs/promises';
import path from 'path';

/**
 * Cấu trúc đại diện cho một câu Kinh Thánh đối chiếu song ngữ.
 */
export type UnifiedVerse = {
  verseNumber: number;
  textVi?: string;
  textEn?: string;
  viHeadings?: string[];
  enHeadings?: string[];
};

/**
 * Cấu trúc dữ liệu của một chương Kinh Thánh.
 */
export type ChapterData = {
  book: string;
  chapter: number;
  verses: UnifiedVerse[];
  footnotesVi?: Record<string, string>;
  missingSecondaryBook?: boolean;
};

/**
 * Lấy dữ liệu chương Kinh Thánh song ngữ (Việt - Anh/Latinh/Hy Lạp).
 */
export async function getBilingualChapter(
  bookVi: string,
  chapter: number,
  lang: string = 'nabre'
): Promise<ChapterData> {
  const baseUnifiedPath = path.join(process.cwd(), 'public', 'bible', 'unified', bookVi, `${chapter}.json`);
  try {
    const rawData = await fs.readFile(baseUnifiedPath, 'utf-8');
    const data: ChapterData = JSON.parse(rawData);

    if (lang && lang !== 'nabre') {
      const secondaryPath = path.join(process.cwd(), 'public', 'bible', 'unified', lang, bookVi, `${chapter}.json`);
      try {
        const secondaryRaw = await fs.readFile(secondaryPath, 'utf-8');
        const secondaryData: ChapterData = JSON.parse(secondaryRaw);

        // Ghép nội dung ngôn ngữ phụ vào cột textEn
        const secondaryVerseMap = new Map(
          secondaryData.verses.map((v: UnifiedVerse) => [v.verseNumber, v.textEn])
        );
        data.verses.forEach((v) => {
          v.textEn = (secondaryVerseMap.get(v.verseNumber) || '') as string;
          v.enHeadings = [];
        });
      } catch {
        // Nếu sách không tồn tại ở bản văn phụ (ví dụ: các sách Thứ Kinh)
        data.missingSecondaryBook = true;
        data.verses.forEach((v) => {
          v.textEn = '';
          v.enHeadings = [];
        });
      }
    }

    return data;
  } catch {
    return { book: bookVi, chapter, verses: [] };
  }
}

/**
 * Lấy danh sách các số chương hiện có của một sách Kinh Thánh.
 */
export async function getChaptersForBook(bookVi: string): Promise<number[]> {
  const unifiedDir = path.join(process.cwd(), 'public', 'bible', 'unified', bookVi);
  try {
    const files = await fs.readdir(unifiedDir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => parseInt(f.replace('.json', ''), 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}
