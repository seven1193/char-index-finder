import { ref } from 'vue';

export function useBooksData() {
  const booksData = ref<Record<string, Record<string, string>>>({});
  const invertedIndex = ref<Record<string, { bookName: string; page: string }[]>>({});

  function buildInvertedIndex(data: typeof booksData.value) {
    const index: typeof invertedIndex.value = {};
    for (const [bookName, charMap] of Object.entries(data)) {
      for (const [char, page] of Object.entries(charMap)) {
        if (!index[char]) index[char] = [];
        index[char].push({ bookName, page });
      }
    }
    invertedIndex.value = index;
  }

  async function fetchBooksData(url: string, allowedBooks: string[]) {
    const response = await fetch(url);
    const fullData = await response.json();

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