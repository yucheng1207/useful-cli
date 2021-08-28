const path = require('path');

const resolveApp = (p) => path.resolve(__dirname, '..', p);

module.exports = {
    port: 3000,
    resolveApp,
    entryPath: () => resolveApp('src/boot-client.tsx'),
    buildPath: () => resolveApp('build'),
    htmlPath: () => resolveApp('public/index.html'),
    imagesPath: () => resolveApp('src/images'),
    publicPath: () => resolveApp('public'),
    envPath: () => resolveApp(`env/${process.env.NODE_ENV}.env`),
};
