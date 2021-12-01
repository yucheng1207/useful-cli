import { ipcMain, Event, BrowserWindow } from "electron";
import { IPCRendererToMainChannelName, IPCMainToRenderChannelName } from "./IPCChannelName";
import * as path from 'path';
import { Globals } from '../config/globals';
import DialogManager from '../managers/DialogManager/index';

const logPath = path.join(Globals.LOG_PATH, Globals.LOG_NAME)

export default class IPCMainManager {

	private static _instance: IPCMainManager;

	private mainWindow: BrowserWindow = null;

	public static getInstance(): IPCMainManager {
		if (!this._instance) {
			this._instance = new IPCMainManager();
		}

		return this._instance;
	}

	public init(win?: BrowserWindow): void {
		// register all IPC Main Channel
		for (const channel of Object.keys(IPCRendererToMainChannelName)) {
			ipcMain.on(channel, this.handleChannelEvent.bind(this, channel));
		}

		this.mainWindow = win;
	}

	public sendMessageToRenderer(channel: IPCMainToRenderChannelName, args: any): void {
		console.log('SendMessageToRenderer:', channel, args)
		this.mainWindow && this.mainWindow.webContents.send(channel, args);
	}

	private async handleChannelEvent(channel: IPCRendererToMainChannelName, event: Event, ...args: any[]) {
		console.log('HandleChannelEventFromRenderer:', channel, args)
		switch (channel) {
			// hotUpdateDialogWindow专用的ipc
			case (IPCRendererToMainChannelName.HOT_UPDATE_DIALOG_CALLBACK):
				this.handleHotUpdateDialogCallback(event, args);
				break;
			// alertDialogWindow专用的ipc
			case (IPCRendererToMainChannelName.MAIN_ALERT_DIALOG_CALLBACK):
				this.handleAlertDialogCallback(event, args);
				break;
			// 渲染进程ipc
			case (IPCRendererToMainChannelName.RENDERER_READY):
				this.sendMessageToRenderer(IPCMainToRenderChannelName.MAIN_INFO, { logPath, chromeVersion: process.versions["chrome"], electronVersion: process.versions["electron"], nodeVersion: process.versions["node"] })
				event.returnValue = true
				break;
			default:
				break;
		}
	}

	private handleHotUpdateDialogCallback(event: any, args: any[]) {
		const opts = args[0]
		DialogManager.getInstance().hotUpdateDialogCallback(opts);
	}

	private handleAlertDialogCallback(event: any, args: any[]) {
		const type = args[0]
		const opts = args[1]
		DialogManager.getInstance().alertDialogCallback(type, opts);
	}
}