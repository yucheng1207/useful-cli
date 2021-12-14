import { IPCRendererToMainChannelName, IPCMainToRenderChannelName } from "../main/ipc/IPCChannelName";
const { ipcRenderer } = window.require("electron")
// console.log('electron:', (window as any).electron)
// const electronApi = (window as any).electron
// const ipcRenderer = {
// 	on: electronApi.handle,
// 	send: electronApi.send,
// 	sendSync: electronApi.sendSync,
// 	sendAsync: electronApi.sendAsync,
// 	invoke: electronApi.sendAsync,
// }

console.log('This is renderer process!')

/**
 * 给主进程发送消息
 */
ipcRenderer.sendSync(IPCRendererToMainChannelName.RENDERER_READY);

/**
 * 监听主进程发过来的消息
 */
ipcRenderer.on(IPCMainToRenderChannelName.MAIN_INFO, (event: any, ...arg: any[]) => {
	const info = arg[0]
	if (info) {
		const { chromeVersion, electronVersion, nodeVersion, logPath } = info
		console.log('应用日志路径:', logPath)
		console.log('Electron版本:', electronVersion)
		console.log('Node版本:', nodeVersion)
		console.log('Chrome版本:', chromeVersion)
	}
})
