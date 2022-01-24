'use strict';
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
    container: { ModuleFederationPlugin },
} = require('webpack');
const TarWebpackPlugin = require('tar-webpack-plugin').default;
// const WebpackRemoteTypesPlugin = require('webpack-remote-types-plugin').default;
const path = require('path');
const paths = require('./paths');
const mfcfg = require('./mfcfg');
const mfImportCfg = mfcfg.importConfig;
const mfExportCfg = mfcfg.exportConfig;

const DEV = paths.env === 'development';

module.exports = {
    context: __dirname,
    target: 'web',
    entry: {
        app: paths.entryPath(),
    },
    output: {
        path: paths.buildPath(),
        filename: '[name].js',
        publicPath: process.env.PUBLIC_URL || 'auto',
    },
    resolve: {
        alias: {
            src: paths.resolveApp('src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: DEV ? 'eval' : false,
    externals: {},
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
                    {
                        loader: 'dts-loader',
                        options: {
                            name: mfExportCfg.libName, // The name configured in ModuleFederationPlugin
                            exposes: mfExportCfg.exposes,
                            typesOutputDir: mfExportCfg.typesOutputDir, // Optional, default is '.wp_federation'
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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.publicPath(),
                    to: '.',
                    globOptions: {
                        dot: true,
                        gitignore: false,
                        ignore: ['**/index.html'],
                    },
                },
            ],
            options: {
                concurrency: 100,
            },
        }),
        /**
         * 配置 Module Federation 输出模块
         */
        new ModuleFederationPlugin({
            name: mfExportCfg.libName,
            filename: mfExportCfg.exportFileName,
            library: {
                type: 'var',
                name: mfExportCfg.libName,
            },
            exposes: mfExportCfg.exposes,
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: false,
                    version: false,
                },
            },
        }),
        new TarWebpackPlugin({
            action: 'c',
            gzip: true,
            cwd: paths.buildPath(),
            file: path.resolve(
                paths.buildPath(),
                `${mfExportCfg.libName}-ts.tgz`
            ),
            fileList: [mfExportCfg.libName],
            delSource: !DEV, // development 环境下不删除压缩源文件，因为在 hot-update 时，如果仅仅是 css 文件的更改，则不会触发 dts-loader 的编译，从而不会产生新的类型定义文件夹，而该 TarWebpackPlugin 又会执行，当找不到压缩文件夹时会报错 [Error: ENOENT: no such file or directory]
        }),
        /**
         * 配置 Module Federation 导入模块
         */
        // new ModuleFederationPlugin({
        //     remotes: mfImportCfg.remotes,
        //     shared: {
        //         react: {
        //             singleton: true,
        //             requiredVersion: false,
        //             version: false,
        //         },
        //     },
        // }),
        // new WebpackRemoteTypesPlugin({
        //     remotes: mfImportCfg.typeRemotes,
        //     outputDir: mfImportCfg.outputDir,
        //     remoteFileName: mfImportCfg.remoteFileName,
        // }),
    ],
};
