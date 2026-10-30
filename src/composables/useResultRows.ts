import { type Ref, computed } from "vue";
import type { CharacterResult } from "../types/books";
import type { ResultRow, SortMode } from "../types/view";

const collator = new Intl.Collator("zh-Hant", { numeric: true });

function compareRows(a: ResultRow, b: ResultRow) {
  // 查無資料排最後
  if (a.found !== b.found) return a.found ? -1 : 1;
  return (
    collator.compare(a.book.bookName, b.book.bookName) ||
    collator.compare(a.book.page ?? "", b.book.page ?? "") ||
    collator.compare(a.book.pos ?? "", b.book.pos ?? "")
  );
}

// 把查詢結果攤平成一列一個位置，並依排列方式排序
export function useResultRows(
  results: Ref<CharacterResult[]>,
  sort: Ref<SortMode>
) {
  return computed<ResultRow[]>(() => {
    const rows = results.value.flatMap((result, index) =>
      result.books.map((book) => ({
        key: `${index}-${book.bookName}-${book.page}-${book.pos}`,
        character: result.character,
        found: result.found,
        book,
      }))
    );
    return sort.value === "page" ? rows.slice().sort(compareRows) : rows;
  });
}
