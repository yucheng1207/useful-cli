import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';

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
        const security = process.env.NODE_ENV.startsWith('production');
        const options: BrowserWindowConstructorOptions = {
            width: 800,
            height: 600,
            frame: process.platform === 'darwin',
            titleBarStyle:
                process.platform === 'darwin' ? 'hiddenInset' : 'default',
            backgroundColor: '#FFFFFF',
            webPreferences: {
                webSecurity: security,
                preload: path.join(__dirname, 'preload.js'),
                // https://github.com/electron/electron/issues/7300#issuecomment-493077796
                nodeIntegration: true,
            },
        };

        const mainWin = createBrowserWindow(options, url);

        if (openDevTools) {
            mainWin.webContents.openDevTools();
        }

        return mainWin;
    }
}
