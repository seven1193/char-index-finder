<template>
  <div class="app-container">
    <HeaderSection />
    <SearchForm 
      :booksData="booksData"
      :inputText="inputText"
      :selectedBooks="selectedBooks"
      :totalFound="totalFound"
      :totalCharacters="totalCharacters"
      @inputTextChange="onInputTextChange"
      @bookSelectionChange="onBookSelectionChange"
      @clearInput="clearInput"
    />
    <ResultTable
      :results="searchResults"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import HeaderSection from './components/HeaderSection.vue';
import SearchForm from './components/SearchForm.vue';
import ResultTable from './components/ResultTable.vue';

const STORAGE_KEY = 'inputText';

const inputText = ref('春風送暖入屠蘇');
const booksData = ref<Record<string, Record<string, string>>>({});
const selectedBooks = ref<string[]>([]);
const invertedIndex = ref<Record<string, { bookName: string; page: string }[]>>({});

const totalCharacters = computed(() => inputText.value.length);

onMounted(async () => {
  const savedText = sessionStorage.getItem(STORAGE_KEY);
  inputText.value = savedText ?? '春風送暖入屠蘇';
  await fetchBooksData();
});

watch(inputText, (newVal) => {
  sessionStorage.setItem(STORAGE_KEY, newVal);
});

function buildInvertedIndex(data: Record<string, Record<string, string>>) {
  const index: Record<string, { bookName: string; page: string }[]> = {};
  for (const [bookName, charMap] of Object.entries(data)) {
    for (const [char, page] of Object.entries(charMap)) {
      if (!index[char]) index[char] = [];
      index[char].push({ bookName, page });
    }
  }
  invertedIndex.value = index;
}

async function fetchBooksData() {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'data/books_pages.json');
    const data = await response.json();
    booksData.value = data;
    buildInvertedIndex(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const searchResults = computed(() => {
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

const totalFound = computed(() => searchResults.value.filter((r) => r.found).length);

function onInputTextChange(value: string) {
  inputText.value = value;
}

function onBookSelectionChange(selection: string[]) {
  selectedBooks.value = selection;
}

function clearInput() {
  inputText.value = '';
}
</script>

<style scoped>
.app-container {
  max-width: 64rem;
  margin: 0 auto;
  padding: 1rem 1rem;
}
</style>