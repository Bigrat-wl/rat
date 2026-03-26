<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import ToggleTheme from './ToggleTheme.vue';

const route = useRoute();

const navLinks = [
  { text: '首页', link: '/' },
  { text: '归档', link: '/posts/archives' },
  { text: '项目', link: '/posts/projects' },
];

function normalizePath(path: string) {
  const withoutHtml = path.replace(/\.html$/, '');
  const withoutIndex = withoutHtml.replace(/\/index$/, '/');

  if (withoutIndex === '/' || withoutIndex === '') {
    return '/';
  }

  return withoutIndex.replace(/\/$/, '');
}

const currentPath = computed(() => normalizePath(route.path));

function isActive(link: string) {
  const targetPath = normalizePath(link);

  if (targetPath === '/') {
    return currentPath.value === '/';
  }

  return (
    currentPath.value === targetPath ||
    currentPath.value.startsWith(`${targetPath}/`)
  );
}
</script>

<template>
  <header h-16 border-b border-[var(--c-border)] bg-[var(--c-bg)]>
    <nav h-full flex justify-between items-center px-4>
      <a href="/" class="logo-link" aria-label="Rat oOo Home">
        <span class="logo-icon" aria-hidden="true" />
      </a>

      <ul class="site-nav" flex gap-4 text-4.4 items-center>
        <li v-for="item in navLinks" :key="item.link">
          <a
            :href="item.link"
            class="nav-link"
            :class="{ 'nav-link--active': isActive(item.link) }"
            p-1
          >
            {{ item.text }}
          </a>
        </li>

        <li>
          <ToggleTheme />
        </li>
      </ul>
    </nav>
  </header>
</template>
