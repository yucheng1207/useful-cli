# useful-cli

一个有用的前端脚手架，支持创建 `微信小程序`、`vue`、`react` 和 `electron` 项目，脚手架搭建过程可以看这篇[掘金 blog](https://juejin.cn/post/6981631766406627364)。

-   [微信小程序](./src/template-typescript/wechat-miniprogram)：使用 `gulp`搭建的小程序原生开发工程化模板，集成了以下功能：
    -   支持`国际化`
    -   支持`typescript`
    -   支持`scss 预编译`
    -   支持`设置环境变量`
    -   支持`热更新`（执行 yarn dev 在文件被修改时会自动编译）
    -   使用 `Promise` 封装了 `wx.request`，并创建了一个 `httpManager` 单例
    -   使用 `eslint` + `prettier` + `husky` 规范代码格式
    -   引入了 `weUI` 库
-   [react-ts](./src/template-typescript/react-app)：这是一个 React 前端项目模板，使用了 `React全家桶` （`react` + `react-router` + `redux`）搭建，项目中推荐使用 `react-hook` 开发组件，主要集成了以下功能：
    -   自定义配置 `webpack`，支持 `alias`、`scss` 等
    -   集成了 `antd` UI 库
    -   支持 `国际化`
    -   支持`typescript`
    -   支持使用 `redux-toolkit` 来进行状态管理
    -   支持使用 `react-router` 来管理路由
    -   集成了 `Module Federation`，可以输出和引入子模块
    -   使用 `ESLint`、`husky` 和 `.vscode` 来规范代码
-   [vue3-ts(vite)](./src/template-typescript/vite-vue3-app)：该项目是使用 [Vite](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project) 搭建的 `Vue3.0` 项目模板，支持以下功能，更多自定义功能待完善...
    -   支持 `scss`
    -   集成 `Vue Router` 管理路由
    -   集成 `Vuex` 管理状态
    -   集成 UI 框架 `Element Plus`
    -   使用 `EditorConfig` + `Prettier` + `ESLint` 来实现代码规范化
-   [vue3-ts(vue-cli)](./src/template-typescript/vue3-app)：该项目是使用 `vue-cli` 搭建的 `Vue3.0` 项目模板，支持以下功能，更多自定义功能待完善...
    -   支持 `scss`
    -   集成 `Vue Router` 管理路由
    -   集成 `Vuex` 管理状态
    -   集成 UI 框架 `Element Plus`
    -   使用 `Prettier` + `ESLint` 来实现代码规范化
-   [electron-main-app](./src/template-typescript/electron-app/electron-main-app)：这是一个 Electron 前端项目模板，渲染进程是一个最简单的静态页面，用于演示如何引入一个渲染进程项目，可以参考该静态页面的配置自行改成`vue`或`react`，主要集成了以下功能：
    -   支持使用 `webpack` 编译主进程和渲染进程代码，使用 `gulp` 编写应用调试打包脚本
    -   使用 `electron-builder` 打包应用，支持 `window`、`mac` 两个系统
    -   支持 `应用更新` 和 `热更新`。`应用更新`即主进程代码改动时重新安装应用，`热更新`即渲染进程代码改动时在线更新渲染进程代码（不需要重新安装）
    -   支持 `typescript`
    -   主进程使用 [bunyan](https://www.npmjs.com/package/bunyan) 进行日志收集
    -   主进程使用 [Nedb](https://github.com/louischatriot/nedb) 管理本地数据
    -   支持主进程和渲染进程通信
    -   支持 URL 远程启动 - `Deep Link`
    -   主窗口加载完成前使用 `Loading` 窗口避免白屏和过长时间的启动等待
    -   使用 `ESLint` 和 `.vscode` 来规范代码

## 查看当前版本

```
    npx useful-cli -v
```

## 通过脚手架创建项目

```
    npx useful-cli create <app-name>
```

## 发布流程

1. 修改 package.json 版本号，并将代码 push 到 github

```
git commit -m "xxxxx"
git push
```

2. 删除项目中的依赖，然后打 tag，最后执行 `npm publish` 进行发布，执行 `yarn deploy` 带上部署描述 将完成前面的这些操作

```
yarn deploy 'xxxxx'
```

## useful-cli 依赖介绍

### [chalk](https://www.npmjs.com/package/chalk)

用于设置终端字符串样式，比如需要输出一段红色字符串

```js
console.log(chalk.red(`This is a string of red strings`));
```

### [fs-extra](https://www.npmjs.com/package/fs-extra)

fs-extra 是 fs 的一个扩展，提供了非常多的便利 API，并且继承了 fs 所有方法和为 fs 方法添加了 promise 的支持

```js
const fs = require('fs-extra');
// 同步写法
try {
    fs.copySync('/tmp/myfile', '/tmp/mynewfile');
    console.log('success!');
} catch (err) {
    console.error(err);
}
// 异步写法
async function copyFiles() {
    try {
        await fs.copy('/tmp/myfile', '/tmp/mynewfile');
        console.log('success!');
    } catch (err) {
        console.error(err);
    }
}
```

### [path](https://nodejs.org/docs/latest/api/path.html)

path 模块用于处理文件或目录路径

```js
path.resolve([...paths])：方法将路径或路径片段的序列解析为绝对路径。
path.join([...paths])：方法使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。
path.resolve(__dirname)：返回被执行 js 文件的绝对路径
path.resolve(
    path.join(__dirname, 'template-typescript', 'wechat-miniprogram')
) // 返回被执行路径下的template-typescript/wechat-miniprogram的绝对路径
```

### [inquirer](https://www.npmjs.com/package/inquirer)

一组通用的交互式命令行用户界面。如下代码可在命令行中进行选择操作

```js
const { appType } = await inquirer.prompt([
    {
        name: 'appType',
        type: 'list',
        message: `Please select the type of project you want to create:`,
        choices: [{ name: '微信小程序', value: 'wechat-miniprogram' }],
    },
]);
switch (appType) {
    case 'wechat-miniprogram':
        createWechatMiniprogram(name, options);
        break;
    default:
        console.log(chalk.red('unknow app type'));
        break;
}
```

### [minimist](https://www.npmjs.com/package/minimist)

用于解析命令行参数，如下代码可获取命令行输入的参数

```js
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
```

### [commander](https://www.npmjs.com/package/commander)

完整的 node.js 命令行解决方案。可用于配置命令具体处理函数

```js
const { Command } = require('commander');
const program = new Command();
program
    .command('create <app-name>')
    .description(`Use ${chalk.green('useful-cli')} to create a new project`, {
        'app-name': 'project name',
    })
    .action((appName, options) => {
        if (minimist(process.argv.slice(3))._.length > 1) {
            console.log(
                chalk.yellow(
                    "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
                )
            );
        }
        ...
    });
```
