import { defineConfig } from 'vitepress';
import UnoCss from 'unocss/vite';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Rat oOo',
  description: '前端已死...',

  vite: {
    plugins: [UnoCss()],
  },
});
