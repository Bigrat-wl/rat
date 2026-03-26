## config.mts 中的 `appearance` 是干啥的？

```ts
import { defineConfig } from 'unocss';

export default defineConfig({
  appearance: true,
});
```

不是说 Unocss 默认开启这个选项吗？这里为什么还要写出来？
不设置会怎样？
这个选项到底是 vitepress 的还是 UnoCss 的？

---

## “解包” 是什么意思？

```ts
import { useData } from 'vitepress';
const { frontmatter } = useData();
{
  {
    frontmatter.title;
  }
}
```

```js
import { useData } from 'vitepress';
const { frontmatter } = useData();

console.log(frontmatter.value.title);
```

---

## 什么是 SPA 跳转？

## useData() 的返回值是什么？

## 在写全局样式 style.css 的时候，为什么要这样命名？

```css
:root {
  --c-bg: #ffffff;
  --c-text: #1a1a1a;
  --c-text-light: #666666;
  --c-border: #e5e5e5;
}
```

## setup 是 Vue 3 的写法，意思是"这里面的变量/函数直接能在模板里用"

不太明白“直接能在模板里使用是谁什么意思”，这里的模板指的是什么?

- 模板指的是 HTML

## 我在这边写页面的话有 css重置吗？

## 极简黑白主题的配色设计

## 现在的图标我不是很满意

- 如何更精细的调整图标的定位？
- 如何更好的引用 public 里的 svg


## createContentLoader()

### 是什么？
这是 vitepress 提供的一个数据加载功能，方便我们创建 “归档”、“索引” 页面

### 有什么用？
- 自动扫描 posts/ 文件夹下的所有文章，并生成结构化数据
- 可以利用这些数据进行排序、过滤、分组等操作，生成不同的页面

### 最小用法

```vue
<script setup>
import { data as posts } from './posts.data.js'
</script>

<template>
  <h1>All Blog Posts</h1>
  <ul>
    <li v-for="post of posts">
      <a :href="post.url">{{ post.frontmatter.title }}</a>
      <span>by {{ post.frontmatter.author }}</span>
    </li>
  </ul>
</template>
```

### 选项

```ts
import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  includeSrc: true, // 包含原始 markdown 源?
  render: true,     // 包含渲染的整页 HTML?
  excerpt: true,    // 包含摘录?
  transform(rawData) {
    // 根据需要对原始数据进行 map、sort 或 filter
    // 最终的结果是将发送给客户端的内容
    return rawData.sort((a, b) => {
      return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
    }).map((page) => {
      page.src     // 原始 markdown 源
      page.html    // 渲染的整页 HTML
      page.excerpt // 渲染的摘录 HTML（第一个 `---` 上面的内容）
      return {/* ... */}
    })
  }
})
```

## 3.25 任务
- 完成主页的文章展示
- 完善blog的导航分类