<template>
  <section class="result-table-section">
    <h2 class="section-title">查詢結果</h2>
    <div class="table-wrapper">
      <table class="result-table">
        <thead>
          <tr>
            <th>字詞</th>
            <th>出現書籍與頁碼</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in results" :key="result.character">
            <td class="character-cell">
              <span class="character">{{ result.character }}</span>
            </td>
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
  </section>
</template>

<script setup lang="ts">
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
</script>

<style scoped lang="scss">
.result-table-section {
  padding: 1rem 2rem 2rem 2rem;
  margin-top: 2rem;
  background: linear-gradient(135deg, #f0fdfa, #e0f2fe);
  border-radius: 1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .table-wrapper {
    max-height: 400px;
    overflow-y: auto;
    border-radius: 0.5rem;
  }

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
        padding-left: 1.2rem;
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
</style>
