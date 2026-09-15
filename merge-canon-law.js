const fs = require('fs');
const path = require('path');

const inputVn = 'F:/App/Giao-luat-cong-giao-1983/giao-luat.json';
const inputEn = 'F:/App/Giao-luat-cong-giao-1983/canon_law_en.json';
const outDir = path.join(__dirname, 'public', 'data', 'giao-luat');
const outFile = path.join(outDir, 'canon-law.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Map Vietnamese string to URL-friendly slug
function createSlug(str) {
  if (!str) return '';
  return str.toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// 1. Read files
const vnData = JSON.parse(fs.readFileSync(inputVn, 'utf-8'));
const enData = JSON.parse(fs.readFileSync(inputEn, 'utf-8')); // This is an object { "1": "The canons...", ... }

// 2. Recursive function to merge and add slugs
function traverseAndMerge(node) {
  // If it's a "Quyển" (Book) or "Phần" (Part), maybe create a slug
  if (node.title) {
    node.slug = createSlug(node.title);
  }

  // If it's an Article (Điều), try to find its English translation
  if (node.type === 'ĐIỀU') {
    const canonId = node.id.toString();
    if (enData[canonId]) {
      node.content_en = enData[canonId];
    } else {
      console.warn(`Missing English translation for Canon ${canonId}`);
      node.content_en = "";
    }
  }

  if (node.content && Array.isArray(node.content)) {
    node.content.forEach(child => traverseAndMerge(child));
  }
}

console.log("Merging data...");
// The top level is an object with title and content array
vnData.slug = createSlug(vnData.title);
if (Array.isArray(vnData.content)) {
  vnData.content.forEach(book => {
    traverseAndMerge(book);
  });
}

// 3. Write out
fs.writeFileSync(outFile, JSON.stringify(vnData, null, 2), 'utf-8');
console.log(`Merged file written to ${outFile}`);
