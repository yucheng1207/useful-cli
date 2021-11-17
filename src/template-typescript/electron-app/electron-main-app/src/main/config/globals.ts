import * as os from 'os'
import * as path from 'path';
export enum AppEnv {
    DEV = 'development',
    TEST = 'test',
    RC = 'production:rc',
    PROD = 'production',
}
const env = require("../env.js");
const tmpdir = os.tmpdir()
const appEnv = env.ENV as AppEnv
const isProd = appEnv === AppEnv.PROD || appEnv === AppEnv.RC
const htmlRelativePath = isProd ? path.join('file://', process.resourcesPath, '/app/dist/index.html') : path.join(__dirname, '../../../../dist/index.html')

console.log('appEnv', appEnv)

export const Globals = {
    APP_ENV: appEnv,
    IS_PROD: isProd,
    WEBVIEW_ROOT_URL: htmlRelativePath,
    LOG_PATH: path.join(tmpdir, env.LOG_FOLDER),
    LOG_NAME: 'app.log',
};
