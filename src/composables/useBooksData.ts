import { ref } from "vue";
import type { BooksData, InvertedIndex } from "../types/books";

export function useBooksData() {
  const booksData = ref<BooksData>({});
  const invertedIndex = ref<InvertedIndex>({});

  function buildInvertedIndex(data: typeof booksData.value) {
    const index: typeof invertedIndex.value = {};
    for (const [bookName, charMap] of Object.entries(data)) {
      for (const [char, info] of Object.entries(charMap)) {
        if (!index[char]) index[char] = [];
        index[char].push({ bookName, page: info.page, pos: info.pos });
      }
    }
    invertedIndex.value = index;
  }

  async function fetchBooksData(url: string, allowedBooks: string[]) {
    const response = await fetch(url);
    const fullData: BooksData = await response.json();

    const filteredData: typeof booksData.value = {};
    for (const book of allowedBooks) {
      if (fullData[book]) {
        filteredData[book] = fullData[book];
      }
    }

    booksData.value = filteredData;
    buildInvertedIndex(filteredData);
  }

  return {
    booksData,
    invertedIndex,
    fetchBooksData,
  };
}
