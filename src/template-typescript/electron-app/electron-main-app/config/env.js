const path = require('path');
const fs = require('fs');
const dotEnv = require('dotenv');

// 先构造出.env*文件的绝对路径
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const pathsDotenv = resolveApp('env/development');

// 按优先级由高到低的顺序加载.env文件
dotEnv.config({ path: `${pathsDotenv}.local` }); // 加载.env.local
dotEnv.config({ path: `${pathsDotenv}.development` }); // 加载.env.development
dotEnv.config({ path: `${pathsDotenv}` }); // 加载.env

function configEnv() {
    console.log('current env', process.env.NODE_ENV);
    // 先构造出.env*文件的绝对路径
    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = (relativePath) =>
        path.resolve(appDirectory, relativePath);
    const pathsDotenv = resolveApp('env/development.env');
    console.log('pathsDotenv', pathsDotenv);

    // 按优先级由高到低的顺序加载.env文件
    // dotEnv.config({ path: `${pathsDotenv}.local` }); // 加载.env.local
    // dotEnv.config({ path: `${pathsDotenv}.development` }); // 加载.env.development
    dotEnv.config({ path: `${pathsDotenv}` }); // 加载.env
    console.log(process.env.NODE_ENV, process.env.APP_NAME);
}
configEnv();

module.exports = {
    configEnv,
};
