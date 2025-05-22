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
import { ref, computed, onMounted } from 'vue';
import HeaderSection from './components/HeaderSection.vue';
import SearchForm from './components/SearchForm.vue';
import ResultTable from './components/ResultTable.vue';
import debounce  from 'lodash.debounce';

import { useBooksData } from './composables/useBooksData';
import { usePersistedInput } from './composables/usePersistedInput';
import { useSearchResults } from './composables/useSearchResults';

const STORAGE_KEY = 'inputText';

const inputText = usePersistedInput(STORAGE_KEY, '春風送暖入屠蘇');
const selectedBooks = ref<string[]>([]);

const { booksData, invertedIndex, fetchBooksData } = useBooksData();
const searchResults = useSearchResults(inputText, selectedBooks, invertedIndex);

const totalCharacters = computed(() => inputText.value.length);
const totalFound = computed(() => searchResults.value.filter((r) => r.found).length);

onMounted(() => {
  fetchBooksData(import.meta.env.BASE_URL + 'data/books_pages.json');
});

const debouncedSetInput = debounce((val: string) => {
  inputText.value = val;
}, 300);

function onInputTextChange(value: string) {
  debouncedSetInput(value);
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