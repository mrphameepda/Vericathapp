const fs = require('fs');
const path = require('path');

function processFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    let count = 0;
    
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (file.endsWith('.json') && file !== 'index.json') {
            try {
                const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                let updated = false;
                
                if (data.bai_doc) {
                    const keys = ['bai_doc_1', 'bai_doc_2', 'phuc_am'];
                    for (const key of keys) {
                        if (data.bai_doc[key] && data.bai_doc[key].trich_dan) {
                            let original = data.bai_doc[key].trich_dan;
                            let formatted = original;
                            
                            // Fix "Năm chẵn)" -> "(Năm chẵn)"
                            formatted = formatted.replace(/Năm chẵn\)/gi, '(Năm chẵn)');
                            formatted = formatted.replace(/Năm lẻ\)/gi, '(Năm lẻ)');
                            // Also fix if it was "Năm A)", "Năm B)", "Năm C)"
                            formatted = formatted.replace(/Năm A\)/gi, '(Năm A)');
                            formatted = formatted.replace(/Năm B\)/gi, '(Năm B)');
                            formatted = formatted.replace(/Năm C\)/gi, '(Năm C)');
                            
                            // Remove duplicate parentheses if they accidentally became "((Năm chẵn))"
                            formatted = formatted.replace(/\(\(Năm/gi, '(Năm').replace(/chẵn\)\)/gi, 'chẵn)');
                            formatted = formatted.replace(/lẻ\)\)/gi, 'lẻ)');
                            
                            if (original !== formatted) {
                                data.bai_doc[key].trich_dan = formatted;
                                updated = true;
                            }
                        }
                    }
                }
                
                if (updated) {
                    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
                    count++;
                }
            } catch (e) {
                console.error(`Error: ${e.message}`);
            }
        }
    }
    console.log(`Updated ${count} files in ${dirPath}`);
}

processFiles('F:/App/vericath-webapp/public/data/loi-chua-hom-nay/days');
processFiles('F:/App/Loi Chua Hom nay/days');
