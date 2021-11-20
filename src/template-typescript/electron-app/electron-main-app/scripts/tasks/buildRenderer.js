const gulp = require('gulp');
const { execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const { paths } = require('../paths.js');

/**
 * 拷贝渲染进程编译后的文件
 */
async function buildRenderer() {
    console.log('正在拷贝渲染进程文件...');
    console.log('existsSync(paths.rendererDist)', existsSync(paths.rendererDist))
    if (!existsSync(paths.dist)) {
        mkdirSync(paths.dist)
    }
    execSync(`rm -rf ${paths.rendererDist} && cp -rf ${paths.renderer} ${paths.rendererDist}`);
    console.log('拷贝渲染进程文件成功');
}

module.exports = {
    build: buildRenderer
}