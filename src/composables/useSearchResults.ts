import { type Ref, computed } from 'vue';

export function useSearchResults(inputText: Ref<string>, selectedBooks: Ref<string[]>, invertedIndex: Ref<Record<string, { bookName: string; page: string }[]>>) {
  return computed(() => {
    const chars = Array.from(inputText.value);
    const hasSelection = selectedBooks.value.length > 0;
    const selectedSet = hasSelection ? new Set(selectedBooks.value) : null;

    return chars.map((char) => {
      const allMatches = invertedIndex.value[char] || [];
      const matches = hasSelection
        ? allMatches.filter(entry => selectedSet!.has(entry.bookName))
        : allMatches;

      const found = matches.length > 0;

      return {
        character: char,
        found,
        books: found ? matches : [{ bookName: '查無資料', page: '---' }],
      };
    });
  });
}