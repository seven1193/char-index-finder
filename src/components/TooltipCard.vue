<template>
    <div class="tooltip-wrapper" ref="triggerRef" @mouseenter="show = true" @mouseleave="show = false"
        @click="show = !show">
        <slot />

        <teleport to="body">
            <div v-if="show" class="tooltip-content" :style="positionStyle">
                <ul>
                    <li v-for="(book, index) in books" :key="index">
                        《{{ book.bookName }}》第 {{ book.page }} 頁
                    </li>
                </ul>
            </div>
        </teleport>
    </div>
</template>


<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

defineProps<{
    books: Array<{ bookName: string; page: string }>;
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
    if (triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        positionStyle.value = {
            position: 'fixed', // 原本是 absolute，這裡改成 fixed
            top: `${rect.top}px`,
            left: `${rect.left + rect.width / 2}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: '1000',
        };
    }
}

</script>

<style lang="scss" scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-content {
  position: fixed; // 重點：從 absolute 改成 fixed
  transform: translateX(-50%) translateY(-0.5rem);
  max-width: 150px;
  background-color: #f9fafb;
  color: #0f172a;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  white-space: pre-line;
  z-index: 1000; // 提高層級避免被蓋住
  font-size: 0.875rem;
  pointer-events: none; // 讓 hover/out 判斷更流暢

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

</style>
