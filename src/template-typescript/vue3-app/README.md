# 介绍

该项目是使用 `vue-cli` 搭建的 Vue3.0 项目模板，支持以下功能，更多自定义功能待完善...

-   支持 scss
-   集成 Vue Router
-   集成 Vuex
-   集成 UI 框架 Element Plus
-   使用 Prettier + ESLint 来实现代码规范化

# 开始

可以使用[useful-cli](https://github.com/yucheng1207/useful-cli)创建项目模板。

**安装依赖**

```
yarn install
```

**本地运行（热重载）**

```
yarn serve
```

**打包（编译生产环境的包）**

```
yarn build
```

**运行单元测试**

```
yarn test:unit
```

**运行 e2e 测试**

```
yarn test:e2e
```

**Lints 和 修复文件**

```
yarn lint
```

# 项目搭建笔记

## 使用 vue-cli 创建项目

该项目使用 vue-cli 创建，创建过程如下

**安装 vue-cli**

```
// 安装
npm install -g @vue/cli
# OR
yarn global add @vue/cli


// 升级
npm install -g @vue/cli
# OR
yarn global add @vue/cli

// 查看版本
vue --version
```

**使用命令创建项目**

```
vue create app-name
```

选择`Manually select features`

```
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert select
ion)
❯◉ Choose Vue version
 ◉ Babel
 ◉ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◉ Unit Testing
 ◉ E2E Testing
```

```
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, TS, Router, Vuex, CSS Pre-processors,
Linter, Unit, E2E
? Choose a version of Vue.js that you want to start the project with 3.x
? Use class-style component syntax? Yes
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Sass/SCSS (with no
de-sass)
? Pick a linter / formatter config: Prettier
? Pick additional lint features: Lint on save, Lint and fix on commit
? Pick a unit testing solution: Jest
? Pick an E2E testing solution: Cypress
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
```

## 自定义配置

[Configuration Reference](https://cli.vuejs.org/config/).

## Vuex

[typescript 官方配置教程](https://next.vuex.vuejs.org/zh/guide/typescript-support.html#typescript-%E6%94%AF%E6%8C%81)
[赋予 Vuex 4.x 更好的 TypeScript 体验](https://juejin.cn/post/6999886459343732772#heading-8)

## Element-Plus

### 方式一：全部引入

```
import { ElButton } from 'element-plus/lib/components';

// 引入所有样式
import 'element-plus/dist/index.css';

app.use(ElButton)
```

### 方式二：手动引入样式

```
import { ElButton } from 'element-plus/lib/components';

// 手动引入样式
import 'element-plus/theme-chalk/base.css';
import 'element-plus/theme-chalk/el-button.css';

app.use(ElButton)
```

### 方式三：按需引入

[官方教程](https://element-plus.gitee.io/zh-CN/guide/quickstart.html#on-demand-import)

1. 安装`unplugin-vue-components`依赖

```
yarn add -D unplugin-vue-components
```

2. 配置 webpack

```
// vue.config.js

const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
    configureWebpack: {
        plugins: [
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    },
};
```

这里我们使用方式三`按需加载`方式引入 element-plus
