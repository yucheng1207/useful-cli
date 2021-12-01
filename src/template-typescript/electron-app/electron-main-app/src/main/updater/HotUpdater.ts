import { BrowserWindow } from 'electron'
import { readFileSync } from 'fs'
import { getLatestRelease, downloadFile, AppType } from './GenericRelease'
import { readFileAsync, deleteFile, renameAsyncWithRetry, deleteFileInDir, existsAsync } from '../utils/fsAsync'
import { extractZip } from './Zip'
import { Logger } from '../managers/LoggerManager/index';
import { autoupdateConfig } from './AutoUpdater';
import { Globals } from '../config/globals';
import NeDBManager from '../store/NeDBManager';
import StoreNames from '../store/StoreName';
import DialogManager from '../managers/DialogManager/index';
import { HotUpdateDialogType } from '../managers/DialogManager/index';

const jsYaml = require('js-yaml')
const jsSha512 = require('js-sha512')
const compareVersions = require('compare-versions')
const { safeLoad } = jsYaml
const { sha512 } = jsSha512

export enum UpdateProvider {
	GITHUB = 'github',
	GENERIC = 'generic',
}

export enum UpdateEvent {
	ERROR = 'error',
	UPDATE_AVAILABLE = 'update-available',
	DOWNLOAD_PROGRESS = 'download-progress',
	UPDATE_NOT_AVAILABLE = 'update-not-available',
	UPDATE_DOWNLOADED = 'update-downloaded'
}

export enum ErrorType {
	/**
	 * 检查版本更新过程中的异常错误
	 */
	CHECK_UPDATE_ERROR = 'CheckUpdateError',
	/**
	 * Github release assert 不完成
	 */
	RELEASE_ASSERT_INCOMPLETE = 'ReleaseAssertIncomplete',
	/**
	 * Bundle压缩文件损坏
	 */
	BUNDLE_ZIP_DAMAGED = 'BundleZipDamaged',
	/**
	 * Bundle压缩文件下载过程中出现的错误
	 */
	BUNDLE_ZIP_DOWNLOAD_ERROR = 'BundleZipDownloadError',
	/**
	 * 备份失败
	 */
	BACKUP_ERROR = 'BackupError',
	/**
	 * 恢复备份失败
	 */
	RESTORE_BACKUP_ERROR = 'RestoreBackupError',
	/**
	 * 解压缩bundle压缩文件失败
	 */
	UNZIP_BUNDLE_ERROR = 'UnzipBundleError',
	/**
	 * 删除无用的Assets文件失败
	 */
	DELETE_UNUSED_ASSETS_ERROR = 'DeleteUnusedAssetsError',
}

export default class HotUpdater {
	private static _instance: HotUpdater;

	private _listeners: { [key: string]: Function[] };

	private bundleZipInfo: {
		url: string,
		name: string,
		version: string,
		sha: string,
	};

	/**
	 * Stores the main window of this application
	 */
	private mainWindow: BrowserWindow;

	public autoDownload = true;

	public static getInstance(): HotUpdater {
		if (!this._instance) {
			this._instance = new HotUpdater();
		}

		return this._instance;
	}

	public init(mainWindow: BrowserWindow): void {
		this.mainWindow = mainWindow
	}

	/**
	 * Register an event listener for given event
	 *
	 * @param {string} event - event name to reference the listener
	 * @param {Function} fn - callback function
	 */
	public on(event: string, fn: Function): HotUpdater {
		this._listeners = this._listeners || {};
		// Create namespace for this event
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}
		this._listeners[event].push(fn);

