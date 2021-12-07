const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const templateRoot = {
    reactApp: path.resolve(
        path.join(__dirname, 'template-typescript', 'react-app')
    ),
    vueApp: path.resolve(
        path.join(__dirname, 'template-typescript', 'vue3-app')
    ),
    viteVue3App: path.resolve(
        path.join(__dirname, 'template-typescript', 'vite-vue3-app')
    ),
    typescriptApp: path.resolve(
        path.join(__dirname, 'template-typescript', 'typescript-app')
    ),
    wechatMiniprogram: path.resolve(
        path.join(__dirname, 'template-typescript', 'wechat-miniprogram')
    ),
    electronMainApp: path.resolve(
        path.join(
            __dirname,
            'template-typescript',
            'electron-app',
            'electron-main-app'
        )
    ),
    electronRenderApp: path.resolve(
        path.join(
            __dirname,
            'template-typescript',
            'electron-app',
            'electron-render-app'
        )
    ),
};

async function createProject(name, templateRoot) {
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
            process.exit(1);
        }
    } catch (error) {
        console.log(chalk.red(`Create ${name} failed:`, error));
        process.exit(1);
    }
}

async function createReactApp(name) {
    await createProject(name, templateRoot.reactApp);
}

async function createVue3App(name) {
    await createProject(name, templateRoot.vueApp);
}

async function createViteVue3App(name) {
    await createProject(name, templateRoot.viteVue3App);
}

async function createTypescriptApp(name) {
    await createProject(name, templateRoot.typescriptApp);
}

async function createWechatMiniprogram(name) {
    await createProject(name, templateRoot.wechatMiniprogram);
}

async function createElectronMainApp(name) {
    await createProject(name, templateRoot.electronMainApp);
}

module.exports = {
    createReactApp,
    createVue3App,
    createViteVue3App,
    createTypescriptApp,
    createWechatMiniprogram,
    createElectronMainApp,
};

// module.exports = (...args) => {
//     return create(...args).catch((err) => {
//         console.log(chalk.red('create wechat miniprogram failed:', err));
//         process.exit(1);
//     });
// };
