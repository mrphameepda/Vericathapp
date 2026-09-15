import * as fs from 'fs';
import * as path from 'path';

const BIBLE_DIR = path.join(process.cwd(), 'public', 'bible');
const UNIFIED_DIR = path.join(BIBLE_DIR, 'unified');
const SOURCE_DIR = path.join('f:/App/bible/Latinh/nova_vulgata_json/json');
const LANG = 'la_latin';

const latinToViMap: Record<string, string> = {
  'genesis': 'st',
  'exodus': 'xh',
  'leviticus': 'lv',
  'numeri': 'ds',
  'deuteronomium': 'đnl',
  'iosue': 'gs',
  'iudicum': 'tl',
  'ruth': 'r',
  'i-samuelis': '1 sm',
  'ii-samuelis': '2 sm',
  'i-regum': '1 v',
  'ii-regum': '2 v',
  'i-paralipomenon': '1 sb',
  'ii-paralipomenon': '2 sb',
  'esdrae': 'er',
  'nehemiae': 'nk',
  'thobis': 'tb',
  'iudith': 'gđt',
  'esther': 'et',
  'i-maccabaeorum': '1 mcb',
  'ii-maccabaeorum': '2 mcb',
  'iob': 'g',
  'psalmi': 'tv',
  'proverbia': 'cn',
  'ecclesiastes': 'gv',
  'canticum': 'dc',
  'sapientia': 'kn',
  'ecclesiasticus': 'hc',
  'isaia': 'is',
  'ieremia': 'gr',
  'lamentationes': 'ac',
  'baruch': 'br',
  'ezechiel': 'ed',
  'daniel': 'đn',
  'osee': 'hs',
  'ioel': 'ge',
  'amos': 'am',
  'abdias': 'ôv',
  'iona': 'gn',
  'michaea': 'mk',
  'nahum': 'nkm',
  'habacuc': 'kb',
  'sophonia': 'xp',
  'aggaeus': 'kg',
  'zacharias': 'dcr',
  'malachias': 'ml',
  'matthaeus': 'mt',
  'marcus': 'mc',
  'lucas': 'lc',
  'ioannes': 'ga',
  'actus': 'cv',
  'romani': 'rm',
  'i-corinthii': '1 cr',
  'ii-corinthii': '2 cr',
  'galatae': 'gl',
  'ephesii': 'ep',
  'philippenses': 'pl',
  'colossenses': 'cl',
  'i-thessalonicenses': '1 tx',
  'ii-thessalonicenses': '2 tx',
  'i-timotheus': '1 tm',
  'ii-timotheus': '2 tm',
  'titus': 'tt',
  'philemon': 'plm',
  'hebraei': 'hr',
  'iacobus': 'gc',
  'i-petrus': '1 pr',
  'ii-petrus': '2 pr',
  'i-ioannes': '1 ga',
  'ii-ioannes': '2 ga',
  'iii-ioannes': '3 ga',
  'iudas': 'gđ',
  'apocalypsis': 'kh'
};

async function main() {
  console.log(`Processing Latin language...`);
  
  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.json') && f !== 'bible.json' && f !== 'index.json');
  
  const langOutDir = path.join(UNIFIED_DIR, LANG);
  if (!fs.existsSync(langOutDir)) fs.mkdirSync(langOutDir, { recursive: true });

  for (const file of files) {
    const raw = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
    const bookData = JSON.parse(raw);
    const sourceAbbrev = bookData.id;
    const targetAbbrev = latinToViMap[sourceAbbrev];
    
    if (!targetAbbrev) {
      console.warn(`No mapping found for book abbreviation: ${sourceAbbrev}`);
      continue;
    }

    const bookOutDir = path.join(langOutDir, targetAbbrev);
    if (!fs.existsSync(bookOutDir)) fs.mkdirSync(bookOutDir, { recursive: true });

    for (const chapter of bookData.chapters) {
      const chapterNum = chapter.chapter;
      
      const verses = chapter.verses.map((v: any) => {
        return {
          verseNumber: parseInt(v.verse.toString().split('-')[0], 10) || parseInt(v.verse, 10), // handle "1-2" cases if any
          textEn: v.text 
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
  console.log("Finished generating unified data for Latin!");
}

main().catch(console.error);
