<template>
    <div class="tooltip-wrapper" ref="triggerRef" @mouseenter="show = true" @mouseleave="show = false"
        @click.stop="show = !show">
        <slot />

        <teleport to="body">
            <div v-if="show" class="tooltip-content" :style="positionStyle">
                <ul>
                    <li v-for="(book, index) in books" :key="index" class="tooltip-book">
                        <span class="book-name">《{{ book.bookName }}》</span>
                        <span class="book-page">頁數：{{ book.page ?? '---' }}</span>
                        <span v-if="book.pos" class="book-pos">位置：{{ book.pos }}</span>
                    </li>
                </ul>
            </div>
        </teleport>
    </div>
</template>


<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { BookPosition } from '../types/books';

defineProps<{
    books: Array<BookPosition>;
}>();

const show = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const positionStyle = ref<Record<string, string>>({});

watch(show, async (newVal) => {
    if (newVal) {
        await nextTick();
        updateTooltipPosition();
    }
});

function updateTooltipPosition() {
    const triggerEl = triggerRef.value;
    const tooltipEl = document.querySelector('.tooltip-content') as HTMLElement;
    if (!triggerEl || !tooltipEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect(); // 真正寬高

    let top = triggerRect.top - 8 - tooltipRect.height; // 預設往上
    let left = triggerRect.left + triggerRect.width / 2;

    // 上方邊界檢查
    if (top < 8) {
        top = triggerRect.bottom + 8; // 翻轉往下
    }

    // 左邊界檢查
    if (left - tooltipRect.width / 2 < 8) {
        left = 8 + tooltipRect.width / 2;
    }

    // 右邊界檢查
    if (left + tooltipRect.width / 2 > window.innerWidth - 8) {
        left = window.innerWidth - 8 - tooltipRect.width / 2;
    }

    positionStyle.value = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translateX(-50%)',
        zIndex: '1000',
    };
}


</script>

<style lang="scss" scoped>
.tooltip-wrapper {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

.tooltip-content {
    white-space: nowrap; // 不換行
    overflow: hidden; // 超出隱藏
    text-overflow: ellipsis; // 超出顯示省略號
    background-color: #f9fafb;
    color: #0f172a;
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
}

.tooltip-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tooltip-book {
    display: flex;
    gap: 0.5rem; // 每個資訊之間間距 0.5rem
    line-height: 1.5; // 行高增加閱讀性
}

.book-name {
    font-weight: bold;
}

.book-page,
.book-pos {
    color: #0f172a;
}

@media (max-width: 480px) {
    .tooltip-content {
        max-width: 95vw; // 手機上更寬，保留少量邊距
        padding: 0.4rem 0.8rem; // 減少 padding
        font-size: 0.75rem; // 字體縮小
    }
}
</style>
