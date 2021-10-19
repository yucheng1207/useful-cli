参考：[从 0 开始手把手带你搭建一套规范的 Vue3.x 项目工程环境](https://juejin.cn/post/6951649464637636622)

# 创建项目

使用 **Vite** 创建项目：[https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project)

```
npm init vite@latest vite-vue3-app -- --template vue-ts
```

# 框架搭建

## 配置 Vite

Vite 配置文件 `vite.config.ts` 位于根目录下，项目启动时会自动读取。

本项目先做一些简单配置，例如：设置 `@` 指向 `src` 目录、 服务启动端口、打包路径、代理等。

关于 Vite 更多配置项及用法，请查看 [Vite 官网](https://cn.vitejs.dev/config/) 。

## 配置 scss

[Vite 默认支持](https://cn.vitejs.dev/guide/features.html#css-pre-processors)，只需安装依赖即可

```
# .scss and .sass
npm install -D sass
```

## 配置 Vue Router

1. [安装 vue-router](https://next.router.vuejs.org/zh/installation.html#%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD-cdn)

```
npm i vue-router@4
```

**vue-router**官网：[https://next.router.vuejs.org/zh/installation.html#npm](https://next.router.vuejs.org/zh/installation.html#npm)

1. 编写 router.ts 文件

```
// src/router/index.ts
import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw
} from 'vue-router'
import Home from '@/views/home.vue'
import Test from '@/views/Test.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/test',
        name: 'Test',
        component: Test
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
```

1. 在 main.ts 文件中挂载路由配置

```
import { createApp } from 'vue'
import App from './App.vue'

import router from './router/index'

createApp(App).use(router).mount('#app')
```

1. 在 App.vue 中使用

```
<template>
  <router-view />
</template>
...
```

## 集成状态管理工具 Vuex

1. [安装 vuex](https://next.vuex.vuejs.org/zh/installation.html)

```
npm i vuex@next
```

**Vuex** 官网: [https://next.vuex.vuejs.org/zh/installation.html](https://next.vuex.vuejs.org/zh/installation.html)

1. 编写 store 文件

```
// src/store/index.ts
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

const defaultState = {
    count: 0
}

interface RootStateTypes {
    count: number
}

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')
export function useStore<T = RootStateTypes>() {
    return baseUseStore<T>(key)
}

// Create a new store instance.
export default createStore<RootStateTypes>({
  state() {
    return defaultState
  },
  mutations: {
    increment(state: typeof defaultState) {
      state.count++
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  },
  getters: {
    double(state: typeof defaultState) {
      return 2 * state.count
    }
  }
})
```

1. 在 main.ts 文件中挂载 Vuex 配置

```
import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router/index'
import store, { key } from '@/store/index'

createApp(App).use(router).use(store, key).mount('#app')
```

1. 使用

Vuex 组合式 api：[https://next.vuex.vuejs.org/zh/guide/composition-api.html#组合式 api](https://next.vuex.vuejs.org/zh/guide/composition-api.html#%E7%BB%84%E5%90%88%E5%BC%8Fapi)
Vue 响应性 api：[https://v3.cn.vuejs.org/api/reactivity-api.html](https://v3.cn.vuejs.org/api/reactivity-api.html)

在组件中通过调用 useStore 函数，来在 setup 钩子函数中访问 store：

```
<template>
  <div class="vuex-container page-container">
    <div class="page-title">Vuex Test Page</div>
    <p>store count is: {{ count }}</p>
    <p>store doubleCount is: {{ doubleCount }}</p>
    <button @click="increment">increment</button>
    <button @click="asyncIncrement">asyncIncrement</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Vuex',

  setup() {
    const store = useStore()
    const reactiveData = reactive({
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),
      // 在 computed 函数中访问 getter
      doubleCount: computed(() => store.getters.double),
    })

     // 使用 mutation
    const increment = () => {
      store.commit('increment')
    }

    // 使用 action
    const asyncIncrement = () => {
      store.dispatch('increment')
    }

    return {
      ...toRefs(reactiveData),
      increment,
      asyncIncrement
    }
  }
})
</script>

<style scoped lang="scss">
  button {
    margin: 0 8px;
  }
</style>import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router/index'
import store, { key } from '@/store/index'

createApp(App).use(router).use(store, key).mount('#app')
```

## 集成 UI 框架 Element Plus

1. 安装 element plus

Element Plus 官网：[https://element-plus.org/en-US/guide/installation.html#using-package-manager](https://element-plus.org/en-US/guide/installation.html#using-package-manager)

```
npm i element-plus
```

1. 挂载 Element Plus

方法一：在 main.ts 文件中

```
import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

createApp(App).use(ElementPlus).mount('#app')
```

方法二：通过 [vite-plugin-element-plus](https://www.npmjs.com/package/vite-plugin-element-plus) 加载

1. 安装依赖

```
npm i vite-plugin-element-plus -D
```

1. 配置 vite.config.ts

```
// vite.config.ts
import importElementPlus from 'vite-plugin-element-plus'
export default defineConfig({
	...
  plugins: [..., importElementPlus({})],
	...
})
```

1. 按需引入样式

```
// src/utils/styleImport
import { App } from 'vue'
import { ElIcon, ElLoading, ElCard, ElButton } from 'element-plus'

/**
 * 按需导入 Element Plus 组件
 * Vite 插件 https://github.com/element-plus/vite-plugin-element-plus
 * @param app {App}
 */
export default function styleImport(app: App) {
  ;[ElButton, ElCard, ElLoading, ElIcon].forEach((v) => {
    app.use(v)
  })
  return app
}

// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import styleImport from '@/utils/style-import'

import router from '@/router/index'
import store, { key } from '@/store/index'

const app = createApp(App)
styleImport(app).use(router).use(store, key).mount('#app')
```

# 代码规范

**使用** **EditorConfig + Prettier + ESLint 组合来实现代码规范化,** 为了防止报错 请将 Node 升级到最新稳定版 `nvm install stable`

## EditorConfig

EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格。

官网：[editorconfig.org](https://link.juejin.cn/?target=http%3A%2F%2Feditorconfig.org)
VSCode 使用 EditorConfig 需要去插件市场下载插件 EditorConfig for VS Code 。

直接在项目根目录添加 `.editorconfig` 即可

```
# Editor configuration, see http://editorconfig.org

# 表示是最顶层的 EditorConfig 配置文件
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

## Prettier

Prettier 是一款强大的代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown 等语言，基本上前端能用到的文件格式它都可以搞定，是当下最流行的代码格式化工具。

官网：[prettier.io/](http://prettier.io/)
VSCode 编辑器使用 Prettier 配置需要下载插件 Prettier - Code formatter 。

1. 安装依赖

```
npm i prettier -D
```

1. 在项目根目录下创建 `.prettierrc` 文件，具体配置可查看 [Prettier-Options](https://prettier.io/docs/en/options.html) 。

```
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "semi": false
}
```

1. Prettier 安装且配置好之后，就能使用命令来格式化代码

```
# 格式化所有文件（. 表示所有文件）
npx prettier --write .
```

## ESLint

ESLint 是一款用于查找并报告代码中问题的工具，并且支持部分问题自动修复。其核心是通过对代码解析得到的 AST（Abstract Syntax Tree 抽象语法树）进行模式匹配，来分析代码达到检查代码质量和风格问题的能力。

VSCode 使用 ESLint 配置文件需要去插件市场下载插件 ESLint 。

1. 安装依赖

```
npm i eslint -D
```

1. 配置 ESLint

执行 `npx eslint --init` 来创建配置文件，为了防止报错 请将 Node 升级到最新稳定版 `nvm install stable`

最终生成的 `.eslintrc.js` 文件，根据项目实际情况，如果我们有额外的 ESLint 规则，也在此文件中追加

```
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
  },
};
```

1. 配置 vscode 的 settings.json 文件

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 解决 Prettier 和 ESLint 的冲突

通常大家会在项目中根据实际情况添加一些额外的 ESLint 和 Prettier 配置规则，难免会存在规则冲突情况。

本项目中的 ESLint 配置中使用了 Airbnb JavaScript 风格指南校验，其规则之一是*代码结束后面要加分号*，而我们在 Prettier 配置文件中加了*代码结束后面不加分号*的配置项，这样就有冲突了，会出现用 Prettier 格式化后的代码，ESLint 检测到格式有问题的，从而抛出错误提示。

解决两者冲突问题，需要用到 **eslint-plugin-prettier** 和 **eslint-config-prettier**。

- `eslint-plugin-prettier` 将 Prettier 的规则设置到 ESLint 的规则中。
- `eslint-config-prettier` 关闭 ESLint 中与 Prettier 中会发生冲突的规则。

最后形成优先级：`Prettier 配置规则` > `ESLint 配置规则`。

1. 安装插件

```
npm i eslint-plugin-prettier eslint-config-prettier -D
```

1. 在 `.eslintrc.js` 添加 prettier 插件

```
module.exports = {
  ...
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:prettier/recommended' // 添加 prettier 插件
  ],
  ...
}
```

这样，我们在执行 eslint --fix 命令时，ESLint 就会按照 Prettier 的配置规则来格式化代码，轻松解决二者冲突问题。

## 集成 husky 和 lint-staged (未验证)

[husky](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fhusky) — Git Hook 工具，可以设置在 git 各个阶段（pre-commit、commit-msg、pre-push 等）触发我们的命令。
[lint-staged](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fokonet%2Flint-staged) — 在 git 暂存的文件上运行 linters。

1. 安装依赖

```
npm i husky lint-staged -D
```

1. 修改 package.json

```
{
  ...
  "scripts": {
    ...
    "serve": "vite preview"
  },
  "lint-staged": {
    "*.{vue,js,ts}": "eslint --fix"
  },
  "husky": {
		"hooks": {
			"pre-commit": "npx lint-staged && yarn test"
		}
	},
	...
}
```

# 参考

[从 0 开始手把手带你搭建一套规范的 Vue3.x 项目工程环境](https://juejin.cn/post/6951649464637636622)
