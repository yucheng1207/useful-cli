// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

/**
 * 使用此preload的渲染进程可以拷贝以下代码来替换`const { ipcRenderer } = window.require("electron")`
 */
// const electronApi = (window as any).electron
// const ipcRenderer = {
// 	on: electronApi.handle,
// 	send: electronApi.send,
// 	sendSync: electronApi.sendSync,
// 	sendAsync: electronApi.sendAsync,
// 	invoke: electronApi.sendAsync,
// }

/**
 * 使用contextBridge进行通信，窗口配置 contextIsolation 为 true 时才可以使用此preload
 * Refrence: https://www.electronjs.org/zh/docs/latest/api/context-bridge
 */
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
        return ipcRenderer.send(channel, data);
    },
    sendSync: (channel, data) => {
        return ipcRenderer.sendSync(channel, data);
    },
    sendAsync: (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    },
    handle: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
});

/**
 * 暴露 Node Global Symbols
 * Refrence: https://www.electronjs.org/zh/docs/latest/api/context-bridge
 */
// const crypto = require("crypto")
// contextBridge.exposeInMainWorld("nodeCrypto", {
// 	sha256sum(data) {
// 		const hash = crypto.createHash("sha256")
// 		hash.update(data)
// 		return hash.digest("hex")
// 	},
// })

// window.addEventListener('DOMContentLoaded', () => {
// 	console.log('预加载脚本');
// });
