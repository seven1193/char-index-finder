interface BookPositionRawData {
  page: string;
  pos?: string | null;
}

// 單個字在書中的位置
export interface BookPosition extends BookPositionRawData {
  bookName: string;
}

// 所有書籍資料：
// { [bookName]: { [char]: BookPosition } }
export type BooksData = Record<string, Record<string, BookPosition>>;

// 反向索引：
// { [char]: BookPosition[] }
export type InvertedIndex = Record<string, BookPosition[]>;

// 查詢結果型別
export interface CharacterResult {
  character: string;
  found: boolean;
  books: BookPosition[];
}
