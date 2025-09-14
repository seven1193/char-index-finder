<template>
    <template v-if="exists">
        <slot />
        <img :src="props.src" @error="onError" style="display:none" />
    </template>
    <template v-else>
        <slot name="fallback" />
    </template>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    src: string
}>();

const exists = ref(true);

function onError() {
    exists.value = false;
}
</script>
