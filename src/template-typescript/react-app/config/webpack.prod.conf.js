'use strict';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const paths = require('./paths');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        path: paths.buildPath(),
        filename: 'static/js/[name].bundle.[fullhash].js',
        publicPath: process.env.PUBLIC_URL || 'auto',
    },
    plugins: [
        // ...baseWebpackConfig.plugins, // merge已经把baseWebpackConfig中的plugins加进来了，这里不需要再加了
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[fullhash].css',
            chunkFilename: 'static/css/[id].[contenthash].css',
        }),
    ],
    // 设置了optimization，如果使用ModuleFederation会报错，暂时注释掉
    // optimization: {
    // 	splitChunks: {
    // 		chunks: "all",
    // 		cacheGroups: {
    // 			defaultVendors: {
    // 				test: /[\\/]node_modules[\\/]/,
    // 				priority: -10,
    // 				reuseExistingChunk: true,
    // 				filename: "static/js/[name].[fullhash].js",
    // 				idHint: "vendors",
    // 			},
    // 			default: {
    // 				minChunks: 2,
    // 				priority: -20,
    // 				reuseExistingChunk: true,
    // 			},
    // 		},
    // 	},
    // },
});

module.exports = webpackConfig;
