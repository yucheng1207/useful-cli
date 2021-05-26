#!/usr/bin/env node
const chalk = require('chalk');
const inquirer = require('inquirer');
const minimist = require('minimist');
const commander = require('commander');
const packageJson = require('../package.json');
const program = new commander.Command(packageJson.name);
const createWechatMiniprogram = require('./createWechatMiniprogram');

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
        create(appName, options);
    });

async function create(name, options) {
    console.log('createApp', name, options);
    const { appType } = await inquirer.prompt([
        {
            name: 'appType',
            type: 'list',
            message: `Please select the type of project you want to create:`,
            choices: [{ name: '微信小程序', value: 'wechat-miniprogram' }],
        },
    ]);
    switch (appType) {
        case 'wechat-miniprogram':
            createWechatMiniprogram(name, options);
            break;
        default:
            console.log(chalk.red('unknow app type'));
            break;
    }
}

program.parse(process.argv);
