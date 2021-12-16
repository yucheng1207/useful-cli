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

# 问题记录

#### vscode 去识别`styles.xxx`时报错：cannot find module ‘xxx.module.scss’ or its corresponding type declarations

-   解决方式一：增加 xxx.module.scss 类型定义

    ```typescript
    // src/types/scss.d.ts
    declare module '*.module.scss' {
        const content: Record<string, string>;
        export default content;
    }
    ```

    这种方式只能解决 VSCode 报错，无法通过 `command+左键` 定位到相对应的 `className` 定义

-   解决方式二：使用 [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)
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
