import { App, app, Menu, dialog, BrowserWindow, globalShortcut } from 'electron';
import { performance, PerformanceObserver } from "perf_hooks";
import { Globals } from '../config/globals';
import { Logger } from '../managers/LoggerManager/index';
import WindowManager from '../managers/WindowManager/index';
import IPCMainManager from '../ipc/IPCMainManager';
import { MARKS } from '../config/PerformanceMarks';
import AutoUpdater from '../updater/AutoUpdater';
import DialogManager from '../managers/DialogManager/index';
import NeDBManager from '../store/NeDBManager';
import StoreConfigs from '../store/StoreConfigs'

/**
 * Measure performance
 */
const obs = new PerformanceObserver((items) => {
	items.getEntries().forEach((item) => {
		console.log('\x1b[32m%s\x1b[0m', item.name + ' ' + item.duration);
	})
})
obs.observe({ entryTypes: ['measure'] });

class Application {
	private _app: App;

	private _deeplinkingUrl: any

	private _mainWindow: BrowserWindow

	constructor() {
		this._app = null;
	}

	public getApplication(): App {
		if (!this._app) {
			this._app = app;
		}

		return this._app;
	}

	public init(): void {
		performance.mark(MARKS.APP_START);
		const _app = this.getApplication()

		this.configDialog();
		this.setDeepLink();
		this.neDBInit();

		// Electron 在完成初始化，并准备创建浏览器窗口时，
		// 会调用这个方法。
		// 部分 API 在 ready 事件触发后才能使用。
		// _app.on('ready', () => {
		_app.whenReady().then(() => {
			this.onAppReady()
			// _app.on('activate', function () {
			// 	// On macOS it's common to re-create a window in the app when the
			// 	// dock icon is clicked and there are no other windows open.
			// 	if (BrowserWindow.getAllWindows().length === 0) this.onAppReady();
			// });
		});

		// 在除 MacOS 的其他平台上，当所有窗口关闭后，退出当前应用。
		// 在 MacOS 上，应用及其菜单栏通常会保持活跃状态，
		// 直到用户明确按下 Cmd + Q 退出应用
		_app.on('window-all-closed', () => {
			// if (process.platform !== 'darwin') {
			// 	_app.quit();
			// }
			_app.quit();
		});

		_app.on('will-quit', () => {
			globalShortcut.unregisterAll();
		})
	}

	/**
	 * 设置远程Url
	 * macOs：当用户尝试打开第二个或通过 deeplink 打开 app 时，会触发 app 的'open-url'事件
	 * windows: 当用户尝试打开第二个或通过 deeplink 打开 app 时，会触发 app 的'second-instance'事件
	 */
	private setDeepLink() {
		if (Globals.IS_DEV) {
			// 本地运行时注册的是electtron，不是DEFAULT_PROTOCOL_CLIENT
			return;
		}
		const _app = this.getApplication();
		const isDefaultProtocolClient = _app.isDefaultProtocolClient(Globals.DEFAULT_PROTOCOL_CLIENT);
		Logger.info(`Deep-Link schemes: ${Globals.DEFAULT_PROTOCOL_CLIENT}, ${isDefaultProtocolClient}`);
		if (!isDefaultProtocolClient) {
			_app.removeAsDefaultProtocolClient(Globals.DEFAULT_PROTOCOL_CLIENT)
			_app.setAsDefaultProtocolClient(Globals.DEFAULT_PROTOCOL_CLIENT)
		}
		_app.on('will-finish-launching', () => {
			// Protocol handler for osx
			_app.on('open-url', (event, url) => {
				Logger.info(`open-url: ${url}`);
				event.preventDefault();
				this._deeplinkingUrl = url
				WindowManager.getInstance().focusMainWindow()
			});
		});
		//Force Single Instance Application
		const gotTheLock = _app.requestSingleInstanceLock();
		Logger.info(`GotTheLock: ${gotTheLock}`);
		if (gotTheLock) {
			_app.on('second-instance', (e, argv) => {
				Logger.info(`second-instance-${process.platform}: ${argv}`);
				// Protocol handler for win32
				// argv: An array of the second instance’s (command line / deep linked) arguments
				if (process.platform === 'win32') {
					// Keep only command line / deep linked arguments
					this._deeplinkingUrl = argv.slice(1)
				}

				// Someone tried to run a second instance, we should focus our window.
				WindowManager.getInstance().focusMainWindow()
			});
		}
		else {
			// Can not get the lock, The application is already running, quit.
			_app.quit();
		}
	}

