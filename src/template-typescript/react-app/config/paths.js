const path = require('path');
const env = process.env.NODE_ENV || 'development';

const resolveApp = (p) => path.resolve(__dirname, '..', p);

module.exports = {
    env,
    port: 3000,
    resolveApp,
    entryPath: () => resolveApp('src/index.tsx'),
    buildPath: () => resolveApp('build'),
    htmlPath: () => resolveApp('public/index.html'),
    imagesPath: () => resolveApp('src/images'),
    publicPath: () => resolveApp('public'),
    envPath: () => resolveApp(`env/${env}.env`),
};
