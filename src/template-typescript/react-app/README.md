# 创建项目

## useful-cli

可以使用[useful-cli](https://github.com/yucheng1207/useful-cli)创建该 react-template 项目。

## node 版本

v14.18.1

# 开发

## 开发调试

执行`yarn dev`命令可本地运行该项目，打开[http://localhost:3000](http://localhost:3000)可在线调试。

```bash
yarn dev
```

## 编译

执行`yarn build`可以编译项目，输出路径为`build`文件夹

```bash
yarn build
```

# 项目搭建

## scss 配置

### 方式一：直接在组件中 import "./app.scss"

```javascript
//app.scss
.main {
	background: white;
    ...
}

// app.tsx
import "./app.scss"
...
    <div className="main">
 		...
   	</div>
...
```

由于 react 中的 css 没有域的概念，会造成全局污染，为了解决这个问题，我们可以为每个 scss 文件创建一个 namespace，如下

```javascript
//app.scss
$namespace: "app";

.#{$namespace} {
    &--main {
        background: white;
    }
}

//app.tsx
import "./app.scss"
const namespace = () => `app`
...
	<div className={`${namespace}--main`}>
    	...
    </div>
...
```

### 方式二：import styles from "./index.moudle.scss"

参考了 react-scripts 中的 webpack.config.js 配置，使能/\.module\.(css|scss)/模块化

```javascript
// webpack.config.js
...
module: {
	rules: [
    ...
    {
			test: /\.scss$/,
			exclude: [
				/node_modules/,
			],
			oneOf: [
				{
					test: /\.module\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								modules: {
									localIdentName: '[path][name]__[local]--[hash:base64:5]',
								},
								sourceMap: DEV,
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: DEV,
							}
						},
					]
				},
				{
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								sourceMap: DEV,
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: DEV,
							}
						},
					],
				}
			],
		},
    ...
   ]
 },
 plugins: [
		...
		new MiniCssExtractPlugin({
			filename: DEV ? '[name].css' : '[name].[contenthash].css',
			chunkFilename: DEV ? '[id].css' : '[id].[hash].css'
		}),
	]
```

使用\*.module.scss 的 moudles 特性可以解决命名冲突问题， 用法如下

```javascript
//app.scss

.main {
	 background: white;
  ...
}

// app.tsx
import styles from "./app.module.scss"
...
 	<div className={`${styles.main}`}>
 		...
   	</div>
...
```

● 开发过程中尽量使用方式二

注：

1. 很多旧的 css-loader 教程中直接在 option 中设置 localIdentName， 由于版本的更新已经不支持这样直接写入 localIdentName， 最新官方文档的写法是将配置包裹进 modules 的 object 里

```javascript
...
{
  loader: "css-loader",
  options: {
      sourceMap: true,
      modules: {
      	localIdentName: '[path][name]__[local]--[hash:base64:5]',
    },
  }
},
...
```

2. typescript 中直接 import styles from "./index.scss"会报找不到模块的错误，解决方法为使用 require 或 添加以下全局声明，可参考这里

```javascript
declare module '*.scss' {
  const content: any;
  export default content;
}
```

3. 只有在 css-loader 中的 modules 设置为 true|object 时，import styles from "./index.scss 中的 styles 才可以拿到对应的样式，否则 styles 为{}

## 集成 antd UI 库

> [Ant Design 官网](https://ant.design/docs/react/introduce-cn)

### 1. 安装依赖

```bash
yarn add antd
```

### 2. 导入样式

ant design 有以下三种导入方式

#### 方式一：全局导入

导入全局样式，该方法会导入所有的 antd 样式文件（600 多 K）

```javascript
import 'antd/dist/antd.css';
import { Button } from 'antd';

...
    <Button>按钮</Button>
...
```

#### 方式二：手动导入

手动按需导入，该方法只会导入用到的 css， 但是写法麻烦

```javascript
import { Button } from 'antd';
import 'antd/es/button/style/css';

...
    <Button>按钮</Button>
...
```

#### 方式三：按需导入

自动按需导入， 使用 ts-import-plugin(ts-loader)实现按需导入功能（babel-loader 时可使用 babel-plugin-import）

```javascript
yarn -dev add ts-import-plugin

// webpack.config.js
const tsImportPluginFactory = require('ts-import-plugin')
....
  {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              silent: true,
              transpileOnly: DEV ? false : true,
              getCustomTransformers: () => ({
                before: [tsImportPluginFactory({
                  libraryName: 'antd',
                  libraryDirectory: 'lib',
                  style: 'css'
                })]
              }),
            }
          }
        ]
    },
...


// app.tsx
//配置好ts-import-plugin后直接import { Button } from 'antd';会按需加载样式文件
import { Button } from 'antd';
...
    <Button>按钮</Button>
...
```

### 使用

```javascript
// app.tsx
import styles from "./app.module.scss";
import { Button } from 'antd';
...
  <div className={styles.appContainer}>
      <Button>按钮</Button>
  </div>
...

// app.module.scss
.appContainer {
  :global {
      // 在这里通过找到antd类名来修改组件的样式
  }
}
```

## 国际化

本项目使用的国际化框架为[react-intl](https://www.npmjs.com/package/react-intl)，如果使用的是 vscode 编辑器，可以下载[react-intl-linter](https://github.com/Styx11/react-intl-linter)插件便捷的添加国际化文本。

1. 安装`react-intl`依赖

```bash
yarn add react-intl
```

2. React 最外层添加`IntlProvider`

```js
import { IntlProvider } from 'react-intl';
import { getLocales, ILocales } from 'src/intl';

<IntlProvider
    locale={this.props.locale}
    messages={getLocales(this.props.locale)}
    onError={(err) => {
        // react-intl itself doesn't inherently have any locale-data. Ignore Error
        console.warn(err);
    }}
>
    {this.props.children}
</IntlProvider>;
```

3. 提供国际化配置文件

```
src
└── intl // 语言客户端
    ├── interface.ts // 中英文文本配置 interface
		├── zh_CN.ts // 中文文本配置
		├── en_US.ts // 英文文本配置
    └── index.ts // 导出国际化配置
```

4. 使用`intl.formatMessage`添加国际化文本，配合[react-intl-linter](https://github.com/Styx11/react-intl-linter)vscode 插件可以更方便的去修改上一步的国际化配置文件

> react-intl-linter 为 vscode 插件，直接搜索安装即可

```js
import React from 'react';
import { useIntl } from 'react-intl';

interface Props { }

const HelloWorld: React.FunctionComponent<Props> = (props) => {
	const intl = useIntl()
	return (
		...
		{intl.formatMessage({ id: 'HELLO_WORLD' })}
		...
	);
};

export default HelloWorld;

```

## [React-Router](https://github.com/remix-run/react-router#readme)

本项目使用的是 v6 版本，跟 v5 版本的写法会有所区别，详情请看[react-router 升级指南](https://reactrouter.com/docs/en/v6/upgrading/v5)

-   使用 Routes 替代原来的 Switch
-   使用 Navigate 替代原来的 Redirect: eg: `<Route path="*" element={<Navigate replace to={xxx} />} />`

其他 API 或组件的使用细节请参考[官方教程](https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md)

## 状态管理

本项目使用[redux](https://redux.js.org/)来管理项目状态，但要将`redux`集成到项目中要进行一系列繁琐的配置，使用[Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)可以`redux`配置变的更加简单

> [redux toolkit api](https://redux-toolkit.js.org/introduction/getting-started#whats-included)

1. 使用`configureStore`api 创建一个`Redux Store`

```js
// src/store/index.ts
import { BrowserHistory } from 'history';
import { routerReducer } from 'react-router-redux';
import {
    configureStore as _configureStore,
    combineReducers,
} from '@reduxjs/toolkit';
import application from './application/slice';

/**
 * Refrence: https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const rootReducer = combineReducers({
    application,
    routing: routerReducer,
});

function configureStore(history: BrowserHistory) {
    return _configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                immutableCheck: false,
                serializableCheck: false,
            }),
    });
}

const store = configureStore();

export type AppState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types

export default store
```

2. 将 store 注入应用

```js
// src/index.tsx
import { Provider as ReduxProvider } from 'react-redux';

/**
 * Init App
 */
const render = () => {
    ReactDOM.render(
        <ReduxProvider store={store}>...</ReduxProvider>,
        document.getElementById('react-app')
    );
};

render();
```

2. 使用`createSlice`创建一个带有`action creators`和`action types`的`reducer`数据切片

```js
// src/xxx/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ILoading {
    visible: boolean;
    text?: string;
}

export interface IApplicationState {
    loading: ILoading;
}

const initialState: IApplicationState = {
    loading: {
        visible: false,
    },
};

/**
 * 使用`createSlice`创建一个带有`action creators`和`action types`的`reducer`数据切片
 * Redux 规定我们不可以直接在 switch cases 函数中直接修改 state 值，而是返回一个修改后的拷贝值
 * 而 Redux ToolKit 的 createSlice 和 createReducer 函数内部使用了 immer 让我们可以直接在函数中修改 state 中的属性值。
 * 但是需要注意的是，在同一个函数中我们不可以 既修改 state 又返回修改后的拷贝值，immer 是无法区分这两种情况的。
 */
const slice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        SetLoadingAction(
            state: IApplicationState,
            action: PayloadAction<ILoading>
        ) {
            return {
                ...state,
                loading: action.payload,
            };
        },
    },
});

export const { SetLoadingAction } = slice.actions;

export default slice.reducer;
```

> Redux 规定我们不可以直接在 switch cases 函数中直接修改 state 值，而是返回一个修改后的拷贝值，而 Redux ToolKit 的 createSlice 和 createReducer 函数内部使用了 immer 让我们可以直接在函数中修改 state 中的属性值。但是需要注意的是，在同一个函数中我们不可以 既修改 state 又返回修改后的拷贝值，immer 是无法区分这两种情况的。

```js
// 这种写法是允许的
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      // "Mutate" the existing state, no return value needed
      state.push(action.payload)
    },
    todoDeleted(state, action.payload) {
      // Construct a new result array immutably and return it
      return state.filter(todo => todo.id !== action.payload)
    }
  }
})

// brokenReducer是不允许的，因为它既修改了 state 值，又返回了一个修改后的拷贝值
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // ❌ ERROR: mutates state, but also returns new array size!
    brokenReducer: (state, action) => state.push(action.payload),
    // ✅ SAFE: the `void` keyword prevents a return value
    fixedReducer1: (state, action) => void state.push(action.payload),
    // ✅ SAFE: curly braces make this a function body and no return
    fixedReducer2: (state, action) => {
      state.push(action.payload)
    },
  },
})
```

3. 异步 react-thunk 配置

`Redux ToolKit`提供了`createAsyncThunk`函数供用户创建能够执行异步逻辑的派发函数，但是从调研结果来看，`createAsyncThunk`函数反而使这个流程变得繁琐了，所以本项目还是使用原生的`react-thunk`的方式

```js
import { AppDispatch } from '..';
import { SetLoadingAction } from './slice';

export const actionCreators = {
    getAsyncResult: (id: number) => async (dispatch: AppDispatch) => {
        try {
            dispatch(SetLoadingAction({ visible: true }));
            const result = await getAsyncResultDetail(id);
            dispatch(SetAsyncResult(result));
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(SetLoadingAction({ visible: false }));
        }
    },
};
```

# 问题记录

#### vscode 去识别`styles.xxx`时报错：cannot find module ‘xxx.module.scss’ or its corresponding type declarations

1. 增加 xxx.module.scss 类型定义

```typescript
// src/types/scss.d.ts
declare module '*.module.scss' {
    const content: Record<string, string>;
    export default content;
}
```

这种方式只能解决 VSCode 报错，无法通过 `command+左键` 定位到相对应的 `className` 定义

2. 使用 [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)
   首先安装依赖

```shell
yarn add -D typescript-plugin-css-modules
```

然后将该插件配置在 `tsconfig.json` 文件中

```json
{
    "compilerOptions": {
        "plugins": [{ "name": "typescript-plugin-css-modules" }]
    }
}
```

配置 VSCode 中的 Typescript 版本为 4.3.5 [参考](https://github.com/mrmckeb/typescript-plugin-css-modules#visual-studio-code)，如下图
![image-20211215182614909](https://cdn.jsdelivr.net/gh/cjh804263197/AssetsLibrary@master/img/image-20211215182614909.png)
最后重启 VSCode 大功告成，这种方式既可以解决 VSCode 报错，也可以通过 `command+左键` 定位到相对应的 `className` 定义，效果很好
