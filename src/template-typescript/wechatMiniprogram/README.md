# Introduction

小程序原生开发模板，集成了以下功能：

-   支持`国际化`
-   支持`typescript`
-   支持`scss 预编译`
-   支持`设置环境变量`
-   支持`热更新`（执行 yarn dev 在文件被修改时会自动编译）
-   使用 Promise 封装了 wx.request，并创建了一个 httpManager 单例
-   使用 eslint + prettier + husky 规范代码格式

# Getting Started

## 开发参考文档：

-   [小程序官网](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html)
-   [小程序开发指南](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0008aeea9a8978ab0086a685851c0a)

## 目录结构

```
  ├── dist                  // 编译输出目录，供微信开发者工具加载
  ├── miniprogram           // 小程序源文件目录
  │   ├── config            // 项目环境配置
  │   ├── http
  │   │   ├── api.ts        // 后端api封装
  │   │   ├── httpManager.ts    // http实例，将wx.request封装成一个Promise
  │   │   ├── types.ts      // 前端自定义interface
  │   ├── i18n              // 国际化文本目录
  │   ├── miniprogram_npm   // 使用微信开发者工具构建的npm包
  │   ├── page              // 小程序页面目录
  │   ├── store             // globalData存放目录
  │   ├── util              // 公用方法
  │   ├── app.json          // 小程序进行全局配置文件，可配置路由、微信窗口等
  │   ├── app.ts
  │   ├── app.wxss          // 小程序全局样式
  │   ├── package.json      // 小程序使用到的依赖，使用微信开发者工具可以把node_module构建成小程序可识别的npm包(miniprogram_npm)
  │   ├── yarn.lock
  ├── typings               // 小程序官方interface
  ├── .eslintrc.js          // 配置代码检查工具Eslint
  ├── .eslintignore         // eslint忽略规则
  ├── .gitignore            // git忽略提交规则
  ├── .prettierrc.js        // 配置prettier
  ├── gulpfile.js           // gulp配置文件
  ├── package.json
  ├── project.config.json   // 小程序项目配置文件
  ├── README.md
  ├── tsconfig.json         // typescript编译配置文件
  └── yarn.lock
```

## 获取 AppID

