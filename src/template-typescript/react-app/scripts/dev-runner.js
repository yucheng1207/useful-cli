const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const rendererConfig = require('../config/webpack.dev.conf');

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

function startRenderer() {
    return new Promise((resolve, reject) => {
        try {
            const compiler = webpack(rendererConfig);

            compiler.hooks.done.tap('done', (stats) => {
                logStats('Renderer', stats);
            });

            const server = new WebpackDevServer(
                {
                    ...rendererConfig.devServer,
                },
                compiler
            );
            server.startCallback(() => {
                console.log(
                    `Starting server on http://localhost:${rendererConfig.devServer.port}`
                );
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

function run() {
    startRenderer();
}

run();
