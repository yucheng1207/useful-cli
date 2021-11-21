import * as os from 'os'
import * as path from 'path';
export enum AppEnv {
    DEV = 'development',
    TEST = 'test',
    RC = 'production:rc',
    PROD = 'production',
}
const env = process.env;
const tmpdir = os.tmpdir()
const appEnv = env.ENV as AppEnv
const isDev = appEnv === AppEnv.DEV
const isProd = appEnv === AppEnv.PROD || appEnv === AppEnv.RC
// const htmlInPackagePath = path.join(process.resourcesPath, '/app/dist/renderer/index.html') // 打包asar为false时有效
const htmlPath = isDev ? 'http://localhost:3000' : path.join(__dirname, '../..', 'dist/renderer/index.html')
const logPath = path.join(tmpdir, env.LOG_FOLDER)
const logName = 'app.log'
console.log('主进程环境：', appEnv, process.env.NODE_ENV)
console.log('日志文件路径：', path.join(logPath, logName));
console.log('Webview路径：', htmlPath);

export const Globals = {
    APP_ENV: appEnv,
    IS_DEV: isDev,
    IS_PROD: isProd,
    WEBVIEW_ROOT_URL: htmlPath,
    LOG_PATH: logPath,
    LOG_NAME: logName
};
