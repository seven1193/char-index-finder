import * as XLSX from 'xlsx';
import * as fs from 'fs';
import path from 'path';

if (XLSX.set_fs) {
  XLSX.set_fs(fs);
}

const [,, inputPath, outputPath] = process.argv;

if (!inputPath) {
    console.error("❌ 錯誤: 請指定輸入檔案路徑。");
    process.exit(1);
}

if (!fs.existsSync(inputPath)) {
    console.error(`❌ 錯誤: 找不到檔案 "${inputPath}"`);
    process.exit(1);
}

let finalOutputPath = outputPath;
if (!finalOutputPath) {
    const parsed = path.parse(inputPath);
    finalOutputPath = path.join(parsed.dir, `${parsed.name}.xlsx`);
}

try {
    console.log(`📂 讀取 Numbers 檔案: ${inputPath}`);
    
    const fileBuffer = fs.readFileSync(inputPath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });

    console.log(`💾 匯出 Excel 檔案: ${finalOutputPath}`);
    
    XLSX.writeFile(workbook, finalOutputPath);

    console.log("✅ 轉換成功！");
} catch (error) {
    console.error("⚠️ 轉換失敗:");
    console.error(error.message);
}