import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { Globals } from '@/config/globals';

function createBrowserWindow(
	options: BrowserWindowConstructorOptions,
	url?: string
): BrowserWindow {
	const window = new BrowserWindow(options);

	if (url && url.includes('http')) {
		window.loadURL(url);
	} else if (url && !url.includes('http')) {
		window.loadFile(url);
	}

	return window;
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
	public createMainWindow(url?: string, openDevTools?: boolean): BrowserWindow {
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
				nodeIntegration: true, // https://github.com/electron/electron/issues/7300#issuecomment-493077796
				contextIsolation: false, // https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation
			},
		};

		const mainWin = createBrowserWindow(options, url);

		this.mainWindow = mainWin

		if (openDevTools) {
			mainWin.webContents.openDevTools();
		}

		return mainWin;
	}

	public focusMainWindow = (): BrowserWindow => {
		if (this.mainWindow) {
			if (this.mainWindow.isMinimized()) this.mainWindow.restore()
			this.mainWindow.focus()
		}

		return this.mainWindow
	}
}
