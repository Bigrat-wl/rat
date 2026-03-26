// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWind3,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind3(), // 核心预设，提供类似 Tailwind 的原子化类名
    presetAttributify(), // 属性化模式，可以直接写 <div flex bg-red></div>
    presetIcons({
      scale: 1.2,
      warn: true,
    }), // 纯 CSS 图标支持（需要时可安装额外图标库）
    presetTypography(), // 专门为 Markdown 渲染的 HTML 提供优美的默认排版
  ],
  // 你还可以在这里自定义主题颜色、字体等
  theme: {
    colors: {
      primary: '#3eaf7c', // 自定义一个主题色
    },
  },

  shortcuts: {
    'icon-base': 'text-4.8 inline-block align-middle',
  },
});
