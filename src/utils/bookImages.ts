import type { BookPosition } from "../types/books";

export type ImageVariant = "trad" | "simp";

const BASE_URL = import.meta.env.BASE_URL;

// 簡體圖放在「書名（簡體）」資料夾
export function getImageUrl(
  bookName: string,
  page: string,
  pos: string,
  variant: ImageVariant = "trad"
) {
  const folder = variant === "simp" ? `${bookName}（簡體）` : bookName;
  return `${BASE_URL}image/${folder}/${page}-${pos}.jpeg`;
}

export interface BookImage {
  variant: ImageVariant;
  label: string;
  char: string;
  src: string;
}

// 有繁簡版本的書回傳繁、簡兩張圖，一般書籍只有一張
export function getBookImages(book: BookPosition, character: string): BookImage[] {
  if (!book.page || !book.pos) return [];

  const images: BookImage[] = [
    {
      variant: "trad",
      label: book.trad ? "繁體" : "",
      char: book.trad ?? character,
      src: getImageUrl(book.bookName, book.page, book.pos, "trad"),
    },
  ];
  if (book.simp) {
    images.push({
      variant: "simp",
      label: "簡體",
      char: book.simp,
      src: getImageUrl(book.bookName, book.page, book.pos, "simp"),
    });
  }
  return images;
}

// 「08」→「8」，用於「這頁的第 8 個字」
export function formatPos(pos?: string | null) {
  if (!pos) return "";
  return /^\d+$/.test(pos) ? String(Number(pos)) : pos;
}
