import { ref } from 'vue';

export function useBookshelf() {
  const bookshelf = ref<Record<string, string[]>>({});
  const selectedShelf = ref<string>('default');
  const selectedBooksFromShelf = ref<string[]>([]);

  async function fetchBookshelf(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    bookshelf.value = data;

    const urlParams = new URLSearchParams(window.location.search);
    const shelfParam = urlParams.get('shelf') || 'default';
    selectedShelf.value = bookshelf.value[shelfParam] ? shelfParam : 'default';
    selectedBooksFromShelf.value = bookshelf.value[selectedShelf.value];
  }

  return {
    bookshelf,
    selectedShelf,
    selectedBooksFromShelf,
    fetchBookshelf
  };
}
