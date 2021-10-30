# 创建项目
该项目使用vue-cli创建，创建过程如下

## 安装vue-cli
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

## 使用命令创建项目
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

# 开发
## 安装依赖
```
yarn install
```

## 本地运行（热重载）
```
yarn serve
```

## 打包（编译生产环境的包）
```
yarn build
```

## 运行单元测试
```
yarn test:unit
```

## 运行 e2e 测试
```
yarn test:e2e
```

## Lints 和 修复文件
```
yarn lint
```

## 自定义配置
[Configuration Reference](https://cli.vuejs.org/config/).

# 工程化配置

## Vuex

[typescript 配置](https://next.vuex.vuejs.org/zh/guide/typescript-support.html#typescript-%E6%94%AF%E6%8C%81)
