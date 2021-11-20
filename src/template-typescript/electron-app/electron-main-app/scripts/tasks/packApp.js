const gulp = require('gulp');
const chalk = require('chalk');
const { execSync } = require('child_process');
const builder = require('electron-builder');
const { paths } = require('../paths');

const envs = ['test', 'production:rc', 'production'];
const platforms = ['mac', 'win'];
const buildEnv = process.env.NODE_ENV

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

async function clean() {
    console.log('正在删除上一次打包文件...');
    execSync(
        `rm -rf ${paths.dist} ${paths.releaseBuilds}`
    );
    console.log('删除成功');
}

async function packApp(params) {
    const { env, platform } = params;
    const isVaildEnv = envs.includes(env);
    const isVaildPlatform = platforms.includes(platform);

    if (!isVaildEnv) {
        throw new Error(`请输入正确的环境变量(${envs.join(',')})`);
    }
    if (!isVaildPlatform) {
        throw new Error(`请输入正确的打包平台(${platforms.join(',')})`);
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

async function packWin() {
    await packApp({ env: buildEnv, platform: 'win' })
}

async function packMac() {
    await packApp({ env: buildEnv, platform: 'mac' })
}

module.exports = {
    clean,
    packWin,
    packMac,
}
