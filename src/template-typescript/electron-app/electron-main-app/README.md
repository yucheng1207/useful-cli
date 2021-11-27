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

-   [electron 官网](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start)
-   [electron-builder](https://github.com/electron-userland/electron-builder)
-   [electron 环境变量](https://www.electronjs.org/docs/latest/api/environment-variables)
-   [boilerplates](https://www.electron.build/#boilerplates)

## node 版本

开发此模板时使用的是 v14.18.1 或 v16.11.1，如果遇到 node 版本问题，建议切换到这两个版本

## 本地调试

执行`yarn dev`会自动本地运行主进程和渲染进程代码，详情看`scripts/dev-runner.js`，运行步骤为

1. startRenderer：启动渲染进程
   可以看到`startRenderer`中的逻辑很简单，只是执行了一下渲染进程启动脚本`electron-dev-run`，该脚本的目的就是让渲染进程在本地运行起来。
   本项目默认渲染进程是一个最简单的 webpack 工程，如果需要改成其他框架（如 vue、react 等），可以参考下面的`渲染进程配置`小节进行替换。

2. startMain：启动主进程（与 startRenderer 是同时进行的）
   使用 webpack 对主进程代码进行编译，当代码发生改变时重新启动应用

3. startElectron：启动应用
   使用 electron 启动应用

### 热重载

参考了[electron-vue](https://github.com/SimulatedGREG/electron-vue/blob/master/template/.electron-vue/dev-runner.js)的 dev-runner 实现热重载功能

#### 主进程热重载

主进程文件修改时重启 electron，详情请看`scripts/dev-runner.js`

#### 渲染进程热重载

渲染进程本地运行时使用`webpack-dev-server`起一个 server，修改渲染进程文件会触发网页重新加载， 详情看渲染进程的`electron-dev-runner.js`渲染进程启动文件

### 设置调试端口号

更改 `scripts/common/paths.js` 中的 `rendererPort` 可以设置本地运行时调试的端口号

### 渲染进程配置

本项目渲染进程是一个最简单的 webpack 工程，实际开发中可以直接将渲染进程代码(src/renderer)`整个替换`成其他框架的代码，只需注意一下几点配置：

1. 编写渲染进程的启动脚本：我们提供了一个模板(`scripts/renderer/electron-dev-runner.js`)，可以参考这个模板来编写，建议直接将模板拷贝到渲染进程目录后根据实际业务进行修改。同时将`path.rendererDevRunnerPath`设置为渲染进程中启动脚本(`electron-dev-runner`)所在位置
2. 渲染进程的`package.json`中添加渲染进程编译命令，默认识别的编译命令是`yarn build:[env]`，如果不是请修改`buildRenderer.js`文件。同时修改`paths.rendererOutput`为编译输出路径

## 打包

该项目使用 `gulp + webpack + electron-builder` 进行打包。打包流程为：

1. 编译渲染进程代码，通过运行渲染进程的 build 命令进行打包，并将结果输出到`dist/renderer`文件夹下，详情看`scripts/tasks/buildRenderer.js`，`buildRenderer.js`默认执行渲染进程编译命令是`yarn build:[env]`, 如果不是请修改`buildRenderer.js`文件

```
const env = process.env.NODE_ENV;
console.log(`正在编译【${env}环境】渲染进程文件...`);
execSync(`cd ${paths.rendererSrc} && yarn build:${env}`);
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

打包相关的路径配置都放在`scripts/common/paths.js`中，详情请看该文件中的定义

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

## 主进程和渲染进程通信

-   [官方教程](https://www.electronjs.org/zh/docs/latest/api/ipc-main)

## URL 远程启动（Deep Link）

参考：

-   [官方教程](https://www.electronjs.org/zh/docs/latest/tutorial/launch-app-from-url-in-another-app)
-   [electron-deep-linking-mac-win](https://github.com/oikonomopo/electron-deep-linking-mac-win)

1. 设置 schemes， 使用 electron-builder 打包加上 protocols 配置项

```
protocols:
    name: "useful-electron-app"
    schemes:
        - "useful-electron-app"
```

2. 设置当前应用为[协议的默认处理程序](https://www.electronjs.org/docs/latest/api/app#appsetasdefaultprotocolclientprotocol-path-args)

```
const schemes = "meshkit-studio"
app.setAsDefaultProtocolClient(schemes)
```

3. 获取 deeplink url

-   macOs：当用户尝试打开第二个或通过 deeplink 打开 app 时，会触发 app 的'open-url'事件
-   windows: 当用户尝试打开第二个或通过 deeplink 打开 app 时，会触发 app 的'second-instance'事件

注意: 在 macOs 上，当用户尝试在 FInder 中打开您的应用程序的第二个实例时， 系统会通过发出`onen-file`和`open-url`事件来自动强制执行单个实例。但当用户在命令行中启动应用程序时，系统的单实例机制将被绕过，必须手动调用 requestSingleInstanceLock 来确保单例

4. 浏览器中输入协议可打开 app

```
useful-electron-app://
```

如果需要自定义项目的 protocols， 需要更改`config/electron-builder`下 yml 文件中的`protocols`字段和`config/main/env`下的环境变量文件中的`DEFAULT_PROTOCOL_CLIENT`变量
