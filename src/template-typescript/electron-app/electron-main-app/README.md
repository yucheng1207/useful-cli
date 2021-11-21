# 创建项目

该工程在 [https://github.com/electron/electron-quick-start-typescript](https://github.com/electron/electron-quick-start-typescript) 模板上进行搭建的

```bash

# 本地调试
yarn dev

# 编译
yarn build:[env]

# 打包
yarn pack:[platform]:[env]
```

# 项目搭建

## 资料

[electron 官网](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start)
[electron-builder](https://github.com/electron-userland/electron-builder)
[electron 环境变量](https://www.electronjs.org/docs/latest/api/environment-variables)
[boilerplates](https://www.electron.build/#boilerplates)

## node 版本

v16.11.1

## 本地调试

### 热重载

参考了[electron-vue](https://github.com/SimulatedGREG/electron-vue/blob/master/template/.electron-vue/dev-runner.js)的 dev-runner 实现热重载功能

### 设置调试端口号

更改 `scripts/common/paths.js` 中的 `rendererPort` 可以设置本地运行时调试的端口号

## 打包

该项目使用 `gulp + webpack + electron-builder` 进行打包。打包流程为：

1. 编译渲染进程代码，通过运行渲染进程的 build 命令进行打包，并将结果输出到`dist/renderer`文件夹下，详情看`scripts/tasks/buildRenderer.js`，默认执行的 build 命令是

```
// scripts/tasks/buildRenderer.js中执行build命令代码，如果渲染进程的打包命令不是 yarn build，需要自行修改成正确的打包命令
execSync(`cd src/renderer && yarn build`);
```

2. 编译主进程代码，使用`webpack`对主进程代码进行编译，并将结果输出到`dist/main`文件夹下，详情看`scripts/tasks/buildMain.js`

3. 经过上两步，dist 文件下已经有的主进程和渲染进程打包后的代码，最后只要使用`electron-builder`对应用进行打包，详情看`scripts/tasks/buildApp.js`

### gulp

使用`gulp`自动化构建工具可以更好的编写打包脚本，根目录下的`gulpfile`文件可以看到定义了很多 glup 任务，
然后在`srcipt/build.js`中去调用这些任务，打包流程变的更加的便捷

### webpack

使用`webpack`对主进程代码进行编译，跟直接使用`tsc`进行编译相比有以下好处：

** webpack vs tsc **

-   tsc: 使用 tsc 编译无法配置 alias，也无法将 node_module 中的内容一起编译，所以 electron 打包的时候还需要将 node_module 拷贝到输出包中，导致输出包十分的大
-   webpack: 使用 webpack 打包不仅可以配置 alias，还可以将所用内容(包括 node_module)输出到一个 bundle 中，体积更小，并且可以使用 webpack 的插件，如`dotenv-webpack`可以很好的解决环境变量的问题

### electron-builder

编译完成后就可以使用[electron-builder](https://www.electron.build/code-signing)进行打包了

-   [electron-builder doc](https://www.electron.build)
-   [electron-builder github](https://github.com/electron-userland/electron-builder)

1. 安装依赖

```bash
yarn add -D electron-builder
```

2. 配置`electron-builder`选项
   有两种方法，一种是在`package.json`的 build 字段配置，一种是使用 yml 文件，为了可以根据不同的环境进行打包，本项目使用的是 yml 文件的方式
   根目录下创建不同环境的 yml 文件，然后使用`electron-builder`去加载对应的 yml 文件进行打包了

electron 打包所有选项说明可以看[官方文档](https://www.electron.build/configuration/configuration#configuration)

配置文件：

-   electron-builder-test.yml -> 测试环境打包配置文件
-   electron-builder-rc.yml -> RC 环境打包配置文件
-   electron-builder-prod.yml -> 正式环境打包配置文件

### 打包文件说明

```
"config/electron-builder" => electron-builder配置文件
"config/main/webpack.main.config.js" => 主进程webpack config文件
"src/main/*" => 主进程代码
"src/renderer/*" => 渲染进程代码
"dist/main/*" => 主进程webpack打包输出文件
"dist/renderer/*" => 渲染进程编译后的输出文件
"release-builds" => 最终的打包输出文件
"gulpfile.js" => gulp配置文件
"srcipts/*" => 打包相关的脚本
```

### 打包命令

```bash
# 编译
yarn build:[env]

# 打包
yarn pack:[platform]:[env]
```

## 环境变量

使用`dotenv-webpack`进行配置

## Alias 配置

`tsconfig`和`webpack.config`可以配置项目的 alias

## Logger

使用[bunyan](https://www.npmjs.com/package/bunyan)进行日志收集
日志保存在`path.join(Globals.LOG_PATH, Globals.LOG_NAME)`，使用方法如下

```javascript
import { Logger } from './managers/LoggerManager';
Logger.info('hello');
```

# TODOS

-   热重载(electron-reload)
