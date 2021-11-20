const minimist = require('minimist');
const chalk = require('chalk');
const cp = require('child_process');

const envs = ['development', 'test', 'production:rc', 'production'];
const platforms = ['mac', 'win'];

const cmds = {
    cleanApp: 'gulp clean-app',
    buildRenderer: 'gulp build-renderer',
    buildMain: 'gulp build-main',
    packWin: 'gulp only-pack-win',
    packMac: 'gulp only-pack-mac'
}

const argv = minimist(process.argv.slice(2), {
    boolean: ['help', 'clean', 'compileRenderer', 'compileMain'],
    default: {
        help: false,
        clean: false,
        pack: false,
        compileRenderer: true,
        compileMain: true,
        env: 'test',
        platform: 'mac',
    },
    string: ['env', 'platform'],
});

function execSync(cmd) {
    cp.execSync(cmd, {stdio: 'inherit'}) // 配置stdio: 'inherit'可将运行中的打印输出
}

async function build(argv) {
    const { compileRenderer, compileMain, pack, env, platform } = argv;
    const isVaildEnv = envs.includes(env);
    const isVaildPlatform = platforms.includes(platform);

    if (!isVaildEnv) {
        throw new Error(`请输入正确的环境变量(${envs.join(',')})`);
    }
    if (!isVaildPlatform) {
        throw new Error(`请输入正确的打包平台(${platforms.join(',')})`);
    }

    // 编译渲染进程
    compileRenderer &&  execSync(`NODE_ENV=${env} ${cmds.buildRenderer}`);
    // 编译主进程
    compileMain && execSync(`NODE_ENV=${env} ${cmds.buildMain}`);
    // 打包
    pack && execSync(`NODE_ENV=${env} ${platform === 'win' ? cmds.packWin : cmds.packMac}`);

}

async function main() {
    const { help, clean } = argv;
    // console.log('argv', argv);
    try {
        if (help) {
            printHelp();
            return;
        }
        clean && execSync(cmds.cleanApp);

        build(argv);

    } catch (error) {
        console.log(chalk.red(error));
    }
}

function printHelp() {
    console.log('打包electron app的脚本，参数说明如下\n');
    console.log(`${chalk.green('--help')} - 打印帮助信息\n`);
    console.log(`${chalk.green('--clean')} - 清除上一次的打包文件，默认值为false\n`);
    console.log(`${chalk.green('--pack')} - 是否要执行打包， 默认值为false\n`);
    console.log(`${chalk.green('--compileRenderer')} - 是否编译渲染进程代码，默认值为true\n`);
    console.log(`${chalk.green('--compileMain')} - 是否编译主进程代码，默认值为true\n`);
    console.log(`${chalk.green('--env [env]')} - 打包编译的环境，可选值为【${chalk.blue(envs.join(','))}】，默认值为test\n`);
    console.log(
        `${chalk.green(
            '--platform [platform]'
        )} - 打包编译的平台，可选值为【${chalk.blue(platforms.join(','))}】，默认值为mac\n`
    );
}

main();
