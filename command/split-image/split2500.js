import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "./data/田英章毛筆楷書2500字";
const outputDir = "./public/image/田英章毛筆楷書2500字";

// 確保輸出資料夾存在
await fs.promises.mkdir(outputDir, { recursive: true });

const generatePositions = (rows, cols) => {
  const positions = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = cols - 1; c >= 0; c--) {
      const base = c * rows + 1;
      const num = base + r;
      row.push(num.toString().padStart(2, "0"));
    }
    positions.push(row);
  }
  return positions;
};

const rows = 5;
const cols = 3;
const positions = generatePositions(rows, cols);

const isBlankRegion = async (region, threshold) => {
  const { data } = await region
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const total = data.reduce((sum, val) => sum + val, 0);
  const avg = total / data.length;
  return avg > threshold;
};

const splitImageAuto = async (filePath, fileBase) => {
  try {
    const metadata = await sharp(filePath).metadata();
    const { width, height } = metadata;

    const charWidth = Math.floor(width / cols);
    const charHeight = Math.floor(height / rows);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const left = c * charWidth;
        const top = r * charHeight;
        // 裁剪
        const region = sharp(filePath).extract({
          left,
          top,
          width: charWidth,
          height: charHeight,
        });

        // 判斷是否空白
        if (await isBlankRegion(region, 250)) {
          continue;
        }

        const outputFile = path.join(
          outputDir,
          `${fileBase}-${positions[r][c]}.jpeg`
        );

        await region.jpeg().toFile(outputFile);
      }
    }
  } catch (err) {
    console.error(`錯誤: ${fileBase}`, err);
  }
};

const main = async () => {
  const files = (await fs.promises.readdir(inputDir)).filter((f) =>
    f.endsWith(".jpeg")
  );

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(inputDir, file);
    const fileBase = path.parse(file).name;
    await splitImageAuto(filePath, fileBase);
  }
  console.log("✅ 全部完成！");
};

main();
