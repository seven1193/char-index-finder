<template>
  <div class="result-table">
    <table>
      <thead>
        <tr>
          <th>書名</th>
          <th>章節</th>
          <th>段落</th>
          <th>內容</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in results" :key="index">
          <td>{{ result.book }}</td>
          <td>{{ result.chapter }}</td>
          <td>{{ result.paragraph }}</td>
          <td v-html="highlightKeyword(result.content)"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{ 
  results: Array<{
    book: string;
    chapter: string;
    paragraph: number;
    content: string;
    keyword: string;
  }>
}>();

function highlightKeyword(text: string): string {
  if (!props.results[0]?.keyword) return text;
  const keyword = props.results[0].keyword;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
</script>

<style scoped lang="scss">
.result-table {
  overflow-x: auto;
  background: #ffffff;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background-color: #f9fafb;
      color: #1f2937;
      font-weight: 600;
      font-size: 0.95rem;
    }

    td {
      font-size: 0.95rem;
      color: #374151;

      mark {
        background-color: #fef3c7;
        color: #92400e;
        padding: 0 0.2em;
        border-radius: 0.25rem;
      }
    }

    tr:hover {
      background-color: #f1f5f9;
    }
  }
}
</style>
