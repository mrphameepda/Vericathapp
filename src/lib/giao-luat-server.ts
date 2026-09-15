import path from 'path';
import fs from 'fs';

export type CanonLawType = 'QUYỂN' | 'PHẦN' | 'THIÊN' | 'ĐỀ MỤC' | 'CHƯƠNG' | 'TIẾT' | 'ĐIỀU';

export interface CanonLawNode {
  type: CanonLawType;
  id: string | number;
  title: string;
  content?: string | CanonLawNode[];
  content_en?: string;
  reference_links?: string[];
  slug?: string;
}

export interface CanonLawData {
  title: string;
  slug: string;
  content: CanonLawNode[];
}

// Caching variable - flush by modifying this file - trigger 2
let cachedCanonLawData: CanonLawData | null = null;

export function getCanonLawData(): CanonLawData {
  if (cachedCanonLawData) return cachedCanonLawData;
  const filePath = path.join(process.cwd(), 'public', 'data', 'giao-luat', 'canon-law.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedCanonLawData = JSON.parse(fileContents);
  return cachedCanonLawData as CanonLawData;
}

export function getAllBooks(): CanonLawNode[] {
  const data = getCanonLawData();
  return data.content || [];
}

export function getBookBySlug(slug: string): CanonLawNode | undefined {
  const books = getAllBooks();
  return books.find((b) => b.slug === slug);
}
