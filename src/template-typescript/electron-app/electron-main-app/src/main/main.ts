import { app, BrowserWindow } from 'electron';
import { Logger } from '@/managers/LoggerManager';
import WindowManager from '@/managers/WindowManager';
import { Globals } from '@/config/globals';
import IPCMainManager from './ipc/IPCMainManager';

function initMainWindow() {
	return WindowManager.getInstance().createMainWindow(
		Globals.WEBVIEW_ROOT_URL,
		!Globals.IS_PROD
	)
}

function initMainIpc(win: BrowserWindow) {
	return IPCMainManager.getInstance().init(win)
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	Logger.info('app ready')
	const win = initMainWindow();
	initMainIpc(win)
	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) initMainWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
