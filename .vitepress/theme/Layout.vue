<script setup lang="ts">
import { useData } from 'vitepress';
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import ArticleList from './components/ArticleList.vue';

// https://vitepress.dev/reference/runtime-api#usedata
const { frontmatter } = useData();
</script>

<template>
  <Header />

  <main px-10 pt-12>
    <div v-if="frontmatter.home">
      <Hero />

      <ArticleList />

      <article max-w-3xl mx-auto>
        <ul p-0>
          <li><a href="/markdown-examples.html">Markdown Examples</a></li>
          <li><a href="/api-examples.html">API Examples</a></li>
        </ul>
      </article>
    </div>

    <div v-else>
      <Content />
    </div>
  </main>
</template>
