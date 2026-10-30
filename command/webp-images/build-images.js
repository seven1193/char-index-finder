import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";

// 把 data/char-image 裡的單字圖轉成網頁用的 WebP：
//   大圖（點開放大）→ public/image/<書名>/<頁>-<位>.webp
//   小圖（列表、字帖）→ public/thumb/<書名>/<頁>-<位>.webp
// 已經轉過的圖會跳過；加上 --force 則全部重轉
const sourceDir = "./data/char-image";
const outputs = [
  { dir: "./public/image", width: null },
  { dir: "./public/thumb", width: 400 },
];
const QUALITY = 80;
const force = process.argv.includes("--force");

const exists = (file) => fs.promises.access(file).then(() => true, () => false);

const tasks = [];
for (const book of await fs.promises.readdir(sourceDir)) {
  const bookDir = path.join(sourceDir, book);
  if (!(await fs.promises.stat(bookDir)).isDirectory()) continue;

  for (const { dir } of outputs) {
    await fs.promises.mkdir(path.join(dir, book), { recursive: true });
  }

  for (const file of await fs.promises.readdir(bookDir)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const name = path.parse(file).name + ".webp";
    tasks.push({ input: path.join(bookDir, file), book, name });
  }
}

let converted = 0;
let skipped = 0;

const convert = async ({ input, book, name }) => {
  for (const { dir, width } of outputs) {
    const outputFile = path.join(dir, book, name);
    if (!force && (await exists(outputFile))) {
      skipped++;
      continue;
    }
    let image = sharp(input);
    if (width) image = image.resize(width);
    await image.webp({ quality: QUALITY }).toFile(outputFile);
    converted++;
  }
};

const start = Date.now();
const queue = [...tasks];
const workers = Array.from({ length: os.cpus().length }, async () => {
  while (queue.length) await convert(queue.shift());
});
await Promise.all(workers);

console.log(
  `✅ ${tasks.length} 張原圖：轉出 ${converted} 張，略過 ${skipped} 張（${((Date.now() - start) / 1000).toFixed(1)} 秒）`
);
