import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = process.argv[2];
const outputDir = path.join(__dirname, "../../public/data");
const outputPath = path.join(outputDir, "books_pages.json");
const bookshelfPath = path.join(outputDir, "bookshelf.json");

if (!inputPath) {
  console.error("請指定 Excel 檔案路徑");
  process.exit(1);
}

const workbook = xlsx.readFile(inputPath);
const result = {};
const duplicates = {};

// 工作表名稱：「繁體 - 書名（xx版）」/「簡體 - 書名（xx版）」→ 同一本書的繁、簡版本
// 沒有前綴的工作表視為一般書籍（只有一種字體）
const parseSheetName = (sheetName) => {
  const match = sheetName.match(/^(繁體|簡體)\s*-\s*(.+?)\s*(（[^）]*）)?$/);
  if (!match) return { bookName: sheetName, variant: null };
  return { bookName: match[2], variant: match[1] === "繁體" ? "trad" : "simp" };
};

// 讀出工作表中每一格的 { page, pos, char }
const readCells = (worksheet) => {
  const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const cells = [];

  for (let i = 2; i < sheetData.length; i += 3) {
    const pageRow = sheetData[i] || []; // 頁
    const posRow = sheetData[i + 1] || []; // 位
    const charRow = sheetData[i + 2] || []; // 字

    for (let j = 1; j < charRow.length; j++) {
      const page = pageRow[j];
      const pos = posRow[j];
      const char = charRow[j];

      if (
        (typeof page === "string" || typeof page === "number") &&
        typeof char === "string" &&
        char.trim()
      ) {
        cells.push({
          page: String(page),
          pos: pos !== undefined ? String(pos) : null,
          char: char.trim(),
        });
      }
    }
  }
  return cells;
};

const cellKey = (cell) => `${cell.page}-${cell.pos}`;

// 依書名整理各版本的格子
const books = {};
workbook.SheetNames.forEach((sheetName) => {
  const { bookName, variant } = parseSheetName(sheetName);
  if (!books[bookName]) books[bookName] = {};
  books[bookName][variant ?? "plain"] = readCells(workbook.Sheets[sheetName]);
});

const addChar = (bookName, char, entry) => {
  const bookResult = result[bookName];
  const existing = bookResult[char];

  // 同一格（繁簡同字）不算重複
  if (existing && cellKey(existing) !== cellKey(entry)) {
    if (!duplicates[bookName]) duplicates[bookName] = {};
    if (!duplicates[bookName][char]) duplicates[bookName][char] = [];

    // 把之前的出現點也記錄進去（避免漏掉第一次）
    if (duplicates[bookName][char].length === 0) {
      duplicates[bookName][char].push(existing);
    }
    duplicates[bookName][char].push(entry);
  }

  bookResult[char] = entry;
};

for (const [bookName, variants] of Object.entries(books)) {
  result[bookName] = {};

  if (variants.trad || variants.simp) {
    // 繁、簡兩個工作表逐格對齊，以「頁-位」配對
    const entries = {};
    for (const cell of variants.trad ?? []) {
      entries[cellKey(cell)] = { page: cell.page, pos: cell.pos, trad: cell.char };
    }
    for (const cell of variants.simp ?? []) {
      const key = cellKey(cell);
      if (!entries[key]) entries[key] = { page: cell.page, pos: cell.pos };
      entries[key].simp = cell.char;
    }

    for (const entry of Object.values(entries)) {
      if (entry.trad) addChar(bookName, entry.trad, entry);
      if (entry.simp && entry.simp !== entry.trad)
        addChar(bookName, entry.simp, entry);
    }
  }

  for (const cell of variants.plain ?? []) {
    addChar(bookName, cell.char, { page: cell.page, pos: cell.pos });
  }
}

const bookNames = Object.keys(result);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// 寫入 books_pages.json
fs.writeFileSync(outputPath, JSON.stringify(result), "utf8");
console.log("✅ 已輸出：" + outputPath);

// 產生 bookshelf.json
const bookshelf = {
  default: bookNames.length > 0 ? [bookNames[0]] : [],
  all: bookNames,
};
fs.writeFileSync(bookshelfPath, JSON.stringify(bookshelf, null, 2), "utf8");
console.log("✅ 已輸出：" + bookshelfPath);

// 寫入 duplicates.json
if (Object.keys(duplicates).length > 0) {
  const duplicatesPath = path.join(outputDir, "duplicates.json");
  fs.writeFileSync(duplicatesPath, JSON.stringify(duplicates, null, 2), "utf8");
  console.log("⚠️ 重複字已輸出：" + duplicatesPath);
}
