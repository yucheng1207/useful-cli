const webpack = require('webpack');
const webpackConfig = require('../webpack.renderer.config');
webpack(webpackConfig, (err, stats) => {
    if (err) throw err;
    process.stdout.write(
        stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false,
        }) + '\n\n'
    );

    if (stats.hasErrors()) {
        // console.errpr(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
    }
});
