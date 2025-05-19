<template>
  <section class="header-section">
    <h1 class="title">字詞查找器</h1>
    <p class="subtitle">請輸入要查找的詞語，並選擇要查找的書籍。</p>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.header-section {
  text-align: center;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #eef2ff, #f0f9ff);
  border-radius: 1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);

  .title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1rem;
    color: #374151;
  }
}
</style>