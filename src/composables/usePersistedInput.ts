import { ref, watch, onMounted } from 'vue';

export function usePersistedInput(storageKey: string, defaultValue = '') {
  const inputText = ref(defaultValue);

  onMounted(() => {
    const saved = sessionStorage.getItem(storageKey);
    inputText.value = saved ?? defaultValue;
  });

  watch(inputText, (val) => {
    sessionStorage.setItem(storageKey, val);
  });

  return inputText;
}