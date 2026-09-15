// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const BIBLE_DIR = path.join(process.cwd(), 'public', 'bible');
const KT2011_DIR = path.join(BIBLE_DIR, 'kt2011');
const NABRE_DIR = path.join(BIBLE_DIR, 'nabre');
const UNIFIED_DIR = path.join(BIBLE_DIR, 'unified');

const bookMapping = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'book-mapping.json'), 'utf-8'));

function extractEnglishTitle(text: string): { enHeadings: string[], textEn: string } {
  let enHeadings: string[] = [];
  let textEn = text || '';

  const preambleMatch = textEn.match(/^(Preamble\.\s+.*?Chapter\s+\d+\s+-\s+[^.]+\.)\s+(.*)$/i);
  if (preambleMatch) {
    enHeadings.push(preambleMatch[1].trim());
    textEn = preambleMatch[2].trim();
    return { enHeadings, textEn };
  }

  const chapterMatch = textEn.match(/^(Chapter\s+\d+\s+-\s+[^.]+\.)\s+(.*)$/i);
  if (chapterMatch) {
    enHeadings.push(chapterMatch[1].trim());
    textEn = chapterMatch[2].trim();
    return { enHeadings, textEn };
  }

  const romanMatch = textEn.match(/^([IVX]+\.\s+[^.]+\s+-\s+[^.]+\.)\s+(.*)$/);
  if (romanMatch) {
    enHeadings.push(romanMatch[1].trim());
    textEn = romanMatch[2].trim();
    return { enHeadings, textEn };
  }

  return { enHeadings, textEn };
}

