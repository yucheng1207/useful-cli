'use strict';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const paths = require('./paths');

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devServer: {
        compress: true,
        historyApiFallback: true,
        hot: true,
        port: paths.port,
    },
    plugins: [
        ...baseWebpackConfig.plugins,
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
});

module.exports = devWebpackConfig;
