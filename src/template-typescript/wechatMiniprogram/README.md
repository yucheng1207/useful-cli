# Introduction

小程序原生开发模板，集成了以下功能：

-   国际化
-   支持 typescript

# Getting Started

## 开发参考文档：

-   [小程序官网](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html)
-   [小程序开发指南](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0008aeea9a8978ab0086a685851c0a)

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
