const gulp = require('gulp');
const chalk = require('chalk');
const { existsSync } = require('fs');
const OSSManager = require('../common/ossManager');
const { releaseToOss, createZip, createYml } = require('../common/utils.js');
const { paths } = require('../common/paths.js');
const pkg = require(paths.rendererPkgJson);
const ENV = process.env.NODE_ENV;
const BUILD_PATH = paths.rendererDist;
const RELEASE_PATH = paths.rendererRelease;
const ZIP_NAME = 'dist.zip';
const YML_NAME = 'latest.yml';
// renderer最终部署的地址为`${ossConfig.baseUrl}${ossConfig.relativePath}`，要跟热更新中获取补丁的地址一致
const ossConfig = {
    // TODO：设置`ossConfig`
    baseUrl: 'xxx',
    relativePath: `/demo/zyc/renderer/${ENV}`, // 如果需要保存历史版本可以多一级版本目录
    bucket: 'mesh-static',
    endpoint: 'xxx',
    salt: 'xxx',
};
const ossManager = new OSSManager({
    bucket: ossConfig.bucket,
    endpoint: ossConfig.endpoint,
    salt: ossConfig.salt,
});

async function publishRenderer() {
    try {
        await releaseToOss({
            ymlNames: [YML_NAME],
            currentVersion: pkg.version,
            localPath: RELEASE_PATH,
            ossBaseUrl: ossConfig.baseUrl,
            ossRelativeUrl: ossConfig.relativePath,
            ossManager,
            // skipVersionCheck: true,
        });
        console.log(`${chalk.bold(chalk.green('Publish Success'))}`);
    } catch (error) {
        console.log(`${chalk.red(error)}\n`);
        process.exit(0);
    }
}

async function packRenderer() {
    try {
        if (!existsSync(BUILD_PATH)) {
            console.log(`${chalk.red('Need to build webviews first')}\n`);
            process.exit(1);
        } else {
            const appRelease = pkg.appRelease;
            const version = pkg.version;
            const appMinVersion = appRelease && appRelease.appMinVersion;
            const appMaxVersion = appRelease && appRelease.appMaxVersion;
            const title = (appRelease && appRelease.title) || '';
            const description = (appRelease && appRelease.description) || '';
            // 默认设置成预发布(pre-release)版本， 后期产品经理补上描述后改为发布版本
            const release =
                appRelease && appRelease.release !== undefined
                    ? appRelease.release
                    : false;
            console.log(
                `${chalk.blue(
                    'Supported version'
                )} of the main process: ${appMinVersion} - ${appMaxVersion}`
            );
            console.log(
                `${chalk.blue('Deploy version')}:${version} release:${release}`
            );
            console.log(`${chalk.blue('Deploy description')}: ${description}`);

            const sha512 = await createZip(ZIP_NAME, BUILD_PATH, RELEASE_PATH);
            const ymlContent = {
                title,
                description,
                version: version, // 当前渲染进程版本号
                appMinVersion, // 兼容主进程的最小版本号
                appMaxVersion, // 兼容主进程的最大版本号
                files: [
                    {
                        url: ZIP_NAME,
                        sha512: sha512.toString(),
                    },
                ],
                sha512: sha512.toString(), // sha512
                releaseDate: new Date().getTime().toString(),
            };
            await createYml(YML_NAME, RELEASE_PATH, ymlContent);
        }
    } catch (error) {
        console.log(`${chalk.red('Error when release webview')}`);
        console.log(`${chalk.red(error)}\n`);
        process.exit(1);
    }
}

const pubilsh = gulp.series(packRenderer, publishRenderer);

module.exports = {
    pubilsh,
};
