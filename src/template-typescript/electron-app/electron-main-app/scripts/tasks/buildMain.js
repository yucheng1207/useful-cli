const gulp = require('gulp');
const webpack = require('webpack-stream');
const { execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const { paths } = require('../paths.js');
const webpackConfig = require(paths.mainWebpackConfig)

async function cleanMain() {
    if (!existsSync(paths.dist)) {
        mkdirSync(paths.dist)
    }
    execSync(`rm -rf ${paths.mianDist}`);
}

function buildMain() {
    console.log('正在编译主进程文件...');
    return gulp.src(paths.mainEntry)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.mianDist))
        .on('end', function() {
            console.log('编译主进程文件成功');
        });
}

const build = gulp.series(cleanMain, buildMain)

module.exports = {
    build
}