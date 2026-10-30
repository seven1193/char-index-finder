import { ref, watch } from "vue";

// 存在 localStorage 的使用者偏好（檢視方式、排列等）
export function usePreference<T extends string>(
  storageKey: string,
  defaultValue: T,
  allowed: readonly T[]
) {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(storageKey);
  } catch {
    // 無法讀取時使用預設值
  }

  const value = ref<T>(
    allowed.includes(saved as T) ? (saved as T) : defaultValue
  );

  watch(value, (val) => {
    try {
      localStorage.setItem(storageKey, val);
    } catch {
      // 無法儲存時忽略
    }
  });

  return value;
}