登录 [小程序后台](https://mp.weixin.qq.com/) 在菜单 “开发”-“开发设置” 看到小程序的 AppID 了 。（没有 AppId 需要去[注册](https://mp.weixin.qq.com/wxopen/waregister?action=step1)一个小程序账号）

## 初始化项目

```
// 安装useful-cli脚手架
yarn global add useful-cli

// 使用useful-cli创建工程，并选择`微信小程序`选项
useful-cli create <app-name>

```

## 安装依赖

执行 `yarn` 命令安装 gulp、eslint、typescript 等依赖，是小程序具备打包编译等功能

```

yarn

```

## 调试

使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开项目，执行以下命令 `yarn dev` 开在本地调试，该命令会将 ts 文件编译成 js 文件，并且当文件改变时自动重新编译，编译后即可在微信开发者工具中预览

```

yarn dev

```

## 编译

```

yarn build

```

## 打包

-   TBD

## Note

### 代码编写规范 - ESlint + prettier + husky

参考:

1. [使用 ESLint+Prettier 规范 React+Typescript 项目](https://zhuanlan.zhihu.com/p/62401626)
2. [用 ESLint 来规范 Typescript 代码](https://github.com/forthealllight/blog/issues/45)

### 配置 alias

由于使用 typescript 编译后无法正常解析 alias，所以引用 ttypescript + typescript-transform-paths 来解决这个问题，如引用 utils 中的方法可直接 import { ... } from '@utils/util'或 import { ... } from 'utils/util'，配置如下

1. 安装 ttypescript + typescript-transform-paths 依赖

```
// 安装依赖
yarn add -D ttypescript
yarn add -D typescript-transform-paths
```

2. 配置 tsconfig

```
// tsconfig
{
...
    "baseUrl": "miniprogram" /* Base directory to resolve non-absolute module names. */,
    "paths": {
      "@pages/*": ["page/*"],
      "@utils/*": ["utils/*"],
      "@npm/*": ["miniprogram_npm/*"]
      ...
    } /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */,
"plugins": [{ "transform": "typescript-transform-paths" }],
...
}
```

3. 使用 ttsc 进行编译

```
// package.json
...
   "scripts" {
       "tsc": "ttsc",
       ...
    }
...
```

4. 使用 alias

```
// 引用utils中的方法
import { ... } from '@utils/util'
// 或者
import { ... } from 'utils/util'

// 引用npm模块
import { ... } from '@npm/***'
// 或者
import { ... } from 'miniprogram_npm/***'
```

### 配置国际化

参考[这里](https://developers.weixin.qq.com/miniprogram/dev/extended/utils/miniprogram-i18n/quickstart.html)

#### WXML 中的用法

1. 在 WXML 文件对应的 JavaScript 文件里引入国际化运行时。

注意：这里建议 Page 以及 Component 都采用 Component 构造器进行定义，这样可以使用 I18n 这个 Behavior。如果需要在 Page 构造上使用 I18n 则需要引入 I18nPage 代替 Page 构造器。

```
<!-- pages/index/index.ts -->
import { I18nPage } from '@miniprogram-i18n/core'
I18nPage({
  ...
})

或者

import { I18n } from '@miniprogram-i18n/core'
Component({
  behaviors: [I18n]
})
```

2. 在 WXML 中使用 t 函数（或其他你指定的函数名）来获取文本。

```
<!-- pages/index/index.wxml -->
<view>{{ t('helloWorld') }}</view>
```

#### JavaScript 中的用法

miniprogram/utils/i18n 中封装了 message，可以直接使用

```
import { message, toggleLanguage } from '@utils/i18n'
console.log(message('helloWorld'))
toggleLanguage() // 切换语言
console.log(message('helloWorld'))
```

Note：

-   使用@miniprogram-i18n/core 前需要构建 npm
-   使用 gulp 解析`i18n`中的`json文件`和`page`中的`wxml文件`后输出到 dist

### 配置 scss

参考[这里](https://juejin.cn/post/6844903778496282632)

gulp 配置如下：

```
// gulpfile.js
const scss = require('gulp-sass'); // scss编译插件
const postcss = require('gulp-postcss'); // 强大的css处理插件
const pxtorpx = require('postcss-px2rpx'); // px转为rpx
const styleAliases = require('gulp-style-aliases'); // scss设置alias
const rename = require('gulp-rename'); // 更改文件名
const replace = require('gulp-replace'); // 替换内容
const changed = require('gulp-changed'); // 检测改动
const autoprefixer = require('autoprefixer'); //  自动添加前缀

/**
 * 编译sass文件为wxss文件，需要注意的是sass中不能使用@mixin语法
 * refrence: https://juejin.cn/post/6844903778496282632
 */
function compileStyle() {
    /**
    * 步骤如下：
    * 指定文件处理目录
    * gulp-replace通过正则匹配@import语句将其注释
    * 启用gulp-sass编译scss文件，
    * 通过postcss对低版本ios和安卓进行兼容样式处理
    * gulp-rename更改文件后缀为.wxss
    * gulp-replace通过正则匹配@import语句打开注释
    * 最后输入到dist目录
    */
    return src(['miniprogram/**/*.scss'])
      .pipe(replace(/\@(import\s[^@;]*)+(;import|\bimport|;|\b)?/g, ($1) => {
        // 与小程序自带的import不同，sass会把@improt的内容打包到当前文件，所以打出来的报会大一点
        // 而小程序限制单包大小不能超过2M，如果由于@import导致包过大，需要注释掉@import(使用自带的import)，等sass编译完后在重新打开
        // 考虑到小程序的样式文件单包应该不会超过2M，而且注释掉@import会导致sass中的变量申明、@mixin功能就不能用了，这里还是选择使用sass的@import功能
        return $1 // `\/*T${$1}T*\/`
      }))
      .pipe(styleAliases({
        "@miniprogram": 'miniprogram',
        "@page": 'miniprogram/page',
        "@styles": 'miniprogram/styles'
      }))
      .pipe(scss())
      .pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1']), pxtorpx()]))
      .pipe(
        rename(function(path) {
          path.extname = '.wxss'
      }))
      .pipe(changed('dist'))
      .pipe(replace(/.scss/g, '.wxss'))
      .pipe(replace(/\/\*T(@import\s[^@;]*;)?(T\*\/)/g, '$1'))
      .pipe(dest('dist'))
  }
```

### 设置环境变量

1. 在`miniprogram/config`中定义不同环境的 ts 文件
2. 使用`cross-env`注入环境变量
3. gulpfile 中获取环境变量`process.env.NODE_ENV`
4. 根据`process.env.NODE_ENV`生成 env.ts（从 miniprogram/config 中拷贝）
5. 使用如下:

```
import ENV from 'env';
console.log('当前环境变量', ENV)
```

### 引入第三方依赖

引入第三方依赖有两种方式：

1. 直接将依赖输出文件拷贝出来
2. 使用 npm 构建工具

#### 直接拷贝依赖的输出文件

以 ali-oss 文件为例，可以将https://github.com/ali-sdk/ali-oss git 仓库中的 dist/aliyun-oss-sdk.min.js 拷贝到项目 lib 文件夹下

#### [构建 NPM](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

小程序支持使用 npm，但是需要使用微信开发者工具的`构建npm`功能
当我们需要引入 npm 包时，需要执行以下操作

1. 修改 project.config.json
   配置 project.config.json 的 setting.packNpmManually 为 true，开启自定义 node_modules 和 miniprogram_npm 位置的构建 npm 方式
   配置 project.config.json 的 setting.packNpmRelationList 项，指定 packageJsonPath 和 miniprogramNpmDistDir 的位置

```
  "packNpmManually": true,
  "packNpmRelationList": [{
    "packageJsonPath": "miniprogram/package.json",
    "miniprogramNpmDistDir": "miniprogram"
  }],
```

2. 在 miniprogram 目录下添加对应的依赖

```
cd miniprogram
yarn add ***
```

3. 添加完依赖后小程序 miniprogram 中会有 node_modules 文件夹，通过微信开发者工具把`node_modules`构建成`miniprogram_npm`
   微信开发者工具菜单 -> 工具 -> 构建 npm
4. 构建完后`miniprogram_npm`目录下就生成了相应的 npm 包，可在项目中直接引用

```
import { ... } from '@npm/***'
// 或者
import { ... } from 'miniprogram_npm/***'
```

#### [小程序分包大小有限制](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html)

-   使用分包加载时，整个小程序所有分包大小不超过 20M
-   单个分包/主包大小不能超过 2M
    所以为了避免小程序体积过大，建议图片都放到 cdn，一些第三方依赖能后端处理就后端处理（如 ali-oss 获取签名 url 就可以让后端提供 api，这样小程序就不需要引入 ali-oss 依赖了）

### 状态管理 - globalData

由于小程序数据不会很复杂，且在小程序中 redux 对 ts 的支持不好，这里直接使用小程序自带的 globalData 来进行状态管理。

1. `使用getApp()` 或者 `在App()函数内使用this` 可获取到小程序全局唯一的 App 实例。
   注意：

-   不要在定义于 [App()](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html) 内的函数中，或调用 App()函数 前调用 getApp() ，使用 this 就可以拿到 app 实例。
-   通过 getApp() 获取实例之后，不要私自调用生命周期函数。

2. 直接获取 App 实例的 globalData 属性就可以设置全局属性了， 可以再 App()函数 中初始化 globalData

```
App<IMiniAppOption>({
    globalData: {
      test: '123'
    },
    onLaunch() {
      this.globalData.test = '456'
    }
}
```

为了方便管理整个工程的全局属性，我们定义了一个单例 - StoreManager， 约定所有的 globalData 操作都通过 StoreManager 来执行

```
// storeManager.ts
import { IMiniApp } from 'app'

export interface IGlobalData {
    test: string
}

export function initGlobalData() {
    return {
        test: '',
    }
}

export default class StoreManager {
    // StoreManager instance
    private static _storeManager: StoreManager

    private _app: IMiniApp

    constructor(app?: IMiniApp) {
        this._app = app || getApp()
        if (!this._app) {
            throw 'StoreManager Error: 获取app实例失败'
        }
    }

    public static getInstance(app?: IMiniApp): StoreManager {
        if (!this._storeManager) {
            this._storeManager = new StoreManager(app)
        }

        return this._storeManager
    }

    public setTest(test) {
        this._app.globalData.test = test
    }

    public getLogs() {
        return this._app.globalData.test
    }
}


// app.ts
import StoreManager, { IGlobalData, initGlobalData } from 'store/storeManager'
interface IMiniAppOption {
    globalData: IGlobalData
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}
export type IMiniApp = WechatMiniprogram.App.Instance<IMiniAppOption>

App<IMiniAppOption>({
    globalData: initGlobalData(),
    onLaunch() {
        StoreManager.getInstance(this).initLogs()
    }
})
```

### 路由

#### 路由配置

在 app.json 文件的 pages 属性可以配置项目的路由

#### 路由跳转

使用 [wx.navigateTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)可以进行路由跳转，跳转 url 可以是相对路径，也可以是绝对路径("/pages/**/**")

```
    wx.navigateTo({
        url: '../logs/logs',
    })
    或者
    wx.navigateTo({
        url: '/pages/logs/logs',
    })
```

### UI 库 - [WeUI](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/quickstart.html)

#### 有两种引入方式

1. 通过 useExtendedLib 扩展库 的方式引入，这种方式引入的组件将不会计入代码包大小。
2. 可以通过 npm 方式下载构建，npm 包名为 weui-miniprogram

通过 useExtendedLib 扩展库 的方式引入组件将不会计入代码包，我们没有理由不用它。

#### 使用

1. 在 app.json 中配置 useExtendedLib

```
// app.json
{
  ...
  "useExtendedLib": {
    "weui": true
  }
  ...
}
```

2. 在页面对应的 json 文件的 usingComponents 配置字段添加要使用的组件

```
// ***.json
{
  "usingComponents": {
    "mp-dialog": "weui-miniprogram/dialog/dialog"
  }
}
```

3. 在对应页面的 wxml 中直接使用该组件

```
<mp-dialog title="test" show="{{true}}" bindbuttontap="tapDialogButton" buttons="{{[{text: '取消'}, {text: '确认'}]}}">
    <view>test content</view>
</mp-dialog>
```

#### 修改组件内部样式

每个组件可以设置 ext-class 这个属性，该属性提供设置在组件 WXML 顶部元素的 class，组件的 addGlobalClass 的 options 都设置为 true，所以可以在页面设置 wxss 样式来覆盖组件的内部样式。需要注意的是，如果要覆盖组件内部样式，必须 wxss 的样式选择器的优先级比组件内部样式优先级高。 addGlobalClass 在基础库 2.2.3 开始支持。

## Todos

-   部署配置
-   支持加载 svg
-   分包加载配置
