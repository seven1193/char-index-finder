<template>
  <figure class="char-image" :style="{ '--size': size }">
    <SpotlightImage v-if="!failed" :src="src" :alt="alt">
      <template #default="{ open }">
        <button class="thumb-btn" type="button" :aria-label="`放大 ${alt}`" @click.stop="open">
          <img :src="src" :alt="alt" loading="lazy" @error="failed = true" />
        </button>
      </template>
    </SpotlightImage>
    <div v-else class="placeholder">沒有圖</div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SpotlightImage from './SpotlightImage.vue';

const props = withDefaults(defineProps<{
  src: string;
  alt: string;
  caption?: string;
  size?: string;
}>(), {
  size: '5rem',
});

const failed = ref(false);

watch(() => props.src, () => {
  failed.value = false;
});
</script>

<style scoped lang="scss">
.char-image {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  .thumb-btn {
    display: block;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 0.5rem;
    background: var(--surface);
    overflow: hidden;

    &:hover {
      border-color: var(--accent);
    }

    img {
      display: block;
      width: var(--size);
      height: var(--size);
      object-fit: cover;
    }
  }

  .placeholder {
    width: var(--size);
    height: var(--size);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--line-strong);
    border-radius: 0.5rem;
    color: var(--muted);
    font-size: 0.875rem;
  }

  figcaption {
    font-size: 0.875rem;
    color: var(--muted);
  }
}
</style>
