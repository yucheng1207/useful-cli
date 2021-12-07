
import { BrowserWindow, MessageBoxOptions, dialog, App } from "electron";
import WindowManager from '../WindowManager';
import { IPCMainToRenderChannelName } from "../../ipc/IPCChannelName";
import HotUpdater from '../../updater/HotUpdater'
import { Logger } from '../LoggerManager/index';
import { Globals } from '../../config/globals';

export enum HotUpdateDialogType {
	NOTIFY_UPDATE = "NOTIFY_UPDATE",
	UPDATING = "UPDATING",
	FAIL = "FAIL",
	REBOOT = "REBOOT",
	CORRUPTED = "CORRUPTED",
}

export interface IHotUpdateDialogOpts {
	type: HotUpdateDialogType; // 用于主进程处理dialog回调
	title: string;			// Dialog的标题
	hasBorder?: boolean;	// Dialog的内容div是否带边框
	desc?: string;			// Dialog的内容
	buttonDesc?: string;	// button文案
	url?: string;			// Dialog中的链接
	progress?: number;		// Dialog中的进度
	progressDesc?: string;	// 进度条下面的描述
}


interface IModalDialogButton {
	text: string;
}

type IModalDialogButtonType = 'default' | 'single' | 'none';

export interface IAlertDialogOpts {
	/**
	 * Modal key 值
	 */
	key?: string;

	/**
	 * Modal Dialog 是否有shadow
	 */
	hasShadow?: boolean;

	/**
	 * Modal Dialog 标题
	 */
	title: string;

	/**
	 * Modal Dialog 宽度
	 */
	width: number;

	/**
	 * Modal Dialog 高度
	 */
	height: number;

	/**
	 *  Modal Dialog 文本
	 */
	text?: string;

	/**
	 *  Modal Dialog 多行文本
	 */
	textArray?: string[];

	/**
	 * Modal Dialog 文本对齐方式, 默认center
	 */
	align?: 'left' | 'right' | 'center';

	/**
	 * Modal Dialog 按钮类型, 决定主/次按钮的显示规则
	 * default: 显示主按钮和次按钮
	 * single: 只显示主按钮
	 * none: 都不显示
	 */
	buttonType?: IModalDialogButtonType,

	/**
	 * 主按钮选项
	 */
	mainButton: IModalDialogButton;

	/**
	 * 次按钮选项，默认为'取消'
	 */
	secondaryButton?: IModalDialogButton;

	/**
	 * 主按钮点击回调
	 */
	onMainCallback?: Function;

	/**
	 * 次按钮点击回调
	 */
	onSecondaryCallback?: Function;

	/**
	 * Dialog 右上角关闭按钮点击回调
	 */
	onCloseCallback?: Function;
}

export default class DialogManager {
	private static _manager: DialogManager;

	private _app: App = null;
	private mainWindow: BrowserWindow = null;
	private hotUpdateDialog: BrowserWindow = null;
	private alertDialogs: { win: BrowserWindow, opts: IAlertDialogOpts, onMainCallback?: Function, onSecondaryCallback: Function, onCloseCallback?: Function }[] = [];

	public static getInstance(): DialogManager {
		if (!this._manager) {
			this._manager = new DialogManager();
		}

		return this._manager;
	}

	public init(win: BrowserWindow, app: App): void {
		this.mainWindow = win;
		this._app = app;
	}

	/**
	 * 通知渲染进程显示遮罩，主要用于热更新期间禁止页面点击
	 */
	public displayMask(): void {
		const showMask = this.hotUpdateDialog !== null || (this.alertDialogs && this.alertDialogs.length > 0)
		this.mainWindow && this.mainWindow.webContents.send(IPCMainToRenderChannelName.DISPLAY_MASK_NOTIFICATION, showMask);
	}

	public hotUpdateDialogCallback(opts: IHotUpdateDialogOpts): void {
		const type = opts && opts.type
		if (type === HotUpdateDialogType.NOTIFY_UPDATE) {
			this.updateHotUpdateDialog(HotUpdateDialogType.UPDATING)
			HotUpdater.getInstance().installAndReload().then(() => {
				this.closeHotUpdateDialog()
			})
		}
		else if (type === HotUpdateDialogType.UPDATING) {
			// updating
		}
		else if (type === HotUpdateDialogType.FAIL) {
			this.closeHotUpdateDialog()
		}
		else if (type === HotUpdateDialogType.REBOOT) {
			this._app && this._app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
			this._app.exit(0)
		}
		else if (type === HotUpdateDialogType.CORRUPTED) {
			this._app && this._app.exit()
		}
	}

	public createHotUpdateDialog(type: HotUpdateDialogType): void {
		this.updateHotUpdateDialog(type)
	}

