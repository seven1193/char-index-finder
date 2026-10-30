<template>
  <div class="view-toolbar">
    <div class="tabs" role="tablist" aria-label="檢視方式">
      <button
        v-for="tab in TABS"
        :key="tab.value"
        type="button"
        role="tab"
        class="tab"
        :class="{ 'is-selected': view === tab.value }"
        :aria-selected="view === tab.value"
        @click="$emit('update:view', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="actions">
      <div class="sort" role="group" aria-label="排列方式">
        <span class="sort-label">排列</span>
        <button
          v-for="option in SORTS"
          :key="option.value"
          type="button"
          class="btn"
          :class="{ 'is-active': sort === option.value }"
          :aria-pressed="sort === option.value"
          @click="$emit('update:sort', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
      <button type="button" class="btn print-btn" @click="$emit('print')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 9V3h12v6" />
          <rect x="3" y="9" width="18" height="8" rx="2" />
          <path d="M6 14h12v7H6z" />
        </svg>
        列印
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortMode, ViewMode } from '../types/view';

defineProps<{
  view: ViewMode;
  sort: SortMode;
}>();

defineEmits<{
  'update:view': [value: ViewMode];
  'update:sort': [value: SortMode];
  print: [];
}>();

const TABS: { value: ViewMode; label: string }[] = [
  { value: 'list', label: '列表' },
  { value: 'grid', label: '字帖' },
  { value: 'table', label: '翻書清單' },
];

const SORTS: { value: SortMode; label: string }[] = [
  { value: 'input', label: '照輸入順序' },
  { value: 'page', label: '照頁碼' },
];
</script>

<style scoped lang="scss">
.view-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .tabs {
    display: flex;
    gap: 0.25rem;
    padding: 0.3rem;
    background: var(--tab-bg);
    border-radius: 0.875rem;

    .tab {
      padding: 0.4rem 1.25rem;
      font-size: 1.1875rem;
      border: none;
      border-radius: 0.625rem;
      background: transparent;
      color: #3a3a3a;

      &.is-selected {
        background: var(--surface);
        color: var(--accent);
        font-weight: 700;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .sort {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .sort-label {
      font-size: 1.0625rem;
      color: var(--muted);
    }
  }

  .print-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
}

@media (max-width: 640px) {
  .view-toolbar .tabs {
    width: 100%;

    .tab {
      flex: 1;
      padding: 0.4rem 0.25rem;
      font-size: 1.0625rem;
    }
  }
}
</style>
