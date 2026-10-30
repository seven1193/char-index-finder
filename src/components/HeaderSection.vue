<template>
  <header class="header-section">
    <h1 class="title">字詞查找器</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  subtitle?: string;
}>();
</script>

<style scoped lang="scss">
.header-section {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;

  .title {
    margin: 0;
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: 0.125rem;
  }

  .subtitle {
    margin: 0;
    font-size: 1.125rem;
    color: var(--muted);
  }
}
</style>
