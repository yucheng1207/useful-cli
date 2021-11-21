const path = require('path');

const resolveApp = (p) => path.resolve(__dirname, '../..', p);

const paths = {
    dist: resolveApp('dist'), // 编译文件输出路径
    releaseBuilds: resolveApp('release-builds'), // 打包文件输出路径
    testYml: resolveApp('config/electron-builder/electron-builder-test.yml'),
    rcYml: resolveApp('config/electron-builder/electron-builder-rc.yml'),
    prodYml: resolveApp('config/electron-builder/electron-builder-prod.yml'),
    mainEntry: resolveApp('src/main/main.ts'),
    mainSrc: resolveApp('src/main'),
    mianDist: resolveApp('dist/main'), // 应用打包时主进程最终代码存放路径
    mianDistEntry: resolveApp('dist/main/main.js'),
    mainEnvConfig: resolveApp('config/main/env'),
    mainWebpackConfig: resolveApp('config/main/webpack.main.config'),
    rendererPort: 3000, // 渲染进程本地运行时的端口号
    rendererOutput: resolveApp('src/renderer/dist'), // 渲染进程打包后输出路径
    rendererDist: resolveApp('dist/renderer'), // 应用打包时渲染进程最终代码存放路径
    rendererSrc: resolveApp('src/renderer'),
    rendererDevRunnerPath: resolveApp(
        'src/renderer/scripts/electron-dev-runner'
    ), // 渲染进程electron-dev-runner存放路径
};

module.exports = {
    paths,
};
