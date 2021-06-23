// app.ts
import StoreManager, { IGlobalData, initGlobalData } from 'store/storeManager'
import { message } from './utils/i18n'
interface IMiniAppOption {
    globalData: IGlobalData
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}
export type IMiniApp = WechatMiniprogram.App.Instance<IMiniAppOption>

App<IMiniAppOption>({
    globalData: initGlobalData(),
    onLaunch() {
        StoreManager.getInstance(this).initLogs()

        // 登录
        wx.login({
            success: (res) => {
                console.log(res.code)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            },
            fail: () => {
                wx.showToast({
                    title: message('authorizationFailedTip'),
                    icon: 'error',
                })
            },
        })
    },
})
