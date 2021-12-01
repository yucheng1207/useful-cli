const gulp = require('gulp');
const webpack = require('webpack-stream');
const { existsSync, mkdirSync } = require('fs');
const { execSync } = require('../common/utils');
const { paths } = require('../common/paths.js');
const webpackConfig = require(paths.mainWebpackConfig);

async function cleanMain() {
    if (!existsSync(paths.dist)) {
        mkdirSync(paths.dist);
    }
    execSync(`rm -rf ${paths.mianDist}`);
}

function buildMain() {
    console.log('正在编译主进程文件...');
    return gulp
        .src(paths.mainEntry)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.mianDist))
        .on('end', function () {
            console.log('编译主进程文件成功');
        });
}

async function copyMainPkgJson() {
    execSync(`cp -rf ${paths.mainPkgJson} ${paths.mianDist}`);
}

const build = gulp.series(cleanMain, buildMain, copyMainPkgJson);

module.exports = {
    build,
};
