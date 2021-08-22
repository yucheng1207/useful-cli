'use strict';
const path = require('path');
const URI = require('uri-js');

const baseConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    ...baseConfig,
    devServer: {
        contentBase: path.join(__dirname, '..', 'wwwroot/dist/'),
        compress: true,
        historyApiFallback: true,
        hot: true,
        port: 3000,
        proxy: {
            '*': {
                bypass: (req, res, proxyOptions) => {
                    const reqObj = URI.parse(req.url);
                    if (
                        reqObj.path.endsWith('/auth') &&
                        req.query &&
                        req.query.code
                    ) {
                        req.headers.accept = 'text/html';
                    }
                    return req.url;
                },
            },
        },
        headers: {
            'Access-Control-Allow-Origin': 'http://test.account.meshkit.cn',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
            'Access-Control-Allow-Headers':
                'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Request-Headers, Content-Type, Accept, x-mesh-access-token',
        },
    },
    plugins: [
        ...baseConfig.plugins,
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
};
