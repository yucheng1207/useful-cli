import { ipcMain, Event, BrowserWindow } from "electron";
import { IPCMainChannelName, IPCRenderChannelName } from "./IPCChannelName";
import * as path from 'path';
import { Globals } from '../config/globals';

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
		for (const channel of Object.keys(IPCMainChannelName)) {
			ipcMain.on(channel, this.handleChannelEvent.bind(this, channel));
		}

		this.mainWindow = win;
	}

	public sendMessageToRenderer(channel: IPCRenderChannelName, args: any): void {
		console.log('SendMessageToRenderer:', channel, args)
		this.mainWindow && this.mainWindow.webContents.send(channel, args);
	}

	private async handleChannelEvent(channel: IPCMainChannelName, event: Event, ...args: any[]) {
		console.log('HandleChannelEventFromRenderer:', channel, args)
		switch (channel) {
			case (IPCMainChannelName.RENDERER_READY):
				this.sendMessageToRenderer(IPCRenderChannelName.MAIN_INFO, { logPath, chromeVersion: process.versions["chrome"], electronVersion: process.versions["electron"], nodeVersion: process.versions["node"] })
				event.returnValue = true
				break;
			default:
				break;
		}
	}
}