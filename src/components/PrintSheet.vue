<template>
  <section class="print-only print-sheet">
    <h1 class="print-title">練字清單（依頁碼排序）</h1>
    <p class="print-meta">查詢：{{ inputText }}</p>

    <table class="print-table">
      <thead>
        <tr>
          <th v-if="showBookName">書名</th>
          <th>頁碼</th>
          <th>第幾字</th>
          <th>字</th>
          <th>字帖</th>
          <th>已寫好</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in foundRows" :key="row.key">
          <td v-if="showBookName">{{ row.book.bookName }}</td>
          <td class="page">{{ row.book.page }}</td>
          <td>{{ formatPos(row.book.pos) }}</td>
          <td class="character">{{ row.character }}</td>
          <td>
            <div class="images">
              <img
                v-for="image in getBookImages(row.book, row.character)"
                :key="image.variant"
                :src="image.src"
                :alt="`${image.label} ${image.char}`"
              />
            </div>
          </td>
          <td class="check">{{ isDone(row.book) ? '☑' : '☐' }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="missingChars" class="print-meta">書裡沒有的字：{{ missingChars }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookPosition } from '../types/books';
import type { ResultRow } from '../types/view';
import { formatPos, getBookImages } from '../utils/bookImages';

const props = defineProps<{
  rows: ResultRow[];
  inputText: string;
  showBookName: boolean;
  isDone: (book: BookPosition) => boolean;
}>();

const foundRows = computed(() => props.rows.filter((row) => row.found));
const missingChars = computed(() =>
  props.rows.filter((row) => !row.found).map((row) => row.character).join('、')
);
</script>

<style scoped lang="scss">
.print-sheet {
  color: #000000;
  font-size: 12pt;
}

.print-title {
  margin: 0 0 0.25rem;
  font-size: 18pt;
}

.print-meta {
  margin: 0 0 0.75rem;
}

.print-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 4pt 8pt;
    border: 1px solid #999999;
    text-align: left;
  }

  tr {
    break-inside: avoid;
  }

  .page {
    font-size: 16pt;
    font-weight: 700;
  }

  .character {
    font-size: 22pt;
    font-weight: 700;
  }

  .images {
    display: flex;
    gap: 6pt;

    img {
      width: 2.2cm;
      height: 2.2cm;
    }
  }

  .check {
    font-size: 18pt;
    text-align: center;
  }
}
</style>
