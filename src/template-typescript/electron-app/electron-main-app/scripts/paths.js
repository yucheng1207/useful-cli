
const path = require('path');

const paths = {
    mainEntry: path.join(__dirname, '..', 'src/main/main.ts'),
    mainSrc: path.join(__dirname, '..', 'src/main'),
    mianDist: path.join(__dirname, '..', 'dist/main'),
    mainEnvConfig: path.resolve(__dirname, '..', `config/main/env`),
    mainWebpackConfig: path.join(__dirname, '..', 'config/main/webpack.main.config'),
    envConfig: path.join(__dirname, '..', 'src/main/config/env'),
    envPath: path.join(__dirname, '..', 'src/main/env.js'),
    testYml: path.join(__dirname, '..', 'config/electron-builder', 'electron-builder-test.yml'),
    rcYml: path.join(__dirname, '..', 'config/electron-builder', 'electron-builder-rc.yml'),
    prodYml: path.join(__dirname, '..', 'config/electron-builder', 'electron-builder-prod.yml'),
    renderer: path.join(__dirname, '..', 'src/renderer'),
    rendererDist: path.join(__dirname, '..', 'dist/renderer'),
    dist: path.join(__dirname, '..', 'dist'),
    releaseBuilds: path.join(__dirname, '..', 'release-builds'),
};

module.exports = {
    paths
}