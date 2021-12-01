import { BrowserWindow, App, MessageBoxOptions } from 'electron';
import { autoUpdater, UpdateInfo } from "electron-updater";
import * as path from 'path'
import HotUpdater, { UpdateEvent, ErrorType } from './HotUpdater'
import { ReleaseInfo, AppType } from '../updater/GenericRelease'
import DialogManager, { HotUpdateDialogType } from '../managers/DialogManager'
import { Logger } from '../managers/LoggerManager/index';
import { Globals } from '../config/globals';


const pkg = require('../../../package.json');

const appFolderPath = path.join(process.resourcesPath, "/app")
const downloadCachePath = path.join(appFolderPath, 'dist/download')
const rendererRemoteYmlAssetName = 'latest.yml' // 渲染进程部署时上传到oss的yml名称
const rendererRemoteZipAssetName = 'dist.zip'   // 渲染进程部署时上传到oss的zip名称
export const autoupdateConfig = {
	appVersion: pkg.version,
	appFolderPath,
	mainPath: path.join(appFolderPath, 'dist/main'),
	rendererPath: path.join(appFolderPath, 'dist/renderer'),
	rendererHtmlPath: path.join(appFolderPath, 'dist/renderer/index.html'),
	rendererBakPath: path.join(appFolderPath, 'dist/renderer_bak'),
	rendererRemoteYmlAssetName,
	rendererRemoteZipAssetName,
	rendererYmlLocalCache: path.join(downloadCachePath, rendererRemoteYmlAssetName),
	rendererZipLocalCache: path.join(downloadCachePath, rendererRemoteZipAssetName),
	rendererPackageJson: path.join(appFolderPath, 'dist/renderer', 'package.json'),
	hotUpdateDatastorePath: path.join(appFolderPath, 'dist', 'hot_update_record.db'),
}

Logger.info('Auto update config');
Logger.info(autoupdateConfig);

export default class AutoUpdater {
	private static _instance: AutoUpdater;

	private mainWindow: BrowserWindow;

	private app: App;

	private updateInfo: UpdateInfo;

	private hotUpdater: HotUpdater;

	public static getInstance(): AutoUpdater {
		if (!this._instance) {
			this._instance = new AutoUpdater();
		}

		return this._instance;
	}

	constructor() {
		this.hotUpdater = HotUpdater.getInstance()
	}

	public init(win: BrowserWindow, app: App): void {
		this.mainWindow = win;
		this.app = app;
		this.hotUpdater.init(win);
	}

	/**
	 * 检查是否有应用更新
	 */
	public checkUpdate(): void {
		if (Globals.IS_DEV) {
			return
		}

		if (this.mainWindow && this.app) {
			try {
				autoUpdater.autoInstallOnAppQuit = false;

				autoUpdater.checkForUpdates();

				autoUpdater.on('error', error => {
					Logger.error("Application Update Error");
					Logger.error(error);
					console.error('Application Update Error', error);
				})

				autoUpdater.on('update-available', (info: UpdateInfo) => {
					Logger.info("Application Update Available");
					Logger.info(info);
					this.updateInfo = info;
				})

				autoUpdater.on('download-progress', (progressObj) => {
					Logger.info("Application Download in progress");
					Logger.info(progressObj);
				})

				autoUpdater.on('update-not-available', () => {
					Logger.info("Application Update NOT Available");
					// 不需要应用更新，检查是否有热更新
					this.checkHotUpdate();
				})

				autoUpdater.on('update-downloaded', async (info: any) => {
					Logger.info("Application Update Downloaded");
					Logger.info(info);

					const option: MessageBoxOptions = {
						title: '安装更新',
						type: 'info',
						message: `${this.updateInfo.version}${'版本下载完毕，程序将重启以完成更新'}`,
						detail: this.updateInfo.releaseDate, //release description
						defaultId: 0,
						buttons: ['立即更新', '稍后更新'],
					}
					const { response } = await DialogManager.getInstance().showMessageBox({ ...option, modal: true })
					if (response === 0) {
						setImmediate(() => autoUpdater.quitAndInstall())
					}
				})
			}
			catch (err) {
				Logger.error("autoUpdater config failed: " + err);
			}
		}
		else {
			throw new Error('checkUpdate should only be called after init has been called')
		}
	}

	public async beforeHotUpdateCheck(): Promise<void> {
		await this.hotUpdater.beforeCheck()
	}

	/**
	 * 检查是否有热更新
	 */
	public checkHotUpdate(): void {
		this.hotUpdater.checkForUpdates();

		this.hotUpdater.on(UpdateEvent.ERROR, (errorType: ErrorType, err?: any) => {
			// print Error: http://www.fly63.com/article/detial/5371?type=2
			const sendError = err ? { error: JSON.stringify(err, Object.getOwnPropertyNames(err), 2), updateErrorType: errorType } : { updateErrorType: errorType }
			Logger.error("Hot Update Error")
			Logger.error(sendError)
			console.log('Hot Update Error')

			switch (errorType) {
				case ErrorType.CHECK_UPDATE_ERROR:
					break;
				case ErrorType.RELEASE_ASSERT_INCOMPLETE:
					break;
				case ErrorType.BUNDLE_ZIP_DAMAGED:
					break;
				case ErrorType.BUNDLE_ZIP_DOWNLOAD_ERROR:
					break;
				case ErrorType.BACKUP_ERROR:
					DialogManager.getInstance().updateHotUpdateDialog(HotUpdateDialogType.FAIL)
					break;
				case ErrorType.RESTORE_BACKUP_ERROR:
					DialogManager.getInstance().updateHotUpdateDialog(HotUpdateDialogType.REBOOT)
					break;
				case ErrorType.UNZIP_BUNDLE_ERROR:
					DialogManager.getInstance().updateHotUpdateDialog(HotUpdateDialogType.FAIL)
					break;
				case ErrorType.DELETE_UNUSED_ASSETS_ERROR:
					break;
				default:

			}
		})

		this.hotUpdater.on(UpdateEvent.UPDATE_AVAILABLE, (releaseInfo: ReleaseInfo) => {
			Logger.info('Hot Update Available')
			Logger.info(releaseInfo)
		})

		this.hotUpdater.on(UpdateEvent.UPDATE_NOT_AVAILABLE, () => {
			Logger.info('Hot Update Not Available')
		})

		this.hotUpdater.on(UpdateEvent.DOWNLOAD_PROGRESS, (receivedBytes: number, totalBytes: number, percentage: number) => {
			Logger.info("Hot Download in progress");
			Logger.info({ receivedBytes, totalBytes, percentage });
		})

		this.hotUpdater.on(UpdateEvent.UPDATE_DOWNLOADED, () => {
			DialogManager.getInstance().createHotUpdateDialog(HotUpdateDialogType.NOTIFY_UPDATE)
		})
	}
}