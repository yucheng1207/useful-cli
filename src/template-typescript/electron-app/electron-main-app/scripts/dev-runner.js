'use strict';
/**
 * refrence element-vue: https://simulatedgreg.gitbooks.io/electron-vue/content/cn/
 */
const chalk = require('chalk');
const electron = require('electron');
const { exec, spawn, fork } = require('child_process');
const { existsSync } = require('fs');
const webpack = require('webpack');
const { logStats, electronLog } = require('./common/utils');

const { paths } = require('./common/paths');
const mainConfig = require(paths.mainWebpackConfig);

let electronProcess = null;
let manualRestart = false;

async function startRenderer() {
    if (!existsSync) {
        logStats(
            'Renderer',
            chalk.red.bold(
                '无法找到正确的渲染进程启动脚本，请先将"scripts/renderer/electron-dev-runner.js拷贝到渲染进程目录下，并将paths.rendererDevRunnerPath指定为这个目录"'
            )
        );
        throw new Error('Renderer electron-dev-runner not found');
    }

    const useCmd = false;

    if (!useCmd) {
        // 方式一：使用fork执行渲染进程electron-dev-run脚本
        fork(paths.rendererDevRunnerPath, [paths.rendererPort], {
            cwd: paths.rendererSrc, // 子进程的执行工作目录
            stdio: 'inherit',
        });
    } else {
        // 方式二：使用命令行的方式运行渲染进程
        const rendererProcess = exec(
            `cd ${paths.rendererSrc} && yarn dev ${paths.rendererPort}`,
            (error, stdout, stderr) => {
                if (error) {
                    logStats('Renderer', chalk.red.bold(error));
                    return;
                }
                stdout && logStats('Renderer', chalk.white.bold(stdout));
                stderr && logStats('Renderer', chalk.red.bold(stderr));
            }
        );
        rendererProcess.stdout.on('data', (data) => {
            logStats('Renderer', chalk.white.bold(data));
        });
        rendererProcess.stderr.on('data', (data) => {
            logStats('Renderer', chalk.red.bold(data));
        });
    }
}

function startMain() {
    return new Promise((resolve, reject) => {
        mainConfig.mode = 'development';
        const compiler = webpack(mainConfig);

        compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
            logStats('Main', chalk.white.bold('compiling...'));
            done();
        });

        compiler.watch({}, (err, stats) => {
            if (err) {
                console.log(err);
                return;
            }

            logStats('Main', stats);

            if (electronProcess && electronProcess.kill) {
                manualRestart = true;
                process.kill(electronProcess.pid);
                electronProcess = null;
                startElectron();

                setTimeout(() => {
                    manualRestart = false;
                }, 5000);
            }

            resolve();
        });
    });
}

function startElectron() {
    let args = ['--inspect=5858', paths.mianDistEntry];

    // detect yarn or npm and process commandline args accordingly
    if (process.env.npm_execpath.endsWith('yarn.js')) {
        args = args.concat(process.argv.slice(3));
    } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args = args.concat(process.argv.slice(2));
    }

    electronProcess = spawn(electron, args);

    electronProcess.stdout.on('data', (data) => {
        electronLog(data, 'blue');
    });
    electronProcess.stderr.on('data', (data) => {
        electronLog(data, 'red');
    });

    electronProcess.on('close', () => {
        if (!manualRestart) process.exit();
    });
}

function init() {
    Promise.all([startRenderer(), startMain()])
        .then(() => {
            startElectron();
        })
        .catch((err) => {
            console.error(err);
        });
}

init();
