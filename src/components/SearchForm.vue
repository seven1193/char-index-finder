<template>
  <section class="search-form">
    <label for="input-text" class="label">輸入要查的字（繁體、簡體都可以）</label>
    <div class="input-row">
      <textarea
        id="input-text"
        ref="textareaRef"
        v-model="localInput"
        rows="1"
        class="textarea"
        @input="onInput"
        @keydown.enter.prevent="$emit('search', localInput)"
      ></textarea>
      <button type="button" class="btn btn-primary action-btn" @click="$emit('search', localInput)">查詢</button>
      <button type="button" class="btn action-btn" @click="$emit('clearInput')">清空</button>
    </div>

    <p class="stats">
      <span>共 {{ totalCharacters }} 個字，{{ totalFound === totalCharacters ? '全部找到' : `找到 ${totalFound} 個` }}</span>
      <span v-if="totalFound > 0">已寫好 {{ doneCount }} / {{ totalFound }}</span>
    </p>

    <div v-if="totalBooks > 1" class="book-group">
      <p class="label">選擇查找書籍：</p>
      <div class="book-list">
        <label v-for="(_, bookName) in booksData" :key="bookName" class="book-option">
          <input
            type="checkbox"
            :value="bookName"
            v-model="localSelection"
            @change="$emit('bookSelectionChange', localSelection)"
          />
          {{ bookName }}
        </label>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { BooksData } from '../types/books';

const props = defineProps<{
  booksData: BooksData;
  inputText: string;
  selectedBooks: string[];
  totalCharacters: number;
  totalFound: number;
  doneCount: number;
}>();

const totalBooks = computed(() => Object.keys(props.booksData).length);

const emit = defineEmits(['inputTextChange', 'search', 'bookSelectionChange', 'clearInput']);

const localInput = ref(props.inputText);
const localSelection = ref([...props.selectedBooks]);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// 輸入框依內容自動長高
function autoResize() {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  const border = el.offsetHeight - el.clientHeight;
  el.style.height = `${el.scrollHeight + border}px`;
}

function onInput() {
  emit('inputTextChange', localInput.value);
  autoResize();
}

watch(() => props.inputText, async val => {
  localInput.value = val;
  await nextTick();
  autoResize();
});
watch(() => props.selectedBooks, val => (localSelection.value = [...val]));

// 寬度改變時換行數也會變
onMounted(() => {
  autoResize();
  window.addEventListener('resize', autoResize);
});
onBeforeUnmount(() => window.removeEventListener('resize', autoResize));
</script>

<style scoped lang="scss">
.search-form {
  background: var(--surface);
  border: 2px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 1.125rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  .label {
    margin: 0;
    font-size: 1.1875rem;
    font-weight: 700;
  }

  .input-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .textarea {
    flex: 1;
    min-width: 0;
    padding: 0.375rem 1rem;
    font-size: 1.75rem;
    line-height: 1.4;
    letter-spacing: 0.25rem;
    border: 2px solid var(--line-strong);
    border-radius: var(--radius);
    overflow: hidden;
    resize: none;
    color: var(--ink);
    background: var(--surface);
  }

  // 與單行輸入框同高，輸入框長高時按鈕維持在上方
  .action-btn {
    min-width: 6rem;
    height: calc(3.2rem + 4px);
    font-size: 1.3125rem;
  }

  .stats {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0 1.5rem;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--ok);

    span {
      white-space: nowrap;
    }
  }

  .book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    gap: 0.5rem;
    max-height: 10rem;
    overflow-y: auto;
    margin-top: 0.5rem;
    padding: 0.75rem;
    border: 1px solid var(--line);
    border-radius: 0.5rem;

    .book-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.125rem;

      input {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: var(--accent);
      }
    }
  }
}

@media (max-width: 640px) {
  .search-form {
    padding: 1rem;

    .label {
      font-size: 1.0625rem;
    }

    .input-row {
      flex-wrap: wrap;
    }

    .textarea {
      flex-basis: 100%;
      font-size: 1.5rem;
      letter-spacing: 0.125rem;
    }

    .action-btn {
      flex: 1;
    }
  }
}
</style>