	public updateHotUpdateDialog(type: HotUpdateDialogType, progress?: number): void {
		const opts: IHotUpdateDialogOpts = { type, title: '' };
		if (type === HotUpdateDialogType.NOTIFY_UPDATE) {
			opts.title = '应用有新的补丁';
			opts.hasBorder = true;
			opts.desc = "已为您下载好热更新补丁，点击更新将会刷新页面，过程将持续 3-5 秒。";
			opts.buttonDesc = "立即更新";
		}
		else if (type === HotUpdateDialogType.UPDATING) {
			opts.title = '更新中...';
			opts.hasBorder = false;
			opts.progress = progress || 0;
			opts.progressDesc = '应用自动更新中，过程大约 3-5 秒，请勿退出';
		}
		else if (type === HotUpdateDialogType.FAIL) {
			opts.title = '更新失败';
			opts.hasBorder = false;
			opts.desc = '热更新意外失败，请稍后重启应用再次尝试';
			opts.url = Globals.DOWNLOAD_URL;
			opts.buttonDesc = '我知道了';
		}
		else if (type === HotUpdateDialogType.REBOOT) {
			opts.title = '更新失败';
			opts.hasBorder = false;
			opts.desc = '热更新意外失败，请重启奇志工作台，如多次失败，请尝试从官网重新下载安装包进行安装。';
			opts.url = Globals.DOWNLOAD_URL;
			opts.buttonDesc = '重启应用';
		}
		else if (type === HotUpdateDialogType.CORRUPTED) {
			opts.title = '关键文件损坏';
			opts.hasBorder = false;
			opts.desc = '必要文件被损坏，请重新下载安装';
			opts.url = Globals.DOWNLOAD_URL;
			opts.buttonDesc = '我知道了';
		}

		if (!this.hotUpdateDialog) {
			this.hotUpdateDialog = WindowManager.getInstance().createHotUpdateDialogWindow(this.mainWindow, false, () => {
				this.hotUpdateDialog && this.hotUpdateDialog.webContents.send(IPCMainToRenderChannelName.HOT_UPDATE_DIALOG_INFO_UPDATE, opts);
			});
			this.displayMask();
		}
		else {
			// hotUpdateDialog已存在，更新dialog中的信息
			this.hotUpdateDialog && this.hotUpdateDialog.webContents.send(IPCMainToRenderChannelName.HOT_UPDATE_DIALOG_INFO_UPDATE, opts);
		}
	}

	/**
	 * close window immediately
	 */
	public closeHotUpdateDialog(): void {
		this.hotUpdateDialog && this.hotUpdateDialog.destroy()
		this.hotUpdateDialog = null
		this.displayMask()
	}

	public alertDialogCallback(type: 'main' | 'secondary' | 'close', opts: IAlertDialogOpts): void {
		const dialogIndex = this.alertDialogs.findIndex(item => item.opts.key === opts.key)
		if (dialogIndex !== -1) {
			const result = this.alertDialogs.splice(dialogIndex, 1);
			const dialog = result[0]
			if (dialog) {
				dialog.win.destroy();
				this.displayMask();
				type === 'main' && dialog.onMainCallback && dialog.onMainCallback()
				type === 'secondary' && dialog.onSecondaryCallback && dialog.onSecondaryCallback()
				type === 'close' && dialog.onCloseCallback && dialog.onCloseCallback()
			}
		}
		else {
			console.error('alertDialogCallback error: can not find dialog')
		}
	}

	/**
	 * 自定义主进程Alert弹框
	 * @param opts
	 * @param onSuccessCallback
	 * @param onCloseCallback
	 */
	public showAlertDialog(opts: IAlertDialogOpts): void {
		const key = opts.key || '';
		opts.key = key ? key : new Date().getTime().toString()
		if (this.alertDialogs.find((item) => item.opts.key === key)) {
			return;
		}
		const alertDialog = WindowManager.getInstance().createAlertDialogWindow({
			width: opts.width,
			height: opts.height,
			parent: this.mainWindow,
			modal: false,
			hasShadow: opts.hasShadow
		}, () => {
			const {
				key, // alertDialogCallback中用来标识dialog的
				title,
				text,
				textArray,
				align,
				buttonType,
				mainButton,
				secondaryButton,
			} = opts // ipc不能的参数属性不能是Function， 所以这里要把opts中的onMainCallback等去掉
			alertDialog && alertDialog.webContents.send(IPCMainToRenderChannelName.MAIN_ALERT_DIALOG_INFO_UPDATE, {
				key,
				title,
				text,
				textArray,
				align,
				buttonType,
				mainButton,
				secondaryButton,
			});
			this.displayMask()
		});
		this.alertDialogs.push({
			win: alertDialog,
			opts,
			onMainCallback: opts.onMainCallback,
			onSecondaryCallback: opts.onSecondaryCallback,
			onCloseCallback: opts.onCloseCallback
		})
	}

	/**
	 * 调用系统弹框
	 * API: https://www.electronjs.org/docs/api/dialog#dialogshowmessageboxbrowserwindow-options
	 */
	public showMessageBox(params: MessageBoxOptions & { modal?: boolean }): Promise<Electron.MessageBoxReturnValue> {
		// 注意: modal设置为true时，必须在父窗口(this.mainWindow)show事件触发后才可以调用showMessageBox， 否则弹框会被mainWindow遮挡， modal设置为false时不会有这个问题
		if (params.modal && !this.mainWindow) {
			Logger.warn('ShowMessageBox warn: The creation of the modal message box failed because the parent window is empty.')
		}
		return dialog.showMessageBox(params.modal ? this.mainWindow : null, params)
	}
}
