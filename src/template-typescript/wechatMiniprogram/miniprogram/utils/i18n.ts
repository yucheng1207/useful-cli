/**
 * 参考：miniprogram-i18n接口文档： https://developers.weixin.qq.com/miniprogram/dev/extended/utils/miniprogram-i18n/api.html#%E5%88%9D%E5%A7%8B%E5%8C%96-i18n-%E8%BF%90%E8%A1%8C%E6%97%B6
 */
import { getI18nInstance } from '@miniprogram-i18n/core'

export interface I18n {
    initI18n(localesConfig: object): I18n
    getI18nInstance(): I18n
    t(key: string, params?: object): string
    getLocale(): string
    setLocale(currentLocale: string): void
    getFallbackLocale(): string
    onLocaleChange(handler: (currentLocale: string) => void): object
}

export const i18n: I18n = getI18nInstance()

export const message = (key: string, params?: object) => {
    return i18n.t(key, params)
}

/**
 * 切换语言
 */
export const toggleLanguage = () => {
    i18n.setLocale(i18n.getLocale() === 'zh-CN' ? 'en-US' : 'zh-CN')
}

export default i18n
