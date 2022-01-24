/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import * as URI from 'uri-js'

export enum ResponseCode {
	/**
	 * 400 客户端指定了无效的参数。 检查错误消息和错误详细信息以获取更多信息。
	 */
	INVALID_ARGUMENT = 'INVALID_ARGUMENT',
	/**
	 * 400 请求不能在当前系统状态下执行，例如删除非空目录。
	 */
	FAILED_PRECONDITION = 'FAILED_PRECONDITION',
	/**
	 * 400 客户端指定了无效的范围。
	 */
	OUT_OF_RANGE = 'OUT_OF_RANGE',
	/**
	 * 409 并发冲突，例如读-修改-写冲突。
	 */
	ABORTED = 'ABORTED',
	/**
	 * 409 客户端尝试创建的资源已存在。
	 */
	ALREADY_EXISTS = 'ALREADY_EXISTS',
	/**
	 * 419 删除角色失败
	 */
	ROLE_DELETE_ERROR = "ROLE_DELETE_ERROR",
	/**
	 * 419 名称已存在
	 */
	NAME_EXISTED_ERROR = "NAME_EXISTED_ERROR",
	/**
	 * 419 基坑设计方案已被使用，无法删除
	 */
	SCHEME_BIND_ERROR = "SCHEME_BIND_ERROR",
	/**
	 * 419 形象进度已经是开通状态
	 */
	VISUAL_ACTIVATED_ERROR = "ERR.PROJECT_VISUAL_ACTIVATED_ERROR",
	/**
	 * 419 该项目已存在申请开通形象进度的服务单
	 */
	VISUAL_HAS_TICKET_ERROR = "ERR.PROJECT_HAS_VISUAL_TICKET_ERROR",
	/**
	 * 419 项目服务单文件名称已存在
	 */
	PROJECT_FILE_NAME_EXISTED_ERROR = "ERR.PROJECT_FILE_NAME_EXISTED_ERROR",
	/**
	 * 500 不可恢复的数据丢失或数据损坏。 客户端应该向用户报告错误。
	 */
	DATA_LOSS = 'DATA_LOSS',
	/**
	 * 500 未知的服务器错误。 通常是服务器错误。
	 */
	UNKNOWN = 'UNKNOWN',
	/**
	 * 500 内部服务错误。 通常是服务器错误。
	 */
	INTERNAL = 'INTERNAL',
}

/**
 * axios single instance manager
 */
export default class HttpManager {
	// HttpManager instance
	private static _httpManager: HttpManager

	// axios instance
	private instance: AxiosInstance

	private accessToken?: string

	constructor() {
		this.instance = axios.create({
			baseURL: process.env.API_ROOT,
			timeout: 10000,
			// withCredentials: true, // allowed to carry cookies
		})
		this.initInterceptors()
	}

	public static getInstance(): HttpManager {
		if (!this._httpManager) {
			this._httpManager = new HttpManager()
		}

		return this._httpManager
	}

	private initInterceptors() {
		if (this.instance) {
			// Add a request interceptor
			this.instance.interceptors.request.use(
				(config: AxiosRequestConfig) => {
					// Do something before request is sent
					return config
				},
				(error: any) => {
					return Promise.reject(error)
				}
			)

			// Add a response interceptor
			this.instance.interceptors.response.use(
				(response: AxiosResponse) => {
					console.log('AxiosResponse', response);
					let url = response.config.url
					let baseURL = response.config.baseURL
					const responseURL = response.request.responseURL
					if (url && baseURL && responseURL) {
						if (!url.startsWith(baseURL)) {
							const baseUrlObj = URI.parse(baseURL)
							if (baseUrlObj.path) {
								// `URI.resolve` 第一个参数 `baseURI` 只能传入host地址，否则会将非host部分过滤掉，因此需要将 `baseURL` 中非host部分添resolve到url上面
								baseURL = `${baseUrlObj.scheme}://${baseUrlObj.host}`
								if (baseUrlObj.port) {
									baseURL = `${baseURL}:${baseUrlObj.port}`
								}
								// 处理拼接过程中产生路径为 `//` 或 `///` 的情况
								url = `${baseUrlObj.path}/${url}`.replace('//', '/').replace('//', '/')
							}
							url = URI.resolve(baseURL, url)
						}
						// 只保留scheme+host+port+path进行比较
						const urlObj = URI.parse(url)
						const responseUrlObj = URI.parse(responseURL)
						if (urlObj.scheme !== responseUrlObj.scheme || urlObj.host !== responseUrlObj.host || urlObj.port !== responseUrlObj.port || urlObj.path !== responseUrlObj.path) // http status is 302
						{
							this.handleBrowserRedirect(responseURL)
						}
					}
					return Promise.resolve(response.data);
				},
				(error: any) => {
					if (error.response) {
						const { status, data } = error.response
						switch (status) {
							case 400:
								this.handleBadRequestError()
								break
							case 401:
								this.handleUnauthorizedError()
								break
							case 403:
								this.handlePermissionDeniedError();
								break;
							case 404:
								this.handleNotFoundError()
								break;
							case 409:
								this.handleResourceConflictError(data.code);
								break;
							case 419:
								// 自定义错误，需要在调用地方做处理
								return Promise.reject(data.code);
							case 429:
								this.handleResourceExhaustedError();
								break;
							case 499:
								this.handleCancelRequestError();
								break;
							case 500:
								this.handleServerError()
								break
							case 501:
								this.handleNotImplementedError();
								break;
							case 502:
								this.handleBadGatewayError();
								break;
							case 503:
								this.handleUnavailableError();
								break;
							case 504:
								this.handleDeadlineExceededError();
								break;
							default:
								console.error('Unhandled network error => ', error)
								break;
						}
					}
					else {
						if (error.message === 'Network Error') {
							console.warn('Network Error')
							this.handleNetworkError()
						}
					}
					return Promise.reject(error)
				}
			)
		}
	}