		return this;
	}

	/**
	 * Emits an event and trigger all its listeners
	 *
	 * @param event - event name to reference the listener
	 * @param args - other args being applied to the callback
	 */
	private emit(event: string, ...args: any[]) {
		if (event !== UpdateEvent.DOWNLOAD_PROGRESS) console.log('emit ', event, ...args)
		this._listeners = this._listeners || {};
		const callbacks = this._listeners[event];

		if (callbacks) {
			for (const callback of callbacks) {
				callback.apply(this, args);
			}
		}

		return this;
	}

	/**
	 * 热更新的前置检查，用于清理上次热更新中断的情况
	 */
	public async beforeCheck(): Promise<void> {
		if (Globals.IS_DEV) {
			return
		}
		const { rendererPath, rendererBakPath } = autoupdateConfig
		const result = await NeDBManager.getInstance().find(StoreNames.HOT_UPDATE_RECORD_STORE, { complete: false });
		const bundlePath = rendererPath
		const isExistBundleFolder = await existsAsync(bundlePath);
		if (!result.length && isExistBundleFolder) {
			return
		}

		// bundle is incomplete
		if (result.length && isExistBundleFolder) {
			await deleteFileInDir(bundlePath);
		}

		result.length && await NeDBManager.getInstance().remove(StoreNames.HOT_UPDATE_RECORD_STORE, { complete: false }, { multi: true })

		const bundleBakPath = rendererBakPath
		const isExistBundleBakFolder = await existsAsync(bundleBakPath);
		if (isExistBundleBakFolder) {
			try {
				await renameAsyncWithRetry(bundleBakPath, bundlePath)
			}
			catch (err) {
				DialogManager.getInstance().createHotUpdateDialog(HotUpdateDialogType.CORRUPTED)
				throw err
			}
		}
		else {
			DialogManager.getInstance().createHotUpdateDialog(HotUpdateDialogType.CORRUPTED)
			throw new Error('Need reinstall app')
		}
	}

	public async checkForUpdates(): Promise<void> {
		try {
			const { appVersion, rendererPackageJson, rendererRemoteYmlAssetName, rendererRemoteZipAssetName, rendererYmlLocalCache } = autoupdateConfig
			const releaseInfo = await getLatestRelease(AppType.BUNDLE)
			const packageJsonString = await readFileAsync(rendererPackageJson)
			const packageJson = JSON.parse(packageJsonString)

			// 线上版本
			const releaseBundleVersion = releaseInfo && releaseInfo.version
			// 当前版本
			const localBundleVersion = packageJson && packageJson.version
			if (releaseBundleVersion && localBundleVersion && compareVersions(releaseBundleVersion, localBundleVersion) > 0 && releaseInfo.assets && Array.isArray(releaseInfo.assets)) {
				const ymlAsset = releaseInfo.assets.find(asset => asset.name === rendererRemoteYmlAssetName)
				const zipAsset = releaseInfo.assets.find(asset => asset.name === rendererRemoteZipAssetName)
				if (ymlAsset && zipAsset) {
					const targetPath = rendererYmlLocalCache
					// download latest.yml
					await downloadFile(ymlAsset.url, targetPath)
					const yamlContent = await readFileAsync(targetPath)
					const yamlObj = safeLoad(yamlContent)
					if (yamlObj && compareVersions(yamlObj.version, releaseBundleVersion) === 0 && compareVersions(yamlObj.appMaxVersion, appVersion) >= 0 && compareVersions(appVersion, yamlObj.appMinVersion) >= 0) {
						this.bundleZipInfo = {
							url: zipAsset.url,
							name: zipAsset.name,
							version: releaseBundleVersion,
							sha: yamlObj.sha512
						}
						this.emit(UpdateEvent.UPDATE_AVAILABLE, releaseInfo)
						if (this.autoDownload) {
							this.downloadUpdate()
						}
					}
					else {
						this.emit(UpdateEvent.UPDATE_NOT_AVAILABLE)
					}
				}
				else {
					this.emit(UpdateEvent.ERROR, ErrorType.RELEASE_ASSERT_INCOMPLETE)
				}
			}
		}
		catch (err) {
			this.emit(UpdateEvent.ERROR, ErrorType.CHECK_UPDATE_ERROR, err)
		}
	}

	public async downloadUpdate(retryTimes = 3): Promise<void> {
		if (this.bundleZipInfo) {
			const { url, name, sha } = this.bundleZipInfo
			const { rendererYmlLocalCache, rendererZipLocalCache } = autoupdateConfig

			try {
				const targetPath = rendererZipLocalCache
				Logger.info('downloadUpdate', retryTimes, url, targetPath)
				// download dist.zip
				await downloadFile(url, targetPath, (receivedBytes: number, totalBytes: number, percentage: number) => {
					this.emit(UpdateEvent.DOWNLOAD_PROGRESS, receivedBytes, totalBytes, percentage)
				})
				// check sha512 value
				const buffer = readFileSync(targetPath)
				const zipSha512 = sha512(buffer)
				if (zipSha512 && zipSha512 === sha) {
					this.emit(UpdateEvent.UPDATE_DOWNLOADED)
				}
				else {
					if (retryTimes > 0) {
						await this.downloadUpdate(--retryTimes)
					}
					else {
						this.emit(UpdateEvent.ERROR, ErrorType.BUNDLE_ZIP_DAMAGED)
						// delete dist.zip latest.yml
						await deleteFile(rendererYmlLocalCache)
						await deleteFile(rendererZipLocalCache)
					}
				}
			}
			catch (err) {
				this.emit(UpdateEvent.ERROR, ErrorType.BUNDLE_ZIP_DOWNLOAD_ERROR, err)
			}
		}
	}

	/**
	 * Installs the update after it has been downloaded and reload the index.html.
	 * It should only be called after `update-downloaded` has been emitted.
	 */
	public async installAndReload(): Promise<void> {
		try {
			const { rendererHtmlPath } = autoupdateConfig
			Logger.info('Performing original file backup...')
			await this.originalBundleBackup()
			Logger.info('Saving backup info in local database...')
			await this.saveInLocalDataBase()
			Logger.info('Extracting bundle file...')
			await this.extractBundleZip()
			Logger.info('Removing backup info from local database...')
			await this.removeInLocalDataBase()
			Logger.info('Deleting useless files...')
			await this.deleteUnusedFoldersAndFiles()
			if (this.mainWindow) {
				Logger.info(`Reloading mainWindow...`);
				Logger.info(rendererHtmlPath);
				await this.mainWindow.loadFile(rendererHtmlPath).then(() => {
					Logger.info(`MainWindow load url success: file://${rendererHtmlPath}`);
				})
			}
		}
		catch (err) {
			Logger.info('installAndReload Error')
			Logger.info(err)
			console.error(err)
		}
	}

	private async saveInLocalDataBase() {
		const { version } = this.bundleZipInfo
		const records = await NeDBManager.getInstance().find(StoreNames.HOT_UPDATE_RECORD_STORE, { version })
		if (records.length) {
			await NeDBManager.getInstance().update(
				StoreNames.HOT_UPDATE_RECORD_STORE,
				{
					version
				},
				{
					$set: {
						complete: false,
						createdAt: new Date().getTime()
					}
				},
				{
					multi: true
				}
			)
		}
		else {
			await NeDBManager.getInstance().insert(StoreNames.HOT_UPDATE_RECORD_STORE, { version, complete: false, createdAt: new Date().getTime() })
		}
	}

	private async removeInLocalDataBase() {
		const { version } = this.bundleZipInfo
		await NeDBManager.getInstance().remove(StoreNames.HOT_UPDATE_RECORD_STORE, { version, complete: false }, { multi: true })
	}

	/**
	 * 备份原文件
	 */
	private async originalBundleBackup() {
		try {
			const { rendererPath, rendererBakPath } = autoupdateConfig
			await renameAsyncWithRetry(rendererPath, rendererBakPath)
		}
		catch (err) {
			this.emit(UpdateEvent.ERROR, ErrorType.BACKUP_ERROR, err)
			throw err
		}
	}

	/**
	 * 恢复备份
	 */
	private async restoreOriginalBundle() {
		try {
			const { rendererPath, rendererBakPath } = autoupdateConfig
			await renameAsyncWithRetry(rendererBakPath, rendererPath)
		}
		catch (err) {
			this.emit(UpdateEvent.ERROR, ErrorType.RESTORE_BACKUP_ERROR, err)
			throw err
		}
	}

	private async extractBundleZip() {
		try {
			const { rendererZipLocalCache, rendererPath } = autoupdateConfig
			extractZip(rendererZipLocalCache, rendererPath)
		}
		catch (err) {
			await this.restoreOriginalBundle()
			this.emit(UpdateEvent.ERROR, ErrorType.UNZIP_BUNDLE_ERROR, err)
			throw err
		}
	}

	private async deleteUnusedFoldersAndFiles() {
		try {
			const { rendererBakPath, rendererYmlLocalCache, rendererZipLocalCache } = autoupdateConfig
			// bundle zip
			await deleteFile(rendererZipLocalCache)
			// latest.yml
			await deleteFile(rendererYmlLocalCache)
			// bundle bak folder
			await deleteFileInDir(rendererBakPath)
		}
		catch (err) {
			this.emit(UpdateEvent.ERROR, ErrorType.DELETE_UNUSED_ASSETS_ERROR, err)
			throw err
		}
	}

}