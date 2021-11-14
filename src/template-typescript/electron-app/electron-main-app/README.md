# 创建项目

该工程在 [https://github.com/electron/electron-quick-start-typescript](https://github.com/electron/electron-quick-start-typescript) 模板上进行搭建的

```bash
# 编译
yarn tsc

# To recompile automatically and to allow using [electron-reload](https://github.com/yan-foto/electron-reload), run this in a separate terminal:
yarn tsc:watch

# 输出渲染进程文件
yarn copy-renderer

# 本地调试
yarn dev

# 打包
build:mac:test
```

# 项目搭建

## 资料
[electron 官网](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start)
[electron-builder](https://github.com/electron-userland/electron-builder)

## node 版本

v16.11.1

## 配置环境变量

1. 在 env 目录下定义好不同环境的 env 文件

-   env/development.env 开发环境
-   env/production:rc.env 预正式环境
-   env/production.env 正式环境
-   env/test.env 测试环境

2. 通过 script 注入相应的 NODE_ENV

```bash
NODE_ENV=test electron ./dist/main.js
```

3. 使用 dotenv 根据 NODE_ENV 加载相应的 env 文件

```javascript
// main.js
enum AppEnv {
    DEV = 'development',
    TEST = 'test',
    RC = 'production:rc',
    PROD = 'production',
}
const env = process.env.NODE_ENV as AppEnv;

function configEnv() {
    const envs = Object.values(AppEnv);
    const isVaildEnv = env && envs.includes(env);
    const currEnv = env ? (isVaildEnv ? env : AppEnv.PROD) : AppEnv.DEV;
    console.log('current env:', currEnv, isVaildEnv);
    // 先构造出.env*文件的绝对路径
    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = (relativePath: string) =>
        path.resolve(appDirectory, relativePath);
    const pathsDotenv = resolveApp(`env/${currEnv}.env`);

    dotEnv.config({ path: `${pathsDotenv}` }); // 加载相应的env文件
}
configEnv();
```

dotEnv.config 可以加载 env 中的环境变量， 比如加载的是`env/test.env`

```
// env/test.env
APP_NAME=electron_app
```

则在应用中可以使用`process.env.APP_NAME`获取到环境变量`APP_NAME`

```javascript
console.log(process.env.APP_NAME); // 输出：electron_app
```

## 配置 alias

由于使用 typescript 编译后无法正常解析 alias，所以引用 ttypescript + typescript-transform-paths 来解决这个问题，如引用 src/utils 中的方法可直接 import { ... } from '@/util'，配置如下

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
      "@/*": ["src/*"],
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
import { ... } from '@/util'
```

## Logger

使用[bunyan](https://www.npmjs.com/package/bunyan)进行日志收集
日志保存在`path.join(Globals.LOG_PATH, Globals.LOG_NAME)`，使用方法如下

```javascript
import { Logger } from './managers/LoggerManager';
Logger.info('hello');
```

## 打包

使用[electron-builder](https://www.electron.build/code-signing)进行打包

-   [electron-builder doc](https://www.electron.build)
-   [electron-builder github](https://github.com/electron-userland/electron-builder)


## 打包
1. 安装依赖
```bash
yarn add -D electron-builder
```

2. 配置`electron-builder`选项
有两种方法，一种是在`package.json`的build字段配置，一种是使用yml文件，为了可以根据不同的环境进行打包，本项目使用的是yml文件的方式
根目录下创建不同环境的yml文件，然后使用命令`electron-builder --config xxx.yml`就可以进行打包了

electron打包所有选项说明可以看[官方文档](https://www.electron.build/configuration/configuration#configuration)

配置文件：
- electron-builder-test.yml -> 测试环境打包配置文件
- electron-builder-rc.yml -> RC环境打包配置文件
- electron-builder-prod.yml -> 正式环境打包配置文件

打包文件说明：
打包前需要将渲染进程的输出文件拷贝到dist文件夹下，如本项目的渲染进程内容为"/renderer"，打包前需要将"/renderer"文件拷贝到dist中

"/bld" => 主进程ts编译后的输出文件
"/dist" => 渲染进程输出文件
"/release-builds" => 最终的输出文件


# TODOS
- 热重载(electron-reload)