# 文字頁數查找 APP

## 📘 專案簡介

本專案是一套基於 Vue.js 的網頁應用程式，讓使用者可以輸入一段文字，系統根據內建的字頁對應資料查找每個字所在的**書籍名稱**與**頁數**。  
資料最初來源於 Excel，經由 Node.js 工具轉換為 JSON，供前端查詢使用。

---

## 🏗 系統架構

```
[Excel 檔案] → [資料轉換工具 (Node.js)] → [JSON 檔案] → [Vue.js 前端頁面]
```

---

## 🔧 功能模組

### 1️⃣ Excel 轉 JSON 工具

- **功能說明**：將原始 Excel（`.xls` 或 `.xlsx`）中的字頁對應資料，轉換為 JSON 格式。
- **Excel 檔案描述**：
  - 每本書一個工作表（sheet），建議以書名命名
  - 每行資料格式：頁碼 + 對應字串（如：`1-1`, `一`）
  - 實際內容從第 3 列開始解析
- **JSON 輸出範例**：
  ```json
  {
    "田英章毛筆楷書": {
      "一": "1-1",
      "丁": "1-1",
      "七": "1-1",
      "丈": "1-2"
    },
    "另一本文字書": {
      "一": "2-1",
      "丁": "2-2"
    }
  }
  ```
- **工具位置**：`excel-to-json/convert.js`
- **輸出檔案**：`public/data/books_pages.json`（供前端查詢）

---

### 2️⃣ Vue.js 查詢網頁

- **功能說明**：提供輸入框，可即時查詢每個字的書名與頁數
- **技術規格**：
  - Vue.js 3（Composition API）
  - 查詢資料：由 JSON 檔載入 (`public/data/books_pages.json`)
- **介面需求**：
  - 🔤 文字輸入框
  - 🔍 即時查詢
  - 📋 結果顯示（建議表格呈現）
  - 📌 書名過濾（可選）
- **查無資料處理**：若查無資料，顯示「查無資料」與「---」

---

## 📁 專案結構

```
project-root/
├── public/
│   └── data/
│       └── books_pages.json    # 前端查詢用 JSON 檔
├── excel-to-json/
│   └── convert.js              # Excel 轉 JSON 工具
├── src/
│   └── components/
│       └── QueryPage.vue       # 查詢主畫面元件
│   └── App.vue
│   └── main.js
```

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
yarn install
```

### 2. 轉換 Excel 為 JSON

將你的 Excel 檔案放至指定資料夾，執行轉換工具：

```bash
node excel-to-json/convert.js <Excel檔名>
# 產出的 books_pages.json 會放在 public/data/
```

### 3. 啟動前端伺服器

```bash
yarn dev
```
然後開啟瀏覽器進入本地網址（預設 http://localhost:5173）。

---

## 📝 資料格式標準

- 頁碼皆為字串（例：`1-1`、`2-3`、`附錄-A`）
- 書名為 JSON 第一層 key，字為第二層 key，頁碼為 value

---

## 💡 未來擴充建議

- 匯出查詢結果（CSV、PDF）
- 進階書名篩選與多本書比對
