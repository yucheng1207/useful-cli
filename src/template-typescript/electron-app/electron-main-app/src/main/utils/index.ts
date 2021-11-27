import { Notification } from 'electron';

/**
 * 显示应用通知
 * https://www.electronjs.org/zh/docs/latest/tutorial/notifications
 */
export function showNotification(title: string, content: string): void {
	new Notification({ title, body: content }).show()
}
