import * as os from 'os'
import * as path from 'path';
import { AppEnv } from './env';
import './env' // 确保使用configEnv被调用了，process.env才能拿到正确的值
const tmpdir = os.tmpdir()

export const Globals = {
    NODE_ENV: process.env.NODE_ENV as AppEnv,
    LOG_PATH: path.join(tmpdir, process.env.LOG_FOLDER),
    LOG_NAME: 'app.log',
};
