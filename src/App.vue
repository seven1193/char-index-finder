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
      :isLoading="isLoading"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import HeaderSection from './components/HeaderSection.vue';
import SearchForm from './components/SearchForm.vue';
import ResultTable from './components/ResultTable.vue';
import bookJson from './data/books_pages.json'

const inputText = ref('春風送暖入屠蘇');
const booksData = ref<Record<string, Record<string, string>>>(bookJson);
const selectedBooks = ref<string[]>([]);
const isLoading = ref(false);

const searchResults = ref<any[]>([]);
const totalCharacters = computed(() => inputText.value.length);
const totalFound = computed(() => searchResults.value.filter(r => r.found).length);

onMounted(processSearch);

function processSearch() {
  const chars = Array.from(inputText.value);
  const dataToSearch = selectedBooks.value.length
    ? Object.fromEntries(Object.entries(booksData.value).filter(([book]) => selectedBooks.value.includes(book)))
    : booksData.value;

  searchResults.value = chars.map(char => {
    const matches = Object.entries(dataToSearch)
      .filter(([, bookChars]) => char in bookChars)
      .map(([bookName, bookChars]) => ({
        bookName,
        page: bookChars[char],
      }));

    return {
      character: char,
      found: matches.length > 0,
      books: matches.length > 0 ? matches : [{ bookName: '查無資料', page: '---' }],
    };
  });
}

function onInputTextChange(value: string) {
  inputText.value = value;
  processSearch();
}

function onBookSelectionChange(selection: string[]) {
  selectedBooks.value = selection;
  processSearch();
}

function clearInput() {
  inputText.value = '';
  processSearch();
}
</script>

<style scoped>
.app-container {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>