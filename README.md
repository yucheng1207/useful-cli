# useful-cli

一个有用的前端脚手架，支持创建 `微信小程序` 项目。

> [掘金 blog](https://juejin.cn/post/6981631766406627364)

## 全局安装 useful-cli

```
    npm install useful-cli -g || yarn global add useful-cli
```

## 查看当前版本

```
    useful-cli -v
```

## 通过脚手架安装项目

```
    useful-cli create <app-name>
```

## useful-cli 依赖介绍

### [chalk](https://www.npmjs.com/package/chalk)

用于设置终端字符串样式，比如需要输出一段红色字符串

```
console.log(chalk.red(`This is a string of red strings`));
```

### [fs-extra](https://www.npmjs.com/package/fs-extra)

fs-extra 是 fs 的一个扩展，提供了非常多的便利 API，并且继承了 fs 所有方法和为 fs 方法添加了 promise 的支持

```
const fs = require('fs-extra')
// 同步写法
try {
  fs.copySync('/tmp/myfile', '/tmp/mynewfile')
  console.log('success!')
} catch (err) {
  console.error(err)
}
// 异步写法
async function copyFiles () {
  try {
    await fs.copy('/tmp/myfile', '/tmp/mynewfile')
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}
```

### [path](https://nodejs.org/docs/latest/api/path.html)

path 模块用于处理文件或目录路径

```
path.resolve([...paths])：方法将路径或路径片段的序列解析为绝对路径。
path.join([...paths])：方法使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。
path.resolve(__dirname)：返回被执行 js 文件的绝对路径
path.resolve(
    path.join(__dirname, 'template-typescript', 'wechatMiniprogram')
) // 返回被执行路径下的template-typescript/wechatMiniprogram的绝对路径
```

### [inquirer](https://www.npmjs.com/package/inquirer)

一组通用的交互式命令行用户界面。如下代码可在命令行中进行选择操作

```
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

```
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
```

### [commander](https://www.npmjs.com/package/commander)

完整的 node.js 命令行解决方案。可用于配置命令具体处理函数

```
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
