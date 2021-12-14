'use strict';
const baseWebpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const paths = require('./paths');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        path: paths.buildPath(),
        filename: 'static/js/[name].bundle.[fullhash].js',
        publicPath: process.env.PUBLIC_URL || '',
    },
    plugins: [
        ...baseWebpackConfig.plugins,
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[fullhash].css',
            chunkFilename: 'static/css/[id].[contenthash].css',
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    filename: 'static/js/[name].[fullhash].js',
                    idHint: 'vendors',
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
});

module.exports = webpackConfig;
