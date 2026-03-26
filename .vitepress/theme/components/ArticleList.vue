<script setup>
// 从上一级目录的 posts.data 模块里导入 data
// 这里不要写 .js，Vite 会自动找到 posts.data.ts
import { data as posts } from './posts.data';
</script>

<template>
  <ul>
    <li v-for="post in posts" :key="post.url">
      <!-- 默认结构是 post.url + post.frontmatter.xxx -->
      <a :href="post.url">{{ post.frontmatter.title }}</a>
      <span>{{ post.frontmatter.date }}</span>
    </li>
  </ul>
</template>
