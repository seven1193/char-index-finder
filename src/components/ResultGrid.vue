<template>
  <section class="result-grid-section" aria-label="查詢結果">
    <div class="script-toggle" role="group" aria-label="字帖顯示">
      <span class="toggle-label">字帖顯示</span>
      <button
        v-for="option in SCRIPTS"
        :key="option.value"
        type="button"
        class="btn pill"
        :class="{ 'is-active': script === option.value }"
        :aria-pressed="script === option.value"
        @click="script = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="grid">
      <article v-for="row in rows" :key="row.key" class="card" :class="{ 'is-missing': !row.found }">
        <div v-if="row.found" class="card-images">
          <CharImage
            v-for="image in visibleImages(row)"
            :key="image.variant"
            :src="image.src"
            :thumb="image.thumb"
            :alt="`${image.label} ${image.char} 字帖`"
            size="100%"
          />
        </div>
        <div v-else class="card-missing">書裡沒有這個字</div>

        <div class="card-footer">
          <span class="character">{{ row.character }}</span>
          <template v-if="row.found">
            <span class="page-pill">{{ row.book.page }} 頁 · {{ formatPos(row.book.pos) }}</span>
            <input
              type="checkbox"
              class="card-check"
              :checked="isDone(row.book)"
              :aria-label="`${row.character} 已寫好`"
              @change="$emit('toggleDone', row.book)"
            />
          </template>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BookPosition } from '../types/books';
import type { GridScript, ResultRow } from '../types/view';
import { formatPos, getBookImages } from '../utils/bookImages';
import { usePreference } from '../composables/usePreference';
import CharImage from './CharImage.vue';

defineProps<{
  rows: ResultRow[];
  isDone: (book: BookPosition) => boolean;
}>();

defineEmits<{
  toggleDone: [book: BookPosition];
}>();

const SCRIPTS: { value: GridScript; label: string }[] = [
  { value: 'trad', label: '繁體' },
  { value: 'simp', label: '簡體' },
  { value: 'both', label: '並列' },
];

const script = usePreference<GridScript>('gridScript', 'trad', ['trad', 'simp', 'both']);

// 沒有簡體圖的字（一般書籍、P0）在「簡體」模式下仍顯示繁體圖
function visibleImages(row: ResultRow) {
  const images = getBookImages(row.book, row.character);
  if (script.value === 'both') return images;
  const match = images.filter((image) => image.variant === script.value);
  return match.length > 0 ? match : images.slice(0, 1);
}
</script>

<style scoped lang="scss">
.result-grid-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.script-toggle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;

  .toggle-label {
    font-size: 1.0625rem;
    color: var(--muted);
  }

  .pill {
    border-radius: 999px;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 0.875rem;
}

.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
  border: 2px solid var(--line);
  border-radius: 0.875rem;

  &.is-missing {
    background: transparent;
    border-style: dashed;
  }
}

.card-images {
  display: flex;

  > * {
    flex: 1;
    min-width: 0;
  }

  // 字帖卡片中的圖填滿寬度
  :deep(.spotlight-wrapper) {
    display: block;
  }

  :deep(.thumb-btn) {
    width: 100%;
    border: none;
    border-radius: 0;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
    }
  }

  :deep(.placeholder) {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    border: none;
  }
}

.card-missing {
  flex: 1;
  min-height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--muted);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-top: 2px solid var(--line);

  .character {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .page-pill {
    padding: 0.15rem 0.625rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
    white-space: nowrap;
  }

  .card-check {
    width: 1.375rem;
    height: 1.375rem;
    margin: 0;
    accent-color: var(--accent);
    cursor: pointer;
  }
}

// 手機一排兩張
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .card-footer {
    flex-wrap: wrap;
    padding: 0.5rem 0.625rem;

    .character {
      font-size: 1.5rem;
    }

    .page-pill {
      order: 3;
      padding: 0.2rem 0.625rem;
      font-size: 1rem;
    }
  }
}
</style>
