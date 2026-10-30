<template>
    <div class="spotlight-wrapper">
        <!-- 保留原本按鈕樣式 -->
        <slot :open="openSpotlight">
            <!-- 預設按鈕 -->
            <button v-if="src" @click.stop="openSpotlight" class="btn btn-primary">
                {{ buttonText ?? '查看圖' }}
            </button>
        </slot>
        <!-- Spotlight Overlay 用 teleport 放到 body -->
        <teleport to="body">
            <div v-if="isOpen" class="spotlight-overlay" role="dialog" :aria-label="alt" @click="closeSpotlight">
                <img :src="src" :alt="alt" class="spotlight-image" />
                <p class="spotlight-hint">點任何地方關閉</p>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

defineProps<{
    src: string;
    alt?: string;
    buttonText?: string;
}>();

const isOpen = ref(false);

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeSpotlight();
}

function openSpotlight() {
    isOpen.value = true;
    window.addEventListener('keydown', onKeydown);
}

function closeSpotlight() {
    isOpen.value = false;
    window.removeEventListener('keydown', onKeydown);
}

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped lang="scss">
.spotlight-wrapper {
    display: inline-block;
}

.spotlight-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    z-index: 9999;
    cursor: zoom-out;
}

.spotlight-image {
    width: min(90vw, 80vh);
    height: min(90vw, 80vh);
    object-fit: contain;
    background: #ffffff;
    border-radius: 0.75rem;
}

.spotlight-hint {
    margin: 0;
    color: #ffffff;
    font-size: 1.25rem;
}
</style>
