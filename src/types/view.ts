import type { BookPosition } from "./books";

// 檢視方式：列表 / 字帖 / 翻書清單
export type ViewMode = "list" | "grid" | "table";

// 排列方式：照輸入順序 / 照頁碼
export type SortMode = "input" | "page";

// 字帖顯示：繁體 / 簡體 / 並列
export type GridScript = "trad" | "simp" | "both";

// 結果中的一列（一個字在一本書中的一個位置）
export interface ResultRow {
  key: string;
  character: string;
  found: boolean;
  book: BookPosition;
}
