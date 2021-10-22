#!/usr/bin/env node
const chalk = require('chalk');
const inquirer = require('inquirer');
const minimist = require('minimist');
const commander = require('commander');
const packageJson = require('../package.json');
const program = new commander.Command(packageJson.name);
const create = require('./create');
const {
    createWechatMiniprogram,
    createReactApp,
    createVue3App,
    createViteVue3App,
    createTypescriptApp,
} = create;

program
    .version(packageJson.version, '-v, --version')
    .usage(`create ${chalk.green('<app-name>')}`);

program
    .command('create <app-name>')
    .description(`Use ${chalk.green('useful-cli')} to create a new project`, {
        'app-name': 'project name',
    })
    .action((appName, options) => {
        if (minimist(process.argv.slice(3))._.length > 1) {
            console.log(
                chalk.yellow(
                    "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
                )
            );
        }
        createApp(appName, options);
    });

async function createApp(name, options) {
    console.log('createApp', name, options);
    const { appType } = await inquirer.prompt([
        {
            name: 'appType',
            type: 'list',
            message: `Please select the type of project you want to create:`,
            choices: [
                { name: '微信小程序', value: 'wechat-miniprogram' },
                { name: 'react-ts', value: 'react-ts' },
                { name: 'vue3-ts(vite)', value: 'vite-vue3-ts' },
                { name: 'vue3-ts(vue-cli)', value: 'vue3-ts' },
                { name: 'typescript-app', value: 'typescript-app' },
            ],
        },
    ]);
    switch (appType) {
        case 'wechat-miniprogram':
            createWechatMiniprogram(name, options);
            break;
        case 'react-ts':
            createReactApp(name, options);
            break;
        case 'vue3-ts':
            createVue3App(name, options);
            break;
        case 'vite-vue3-ts':
            createViteVue3App(name, options);
            break;
        case 'typescript-app':
            createTypescriptApp(name, options);
            break;
        default:
            console.log(chalk.red('unknow app type'));
            break;
    }
}

program.parse(process.argv);
