<script setup lang="ts">
import { useData } from 'vitepress';

const { site } = useData();
</script>

<template>
  <div mb-10 max-w-3xl mx-auto>
    <h1 text-10 m-0>{{ site.title }}</h1>
    <p style="color: var(--c-text-light)">{{ site.description }}</p>
  </div>
</template>
