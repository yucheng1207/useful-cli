'use strict'
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');
const path = require('path');
const { paths } = require('../../scripts/paths')

const isProd = process.env.NODE_ENV === 'production'
console.log('webpack.main.config.js NODE_ENV:', process.env.NODE_ENV)

const cfg_paths = {
  entry: paths.mainEntry,
  mainSrc: paths.mainSrc,
  dotEnv: path.resolve(paths.mainEnvConfig, `${process.env.NODE_ENV}.env`),
}

let mainConfig = {
  mode: isProd ? 'production' : 'development',
  entry: {
    main: cfg_paths.entry,
  },
  resolve: {
		alias: {
			'@': cfg_paths.mainSrc,
      '@main': cfg_paths.mainSrc,
		},
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
    ]
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    // path: path.join(__dirname, '../../dist/electron')
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
			path: cfg_paths.dotEnv,
		}),
  ],
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
// if (!isProd) {
//   mainConfig.plugins.push(
//   )
// }

/**
 * Adjust mainConfig for production settings
 */
// if (isProd) {
//   mainConfig.plugins.push(
//   )
// }

module.exports = mainConfig
