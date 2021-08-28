'use strict';
const baseConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

module.exports = {
    ...baseConfig,
    devServer: {
        contentBase: paths.buildPath(),
        compress: true,
        historyApiFallback: true,
        hot: true,
        port: paths.port,
    },
    plugins: [
        ...baseConfig.plugins,
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
};