	/**
	 * 302 处理重定向
	 * @param location 重定向地址
	 */
	private handleBrowserRedirect(location: string) {
		window.location.href = decodeURI(location)
	}

	/**
	 * 400 处理客户端传参错误
	 */
	private handleBadRequestError() {
		// showAlertDialog({ text: Message('BAD_REQUEST_ERROR_TEXT'), buttonType: 'info' })
	}

	/**
	 * 401 处理客户端没有认证错误
	 */
	private handleUnauthorizedError() {
		// showAlertDialog({
		// 	key: 'UNAUTHORIZED_ERROR_TEXT',
		// 	text: Message('UNAUTHORIZED_ERROR_TEXT'),
		// 	buttonType: 'info',
		// 	onOk: () => {
		// 		this.store.dispatch(routerActions.replace(URLS.LOGIN))
		// 	}
		// })
	}

	/**
	 * 403 处理客户端没有足够的权限错误
	 */
	private handlePermissionDeniedError() {
		// this.store.dispatch(routerActions.replace(URLS.NOT_PERMISSION_EXCEPTION))
	}

	/**
	 * 404 处理找不到指定的资源，或者该请求被未公开的原因（例如白名单）拒绝。
	 */
	private handleNotFoundError() {
		// showAlertDialog({ text: Message('NOT_FOUND_ERROR_TEXT'), buttonType: 'info' })
	}

	/**
	 * 409 处理资源冲突错误
	 */
	private handleResourceConflictError(responseCode: ResponseCode) {

	}

	/**
	 * 429 处理资源配额达到速率限制错误
	 */
	private handleResourceExhaustedError() {

	}

	/**
	 * 499 处理客户端取消请求错误
	 */
	private handleCancelRequestError() {

	}

	/**
	 * 500 处理服务端错误
	 */
	private handleServerError() {
		// showAlertDialog({ text: Message('SERVER_ERROR_TEXT'), buttonType: 'info' })
	}

	/**
	 * 501 处理服务器未实现该API方法
	 */
	private handleNotImplementedError()
	// tslint:disable-next-line: no-empty
	{

	}

	/**
	 * 502 处理服务端重启中错误
	 */
	private handleBadGatewayError() {
		// showAlertDialog({ text: Message('BAD_GATEWAY_ERROR_TEXT'), buttonType: 'info' })
	}

	/**
	 * 503 暂停服务。通常是服务器已经关闭。
	 */
	private handleUnavailableError()
	// tslint:disable-next-line: no-empty
	{

	}

	/**
	 * 504 已超过请求期限。如果重复发生，请考虑降低请求的复杂性。
	 */
	private handleDeadlineExceededError()
	// tslint:disable-next-line: no-empty
	{

	}

	private handleNetworkError() {
		// showAlertDialog({ text: Message('NETWORK_ERROR_TEXT'), buttonType: 'info' })
	}

	public setAccessToken(accesstoken?: string): void {
		this.accessToken = accesstoken
	}

	public setRequestTimeout(time: number): void {
		this.instance.defaults.timeout = time
	}

	public setBaseUrl(url: string): void {
		this.instance.defaults.baseURL = url
	}

	public get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
		if (params && Object.keys(params).length) {
			url = Object.keys(params).reduce((prevVal, curVal, _index) => {
				if (_index === 0) {
					return `${prevVal}?${curVal}=${params[curVal]}`
				}
				return `${prevVal}&${curVal}=${params[curVal]}`
			}, url)
		}
		return this.instance.get(url, { headers: { 'X-Mesh-Service-Token': this.accessToken || '' }, ...config })
	}

	public post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
		return this.instance.post(url, data, { headers: { 'X-Mesh-Service-Token': this.accessToken || '' }, ...config })
	}

	public put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
		return this.instance.put(url, data, { headers: { 'X-Mesh-Service-Token': this.accessToken || '' }, ...config })
	}

	public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.instance.delete(url, { headers: { 'X-Mesh-Service-Token': this.accessToken || '' }, ...config })
	}
}