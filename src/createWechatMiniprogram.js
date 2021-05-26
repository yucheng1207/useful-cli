
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const templateRoot = path.resolve('src/template-typescript/wechatMiniprogram');

async function create(name, options) {
    const root = path.resolve(name);
    try {
        // 如果不存在的话创建文件夹
        if (!fs.existsSync(name)) {
            fs.ensureDirSync(name);
            console.log(`Folder ${name} has been created.`);
            console.log(`Copying...`);
            fs.copySync(templateRoot, root);
            console.log(`Done.`);
        } else {
            console.log(chalk.red(`Folder ${name} is exist`));
            process.exit(1)
        }
    } catch (error) {
        console.log(chalk.red(`Create miniprogram failed:`, error));
        process.exit(1)
    }

}

module.exports = (...args) => {
    return create(...args).catch(err => {
        console.log(chalk.red('create wechat miniprogram failed:', err))
        process.exit(1)
    })
}