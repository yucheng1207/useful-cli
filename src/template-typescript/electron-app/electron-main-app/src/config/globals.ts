import * as os from 'os'
import * as path from 'path';
import { AppEnv } from './env';
import './env' // 确保使用configEnv被调用了，process.env才能拿到正确的值
const tmpdir = os.tmpdir()
const appEnv = process.env.NODE_ENV as AppEnv
const isProd = appEnv === AppEnv.PROD || appEnv === AppEnv.RC
const htmlRelativePath = isProd ? path.join('file://', process.resourcesPath, '/app/dist/index.html') : path.join(__dirname, '../../../dist/index.html')


export const Globals = {
    NODE_ENV: appEnv,
    WEBVIEW_ROOT_URL: htmlRelativePath,
    LOG_PATH: path.join(tmpdir, process.env.LOG_FOLDER),
    LOG_NAME: 'app.log',
};
