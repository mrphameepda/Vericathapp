const fs = require('fs');
const path = require('path');

function formatNoiDung(noiDung) {
    if (!noiDung) return noiDung;
    
    // Prefix regex for introductory sentences
    const introRegex = /^(Trích sách|Trích thư|Trích|Tin Mừng|Khởi đầu Tin Mừng|Sự thương khó)[^\.]*\.\s+/i;
    
    if (introRegex.test(noiDung)) {
        // If it matches, replace the first ". " with ".\n\n"
        return noiDung.replace(introRegex, (match) => {
            return match.trim() + '\n\n';
        });
    }
    return noiDung;
}

let updatedCount = 0;

function processFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processFiles(fullPath);
        } else if (file.endsWith('.json') && file !== 'index.json') {
            try {
                const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                let updated = false;
                
                if (data.bai_doc) {
                    const keys = ['bai_doc_1', 'bai_doc_2', 'phuc_am'];
                    for (const key of keys) {
                        if (data.bai_doc[key] && data.bai_doc[key].noi_dung) {
                            const original = data.bai_doc[key].noi_dung;
                            const formatted = formatNoiDung(original);
                            if (original !== formatted) {
                                data.bai_doc[key].noi_dung = formatted;
                                updated = true;
                            }
                        }
                    }
                }
                
                if (updated) {
                    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
                    updatedCount++;
                }
            } catch (e) {
                console.error(`Error processing ${file}: ${e.message}`);
            }
        }
    }
}

const rootDir = path.join('F:/App/vericath-webapp/public/data/loi-chua-hom-nay');
processFiles(rootDir);
console.log(`Updated ${updatedCount} files.`);
