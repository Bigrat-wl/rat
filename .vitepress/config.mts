import { defineConfig } from 'vitepress';
import UnoCss from 'unocss/vite';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Rat oOo',
  description: '前端已死...',

  appearance: true,

  markdown: {
    headers: {
      level: [2, 3], // 提取 h2 和 h3 作为目录
    },
  },

  vite: {
    plugins: [UnoCss()],
  },
});
