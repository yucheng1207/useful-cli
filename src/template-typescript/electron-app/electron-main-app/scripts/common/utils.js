const chalk = require('chalk');
const cp = require('child_process');

function execSync(cmd) {
    cp.execSync(cmd, { stdio: 'inherit' }); // 配置stdio: 'inherit'可将运行中的打印输出
}

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

function electronLog(data, color) {
    let log = '';
    data = data.toString().split(/\r?\n/);
    data.forEach((line) => {
        log += `  ${line}\n`;
    });
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color].bold('┏ Electron -------------------') +
                '\n\n' +
                log +
                chalk[color].bold('┗ ----------------------------') +
                '\n'
        );
    }
}

module.exports = {
    execSync,
    logStats,
    electronLog,
};
