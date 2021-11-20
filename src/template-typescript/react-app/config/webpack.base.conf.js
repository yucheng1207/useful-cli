// Reference: part of the configurations are from
// https://cesium.com/docs/tutorials/cesium-and-webpack/

'use strict';
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const paths = require('./paths');

const DEV = paths.env === 'development';

module.exports = {
    context: __dirname,
    entry: DEV
        ? {
              app: [
                  'react-hot-loader/patch',
                  `webpack-dev-server/client?http://localhost:${paths.port}`,
                  paths.entryPath(),
              ],
          }
        : {
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
        filename: 'app.bundle.js',
        publicPath: process.env.PUBLIC_URL || '',
    },
    amd: {
        // toUrlUndefined: true,
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty',
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: DEV ? 'inline-eval-cheap-source-map' : 'source-map',

    externals: {},
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: true,
            cacheGroups: {
                vendors: {
                    enforce: true,
                    test: /node_modules/,
                    name: 'vendor',
                    filename: DEV ? '[name].bundle.js' : '[name].[hash].js',
                    priority: -10,
                },
            },
        },
    },

    module: {
        rules: [
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
                test: /\.svg$/,
                use: ['svg-react-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: paths.htmlPath(),
            inject: true,
        }),
        new InterpolateHtmlPlugin({
            PUBLIC_URL: process.env.PUBLIC_URL || '',
        }),
        new CopyWebpackPlugin([
            {
                from: paths.publicPath(),
                to: '.',
                writeToDisk: true,
            },
        ]),
        new Dotenv({
            path: paths.envPath(),
        }),
        new WriteFilePlugin(),
        // new AntdDayjsWebpackPlugin(), // 将antd中的moment替换成dayjs：https://ant.design/docs/react/replace-moment-cn#antd-dayjs-webpack-plugin
    ],
};
