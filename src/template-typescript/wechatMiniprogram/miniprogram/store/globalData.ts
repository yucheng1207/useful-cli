import { IMiniApp } from 'app'

interface IUser {
    name: string
    phone: string
}

export interface IGlobalData {
    user?: IUser
}

export function initGlobalData(): IGlobalData {
    const user = wx.getStorageSync('user') as IUser
    return { user }
}

export function setUser(app: IMiniApp, user?: IUser) {
    app.globalData.user = user
    wx.setStorageSync('user', user)
}
