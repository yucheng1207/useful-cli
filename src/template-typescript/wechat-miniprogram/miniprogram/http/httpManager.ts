import { getRandomChars } from '@utils/util'
import * as CryptoJS from 'miniprogram_npm/crypto-js'
import { IResponseData } from './types'
import ENV from 'env'

export default class HttpManager {
    // HttpManager instance
    private static _httpManager: HttpManager

    private appId: string
    private baseUrl: string
    private accessToken?: string
    private timeDiff: number

    constructor() {
        this.appId = ENV.APP_ID
        this.baseUrl = ENV.BASE_URL
        this.timeDiff = 0
    }

    public static getInstance(): HttpManager {
        if (!this._httpManager) {
            this._httpManager = new HttpManager()
        }

        return this._httpManager
    }

    /**
     * 计算本地时间与服务器时间的误差
     * @param serverTimestamp - 服务器时间
     */
    public setTimeDiff(serverTimestamp: number) {
        const clientTimestamp = Date.now()
        this.timeDiff = serverTimestamp - clientTimestamp
    }

    public setAccessToken(accesstoken?: string): void {
        this.accessToken = accesstoken
    }

    public setBaseUrl(url: string): void {
        this.baseUrl = url
    }

    /**
     * http响应处理
     * @param response - 后端返回的数据
     * @returns 请求结果， true为成功， false为失败
     */
    private responseHandle(
        response: WechatMiniprogram.RequestSuccessCallbackResult<IResponseData>
    ): boolean {
        const { statusCode, data } = response
        let success = false
        switch (statusCode) {
            case 200:
                // 处理成功
                success = true
                break
            case 202:
                // 服务器已接受请求，但尚未处理
                break
            case 204:
                // 处理成功，无返回Body
                success = true
                break
            case 400:
            case 401:
            case 403:
            case 404:
            case 429:
            case 500:
            case 502:
            case 503:
                wx.showToast({ title: data.message, icon: 'error' })
                break
            default:
                break
        }
        return success
    }

    private request(
        url: string,
        method:
            | 'OPTIONS'
            | 'GET'
            | 'HEAD'
            | 'POST'
            | 'PUT'
            | 'DELETE'
            | 'TRACE'
            | 'CONNECT',
        data?: Object
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${this.baseUrl}${url}`,
                method,
                data: data || '',
                success: (
                    response: WechatMiniprogram.RequestSuccessCallbackResult<IResponseData>
                ) => {
                    const result = this.responseHandle(response)
                    if (result) {
                        resolve(response.data)
                    } else {
                        console.error('请求失败', response)
                        reject(response)
                    }
                },
                fail: (error) => {
                    console.error('请求出错', error)
                    reject(data)
                },
            })
        })
    }

    public get<T>(url: string, params?: any): Promise<T> {
        const extra =
            params &&
            Object.keys(params)
                .filter((item) => params[item] === 0 || params[item])
                .map((item) => {
                    return `${encodeURIComponent(item)}=${encodeURIComponent(
                        params[item]
                    )}`
                })
                .join('&')
        return this.request(extra ? `${url}?${extra}` : url, 'GET')
    }

    public post<T>(url: string, data?: object): Promise<T> {
        return this.request(url, 'POST', data)
    }

    public put<T>(url: string, data?: object): Promise<T> {
        return this.request(url, 'PUT', data)
    }

    public delete<T>(url: string): Promise<T> {
        return this.request(url, 'DELETE')
    }
}
