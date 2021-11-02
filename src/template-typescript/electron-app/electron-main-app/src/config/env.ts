import * as path from 'path';
import * as fs from 'fs';
import * as dotEnv from 'dotenv';

export enum AppEnv {
    DEV = 'development',
    TEST = 'test',
    RC = 'production:rc',
    PROD = 'production',
}
const env = process.env.NODE_ENV as AppEnv;

export const configEnv = (): void => {
    const envs = Object.values(AppEnv);
    const isVaildEnv = env && envs.includes(env);
    const currEnv = env ? (isVaildEnv ? env : AppEnv.PROD) : AppEnv.DEV;
    console.log('current env:', currEnv, isVaildEnv);
    // 先构造出.env*文件的绝对路径
    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = (relativePath: string) =>
        path.resolve(appDirectory, relativePath);
    const pathsDotenv = resolveApp(`env/${currEnv}.env`);

    dotEnv.config({ path: `${pathsDotenv}` }); // 加载.env
}

/**
 * 加载环境变量
 */
configEnv();
