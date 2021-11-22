const path = require('path');

const resolveApp = (p) => path.resolve(__dirname, '../..', p);

const paths = {
    dist: resolveApp('dist'), // 编译文件输出路径
    releaseBuilds: resolveApp('release-builds'), // 打包文件输出路径
    testYml: resolveApp('config/electron-builder/electron-builder-test.yml'), // electron-builder 测试环境配置文件
    rcYml: resolveApp('config/electron-builder/electron-builder-rc.yml'), // electron-builder rc环境配置文件
    prodYml: resolveApp('config/electron-builder/electron-builder-prod.yml'), // electron-builder 正式配置文件
    mainEntry: resolveApp('src/main/main.ts'), // 主进程入口文件，用于webpack编译
    mainSrc: resolveApp('src/main'), // 主进程代码目录， 用于webpack配置alias
    mianDist: resolveApp('dist/main'), // 主进程webpack编译后的输出路径，应用打包时将加载该目录下的代码作为主进程代码
    mianDistEntry: resolveApp('dist/main/main.js'), // 主进程编译后的入口文件，本地运行时electron会加载该文件作为应用入口文件
    mainEnvConfig: resolveApp('config/main/env'), // 主进程的环境变量文件， webpack打包时dotEnv会根据不同的环境加载相应的文件
    mainWebpackConfig: resolveApp('config/main/webpack.main.config'), // 主进程webpack config文件
    rendererPort: 3000, // 渲染进程本地运行时的端口号
    rendererOutput: resolveApp('src/renderer/dist'), // 渲染进程webpack打包后输出路径， 需要根据具体的渲染进程进行配置
    rendererDist: resolveApp('dist/renderer'), // 渲染进程代码最终输出目录，编译过程中会将rendererOutput中的内容拷贝到该目录下作为应用打包时渲染进程代码
    rendererSrc: resolveApp('src/renderer'), // 渲染进程代码目录，在编译过程中会将该目录作为编译渲染进程的工作目录
    rendererDevRunnerPath: resolveApp(
        'src/renderer/scripts/electron-dev-runner'
    ), // 渲染进程本地开发启动脚本【electron-dev-runner】存放路径
};

module.exports = {
    paths,
};
