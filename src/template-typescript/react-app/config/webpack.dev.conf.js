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
        static: {
            directory: paths.buildPath(),
        },
        port: paths.port,
    },
    watchOptions: {
        ignored: ['../build/**', '../node_modules/**'],
    },
    plugins: [
        // ...baseWebpackConfig.plugins, // merge已经把baseWebpackConfig中的plugins加进来了，这里不需要再加了
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
});

module.exports = devWebpackConfig;