async function processChapter(bookVi: string, bookEn: string, chapter: number) {
  const viHtmlPath = path.join(KT2011_DIR, bookVi, chapter.toString(), `${chapter}.html`);
  const enJsonPath = path.join(NABRE_DIR, bookEn, chapter.toString(), `${chapter}.json`);
  
  if (!fs.existsSync(viHtmlPath)) return null;

  const viRawHtml = fs.readFileSync(viHtmlPath, 'utf-8');
  const $ = cheerio.load(viRawHtml);
  
  let viFootnotes: Record<string, string> = {};
  $('ol li[id^="fn-"]').each((_, el) => {
    const id = $(el).attr('id');
    const text = $(el).html() || '';
    if (id) {
      const cleanedText = text.replace(/\[<a href="#fnref[^>]+>\d+<\/a>\]/g, '').trim();
      viFootnotes[id] = cleanedText;
    }
  });

  // Remove the footnote <ol> and <hr> so they don't get mixed in
  $('hr').nextAll().remove();
  $('hr').remove();

  // Extract headings mapped to the next verse
  let pendingHeadings: string[] = [];
  let verseHeadings: Record<number, string[]> = {};
  
  // We need to find headings and associate them with the first verse that follows them.
  // We'll iterate all elements in body to just extract headings and their following verse.
  let currentVerseForLabeling: number | null = null;

  // We will tag all nodes with their corresponding verse number
  let currentVerse = 1; // default if no verse marker is found before text
  
  function tagNode(node: cheerio.Element | cheerio.Node) {
    if (node.type === 'tag') {
      const tag = node.name.toLowerCase();
      
      if (/^h[1-6]$/.test(tag)) {
        const $headingClone = $(node).clone();
        $headingClone.find('sup').each((_, sup) => {
           if ($(sup).find('a').length > 0) {
              const num = $(sup).text().trim();
              $(sup).replaceWith(` [${num}] `);
           }
        });
        pendingHeadings.push($headingClone.text().replace(/\s+/g, ' ').trim());
        $(node).addClass('delete-me'); // we will extract these out of the HTML
        return;
      }
      
      // Is this a verse marker?
      if (tag === 'sup' && $(node).find('b').length > 0) {
        const numStr = $(node).find('b').text().trim();
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          currentVerse = num;
          $(node).addClass('delete-me'); // remove the verse marker from the final HTML
          
          if (pendingHeadings.length > 0) {
            verseHeadings[num] = [...pendingHeadings];
            pendingHeadings = [];
          }
        }
      } else {
        // Normal tag, recurse children
        $(node).contents().each((_, child) => tagNode(child));
      }
    } else if (node.type === 'text') {
      const text = node.data;
      if (text.trim().length > 0) {
         // Wrap text in a span indicating its verse
         const wrapper = $(`<span class="verse-content v-${currentVerse}"></span>`);
         wrapper.text(text);
         $(node).replaceWith(wrapper);
      } else {
         // Just whitespace, we can leave it or wrap it
         const wrapper = $(`<span class="verse-content v-${currentVerse}"></span>`);
         wrapper.text(text);
         $(node).replaceWith(wrapper);
      }
    }
  }

  // Tag all nodes in body
  $('body').contents().each((_, child) => tagNode(child));

  // Remove elements marked for deletion (headings and verse markers)
  $('.delete-me').remove();

  // Now, we have a DOM where all text is wrapped in <span class="verse-content v-N">
  // We can collect all unique verse numbers
  const verseNumbers = new Set<number>();
  $('.verse-content').each((_, el) => {
    const classes = $(el).attr('class') || '';
    const match = classes.match(/v-(\d+)/);
    if (match) {
      verseNumbers.add(parseInt(match[1], 10));
    }
  });

  const versesVi: Record<number, string> = {};

  // For each verse number, clone the body, remove spans of OTHER verses, then get HTML
  for (const vNum of Array.from(verseNumbers).sort((a, b) => a - b)) {
    const $clone = cheerio.load($('body').html() || '');
    
    // Remove all .verse-content that are NOT v-vNum
    $clone('.verse-content').not(`.v-${vNum}`).remove();
    
    // Clean up empty tags (e.g. a <blockquote> that now has no text)
    // We run this multiple times to clean up nested empty tags
    let changed = true;
    while (changed) {
      changed = false;
      $clone('body *').each((_, el) => {
        if (el.name !== 'br' && el.name !== 'img' && $clone(el).text().trim().length === 0) {
          $clone(el).remove();
          changed = true;
        }
      });
    }

    // Unwrap the .verse-content spans to keep HTML clean
    $clone('.verse-content').each((_, el) => {
      $clone(el).replaceWith($clone(el).html() || '');
    });

    let html = $clone('body').html() || '';
    if (html.trim().length > 0) {
      versesVi[vNum] = html.trim();
    }
  }

  // Read English Data
  let enData: any = { verses: [] };
  if (fs.existsSync(enJsonPath)) {
    enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf-8'));
  }

  // Combine
  const unifiedVerses = [];
  const allVerseNums = new Set([...Object.keys(versesVi).map(Number), ...enData.verses.map((v: any) => v.number)]);
  
  for (const vNum of Array.from(allVerseNums).sort((a, b) => a - b)) {
    const viText = versesVi[vNum] || '';
    const viHead = verseHeadings[vNum] || [];
    
    const enObj = enData.verses.find((v: any) => v.number === vNum) || { text: '' };
    const { enHeadings, textEn } = extractEnglishTitle(enObj.text);

    unifiedVerses.push({
      verseNumber: vNum,
      viHeadings: viHead.length > 0 ? viHead : undefined,
      enHeadings: enHeadings.length > 0 ? enHeadings : undefined,
      textVi: viText,
      textEn: textEn
    });
  }

  return {
    book: bookVi,
    chapter,
    verses: unifiedVerses,
    footnotesVi: viFootnotes
  };
}

async function run() {
  if (!fs.existsSync(UNIFIED_DIR)) {
    fs.mkdirSync(UNIFIED_DIR, { recursive: true });
  }

  for (const mapping of bookMapping) {
    const bookVi = mapping.vi;
    const bookEn = mapping.en;
    
    const bookDir = path.join(KT2011_DIR, bookVi);
    if (!fs.existsSync(bookDir)) continue;

    const unifiedBookDir = path.join(UNIFIED_DIR, bookVi);
    if (!fs.existsSync(unifiedBookDir)) {
      fs.mkdirSync(unifiedBookDir, { recursive: true });
    }

    const chapterDirs = fs.readdirSync(bookDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => parseInt(dirent.name, 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    for (const chapter of chapterDirs) {
      console.log(`Processing ${bookVi} - Chapter ${chapter}...`);
      const data = await processChapter(bookVi, bookEn, chapter);
      if (data) {
        fs.writeFileSync(
          path.join(unifiedBookDir, `${chapter}.json`),
          JSON.stringify(data, null, 2),
          'utf-8'
        );
      }
    }
  }
  
  console.log('Finished generating unified data!');
}

run().catch(console.error);
