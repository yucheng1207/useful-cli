const minimist = require('minimist');
const chalk = require('chalk');
const { execSync } = require('child_process');
const path = require('path');
const builder = require('electron-builder');

const envs = ['test', 'production:rc', 'production'];
const platforms = ['mac', 'win'];

const paths = {
    mianDist: path.join(__dirname, '..', 'bld'),
    renderer: path.join(__dirname, '..', 'renderer'),
    rendererDist: path.join(__dirname, '..', 'dist'),
    releaseBuilds: path.join(__dirname, '..', 'release-builds'),
    envConfig: path.join(__dirname, '..', 'env'),
    envPath: path.join(__dirname, '..', 'src', 'env.js'),
    testYml: path.join(__dirname, '..', 'electron-builder-test.yml'),
    rcYml: path.join(__dirname, '..', 'electron-builder-rc.yml'),
    prodYml: path.join(__dirname, '..', 'electron-builder-prod.yml'),
};

const argv = minimist(process.argv.slice(2), {
    boolean: ['help', 'clean', 'compileRenderer', 'compileMain'],
    default: {
        help: false,
        clean: false,
        compileRenderer: true,
        compileMain: true,
        env: 'test',
        platform: 'mac',
    },
    string: ['env', 'platform'],
});

function cleanBuild() {
    console.log('正在删除上一次打包文件...');
    execSync(
        `rm -rf ${paths.mianDist} ${paths.rendererDist} ${paths.releaseBuilds}`
    );
    console.log('删除成功');
}

function copyEnv(env) {
  const envConfig = path.join(paths.envConfig, `${env}.env.js`)
  execSync(
    `cp -r ${envConfig} ${paths.envPath}`
  );
}

function buildRenderer() {
    execSync(
        `rm -rf ${paths.rendererDist} && cp -r ${paths.renderer} ${paths.rendererDist}`
    );
}

function buildMain() {
    execSync(`npm run tsc`);
}

function getYmlPath(env) {
    switch (env) {
        case 'test':
            return paths.testYml;
        case 'production:rc':
            return paths.rcYml;
        case 'production':
            return paths.prodYml;
        default:
            return paths.prodYml;
    }
}

function getPlatformTargets(platform) {
    switch (platform) {
        case 'mac':
            return builder.Platform.MAC.createTarget();
        case 'win':
            return builder.Platform.WINDOWS.createTarget();
        case 'linux':
            return builder.Platform.LINUX.createTarget();
        default:
            return builder.Platform.MAC.createTarget();
    }
}

async function build(argv) {
  const { compileRenderer, compileMain, env, platform } = argv;
    const isVaildEnv = envs.includes(env);
    const isVaildPlatform = platforms.includes(platform);

    if (!isVaildEnv) {
        throw new Error(`请输入正确的环境变量(${envs.join(',')})`);
    }
    if (!isVaildPlatform) {
        throw new Error(`请输入正确的打包平台(${platforms.join(',')})`);
    }

    copyEnv(env);

    if (compileRenderer) {
      console.log('正在拷贝渲染进程文件...');
      buildRenderer();
      console.log('拷贝渲染进程文件成功');
    }

    if (compileMain) {
      console.log('正在编译主进程文件...');
      buildMain();
      console.log('编译主进程文件成功');
    }


    console.log(
        `开始打包，打包环境为${chalk.blue(env)}, 打包平台为${chalk.blue(
            platform
        )}`
    );
    // execSync(`electron-builder --mac --config electron-builder-test.yml`)
    // execSync(`electron-builder --x64 --win --config electron-builder-test.yml`)
    // 参考：https://www.electron.build/#programmatic-usage
    await builder.build({
        targets: getPlatformTargets(platform),
        config: getYmlPath(env),
    });
    console.log('打包完成');
}

async function main() {
    const { help, clean } = argv;
    // console.log('argv', argv);
    try {
        if (help) {
            printHelp();
            return;
        }
        if (clean) {
            cleanBuild();
        }

        build(argv);

    } catch (error) {
        console.log(chalk.red(error));
    }
}

function printHelp() {
    console.log('打包electron app的脚本，参数说明如下\n');
    console.log(`${chalk.green('--help')} - 打印帮助信息\n`);
    console.log(`${chalk.green('--clean')} - 清除上一次的打包文件\n`);
    console.log(`${chalk.green('--compileRenderer')} - 是否编译渲染进程代码\n`);
    console.log(`${chalk.green('--compileMain')} - 是否编译主进程代码\n`);
    console.log(
        `${chalk.green('--env [env]')} - 打包编译的环境，可选值为${chalk.blue(
            envs.join(',')
        )}\n`
    );
    console.log(
        `${chalk.green(
            '--platform [platform]'
        )} - 打包编译的平台，可选值为${chalk.blue(platforms.join(','))}\n`
    );
}

main();
