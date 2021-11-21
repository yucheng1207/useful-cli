
const path = require('path');

const paths = {
    dist: path.join(__dirname, '..', 'dist'),
    releaseBuilds: path.join(__dirname, '..', 'release-builds'),
    testYml: path.join(__dirname, '..', 'config/electron-builder', 'electron-builder-test.yml'),
    rcYml: path.join(__dirname, '..', 'config/electron-builder', 'electron-builder-rc.yml'),
    prodYml: path.join(__dirname, '..', 'config/electron-builder', 'electron-builder-prod.yml'),
    mainEntry: path.join(__dirname, '..', 'src/main/main.ts'),
    mainSrc: path.join(__dirname, '..', 'src/main'),
    mianDist: path.join(__dirname, '..', 'dist/main'),
    mianDistEntry: path.join(__dirname, '..', 'dist/main/main.js'),
    mainEnvConfig: path.resolve(__dirname, '..', `config/main/env`),
    mainWebpackConfig: path.join(__dirname, '..', 'config/main/webpack.main.config'),
    renderer: path.join(__dirname, '..', 'src/renderer'),
    rendererDist: path.join(__dirname, '..', 'dist/renderer'),
    rendererDevRunnerPath: path.join(__dirname, '..', 'src/renderer-react/scripts/electron-dev-runner'), // 渲染进程electron-dev-runner存放路径
};

module.exports = {
    paths
}