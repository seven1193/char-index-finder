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
            <div v-if="isOpen" class="spotlight-overlay" @click="closeSpotlight">
                <img :src="src" class="spotlight-image" />
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    src: string;
    buttonText?: string;
}>();

const isOpen = ref(false);

function openSpotlight() {
    isOpen.value = true;
}

function closeSpotlight() {
    isOpen.value = false;
}
</script>

<style scoped lang="scss">
.spotlight-wrapper {
    display: inline-block;
}

.spotlight-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spotlight-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 0.5rem;
}
</style>
