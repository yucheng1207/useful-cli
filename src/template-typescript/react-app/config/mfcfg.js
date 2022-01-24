const paths = require('./paths');

/**
 * Module Federation输出模块配置，可以在这里添加本项目要输出的组件
 */
const exportConfig = {
    libName: 'useful', // The name configured in ModuleFederationPlugin
    exposes: {
        // // The exposes configured in ModuleFederationPlugin
        './UsefulButton':
            '../src/components/ModuleFederation/LocalExportButton/index.tsx',
    },
    typesOutputDir: paths.buildPath(), // Optional, default is '.wp_federation'
    exportFileName: 'remoteEntry.js',
};

function getRemoteEntryUrl(port) {
    return `//localhost:${port}/remoteEntry.js`;
}

/**
 * Module Federation输入模块配置，需要根据实际情况进行配置
 */
const importConfig = {
    remotes: {
        app2: `app2@${getRemoteEntryUrl(3002)}`,
    },
    typeRemotes: {
        app2: `app2@http:${getRemoteEntryUrl(3002)}`,
    },
    outputDir: 'src/types',
    remoteFileName: '[name]-ts.tgz', // default filename is [name]-dts.tgz where [name] is the remote name, for example, `app` with the above setup
};

module.exports = {
    exportConfig,
    importConfig,
};
