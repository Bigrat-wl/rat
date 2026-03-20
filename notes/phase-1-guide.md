# 第一阶段：博客核心骨架开发指南

> **目标**：完成导航栏 + 首页(Hero + 文章列表) + 文章页(带 TOC) + 暗色模式切换
> **原则**：你自己写代码，本指南提供知识点、注意事项和编码建议
> **参考文档**：[自定义主题](https://vitepress.dev/guide/custom-theme) | [数据加载](https://vitepress.dev/guide/data-loading) | [运行时 API](https://vitepress.dev/reference/runtime-api) | [站点配置](https://vitepress.dev/reference/site-config)

---

## 前置知识：Vue 3 核心概念速查

在开始之前，你需要理解以下 Vue 3 的基础概念，整个项目都会用到它们。

### 1. 单文件组件 (SFC) 的结构

每个 `.vue` 文件由三部分组成：

```vue
<!-- 1. 脚本：写逻辑（变量、函数、导入） -->
<script setup lang="ts">
// setup 是 Vue 3 的写法，意思是"这里面的变量/函数直接能在模板里用"
// lang="ts" 表示用 TypeScript，但你可以暂时当普通 JS 写，TS 不强制你加类型注解
import { ref } from 'vue'

const count = ref(0)       // ref() 创建一个"响应式变量"
// 什么叫响应式？就是这个变量改了，页面会自动更新
// 在 JS 里读写要用 .value：count.value = 1
// 在模板(template)里 Vue 自动解包，直接写 count 就行
</script>

<!-- 2. 模板：写 HTML 结构 -->
<template>
  <div>
    <p>{{ count }}</p>           <!-- {{ }} 插值，显示变量的值 -->
    <button @click="count++">   <!-- @click 绑定点击事件 -->
      +1
    </button>
  </div>
</template>

<!-- 3. 样式（可选） -->
<style scoped>
/* scoped 表示样式只对当前组件生效，不会污染其他组件 */
p { color: red; }
</style>
```

### 2. 模板语法速查

你在模板里会频繁用到这些：

```html
<!-- 显示变量 -->
{{ title }}

<!-- 条件渲染：满足条件才显示 -->
<div v-if="isHome">首页内容</div>
<div v-else>其他页面</div>
<!-- v-if 和 v-else 必须紧挨着，中间不能插别的元素！ -->

<!-- 列表渲染：遍历数组 -->
<ul>
  <li v-for="item in list" :key="item.id">
    {{ item.name }}
  </li>
</ul>
<!-- :key 是必须的，告诉 Vue 每个元素的唯一标识 -->

<!-- 绑定属性：前面加冒号 : -->
<a :href="post.url">{{ post.title }}</a>
<!-- 不加冒号是静态值：href="/about" -->
<!-- 加了冒号是 JS 表达式：:href="post.url" 读取变量 post.url 的值 -->

<!-- 绑定事件：用 @ -->
<button @click="isDark = !isDark">切换</button>
```

### 3. 组件的导入和使用

```vue
<script setup lang="ts">
// 导入一个组件（就像导入一个模块）
import Header from './components/Header.vue'
// 导入后，直接在模板里当 HTML 标签用
</script>

<template>
  <Header />           <!-- 使用组件，像 HTML 标签一样 -->
  <Header></Header>    <!-- 这样写也行，效果一样 -->
</template>
```

### 4. useData() —— VitePress 给你的"工具箱"

这是你在这个项目里最常用的函数，它返回当前页面的所有数据：

```ts
import { useData } from 'vitepress'

const {
  site,         // 站点信息（title, description 等），来自 config.mts
  page,         // 当前页面信息（headers 标题列表等）
  frontmatter,  // 当前 .md 文件顶部的 YAML 数据
  isDark,       // 是否暗色模式（true/false），可读可写
} = useData()

// 这些返回值都是 Ref，在 JS 里用 .value 访问：
// frontmatter.value.title
// isDark.value = true
// 但在 <template> 里直接用，Vue 自动解包：
// {{ frontmatter.title }}  ← 不用写 .value
```

---

## 前置知识：TypeScript 在本项目中的用法

本项目用 TS 很轻量，你只需要知道这几点：

```ts
// 1. lang="ts" —— 在 <script setup lang="ts"> 中，告诉编辑器用 TS 检查
//    但你完全可以不写任何类型注解，当普通 JS 写

// 2. 类型注解（可选）—— 给变量标记"这是什么类型的数据"
const name: string = 'rat'     // 字符串
const age: number = 18         // 数字
const isDark: boolean = true   // 布尔值

// 3. 接口（interface）—— 描述一个对象的结构
interface Post {
  title: string
  date: string
  tags: string[]    // string[] 表示"字符串数组"
}

// 4. import type —— 只导入类型，不导入实际代码
import type { Theme } from 'vitepress'
// 你在 theme/index.ts 里已经见过了，这只是告诉 TS "我要用这个类型做检查"
// 构建时会被完全删除，不影响运行

// 暂时记住这些就够了，遇到不懂的 TS 语法随时问我
```

---

## 一、项目结构规划

先把文件结构整理好，后续开发会清晰很多。建议调整为：

```
rat/
├── .vitepress/
│   ├── config.mts          # VitePress 站点配置
│   └── theme/
│       ├── index.ts         # 主题入口（已有）
│       ├── Layout.vue       # 全局布局（已有，需重构）
│       ├── style.css        # 全局样式（已有）
│       ├── components/      # 🆕 组件目录
│       │   ├── Header.vue       # 导航栏
│       │   ├── Hero.vue         # 首页 Hero 区域
│       │   ├── ArticleList.vue  # 文章列表
│       │   ├── Toc.vue          # 文章目录
│       │   └── ToggleTheme.vue  # 主题切换按钮
│       └── composables/     # 🆕 数据加载目录
│           └── posts.data.ts    # 文章列表数据加载（注意 .data.ts 后缀）
├── posts/                   # 🆕 文章目录
│   ├── hello-world.md           # 文章示例
│   └── ...
├── index.md                 # 首页（已有）
├── unocss.config.ts         # UnoCSS 配置（已有）
└── package.json
```

### 你需要了解的知识点
- **VitePress 自定义主题的文件约定**：`.vitepress/theme/index.ts` 是主题入口，导出 `Layout` 组件就是你的全局布局。VitePress 不会自动帮你加任何 UI，所有页面结构由你的 Layout.vue 决定
- **组件拆分原则**：每个组件只做一件事。Header 管导航，Hero 管展示，ArticleList 管列表渲染。不要把所有东西塞进 Layout.vue

### 注意事项
- `components/` 和 `composables/` 放在 `.vitepress/theme/` 下面，因为这些是主题的一部分
- `posts/` 放在项目根目录，和 `index.md` 同级，因为它们是内容（VitePress 会把根目录下的 `.md` 文件当作页面）
- 不要把组件放到根目录，根目录只放 `.md` 内容文件

---

## 二、config.mts —— 站点配置（先改这个）

在开始写组件之前，先把配置补全。你现有的 config.mts 需要加两个关键配置：

```ts
import { defineConfig } from 'vitepress'
import UnoCss from 'unocss/vite'

export default defineConfig({
  title: 'Rat oOo',
  description: '前端已死...',

  // ✅ 暗色模式：VitePress 内置支持！设为 true（其实默认就是 true）
  // 它会自动：
  //   1. 在 <html> 上切换 .dark 类
  //   2. 注入防闪屏的内联脚本（自动读 localStorage）
  //   3. 持久化用户偏好到 localStorage（key: 'vitepress-theme-appearance'）
  appearance: true,

  // ✅ 开启 markdown headers 提取，TOC 需要用到
  markdown: {
    headers: {
      level: [2, 3],  // 提取 h2 和 h3 作为目录
    },
  },

  vite: {
    plugins: [UnoCss()],
  },
})
```

### 你需要了解的知识点

**`appearance` 配置的作用（重要！）**

这是 VitePress 内置的暗色模式机制，**你不需要自己写防闪屏脚本，不需要自己操作 localStorage，不需要自己给 `<html>` 加/移除 `dark` 类**。VitePress 全帮你做好了。

- `appearance: true`（默认值）→ 跟随系统偏好 + 允许手动切换
- `appearance: 'dark'` → 默认暗色
- `appearance: false` → 禁用暗色模式

在组件里通过 `useData()` 获取 `isDark` 就能读写暗色状态：
```ts
const { isDark } = useData()
isDark.value = !isDark.value  // 切换主题，就这么简单
```

---

## 三、Layout.vue —— 全局布局重构

这是你整个博客的"骨架"，所有页面都会套在这个组件里。

### 你需要了解的知识点

**1. VitePress 的 `frontmatter` 机制**

每个 `.md` 文件顶部可以写 YAML 格式的元数据（叫 frontmatter）：

```yaml
---
title: 我的第一篇文章
date: 2026-03-21
tags: [前端, VitePress]
---
```

在 Vue 组件里通过 `useData()` 获取：
```ts
import { useData } from 'vitepress'
const { frontmatter } = useData()
// 在 JS 里：frontmatter.value.title → "我的第一篇文章"
// 在模板里：{{ frontmatter.title }}（自动解包，不用 .value）
```

**2. 条件渲染不同页面**

你的 Layout.vue 需要根据 frontmatter 判断当前是首页还是文章页，渲染不同内容：

```
Layout.vue
├── Header（所有页面都有）
├── 如果是首页(frontmatter.home === true) → 显示 Hero + ArticleList
├── 如果是文章页(其他情况) → 显示文章标题 + <Content /> + Toc
└── Footer（可选，后续加）
```

**3. VitePress 的 `<Content />` 组件**

这是 VitePress 提供的特殊组件，它会把当前 `.md` 文件渲染的 HTML 插入到这个位置。文章页必须用它来展示文章正文。**不需要 import，VitePress 自动注册为全局组件。**

### 编码建议

```vue
<!-- Layout.vue 的大致结构思路 -->
<script setup lang="ts">
import { useData } from 'vitepress'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import ArticleList from './components/ArticleList.vue'
import Toc from './components/Toc.vue'

const { frontmatter } = useData()
</script>

<template>
  <div>
    <Header />
    <!-- 首页 -->
    <main v-if="frontmatter.home" class="pt-16">
      <Hero />
      <ArticleList />
    </main>
    <!-- 文章页 -->
    <main v-else class="pt-16 flex max-w-5xl mx-auto px-6">
      <article class="prose dark:prose-invert flex-1 min-w-0">
        <h1>{{ frontmatter.title }}</h1>
        <Content />
      </article>
      <Toc />
    </main>
  </div>
</template>
```

### 注意事项
- `v-if` 和 `v-else` 必须紧邻使用，中间不能插其他元素
- Layout.vue 不要写具体的业务逻辑，只做"调度"——决定显示哪些组件
- 你现在的 `index.md` 里有 `home: true` 的 frontmatter，所以首页会命中 `v-if="frontmatter.home"`

---

## 四、Header.vue —— 顶部导航栏

### 你需要了解的知识点

**1. VitePress 路由**

VitePress 用的是文件系统路由：
- `index.md` → `/`
- `posts/hello.md` → `/posts/hello`

在组件里用 `<a href="/">` 就能跳转。VitePress 会自动拦截站内 `<a>` 标签并做 SPA 跳转（不会整页刷新）。

**2. UnoCSS 原子化写法**

你已经配了 `presetAttributify()`，可以直接在标签上写属性：
```html
<!-- 两种写法等价 -->
<nav class="flex items-center justify-between px-6 h-16">
<nav flex items-center justify-between px-6 h-16>
```

推荐刚开始用 `class="..."` 写法，更容易理解和调试。等熟悉了再用属性化写法。

**3. 固定导航栏**

```html
<header class="fixed top-0 left-0 w-full z-50">
```
用了 `fixed` 后，导航栏会脱离文档流，下方的内容会顶上去被导航栏盖住。所以 Layout.vue 的 `<main>` 需要加 `pt-16`（假设导航栏高度 64px = 16 × 4px）来把内容推下来。

### 编码建议
- 导航项建议用一个数组来管理，然后用 `v-for` 渲染，方便后续增减：
  ```ts
  // 这是一个"对象数组"，每个对象有 text 和 link 两个属性
  const navLinks = [
    { text: '首页', link: '/' },
    { text: '归档', link: '/archives' },
    { text: '关于', link: '/about' },
  ]
  ```
  ```html
  <!-- 模板里用 v-for 遍历渲染 -->
  <a v-for="item in navLinks" :key="item.link" :href="item.link">
    {{ item.text }}
  </a>
  ```
- 暗色切换按钮 `<ToggleTheme />` 放在导航栏右侧
- Logo 用你已有的 `rat.svg`（在 `public/` 里），通过 `<img src="/rat.svg">` 引用

### 注意事项
- `public/` 里的文件通过绝对路径 `/文件名` 访问，不需要写 `/public/`
- 导航栏的 `z-50` 很重要，保证它在最上层不被其他内容盖住
- 移动端适配先不急，第一阶段桌面端能用就行，后续迭代加响应式

---

## 五、ToggleTheme.vue —— 暗色模式切换（超简单）

### 你需要了解的知识点

**VitePress 已经帮你搞定了 90% 的工作！** 你只需要写一个切换按钮。

核心就一行：
```ts
import { useData } from 'vitepress'
const { isDark } = useData()
// isDark 是一个 ref，值为 true（暗色）或 false（亮色）
// 切换只需要：isDark.value = !isDark.value
```

VitePress 在背后自动做了：
- 在 `<html>` 上自动切换 `.dark` 类
- 自动注入防闪屏脚本（在 HTML 解析阶段就读取 localStorage）
- 自动持久化到 `localStorage`（key 是 `vitepress-theme-appearance`）
- 自动尊重系统偏好 `prefers-color-scheme`

### 编码建议

```vue
<script setup lang="ts">
import { useData } from 'vitepress'
const { isDark } = useData()
</script>

<template>
  <!-- 在模板里可以直接写 isDark，不用 .value -->
  <!-- @click 绑定点击事件，点击时取反 -->
  <button @click="isDark = !isDark">
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>
```

如果想用 UnoCSS Icons 代替 emoji（更美观）：
- 安装图标包：`pnpm add -D @iconify-json/carbon`
- 用法：`<i class="i-carbon-sun" />` / `<i class="i-carbon-moon" />`
- 其他图标集也行，去 https://icones.js.org 挑选

### UnoCSS 的 `dark:` 前缀

写样式时可以用 `dark:` 给暗色模式定义不同样式：
```html
<div class="bg-white dark:bg-black text-black dark:text-white">
```
原理：UnoCSS 会生成类似 `.dark .dark\:bg-black { background: black }` 的 CSS。当 `<html>` 上有 `dark` 类时，这些样式就生效了。

---

## 六、Hero.vue —— 首页 Hero 区域

### 你需要了解的知识点

这是纯展示组件，没有复杂逻辑。重点在排版。

**极简黑白风格建议**：
- 大标题用 `text-4xl` 或 `text-5xl`，加 `font-bold`
- 副标题/描述用 `text-lg` 或 `text-xl`，颜色稍淡 `text-gray-600 dark:text-gray-400`
- 留白很重要：`py-20` 或更大的内边距，让内容呼吸
- 不需要背景图或渐变，黑白风格靠字体层次和留白撑起来

### 编码建议
- 可以从 `useData()` 读取 `site.title` 和 `site.description`，也可以直接硬编码
  ```ts
  const { site } = useData()
  // 模板里用 {{ site.title }} 就能显示 config.mts 里配的标题
  ```
- 建议居中布局：`max-w-4xl mx-auto text-center`
- Hero 区域和下方文章列表之间加一条细分割线或留足间距

---

## 七、posts.data.ts + ArticleList.vue —— 文章列表（本阶段重点难点）

### 你需要了解的知识点

**1. VitePress 的 `createContentLoader`（核心 API）**

这是 VitePress 提供的用来批量加载 `.md` 文件元数据的工具。它只在构建时运行（Build Time），把结果序列化成 JSON 供前端使用。

创建文件 `.vitepress/theme/composables/posts.data.ts`（注意文件名**必须**以 `.data.ts` 结尾）：

```ts
// posts.data.ts
import { createContentLoader } from 'vitepress'

// export default 表示"这个文件默认导出的东西"
// createContentLoader('posts/*.md') 表示"扫描 posts 目录下所有 .md 文件"
export default createContentLoader('posts/*.md', {
  // transform 是一个回调函数，用来加工原始数据
  // rawData 是一个数组，每个元素代表一篇文章，包含 url 和 frontmatter
  transform(rawData) {
    // .sort() 排序：按日期倒序（最新的排前面）
    // +new Date() 把日期字符串转成时间戳数字，方便比较大小
    return rawData.sort((a, b) => {
      return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
    })
  }
})
```

然后在组件里使用（**注意导入路径用 `.js` 后缀**，即使源文件是 `.ts`）：
```ts
// { data as posts } 的意思是：导入 data 这个变量，但在本文件里叫它 posts
import { data as posts } from '../composables/posts.data.js'
// 现在 posts 是一个数组，可以用 v-for 遍历
```

返回的数据结构是一个数组，每个元素长这样：
```ts
{
  url: '/posts/hello-world',           // 文章的 URL 路径
  frontmatter: {                       // 文章 .md 文件顶部的 YAML 数据
    title: '你好世界',
    date: '2026-03-21',
    tags: ['前端', 'VitePress'],
    description: '我的第一篇文章'
  }
}
```

**为什么用 `.data.ts` 而不是普通文件？**
- 普通 `.ts` 文件在浏览器里运行，浏览器无法扫描你电脑上的文件
- `.data.ts` 在构建时由 Node.js 运行，可以读取文件系统，然后把结果打包成 JSON 给浏览器用
- 这是 VitePress 的特殊约定，文档叫 [Build-Time Data Loading](https://vitepress.dev/guide/data-loading)

**参考实现**：[Vue 官方博客的 posts.data.ts](https://github.com/vuejs/blog/blob/main/.vitepress/theme/posts.data.ts)

**2. 文章的 frontmatter 规范**

为每篇文章定义统一的 frontmatter 格式：

```yaml
---
title: 文章标题
date: 2026-03-21
tags: [标签1, 标签2]
description: 文章简短描述
---

正文内容从这里开始...
```

### 编码建议
- ArticleList.vue 用 `v-for` 遍历文章列表：
  ```html
  <div v-for="post in posts" :key="post.url">
    <a :href="post.url">{{ post.frontmatter.title }}</a>
    <span>{{ post.frontmatter.date }}</span>
  </div>
  ```
- 每篇文章展示：标题（可点击跳转）、日期、标签（可选）、描述
- 标题用 `<a :href="post.url">` 跳转到文章页（注意加冒号 `:` 绑定变量）

### 注意事项
- `posts.data.ts` 文件命名很重要，必须以 `.data.ts` / `.data.js` 结尾
- `createContentLoader('posts/*.md')` 的路径是**相对于项目根目录**（即 VitePress 的 srcDir）
- **先创建 `posts/` 目录并放 2-3 篇测试文章**，否则列表是空的，不好调试
- **`createContentLoader` 不支持热更新新增文件**——新增 `.md` 文件后需要重启 `pnpm dev`
- 导入路径写 `.js` 不是 `.ts`：`import { data } from './posts.data.js'`

---

## 八、文章页 + TOC 目录

### 你需要了解的知识点

**1. `<Content />` 的排版**

`<Content />` 渲染出来的是纯 HTML（`<h1>`, `<p>`, `<pre>`, `<ul>` 等），没有任何样式。你需要给这些元素加上排版样式。

**推荐方案**：用 UnoCSS 的 `presetTypography()`。你已经装了它。在文章容器上加 `class="prose"`，会自动给内部所有 HTML 元素加上美观的排版样式（标题大小、段落间距、列表样式等）：

```html
<article class="prose dark:prose-invert max-w-none">
  <Content />
</article>
```
- `prose` → 启用排版样式
- `dark:prose-invert` → 暗色模式下自动调整为浅色文字
- `max-w-none` → 移除 prose 自带的最大宽度限制（你想自己用外层容器控制宽度）

**2. TOC（Table of Contents / 文章目录）**

在 config.mts 里配了 `markdown.headers` 后，VitePress 会提取文章的标题结构。通过 `useData()` 获取：

```ts
import { useData } from 'vitepress'
const { page } = useData()
// page.value.headers 是一个数组，每个元素代表一个标题：
// [
//   { level: 2, title: '安装', slug: '安装', link: '#安装' },
//   { level: 3, title: '用 pnpm', slug: '用-pnpm', link: '#用-pnpm' },
// ]
```

然后用 `v-for` 渲染一个标题列表，每个标题是一个锚点链接：
```html
<nav>
  <a v-for="h in page.headers" :key="h.slug" :href="h.link">
    {{ h.title }}
  </a>
</nav>
```

**⚠️ 重要**：必须在 config.mts 中配置 `markdown.headers`（第二步已经加了），否则自定义主题下 `page.value.headers` 可能为空！

**3. 文章页布局**

文章 + TOC 的经典布局是左宽右窄：

```
|  文章正文(宽)  |  TOC(窄/固定)  |
```

用 Flex 实现：
```html
<div class="flex max-w-5xl mx-auto">
  <article class="flex-1 min-w-0">文章内容</article>
  <aside class="w-60 shrink-0 sticky top-20">目录</aside>
</div>
```
- `flex-1` → 占据剩余空间（文章区域自适应宽度）
- `min-w-0` → **很重要！** 防止代码块等长内容把布局撑破
- `shrink-0` → 目录不被压缩
- `sticky top-20` → 滚动时目录固定在距顶部 80px 的位置

### 编码建议
- 根据 `header.level` 给不同级别标题加缩进，实现层次感：
  ```html
  <a
    v-for="h in page.headers"
    :key="h.slug"
    :href="h.link"
    :style="{ paddingLeft: (h.level - 2) * 16 + 'px' }"
  >
    {{ h.title }}
  </a>
  ```
  h2 缩进 0px，h3 缩进 16px，以此类推
- TOC 高亮当前所在标题是进阶功能，第一阶段可以先不做，后续迭代

### 注意事项
- `page.headers` 包含你在 config 里配置的层级（h2、h3）
- 如果文章没有这些级别的标题，headers 会是空数组，记得处理空状态（可以不显示 TOC）
- `<Content />` 渲染的标题自带 `id` 属性（值就是 slug），锚点跳转直接用 `#slug` 就能工作

---

## 九、全局样式基础

### 你需要了解的知识点

**极简黑白风格的 CSS 变量方案**

在 `style.css` 里定义全局 CSS 变量，暗色模式下覆盖（VitePress 自动在 `<html>` 上切换 `.dark` 类）：

```css
/* CSS 变量：用 --名字 定义，用 var(--名字) 使用 */
/* :root 表示 <html> 元素，在这里定义的变量全局可用 */
:root {
  --c-bg: #ffffff;
  --c-text: #1a1a1a;
  --c-text-light: #666666;
  --c-border: #e5e5e5;
}

/* 当 <html> 上有 dark 类时，覆盖上面的变量值 */
.dark {
  --c-bg: #1a1a1a;
  --c-text: #e5e5e5;
  --c-text-light: #999999;
  --c-border: #333333;
}

html {
  background-color: var(--c-bg);
  color: var(--c-text);
  /* transition 让颜色切换有过渡动画，不会突然跳变 */
  transition: background-color 0.3s, color 0.3s;
}
```

你也可以混用 CSS 变量和 UnoCSS 的 `dark:` 前缀——两者互不冲突，都是基于 `<html>` 上的 `.dark` 类。CSS 变量适合全局性的基础色，`dark:` 前缀适合局部组件的个别样式。

### 注意事项
- `transition` 只给 `html` 和少量关键元素加就行，不要给所有元素加，避免性能问题
- 极简风格核心：少用颜色（只用黑、白、灰），多用留白和字体层级，线条要细（`border` 用 `1px`）
- 字体建议用系统字体栈：`font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`，加载快且各平台表现好

---

## 十、第一阶段执行顺序（建议）

按依赖关系排列，每一步都可以在浏览器里看到效果：

| 步骤 | 任务 | 完成后你能看到 |
|------|------|----------------|
| 1 | config.mts 补充 `appearance` + `markdown.headers` 配置 | 配置就绪 |
| 2 | style.css 全局样式（CSS 变量 + 基础样式） | 页面有了基础配色 |
| 3 | Layout.vue 重构 + Header.vue 导航栏 | 所有页面顶部有导航栏 |
| 4 | ToggleTheme.vue（用 VitePress 内置的 `isDark`） | 点击可切换亮暗 |
| 5 | Hero.vue | 首页有大标题展示区 |
| 6 | 创建 `posts/` 目录 + 2-3 篇测试文章（带 frontmatter） | 有内容可供后续加载 |
| 7 | posts.data.ts + ArticleList.vue | 首页显示文章列表 |
| 8 | 文章页排版（prose）+ Toc.vue | 文章页可阅读，有侧边目录 |

每完成一步就 `pnpm dev` 看效果，确认没问题再下一步。

---

## 十一、调试技巧

- **Vue DevTools**：浏览器装 [Vue DevTools](https://devtools.vuejs.org/) 扩展，可以看组件树、变量状态、事件
- **UnoCSS Inspector**：`pnpm dev` 后访问 `http://localhost:5173/__unocss`，可以看哪些原子类被生成了，方便排查样式不生效的问题
- **页面白屏怎么办**：打开浏览器控制台（F12 → Console），看报错信息。90% 是 import 路径错误或组件名拼写问题
- **`.md` 文件改了没效果**：`createContentLoader` 相关的数据需要重启 `pnpm dev`（Ctrl+C 停止，再 `pnpm dev`）
- **暗色模式调试**：在浏览器控制台执行 `localStorage.getItem('vitepress-theme-appearance')` 查看当前存储的偏好

---

## 十二、时间预估

基于前端初学者（CSS 中等、Vue 刚学、TS 不熟）的水平估算：

| 步骤 | 任务 | 建议时间 |
|------|------|----------|
| 1 | config.mts 配置 | 10 分钟 |
| 2 | style.css 全局样式 | 30 分钟 |
| 3 | Layout.vue + Header.vue | 2-3 小时 |
| 4 | ToggleTheme.vue | 30 分钟 |
| 5 | Hero.vue | 1 小时 |
| 6 | 写 2-3 篇测试文章 | 20 分钟 |
| 7 | posts.data.ts + ArticleList.vue | 2-3 小时 |
| 8 | 文章页排版 + Toc.vue | 2-3 小时 |

**纯编码时间约 9-12 小时**。算上查文档、调试、理解概念，实际 **1-2 周**（按每天 2-3 小时）比较现实。

建议节奏：不要赶，每完成一步就 `pnpm dev` 看效果，有成就感再继续。卡住了随时问。
