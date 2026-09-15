import youcatData from '@/data/youcat.json';

export interface YoucatItem {
  id: number;
  question: string;
  answer: string;
  explanation: string;
  quotes: string[];
  hierarchy: {
    part: string;
    section: string;
    chapter: string;
  };
  references: string[];
}

export interface YoucatPart {
  id: string;
  title: string;
  subtitle: string;
  range: [number, number];
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export interface YoucatChapterGroup {
  chapterTitle: string;
  range: [number, number];
  count: number;
  items: YoucatItem[];
}

export interface YoucatSectionGroup {
  id: string;
  sectionTitle: string;
  range: [number, number];
  count: number;
  chapters: YoucatChapterGroup[];
  items: YoucatItem[];
}

export interface YoucatPartGroup extends YoucatPart {
  count: number;
  sections: YoucatSectionGroup[];
}

export const YOUCAT_PARTS: YoucatPart[] = [
  {
    id: 'part1',
    title: 'PHẦN I',
    subtitle: 'CHÚNG TA TIN (Kinh Tin Kính & Đức Tin)',
    range: [1, 165],
    badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
    badgeText: 'text-blue-800 dark:text-blue-300',
    borderColor: 'border-blue-500'
  },
  {
    id: 'part2',
    title: 'PHẦN II',
    subtitle: 'CỬ HÀNH MẦU NHIỆM KITÔ GIÁO (Bí Tích & Phụng Vụ)',
    range: [166, 278],
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
    badgeText: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-500'
  },
  {
    id: 'part3',
    title: 'PHẦN III',
    subtitle: 'ĐỜI SỐNG TRONG CHÚA KITÔ (10 Điều Răn & Đạo Đức)',
    range: [279, 468],
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-500'
  },
  {
    id: 'part4',
    title: 'PHẦN IV',
    subtitle: 'CẦU NGUYỆN TRONG ĐỜI SỐNG KITÔ HỮU (Kinh Lạy Cha)',
    range: [469, 527],
    badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
    badgeText: 'text-purple-800 dark:text-purple-300',
    borderColor: 'border-purple-500'
  }
];

export const ALL_YOUCAT_ITEMS: YoucatItem[] = youcatData as YoucatItem[];

/**
 * Get part details for a given question ID
 */
export function getPartByQuestionId(id: number): YoucatPart {
  if (id >= 1 && id <= 165) return YOUCAT_PARTS[0];
  if (id >= 166 && id <= 278) return YOUCAT_PARTS[1];
  if (id >= 279 && id <= 468) return YOUCAT_PARTS[2];
  return YOUCAT_PARTS[3];
}

/**
 * Get item by exact question ID
 */
export function getYoucatById(id: number): YoucatItem | undefined {
  return ALL_YOUCAT_ITEMS.find((item) => item.id === id);
}

/**
 * Clean up section titles for beautiful display
 */
export function cleanSectionTitle(title: string): string {
  if (!title) return 'Mục chung';
  let clean = title.trim();
  // Clean trailing commas or typos if any
  clean = clean.replace(/,$/, '');
  return clean;
}

/**
 * Clean up chapter titles
 */
export function cleanChapterTitle(chapter: string): string {
  if (!chapter) return '';
  return chapter.trim();
}

/**
 * Build structured Menu Tree grouped by Parts, Sections, and Chapters
 */
export function getYoucatMenuTree(): YoucatPartGroup[] {
  return YOUCAT_PARTS.map((part) => {
    const partItems = ALL_YOUCAT_ITEMS.filter(
      (item) => item.id >= part.range[0] && item.id <= part.range[1]
    );

    // Group items into Sections
    const sectionMap = new Map<string, YoucatItem[]>();
    partItems.forEach((item) => {
      const secTitle = cleanSectionTitle(item.hierarchy?.section || 'Mục chung');
      if (!sectionMap.has(secTitle)) {
        sectionMap.set(secTitle, []);
      }
      sectionMap.get(secTitle)!.push(item);
    });

    const sections: YoucatSectionGroup[] = Array.from(sectionMap.entries()).map(
      ([secTitle, sItems], idx) => {
        // Group section items into Chapters
        const chapterMap = new Map<string, YoucatItem[]>();
        sItems.forEach((item) => {
          const chapTitle = cleanChapterTitle(item.hierarchy?.chapter || '');
          if (!chapterMap.has(chapTitle)) {
            chapterMap.set(chapTitle, []);
          }
          chapterMap.get(chapTitle)!.push(item);
        });

        const chapters: YoucatChapterGroup[] = Array.from(chapterMap.entries()).map(
          ([chapTitle, cItems]) => ({
            chapterTitle: chapTitle || 'Các câu hỏi trọng tâm',
            range: [cItems[0].id, cItems[cItems.length - 1].id],
            count: cItems.length,
            items: cItems,
          })
        );

        return {
          id: `${part.id}-sec-${idx + 1}`,
          sectionTitle: secTitle,
          range: [sItems[0].id, sItems[sItems.length - 1].id],
          count: sItems.length,
          chapters,
          items: sItems,
        };
      }
    );

    return {
      ...part,
      count: partItems.length,
      sections,
    };
  });
}

/**
 * Search and filter Youcat items
 */
export function searchYoucat(
  query: string,
  partId: string = 'all'
): YoucatItem[] {
  let items = ALL_YOUCAT_ITEMS;

  if (partId !== 'all') {
    const partObj = YOUCAT_PARTS.find((p) => p.id === partId);
    if (partObj) {
      items = items.filter(
        (item) => item.id >= partObj.range[0] && item.id <= partObj.range[1]
      );
    }
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return items;

  // Check if search query is a number
  const numQuery = parseInt(cleanQuery, 10);
  if (!isNaN(numQuery) && numQuery > 0 && numQuery <= 527 && cleanQuery === numQuery.toString()) {
    const exactMatch = items.filter((item) => item.id === numQuery);
    const idPrefixMatches = items.filter(
      (item) => item.id !== numQuery && item.id.toString().includes(cleanQuery)
    );
    return [...exactMatch, ...idPrefixMatches];
  }

  return items.filter((item) => {
    const idStr = item.id.toString();
    const qText = item.question.toLowerCase();
    const aText = item.answer.toLowerCase();
    const eText = item.explanation.toLowerCase();
    const quotesText = item.quotes.join(' ').toLowerCase();
    const refsText = item.references.join(' ').toLowerCase();
    const secText = (item.hierarchy?.section || '').toLowerCase();
    const chapText = (item.hierarchy?.chapter || '').toLowerCase();

    return (
      idStr.includes(cleanQuery) ||
      qText.includes(cleanQuery) ||
      aText.includes(cleanQuery) ||
      eText.includes(cleanQuery) ||
      quotesText.includes(cleanQuery) ||
      refsText.includes(cleanQuery) ||
      secText.includes(cleanQuery) ||
      chapText.includes(cleanQuery)
    );
  });
}
