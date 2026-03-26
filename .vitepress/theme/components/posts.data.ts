import { createContentLoader } from 'vitepress';

// 默认导出一个 content loader
// 它会在构建时扫描项目根目录下的 posts/*.md
export default createContentLoader('posts/*.md', {
  
});
