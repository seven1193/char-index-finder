<template>
  <section class="search-form">
    <div class="input-group">
      <label for="input-text" class="label">輸入文字：</label>
      <textarea
        id="input-text"
        v-model="localInput"
        rows="3"
        class="textarea"
        @input="$emit('inputTextChange', localInput)"
      ></textarea>
      <button @click="$emit('clearInput')" class="clear-btn">清空</button>
    </div>

    <div class="input-group" v-if="totalBooks > 1">
      <label class="label">選擇查找書籍：</label>
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

    <div class="stats">
      總字數：{{ totalCharacters }}，已找到：{{ totalFound }} 字
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { BooksData } from '../types/books';

const props = defineProps<{
  booksData: BooksData;
  inputText: string;
  selectedBooks: string[];
  totalCharacters: number;
  totalFound: number;
}>();

const totalBooks = computed(() => Object.keys(props.booksData).length);

const emits = defineEmits(['inputTextChange', 'bookSelectionChange', 'clearInput']);

const localInput = ref(props.inputText);
const localSelection = ref([...props.selectedBooks]);

watch(() => props.inputText, val => (localInput.value = val));
watch(() => props.selectedBooks, val => (localSelection.value = [...val]));
</script>

<style scoped lang="scss">
.search-form {
  background: #fafafa;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
  font-size: 0.95rem;
  color: #374151;

  .input-group {
    margin-bottom: 1.5rem;

    .label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: block;
    }

    .textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      resize: vertical;
      font-family: inherit;
      font-size: 0.95rem;
    }

    .clear-btn {
      margin-top: 0.5rem;
      background: none;
      border: none;
      color: #2563eb;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0;
      transition: color 0.2s;

      &:hover {
        color: #1d4ed8;
        text-decoration: underline;
      }
    }
  }

  .book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 0.5rem;
    max-height: 160px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.75rem;
    background: #fff;

    .book-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
  }

  .stats {
    margin-top: 1rem;
    color: #4b5563;
    font-size: 0.875rem;
  }
}
</style>
