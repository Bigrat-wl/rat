<script setup lang="ts">
import { useData } from 'vitepress';

const { isDark } = useData();
</script>

<template>
  <button
    flex
    items-center
    justify-center
    bg-transparent
    border-none
    cursor-pointer
    @click="isDark = !isDark"
  >
    <i v-if="isDark" i-tabler-sun icon-base />
    <i v-else i-tabler-moon icon-base />
  </button>
</template>
