// Reference: part of the configurations are from
// https://cesium.com/docs/tutorials/cesium-and-webpack/

'use strict';
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');

const DEV = paths.env === 'development';

module.exports = {
    context: __dirname,
    target: 'web',
    entry: {
        app: paths.entryPath(),
    },
    resolve: {
        alias: {
            src: paths.resolveApp('src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
        path: paths.buildPath(),
        filename: '[name].js',
        publicPath: process.env.PUBLIC_URL || '',
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: DEV ? 'eval' : false,
    externals: {},
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    filename: '[name].[fullhash].js',
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
                            transpileOnly: DEV ? false : true,
                            getCustomTransformers: () => ({
                                before: [
                                    tsImportPluginFactory({
                                        libraryName: 'antd',
                                        libraryDirectory: 'lib',
                                        style: 'css',
                                    }),
                                ],
                            }),
                        },
                    },
                ],
            },
            {
                test: /\.(png|gif|jpg|jpeg|xml|ico)$/,
                exclude: [/node_modules\/proj4/, /node_modules\/antd/],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[hash:7].[ext]',
                },
            },
            {
                test: /\.scss$/,
                exclude: [/node_modules/],
                oneOf: [
                    {
                        test: /\.module\.scss$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName:
                                            '[path][name]__[local]--[hash:base64:5]',
                                    },
                                    sourceMap: DEV,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: DEV,
                                },
                            },
                        ],
                    },
                    {
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: DEV,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: DEV,
                                },
                            },
                        ],
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: ['svg-react-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: paths.htmlPath(),
            inject: true,
            publicPath: process.env.PUBLIC_URL || '',
        }),
        new InterpolateHtmlPlugin({
            PUBLIC_URL: process.env.PUBLIC_URL || '',
        }),
        new Dotenv({
            path: paths.envPath(),
        }),
        // new CopyWebpackPlugin({
        //     patterns: [{ from: paths.publicPath(), to: '.' }],
        //     options: {
        //         concurrency: 100,
        //     },
        // }),
    ],
};
