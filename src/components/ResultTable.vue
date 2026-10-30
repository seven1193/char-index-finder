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
                <li v-for="book in result.books" :key="book.bookName + book.page + book.pos">
                  <template v-if="book.page && book.pos">
                    <!-- Spotlight 按鈕（只有有 pos 才顯示），有繁簡版本時各一個 -->
                    <ImageCheck v-for="variant in getVariants(book)" :key="variant.key"
                      :src="getImageUrl(book.bookName, book.page, book.pos, variant.key)">
                      <SpotlightImage :src="getImageUrl(book.bookName, book.page, book.pos, variant.key)">
                        <template #default="{ open }">
                          <button class="btn btn-outline-secondary" @click.stop="open">{{ variant.label }}🔍</button>
                        </template>
                      </SpotlightImage>
                    </ImageCheck>
                  </template>
                  <span class="book-name">《{{ book.bookName }}》</span>
                  <span class="page-label">
                    <span v-if="book.page">{{ book.page }}頁</span>
                    <span v-if="book.pos">之{{ book.pos }}</span>
                  </span>
                  <span v-if="book.simp" class="variant-label">繁:{{ book.trad }} 簡:{{ book.simp }}</span>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="grid-wrapper">
      <TooltipCard v-for="result in results" :key="result.character" :books="result.books">
        <div class="grid-item">
          <div class="character">{{ result.character }}</div>
          <div class="books">
            <div v-for="book in result.books" :key="book.bookName + book.page + book.pos" class="pages">
              <!-- 改成頁-位置簡潔格式 -->
              <template v-if="book.page && book.pos">
                <ImageCheck v-for="variant in getVariants(book)" :key="variant.key"
                  :src="getImageUrl(book.bookName, book.page, book.pos, variant.key)">
                  <SpotlightImage :src="getImageUrl(book.bookName, book.page, book.pos, variant.key)">
                    <template #default="{ open }">
                      <button class="btn btn-primary" @click.stop="open">
                        <span class="page-text">
                          {{ book.page }}-{{ book.pos }}{{ variant.label ? ' ' + variant.label : '' }}
                        </span>
                      </button>
                    </template>
                  </SpotlightImage>

                  <!-- 簡體圖不存在時不顯示，只在繁體（主要）圖不存在時顯示頁碼 -->
                  <template v-if="variant.key === 'trad'" #fallback>
                    <div class="page">
                      <span class="page-text">
                        {{ book.page ?? '---' }}{{ book.pos ? '-' + book.pos : '' }}
                      </span>
                    </div>
                  </template>
                </ImageCheck>
              </template>
              <div v-else class="page">
                <span class="page-text">
                  {{ book.page ?? '---' }}{{ book.pos ? '-' + book.pos : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TooltipCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { BookPosition, CharacterResult } from '../types/books';
import ImageCheck from './ImageCheck.vue';
import SpotlightImage from './SpotlightImage.vue';
import TooltipCard from './TooltipCard.vue';

const BASE_URL = import.meta.env.BASE_URL;

type ImageVariant = 'trad' | 'simp';

// 簡體圖放在「書名（簡體）」資料夾
function getImageUrl(bookName: string, page: string, pos: string, variant: ImageVariant = 'trad') {
  const folder = variant === 'simp' ? `${bookName}（簡體）` : bookName;
  return `${BASE_URL}image/${folder}/${page}-${pos}.jpeg`;
}

// 有繁簡版本的書顯示「繁」「簡」兩個按鈕，一般書籍維持一個
function getVariants(book: BookPosition): { key: ImageVariant; label: string }[] {
  if (book.simp) {
    return [
      { key: 'trad', label: '繁' },
      { key: 'simp', label: '簡' },
    ];
  }
  return [{ key: 'trad', label: book.trad ? '繁' : '' }];
}

defineProps<{
  results: CharacterResult[];
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

            .page-label {
              display: inline-flex;
              column-gap: 0.5rem;
              margin-right: 0.5rem;
            }

            .pos-label {
              color: gray;
            }

            .variant-label {
              color: #64748b;
              font-size: 0.875rem;
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

      .books {
        display: flex;
        flex-wrap: wrap; // 自動換行
        justify-content: center;
        gap: 0.25rem; // 書本卡片間距
        max-height: 150px; // 固定書本區高度
        overflow-y: auto; // 超出高度可滾動

        .pages {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .page {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0f2fe;
          padding: 0.3rem 0.5rem; // 小卡片
          border-radius: 0.25rem;
          font-size: 0.75rem;
          color: #0f172a;

          .page-text {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
}
</style>
