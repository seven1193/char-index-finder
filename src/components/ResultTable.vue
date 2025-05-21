<template>
  <section class="result-section">
    <h2 class="section-title">查詢結果</h2>

    <div class="toggle-wrapper">
      <button @click="isVertical = !isVertical" class="toggle-btn">
        {{ isVertical ? '橫式' : '直式' }}
      </button>
    </div>

    <!-- 直式表格 -->
    <div v-if="isVertical" class="table-wrapper">
      <table class="result-table">
        <thead>
          <tr>
            <th>字詞</th>
            <th>出現書籍與頁碼</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in results" :key="result.character">
            <td class="character-cell">{{ result.character }}</td>
            <td class="books-cell">
              <ul>
                <li v-for="book in result.books" :key="book.bookName + book.page">
                  <span class="book-name">《{{ book.bookName }}》</span> 第 {{ book.page }} 頁
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 橫式 Grid -->
    <div v-else class="grid-wrapper">
      <TooltipCard v-for="result in results" :key="result.character" :books="result.books">
        <div class="grid-item">
          <div class="character">{{ result.character }}</div>
          <div class="pages">
            <div v-for="book in result.books" :key="book.bookName + book.page" class="page">
              {{ book.page }}
            </div>
          </div>
        </div>
      </TooltipCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import TooltipCard from './TooltipCard.vue';

defineProps<{
  results: Array<{
    character: string;
    found: boolean;
    books: Array<{
      bookName: string;
      page: string;
    }>;
  }>;
}>();

const isVertical = ref(true);

// 讀取偏好
onMounted(() => {
  const savedMode = localStorage.getItem('displayMode');
  if (savedMode === 'vertical') {
    isVertical.value = true;
  } else {
    isVertical.value = false;
  }
});

// 偵測切換模式並儲存
watch(isVertical, (val) => {
  localStorage.setItem('displayMode', val ? 'vertical' : 'horizontal');
});
</script>

<style scoped lang="scss">
.result-section {
  position: relative;
  padding: 1rem 2rem 2rem 2rem;
  margin-top: 2rem;
  background: linear-gradient(135deg, #f0fdfa, #e0f2fe);
  border-radius: 1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1rem;
    text-align: center;
  }

  .toggle-wrapper {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;

    .toggle-btn {
      background-color: #2563eb;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #1e40af;
      }
    }
  }

  .table-wrapper {
    max-height: 80vh;
    overflow: auto;

    .result-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 1rem;
      background-color: #ffffff;

      thead {
        position: sticky;
        top: 0;
        z-index: 2;

        th {
          background-color: #f1f5f9;
          color: #1e293b;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
        vertical-align: top;
      }

      tr:hover {
        background-color: #f9fafb;
      }

      .character-cell {
        font-weight: bold;
        font-size: 1.25rem;
        color: #2563eb;
      }

      .books-cell {
        ul {
          list-style: none;
          margin: 0;
          padding: 0;

          li {
            margin-bottom: 0.5rem;
            color: #334155;

            .book-name {
              font-weight: 500;
              color: #0f172a;
            }
          }
        }
      }
    }
  }

  /* 橫式 Grid 版 */
  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    padding: 1rem 0;
    max-height: 80vh;
    overflow: auto;

    .grid-item {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 0.75rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      .character {
        font-weight: bold;
        font-size: 1.25rem;
        color: #2563eb;
        margin-bottom: 0.5rem;
      }

      .pages {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem;

        .page {
          background: #e0f2fe;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          color: #0f172a;
        }
      }
    }
  }
}
</style>
