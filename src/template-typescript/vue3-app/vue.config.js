// eslint-disable-next-line @typescript-eslint/no-var-requires
const Components = require('unplugin-vue-components/webpack');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
    configureWebpack: {
        plugins: [
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    },
};
