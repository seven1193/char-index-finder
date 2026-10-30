<template>
  <section class="result-list" aria-label="查詢結果">
    <article v-for="row in rows" :key="row.key" class="row" :class="{ 'is-missing': !row.found }">
      <div class="character">{{ row.character }}</div>

      <template v-if="row.found">
        <div class="images">
          <CharImage
            v-for="image in getBookImages(row.book, row.character)"
            :key="image.variant"
            :src="image.src"
            :alt="`${image.label} ${image.char} 字帖`"
            :caption="image.label ? `${image.label} ${image.char}` : ''"
          />
        </div>
        <div class="location">
          <span v-if="showBookName" class="book-name">《{{ row.book.bookName }}》</span>
          <span class="page">第 {{ row.book.page }} 頁</span>
          <span v-if="row.book.pos" class="pos">這頁的第 {{ formatPos(row.book.pos) }} 個字</span>
        </div>
        <label class="done-check">
          <input type="checkbox" :checked="isDone(row.book)" @change="$emit('toggleDone', row.book)" />
          已寫好
        </label>
      </template>

      <p v-else class="missing">書裡沒有這個字</p>
    </article>
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
.result-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .row {
    display: grid;
    grid-template-columns: 4rem auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 1.25rem;
    padding: 0.625rem 1.25rem;
    background: var(--surface);
    border: 2px solid var(--line);
    border-radius: var(--radius-lg);

    &.is-missing {
      grid-template-columns: 4rem minmax(0, 1fr);
      background: transparent;
      border-style: dashed;
    }
  }

  .character {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
    text-align: center;
  }

  .images {
    display: flex;
    gap: 0.875rem;
  }

  .location {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .book-name {
      font-size: 0.9375rem;
      color: var(--muted);
    }

    .page {
      font-size: 1.625rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .pos {
      font-size: 1.0625rem;
      color: var(--muted);
    }
  }

  .missing {
    margin: 0;
    font-size: 1.1875rem;
    color: var(--muted);
  }
}

@media (max-width: 760px) {
  .result-list .row {
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: 0.5rem 0.75rem;
    padding: 0.75rem 1rem;

    .character {
      font-size: 2.25rem;
    }

    .images,
    .location,
    .done-check {
      grid-column: 2;
    }
  }
}
</style>
