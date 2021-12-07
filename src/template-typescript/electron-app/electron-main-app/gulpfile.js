const gulp = require('gulp');
const { task, series } = gulp;

const packApp = require('./scripts/tasks/packApp');
const buildMain = require('./scripts/tasks/buildMain');
const buildRenderer = require('./scripts/tasks/buildRenderer');
const publishApp = require('./scripts/tasks/publishApp');
const publishRenderer = require('./scripts/tasks/publishRenderer');

task('build-main', buildMain.build); // 编译主进程代码
task('build-renderer', buildRenderer.build); // 编译渲染进程代码
task('build', series('build-main', 'build-renderer'));
task('clean-app', series(packApp.clean)); // 清除编译和打包文件
task('only-pack-win', series(packApp.packWin));
task('only-pack-mac', series(packApp.packMac));
task('only-pack-all', series(packApp.packMac, packApp.packWin));
task('pack-win', series('build', 'only-pack-win'));
task('pack-mac', series('build', 'only-pack-mac'));
task('pack-all', series('build', 'only-pack-win', 'only-pack-mac'));
task('only-publish-app', series(publishApp.pubilsh)); // 发布应用，该命令会将打包内容上传到oss，所以执行该命令前要确保已经打包完成
task('publish-app', series('pack-all', publishApp.pubilsh)); // 打包并发布应用
task('only-publish-renderer', series(publishRenderer.pubilsh)); // 发布热更新，该命令会将渲染进程编译后的文件上传到oss，所以执行该命令前要确保渲染进程编译完成
task('publish-renderer', series('build-renderer', publishRenderer.pubilsh)); // 编译并发布热更新
