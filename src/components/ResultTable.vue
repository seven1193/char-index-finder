<template>
  <section class="table-wrapper" aria-label="查詢結果">
    <table class="result-table">
      <thead>
        <tr>
          <th v-if="showBookName" scope="col">書名</th>
          <th scope="col">頁碼</th>
          <th scope="col">這頁第幾字</th>
          <th scope="col">字</th>
          <th scope="col">字帖</th>
          <th scope="col" class="center">已寫好</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.key" :class="{ 'is-missing': !row.found }">
          <template v-if="row.found">
            <td v-if="showBookName" class="book-name">{{ row.book.bookName }}</td>
            <td class="page">{{ row.book.page }}</td>
            <td>{{ row.book.pos ? `第 ${formatPos(row.book.pos)} 字` : '' }}</td>
            <td class="character">{{ row.character }}</td>
            <td>
              <div class="images">
                <CharImage
                  v-for="image in getBookImages(row.book, row.character)"
                  :key="image.variant"
                  :src="image.src"
                  :thumb="image.thumb"
                  :alt="`${image.label} ${image.char} 字帖`"
                  :caption="image.label"
                  size="4rem"
                />
              </div>
            </td>
            <td class="center">
              <input
                type="checkbox"
                class="row-check"
                :checked="isDone(row.book)"
                :aria-label="`${row.character} 已寫好`"
                @change="$emit('toggleDone', row.book)"
              />
            </td>
          </template>
          <template v-else>
            <td v-if="showBookName"></td>
            <td class="page">—</td>
            <td></td>
            <td class="character">{{ row.character }}</td>
            <td colspan="2" class="missing">書裡沒有這個字</td>
          </template>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import type { BookPosition } from '../types/books';
import type { ResultRow } from '../types/view';
import { formatPos, getBookImages } from '../utils/bookImages';
import CharImage from './CharImage.vue';

defineProps<{
  rows: ResultRow[];
  showBookName: boolean;
  isDone: (book: BookPosition) => boolean;
}>();

defineEmits<{
  toggleDone: [book: BookPosition];
}>();
</script>

<style scoped lang="scss">
.table-wrapper {
  overflow-x: auto;
  background: var(--surface);
  border: 2px solid var(--line);
  border-radius: var(--radius-lg);
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.125rem;

  th {
    padding: 0.625rem 1rem;
    font-size: 1rem;
    text-align: left;
    white-space: nowrap;
    background: var(--tab-bg);
  }

  td {
    padding: 0.375rem 1rem;
    border-top: 1px solid var(--line);
    white-space: nowrap;
  }

  .center {
    text-align: center;
  }

  .book-name {
    font-size: 0.9375rem;
    color: var(--muted);
  }

  .page {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent);
  }

  .character {
    font-size: 2rem;
    font-weight: 700;
  }

  .images {
    display: flex;
    gap: 0.75rem;
  }

  .row-check {
    width: 1.5rem;
    height: 1.5rem;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .is-missing .missing {
    color: var(--muted);
  }
}
</style>
