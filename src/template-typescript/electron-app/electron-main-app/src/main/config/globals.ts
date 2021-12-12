import * as os from 'os'
import * as path from 'path';
import { app } from 'electron';
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
const htmlPath = isDev ? `http://localhost:${env.RENDERER_PORT || 3000}` : path.join(__dirname, '../..', 'dist/renderer/index.html')
const logPath = path.join(tmpdir, env.LOG_FOLDER)
const logName = 'app.log'
const protocol = env.DEFAULT_PROTOCOL_CLIENT
console.log('主进程环境：', appEnv, process.env.NODE_ENV)
console.log('日志文件路径：', path.join(logPath, logName));
console.log('Webview路径：', htmlPath);
console.log('应用Deeplink协议', protocol)
console.log('userData:', app.getPath('userData'))
console.log('appData:', app.getPath('appData'))
console.log('cache:', app.getPath('cache'))
console.log('temp:', app.getPath('temp'))

export const Globals = {
	ENABLE_AUTO_UPDATE: false, // 是否开启自动更新功能, 开启前需要进行一些必要配置，具体可以看Readme中的”配置应用更新和热更新的 ali-oss 路径“小节
	DOWNLOAD_URL: '', // 最新软件下载地址，应用更新失败时提示用
	APP_ENV: appEnv, // 应用环境变量
	IS_DEV: isDev, // 是否是开发环境
	IS_PROD: isProd, // 是否是正式环境
	WEBVIEW_ROOT_URL: htmlPath, // 渲染进程路径
	LOG_PATH: logPath, // 日志文件所在路径
	LOG_NAME: logName, // 日志文件名称
	DEFAULT_PROTOCOL_CLIENT: protocol, // 应用Deeplink协议
};