	/**
	 * App Ready
	 */
	private async onAppReady() {
		performance.mark(MARKS.APP_READY);
		performance.measure("App Ready", MARKS.APP_START, MARKS.APP_READY);
		Logger.info("App Ready");
		Logger.info("Webview Url:" + Globals.WEBVIEW_ROOT_URL);

		try {
			const loadingWindow = WindowManager.getInstance().createLoadingWindow();
			performance.mark(MARKS.MAIN_WINDOW_START);
			this._mainWindow = WindowManager.getInstance().createMainWindow({
				hide: true, // 等加载完毕后（ready-to-show）再展示，在这之前显示的是loading window
				url: Globals.WEBVIEW_ROOT_URL,
				openDevTools: !Globals.IS_PROD,
				beforeLoad: (win: BrowserWindow) => {
					// before window load， 注意这里this._mainWindow还没有赋值的
					IPCMainManager.getInstance().init(win);
					DialogManager.getInstance().init(win, this._app);
					AutoUpdater.getInstance().init(win, this._app);
					AutoUpdater.getInstance().beforeHotUpdateCheck() // 在主窗体创建前需要检查热更新的异常情况, 执行前确保IPCMainManager 和 DialogManager 已经被初始化
					this.setGlobalShortcut();
					this.setupMenu();

				}
			})

			this._mainWindow.webContents.once('dom-ready', () => {
				performance.mark(MARKS.MAIN_WINDOW_WEBCONTENT_READY);
				performance.measure("Main window webcontent ready", MARKS.MAIN_WINDOW_START, MARKS.MAIN_WINDOW_WEBCONTENT_READY);
			});

			this._mainWindow.once("ready-to-show", () => {
				loadingWindow.close();
				this._mainWindow.show();
			});

			this._mainWindow.once("show", () => {
				// 确保应用更新弹框和热更新弹框可以正常显示
				AutoUpdater.getInstance().checkUpdate();
			});

			this._mainWindow.on('close', async (e) => {
				console.log('app close')
				// e.preventDefault(); // 拦截应用关闭
				// const option: MessageBoxOptions = {
				// 	title: '友情提示',
				// 	type: 'info',
				// 	message: `确定要退出吗?`,
				// 	detail: '',
				// 	defaultId: 0,
				// 	buttons: ['确定', '取消'],
				// }
				// const { response } = await DialogManager.getInstance().showMessageBox({ ...option, modal: true })
				// if (response === 0) {
				// 	setImmediate(() => {
				// 		WindowManager.getInstance().destoryMainWindow()
				// 		app.quit()
				// 	})
				// }

				// DialogManager.getInstance().showAlertDialog({
				// 	width: 440,
				// 	height: 200,
				// 	key: 'quit tip',
				// 	title: '友情提示',
				// 	text: '确定要退出吗?',
				// 	hasShadow: true,
				// 	buttonType: 'default',
				// 	mainButton: {
				// 		text: '取消'
				// 	},
				// 	secondaryButton: {
				// 		text: '确定'
				// 	},
				// 	onSecondaryCallback: () => {
				// 		WindowManager.getInstance().destoryMainWindow()
				// 		app.quit()
				// 	},
				// })
			});
		}
		catch (err) {
			console.error('onAppReady Error', err)
			Logger.error(err);
		}
	}

	/**
	 * 设置应用快捷键
	 */
	private setGlobalShortcut() {
		globalShortcut.register('CommandOrControl+Q', () => {
			app.quit();
		})
	}

	/**
	 * 设置应用菜单
	 */
	private setupMenu() {
		const menu = Menu.buildFromTemplate([
			{
				label: '编辑',
				submenu: [
					{ label: '撤销', accelerator: "CommandOrControl+Z", role: "undo" },
					{ label: '重做', accelerator: "Shift+CommandOrControl+Z", role: "redo" },
					{ label: '剪切', accelerator: "CommandOrControl+X", role: "cut" },
					{ label: '复制', accelerator: "CommandOrControl+C", role: "copy" },
					{ label: '粘贴', accelerator: "CommandOrControl+V", role: "paste" },
					{ label: '全选', accelerator: "CommandOrControl+A", role: "selectAll" }
				]
			}
		]);
		Menu.setApplicationMenu(menu);
	}

	private async neDBInit() {
		try {
			// create db
			for (const config of StoreConfigs) {
				await NeDBManager.getInstance().addDataStore(config.name, config.options);
			}
		}
		catch (err) {
			console.error(err);
			Logger.error(err);
		}
	}

	/**
	 * 发生系统错误时使用打印而不是 showErrorBox
	 */
	private configDialog() {
		dialog.showErrorBox = function (title, content) {
			const error = `${title}\n${content}`
			console.log(error);
		};
	}
}

export {
	Application,
};