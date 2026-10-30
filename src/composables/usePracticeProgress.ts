import { ref, watch } from "vue";
import type { BookPosition } from "../types/books";

const STORAGE_KEY = "practiceDone";

function loadDone(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// 「已寫好」紀錄，以書名＋頁-位為單位，存在這台裝置的瀏覽器
export function usePracticeProgress() {
  const done = ref(new Set<string>(loadDone()));

  const keyOf = (book: BookPosition) =>
    `${book.bookName}|${book.page}-${book.pos}`;

  function isDone(book: BookPosition) {
    return done.value.has(keyOf(book));
  }

  function toggleDone(book: BookPosition) {
    const next = new Set(done.value);
    const key = keyOf(book);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    done.value = next;
  }

  watch(done, (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...val]));
    } catch {
      // 無法儲存時忽略
    }
  });

  return { isDone, toggleDone };
}
