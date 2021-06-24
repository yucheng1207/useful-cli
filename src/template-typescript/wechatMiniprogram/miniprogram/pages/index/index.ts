// index.ts
// 获取应用实例
import { I18nPage } from '@miniprogram-i18n/core'
import { message, setLanguage } from '@utils/i18n'
const app = getApp<IAppOption>()

// 因为改page下的wxml使用了t函数，所以这里需要引入 I18nPage 代替 Page 构造器。
// 当然也可以采用 Component 构造器进行定义，然后在 Component 中使用 I18n 这个 Behavior
I18nPage({
    data: {
        showDialog: false,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData:
            wx.canIUse('open-data.type.userAvatarUrl') &&
            wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '/pages/logs/logs',
        })
    },
    onLoad() {
        // @ts-ignore
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true,
            })
        }
    },
    getUserProfile() {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: message('displayUserInfo'), // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                })
            },
        })
    },
    getUserInfo(e: any) {
        // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
        console.log(e)
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
        })
    },
    changeLanguage() {
        this.setData({ showDialog: true })
    },
    tapDialogButton(e: WechatMiniprogram.CustomEvent<{ index: number }>) {
        setLanguage(e.detail.index === 0 ? 'en-US' : 'zh-CN')
        this.setData({ showDialog: false })
    },
})
