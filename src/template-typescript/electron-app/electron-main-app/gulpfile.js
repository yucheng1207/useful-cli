const gulp = require('gulp');
const { task, series } = gulp;

const packApp = require('./scripts/tasks/packApp');
const buildMain = require('./scripts/tasks/buildMain');
const buildRenderer = require('./scripts/tasks/buildRenderer');


task('build-main', buildMain.build);
task('build-renderer', buildRenderer.build);
task('build', series('build-main', 'build-renderer'));
task('clean-app', series(packApp.clean));
task('only-pack-win', series(packApp.packWin));
task('only-pack-mac', series(packApp.packMac));
task('only-pack-all', series(packApp.packMac, packApp.packWin));
task('pack-win', series('build', 'only-pack-win'));
task('pack-mac', series('build', 'only-pack-mac'));
task('pack-all', series('build', 'only-pack-win', 'only-pack-mac'));

