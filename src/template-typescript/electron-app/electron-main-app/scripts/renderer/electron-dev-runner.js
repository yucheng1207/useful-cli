/**
 * 该文件用于启动渲染进程代码，需要将此文件拷贝到渲染进程的工程目录下，并配置下面的rendererConfig
 * refrence element-vue: https://simulatedgreg.gitbooks.io/electron-vue/content/cn/
 */
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// todo: 将该脚本拷贝到渲染进程时需要设置一下renderer的webpack.config
const rendererConfig = require('renderer-webpack-config-path');

function logStats(proc, data) {
    let log = '';

    log += chalk.yellow.bold(
        `┏ ${proc} Process ${new Array(19 - proc.length + 1).join('-')}`
    );
    log += '\n\n';

    if (typeof data === 'object') {
        data.toString({
            colors: true,
            chunks: false,
        })
            .split(/\r?\n/)
            .forEach((line) => {
                log += '  ' + line + '\n';
            });
    } else {
        log += `  ${data}\n`;
    }

    log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n';

    console.log(log);
}

function startRenderer(port = 3000) {
    return new Promise((resolve, reject) => {
        try {
            rendererConfig.mode = 'development';
            const compiler = webpack(rendererConfig);

            compiler.hooks.done.tap('done', (stats) => {
                logStats('Renderer', stats);
            });

            const server = new WebpackDevServer(compiler, {
                quiet: true,
                hot: true,
                before(app, ctx) {
                    // app.use(hotMiddleware)
                    ctx.middleware.waitUntilValid(() => {
                        resolve();
                    });
                },
            });

            server.listen(port);
        } catch (error) {
            reject(error);
        }
    });
}

function run() {
    const port = process.argv[2];
    logStats('Renderer', `Start with port ${port}`);
    startRenderer(port);
}

run();
