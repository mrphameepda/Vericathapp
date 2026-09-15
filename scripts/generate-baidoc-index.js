const fs = require('fs');
const path = require('path');

const baiDocDir = path.join(__dirname, '../public/sach-le-roma/bai doc hang ngay');
const outputFile = path.join(__dirname, '../public/sach-le-roma/bai-doc-index.json');

const files = fs.readdirSync(baiDocDir);
const index = [];

files.forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(baiDocDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      index.push({
        ma_dinh_danh: data.ma_dinh_danh || file.replace('.json', ''),
        tieu_de: data.tieu_de || 'Không có tiêu đề',
        thong_tin_ngay: data.thong_tin_ngay || null,
        file_name: file
      });
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
    }
  }
});

fs.writeFileSync(outputFile, JSON.stringify(index, null, 2), 'utf8');
console.log(`Successfully generated index for ${index.length} files.`);
