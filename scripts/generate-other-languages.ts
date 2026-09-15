import * as fs from 'fs';
import * as path from 'path';

const BIBLE_DIR = path.join(process.cwd(), 'public', 'bible');
const UNIFIED_DIR = path.join(BIBLE_DIR, 'unified');
const SOURCE_DIR = path.join('f:/App/bible/other language/json');

// Map abbreviations from "other language" JSON to our Vietnamese Unified abbreviations
const bookMapping: Record<string, string> = {
  'gn': 'st', 'ex': 'xh', 'lv': 'lv', 'nm': 'ds', 'dt': 'đnl',
  'js': 'gs', 'jud': 'tl', 'rt': 'r', '1sm': '1 sm', '2sm': '2 sm',
  '1kgs': '1 v', '2kgs': '2 v', '1ch': '1 sb', '2ch': '2 sb',
  'ezr': 'er', 'ne': 'nk', 'et': 'et', 'job': 'g', 'ps': 'tv',
  'prv': 'cn', 'ec': 'gv', 'so': 'dc', 'is': 'is', 'jr': 'gr',
  'lm': 'ac', 'ez': 'ed', 'dn': 'đn', 'ho': 'hs', 'jl': 'ge',
  'am': 'am', 'ob': 'ôv', 'jn': 'gn', 'mi': 'mk', 'na': 'nkm',
  'hk': 'kb', 'zp': 'xp', 'hg': 'kg', 'zc': 'dcr', 'ml': 'ml',
  'mt': 'mt', 'mk': 'mc', 'lk': 'lc', 'jo': 'ga', 'act': 'cv',
  'rm': 'rm', '1co': '1 cr', '2co': '2 cr', 'gl': 'gl', 'eph': 'ep',
  'ph': 'pl', 'cl': 'cl', '1ts': '1 tx', '2ts': '2 tx', '1tm': '1 tm',
  '2tm': '2 tm', 'tt': 'tt', 'phm': 'plm', 'hb': 'hr', 'jm': 'gc',
  '1pe': '1 pr', '2pe': '2 pr', '1jo': '1 ga', '2jo': '2 ga',
  '3jo': '3 ga', 'jd': 'gđ', 're': 'kh'
};

const targetLanguages = [
  'zh_ncv', 'el_greek', 'ar_svd', 'ko_ko', 'fi_pr', 'es_rvr'
];

async function main() {
  for (const lang of targetLanguages) {
    console.log(`Processing language: ${lang}...`);
    const sourceFile = path.join(SOURCE_DIR, `${lang}.json`);
    
    if (!fs.existsSync(sourceFile)) {
      console.warn(`File not found for ${lang}: ${sourceFile}`);
      continue;
    }

    let raw = fs.readFileSync(sourceFile, 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    
    const data = JSON.parse(raw);
    const langOutDir = path.join(UNIFIED_DIR, lang);
    if (!fs.existsSync(langOutDir)) fs.mkdirSync(langOutDir, { recursive: true });

    for (const bookData of data) {
      const sourceAbbrev = bookData.abbrev;
      const targetAbbrev = bookMapping[sourceAbbrev];
      
      if (!targetAbbrev) {
        console.warn(`No mapping found for book abbreviation: ${sourceAbbrev}`);
        continue;
      }

      const bookOutDir = path.join(langOutDir, targetAbbrev);
      if (!fs.existsSync(bookOutDir)) fs.mkdirSync(bookOutDir, { recursive: true });

      for (let chIndex = 0; chIndex < bookData.chapters.length; chIndex++) {
        const chapterNum = chIndex + 1;
        const versesList = bookData.chapters[chIndex];
        
        const verses = versesList.map((text: string, vIndex: number) => {
          return {
            verseNumber: vIndex + 1,
            textEn: text // map to textEn so frontend works cleanly
          };
        });

        const outData = {
          book: targetAbbrev,
          chapter: chapterNum,
          verses
        };

        fs.writeFileSync(
          path.join(bookOutDir, `${chapterNum}.json`),
          JSON.stringify(outData, null, 2)
        );
      }
    }
  }
  console.log("Finished generating unified data for other languages!");
}

main().catch(console.error);
