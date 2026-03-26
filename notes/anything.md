# Anything

## `pnpm init` 是什么？

好的，以下是关于 `pnpm init` 的清晰说明，按你要求的三点组织：

### 概括

`pnpm init` 是 pnpm（一个 Node.js 包管理器）提供的命令，用于在当前目录初始化一个 Node.js 项目，核心目的是生成 `package.json` 文件。

### 它做了什么

- 在当前工作目录下创建一个名为 `package.json` 的文件。
- 该文件包含项目的元数据，如：
  - `name`（项目名称，默认为当前文件夹名）
  - `version`（版本号，默认为 "1.0.0"）
  - `description`、`main` 入口文件、`scripts` 脚本、`author`、`license` 等字段
- 默认以交互模式运行：会逐项提示你输入或确认每个字段的值（可直接回车接受默认）。
- 如果加上 `-y` 或 `--yes` 参数（即 `pnpm init -y`），则跳过所有提问，直接用默认值生成文件。

### 注意事项

- 会覆盖已有的 `package.json`：如果当前目录已存在该文件，运行 `pnpm init` 会提示是否覆盖（取决于终端环境，某些情况下可能直接覆盖，请谨慎）。
- 默认是交互式的：不像 `npm init -y` 那样“静默”，若想一键生成，必须显式加 `-y`。
- 不依赖全局配置：生成的内容基于当前目录名和 pnpm 内置默认值，与你的 npm/pnpm 用户配置无关。
- 不是项目启动命令：它只是项目“脚手架”的第一步，后续仍需用 `pnpm add` 安装依赖、写代码、配置脚本等。
- 需要先安装 pnpm：如果你没装 pnpm（可通过 `pnpm -v` 检查），此命令无法运行。可使用 `npm install -g pnpm` 安装。

## 管整个网站骨架的地方是 `.vitepress/theme/Layout.vue`

你只需要在这个文件里写好全局的导航栏（包含明暗切换和 GitHub 链接），并在主干位置放上 `<Content />` 组件，VitePress 就会自动把你写的每一个 Markdown 文件“塞”进这个骨架里。


## 问题清单
- [ ] 本地开发热更新闪屏

- [ ] 引用的 svg 的大小一般如何去设置

- [ ] 图标和文本的对齐

- [ ] 矢量图 icon 点击穿透

- [ ] public文件夹的用法

- [ ] 包管理器如何选择

- [ ] normalize.css 有哪几种引用方法

- [ ] 模块系统： CommonJS vs ES Modules
- [ ] Node 对 .js 的判定规则