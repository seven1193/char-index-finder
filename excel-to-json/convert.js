import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = process.argv[2];
const outputDir = path.join(__dirname, "../public/data");
const outputPath = path.join(outputDir, "books_pages.json");
const bookshelfPath = path.join(outputDir, "bookshelf.json");

if (!inputPath) {
  console.error("請指定 Excel 檔案路徑");
  process.exit(1);
}

const workbook = xlsx.readFile(inputPath);
const result = {};

const sheetNames = workbook.SheetNames;

sheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  if (!result[sheetName]) result[sheetName] = {};

  // 每 3 列一組：頁 / 位 / 字
  for (let i = 2; i < sheetData.length; i += 3) {
    const pageRow = sheetData[i]; // 頁
    const posRow = sheetData[i + 1]; // 位
    const charRow = sheetData[i + 2]; // 字

    for (let j = 1; j < charRow.length; j++) {
      const page = pageRow[j];
      const pos = posRow[j];
      const char = charRow[j];
      if (
        (typeof page === "string" || typeof page === "number") &&
        typeof char === "string" &&
        char.trim()
      ) {
        result[sheetName][char.trim()] = {
          page: String(page),
          pos: pos !== undefined ? String(pos) : null,
        };
      }
    }
  }
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// 寫入 books_pages.json
fs.writeFileSync(outputPath, JSON.stringify(result), "utf8");
console.log("✅ 已輸出：" + outputPath);

// 產生 bookshelf.json
const bookshelf = {
  default: sheetNames.length > 0 ? [sheetNames[0]] : [],
  all: sheetNames,
};
fs.writeFileSync(bookshelfPath, JSON.stringify(bookshelf, null, 2), "utf8");
console.log("✅ 已輸出：" + bookshelfPath);
