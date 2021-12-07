const gulp = require('gulp');
const chalk = require('chalk');
const OSSManager = require('../common/ossManager');
const { releaseToOss } = require('../common/utils.js');
const { paths } = require('../common/paths.js');
const ENV = process.env.NODE_ENV;
const VERSION = require(paths.mainPkgJson).version;
const LOCAL_PATH = paths.releaseBuilds;
// app最终部署的地址为`${ossConfig.baseUrl}${ossConfig.relativePath}`，要跟electron-builder.yml中的publish url一致
const ossConfig = {
    // TODO：设置`ossConfig`
    baseUrl: 'xxx',
    relativePath: `/demo/zyc/app/${ENV}`, // 如果需要保存历史版本可以多一级版本目录
    bucket: 'mesh-static',
    endpoint: 'xxx',
    salt: 'xxx',
};
const ossManager = new OSSManager({
    bucket: ossConfig.bucket,
    endpoint: ossConfig.endpoint,
    salt: ossConfig.salt,
});

async function publishApp() {
    try {
        await releaseToOss({
            ymlNames: ['latest-mac.yml', 'latest.yml'],
            currentVersion: VERSION,
            localPath: LOCAL_PATH,
            ossBaseUrl: ossConfig.baseUrl,
            ossRelativeUrl: ossConfig.relativePath,
            ossManager, // oss实例
            // skipVersionCheck: true,
        });
        console.log(`${chalk.bold(chalk.green('Publish Success'))}`);
    } catch (error) {
        process.exit(0);
    }
}

const pubilsh = gulp.series(publishApp);

module.exports = {
    pubilsh,
};
