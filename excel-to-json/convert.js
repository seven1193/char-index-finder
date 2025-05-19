import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = process.argv[2];
const outputPath = path.join(__dirname, '../src/data/books_pages.json');

if (!inputPath) {
  console.error('請指定 Excel 檔案路徑');
  process.exit(1);
}

const workbook = xlsx.readFile(inputPath);
const result = {};

workbook.SheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  if (!result[sheetName]) result[sheetName] = {};

  for (let i = 2; i < sheetData.length; i+=2) {
    const pageRow = sheetData[i];
    const charRow = sheetData[i + 1];
    for (let j = 1; j < charRow.length; j ++) {
      const page = pageRow[j];
      const char = charRow[j];
      if (typeof page === 'string' || typeof page === 'number') {
        if (typeof char === 'string' && char.trim()) {
          result[sheetName][char.trim()] = String(page);
        }
      }
    }
  }
});
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(result), 'utf8');
console.log('✅ 轉換完成，輸出：' + outputPath);