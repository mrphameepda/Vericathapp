import path from 'path';
import fs from 'fs';

export interface Vatican2Block {
  type: 'chapter' | 'section' | 'article' | 'paragraph';
  level?: number;
  id?: string;
  title?: string;
  n?: string;
  notes?: string[];
  text?: string;
  char_count?: number;
}

export interface Vatican2Footnote {
  n: string;
  text: string;
}

export interface Vatican2Document {
  order: number;
  id: string;
  abbrev: string;
  kind: string;
  title_vi: string;
  title_la: string;
  title_meaning: string;
  promulgated: string;
  promulgated_vi: string;
  source: string;
  article_count: number;
  chapter_count: number;
  footnote_count: number;
  preamble: string[];
  blocks: Vatican2Block[];
  footnotes: Vatican2Footnote[];
}

export interface Vatican2Data {
  title: string;
  language: string;
  source: string;
  translator: string;
  document_count: number;
  article_count: number;
  documents: Vatican2Document[];
}

let cachedVatican2Data: Vatican2Data | null = null;

export function getVatican2Data(): Vatican2Data {
  if (cachedVatican2Data) return cachedVatican2Data;
  const filePath = path.join(process.cwd(), 'public', 'data', 'van-kien-vatican-2', 'vatican2.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedVatican2Data = JSON.parse(fileContents);
  return cachedVatican2Data as Vatican2Data;
}

export function getAllVatican2Documents(): Vatican2Document[] {
  const data = getVatican2Data();
  return data.documents || [];
}

export function getVatican2DocumentById(id: string): Vatican2Document | undefined {
  const docs = getAllVatican2Documents();
  return docs.find((d) => d.id === id);
}
