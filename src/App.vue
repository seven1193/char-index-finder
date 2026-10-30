<template>
  <div class="app-container no-print">
    <HeaderSection :subtitle="selectedBooks.join('、')" />
    <SearchForm
      :booksData="booksData"
      :inputText="inputText"
      :selectedBooks="selectedBooks"
      :totalFound="totalFound"
      :totalCharacters="totalCharacters"
      :doneCount="doneCount"
      @inputTextChange="onInputTextChange"
      @search="onSearch"
      @bookSelectionChange="onBookSelectionChange"
      @clearInput="clearInput"
    />

    <template v-if="rows.length > 0">
      <ViewToolbar
        :view="view"
        :sort="sort"
        @update:view="view = $event"
        @update:sort="sort = $event"
        @print="printList"
      />
      <ResultList
        v-if="view === 'list'"
        :rows="rows"
        :showBookName="showBookName"
        :isDone="isDone"
        @toggleDone="toggleDone"
      />
      <ResultGrid
        v-else-if="view === 'grid'"
        :rows="rows"
        :isDone="isDone"
        @toggleDone="toggleDone"
      />
      <ResultTable
        v-else
        :rows="rows"
        :showBookName="showBookName"
        :isDone="isDone"
        @toggleDone="toggleDone"
      />
    </template>
  </div>

  <PrintSheet
    :rows="printRows"
    :inputText="inputText"
    :showBookName="showBookName"
    :isDone="isDone"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import HeaderSection from './components/HeaderSection.vue';
import SearchForm from './components/SearchForm.vue';
import ViewToolbar from './components/ViewToolbar.vue';
import ResultList from './components/ResultList.vue';
import ResultGrid from './components/ResultGrid.vue';
import ResultTable from './components/ResultTable.vue';
import PrintSheet from './components/PrintSheet.vue';
import debounce from 'lodash.debounce';
import { useBooksData } from './composables/useBooksData';
import { usePersistedInput } from './composables/usePersistedInput';
import { useSearchResults } from './composables/useSearchResults';
import { useBookshelf } from './composables/useBookshelf';
import { useResultRows } from './composables/useResultRows';
import { usePreference } from './composables/usePreference';
import { usePracticeProgress } from './composables/usePracticeProgress';
import type { SortMode, ViewMode } from './types/view';

const STORAGE_KEY = 'inputText';

const inputText = usePersistedInput(STORAGE_KEY, '春風送暖入屠蘇');
const selectedBooks = ref<string[]>([]);

const { selectedBooksFromShelf, fetchBookshelf } = useBookshelf();

const { booksData, invertedIndex, fetchBooksData } = useBooksData();
const searchResults = useSearchResults(inputText, selectedBooks, invertedIndex);

const view = usePreference<ViewMode>('viewMode', 'list', ['list', 'grid', 'table']);
// 排列不記憶，每次打開都從「照輸入順序」開始
const sort = ref<SortMode>('input');

const rows = useResultRows(searchResults, sort);
// 列印一律依頁碼排序
const printRows = useResultRows(searchResults, ref<SortMode>('page'));

const { isDone, toggleDone } = usePracticeProgress();

const showBookName = computed(() => selectedBooks.value.length > 1);
const totalCharacters = computed(() => searchResults.value.length);
const totalFound = computed(() => searchResults.value.filter((r) => r.found).length);
const doneCount = computed(() =>
  searchResults.value.filter((r) => r.found && r.books.some(isDone)).length
);

onMounted(async () => {
  const timestamp = new Date().getTime();
  await fetchBookshelf(`${import.meta.env.BASE_URL}data/bookshelf.json?ts=${timestamp}`);
  selectedBooks.value = selectedBooksFromShelf.value;

  await fetchBooksData(
    `${import.meta.env.BASE_URL}data/books_pages.json?ts=${timestamp}`,
    selectedBooksFromShelf.value
  );
});

const debouncedSetInput = debounce((val: string) => {
  inputText.value = val;
}, 300);

function onInputTextChange(value: string) {
  debouncedSetInput(value);
}

function onSearch(value: string) {
  debouncedSetInput.cancel();
  inputText.value = value;
}

function onBookSelectionChange(selection: string[]) {
  selectedBooks.value = selection;
}

function clearInput() {
  debouncedSetInput.cancel();
  inputText.value = '';
}

function printList() {
  window.print();
}
</script>

<style scoped>
.app-container {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

@media (max-width: 640px) {
  .app-container {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }
}
</style>
