'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { paths } = require('../../scripts/common/paths');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
console.log('webpack.renderer.config.js NODE_ENV:', env, process.env.NODE_ENV);

const cfg_paths = {
    entry: path.resolve(__dirname, 'index.ts'),
    htmlPath: path.resolve(__dirname, 'index.html'),
    output: paths.rendererOutput, // path.resolve(__dirname, 'dist'),
};

let rendererConfig = {
    devtool: 'cheap-module-source-map', // [解决报错](https://www.thinbug.com/q/48047150)： Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".
    mode: isProd ? 'production' : 'development',
    entry: {
        renderer: cfg_paths.entry,
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            silent: true,
                            transpileOnly: isProd ? true : false,
                        },
                    },
                ],
            },
        ],
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: cfg_paths.output,
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: cfg_paths.htmlPath,
            inject: true,
        }),
    ],
    target: 'electron-renderer',
};

module.exports = rendererConfig;
