
const chalk = require('chalk');
const fs = require('fs-extra');

async function create(name, options) {
    console.log('create wechat miniprogram', name, options)
    // 如果不存在的话创建文件夹
    if (!fs.existsSync(name)) {
        fs.ensureDirSync(name);
        console.log(`Folder ${name} has been created.`);
        
    } else {
        console.log(chalk.red(`Folder ${name} is exist`));
        process.exit(1)
    }
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        console.log(chalk.red('create wechat miniprogram failed:', err))
        process.exit(1)
    })
}