import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { Globals } from '@/config/globals';
import { Logger } from '../LoggerManager/index';
import * as path from 'path';

function createBrowserWindow(params: {
	options: BrowserWindowConstructorOptions,
	url?: string,
	openDevTools?: boolean,
	beforeLoad?: (win: BrowserWindow) => void
}): BrowserWindow {
	const { options, url, openDevTools, beforeLoad } = params
	const window = new BrowserWindow(options);

	beforeLoad && beforeLoad(window)
	loadWinURL(window, url)

	if (openDevTools) {
		window.webContents.openDevTools();
	}

	return window;
}

function loadWinURL(win: BrowserWindow, url: string): void {
	if (url && url.includes('http')) {
		win.loadURL(url);
	} else if (url && !url.includes('http')) {
		win.loadFile(url);
	}
}

export default class WindowManager {
	private static _manager: WindowManager;

	private mainWindow: BrowserWindow

	public static getInstance(): WindowManager {
		if (!this._manager) {
			this._manager = new WindowManager();
		}

		return this._manager;
	}

	/**
	 * create and open window that app main window
	 */
	public createMainWindow(params: { url?: string, hide?: boolean, openDevTools?: boolean, beforeLoad?: (win: BrowserWindow) => void }): BrowserWindow {
		const { url, hide, openDevTools, beforeLoad } = params
		// create main window
		const options: BrowserWindowConstructorOptions = {
			width: 800,
			height: 600,
			frame: process.platform === 'darwin',
			titleBarStyle:
				process.platform === 'darwin' ? 'hiddenInset' : 'default',
			backgroundColor: '#FFFFFF',
			webPreferences: {
				webSecurity: Globals.IS_PROD,
				/**
				 * nodeIntegration: 是否启用Node integration
				 * issue reference: https://github.com/electron/electron/issues/7300#issuecomment-493077796
				 */
				nodeIntegration: true,
				/**
				 * contextIsolation: 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true.
				 * 参考资料：
				 * [上下文隔离](https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation)
				 * [contextIsolation选项说明](https://www.electronjs.org/zh/docs/latest/api/browser-window#new-browserwindowoptions)
				 * 打开远程链接如百度翻译等要设置为true网页才能正常工作。
				 * 设置为false时渲染进程可以直接通过”const { shell, ipcRenderer } = require('electron')“发送消息了，为true是不可以，必须使用preload进行处理，方法看[这里](https://stackoverflow.com/questions/57807459/how-to-use-preload-js-properly-in-electron)
				 * 编写preload参考：https://www.electronjs.org/zh/docs/latest/api/context-bridge
				 */
				contextIsolation: false,
				// preload: path.join(__dirname, `./preload/preload.js`),
			},
			show: !hide,
		};

		const mainWin = createBrowserWindow({ url, options, beforeLoad, openDevTools });
		this.mainWindow = mainWin

		return mainWin;
	}

	public reloadMainWindow = (url: string): void => {
		this.mainWindow && loadWinURL(this.mainWindow, url)
	}

	public focusMainWindow = (): BrowserWindow => {
		if (this.mainWindow) {
			if (this.mainWindow.isMinimized()) this.mainWindow.restore()
			this.mainWindow.focus()
		}

		return this.mainWindow
	}

	public destoryMainWindow = (): void => {
		this.mainWindow && this.mainWindow.destroy()
	}

	public createLoadingWindow(): BrowserWindow {
		const options: BrowserWindowConstructorOptions = {
			width: 750,
			height: 450,
			show: true,
			frame: false,
			hasShadow: true,
		};
		const loadingWindow = createBrowserWindow({
			url: path.join(__dirname, `./LoadingScreen/index.html`),
			options,
			openDevTools: false
		});
		return loadingWindow;
	}

	public createHotUpdateDialogWindow(parent?: BrowserWindow, modal?: boolean, onReady?: (win: BrowserWindow) => void): BrowserWindow {
		if (modal && !parent) {
			Logger.warn('Create hotupdate dialog window warn: The creation of the modal window failed because the parent window is empty.')
		}
		const options: BrowserWindowConstructorOptions = {
			width: 440,
			height: 312,
			backgroundColor: '#FFFFFF',
			movable: false,
			resizable: false,
			minimizable: false,
			maximizable: false,
			alwaysOnTop: true,
			show: false,
			parent,
			modal,
			frame: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false
			},
			hasShadow: true,
		};

		const dialogWindow = createBrowserWindow({
			url: path.join(__dirname, `./DialogScreen/hotUpdate.html`),
			options,
			openDevTools: false
		});

		dialogWindow.webContents.once('dom-ready', (e) => {
			onReady && onReady(dialogWindow);
		});

		dialogWindow.once('ready-to-show', () => {
			dialogWindow.show();
		})

		return dialogWindow
	}

	public createAlertDialogWindow(opts: { width: number, height: number, hasShadow?: boolean, parent?: BrowserWindow, modal?: boolean }, onReady?: (win: BrowserWindow) => void): BrowserWindow {
		if (opts.modal && !opts.parent) {
			Logger.getInstance().warn('Create alert dialog window warn: The creation of the modal window failed because the parent window is empty.')
		}
		const options: BrowserWindowConstructorOptions = {
			width: opts.width,
			height: opts.height,
			backgroundColor: '#FFFFFF',
			resizable: false,
			minimizable: false,
			maximizable: false,
			alwaysOnTop: true,
			show: false,
			parent: opts.parent,
			modal: opts.modal,
			hasShadow: opts.hasShadow,
			frame: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
			},
		};

		const alertWindow = createBrowserWindow({
			url: path.join(__dirname, `./DialogScreen/alert.html`),
			options,
			openDevTools: false
		});

		alertWindow.webContents.once('dom-ready', () => {
			onReady && onReady(alertWindow);
		});

		alertWindow.once('ready-to-show', () => {
			alertWindow.show()
		})

		return alertWindow
	}
}
