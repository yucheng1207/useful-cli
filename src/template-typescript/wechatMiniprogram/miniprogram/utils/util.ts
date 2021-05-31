export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
    )
}

const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
}

/**
 * 生成随机字符串
 * @param digitNum 字符串长度
 */
export const getRandomChars = (digitNum: number) => {
    const result: string[] = []
    for (let i = 0; i < digitNum; i++) {
        // 通过随机数的奇偶值来决定当前字母的大小写
        // const startAsciiNum: number = Math.ceil(Math.random() * 1000) % 2 === 0 ? 65 : 97
        const startAsciiNum = 97
        // 生成一个 0 ~ 25 的随机数
        const cursorAsciiNum = Math.ceil(Math.random() * 25)
        result.push(String.fromCharCode(startAsciiNum + cursorAsciiNum))
    }
    return result.join('')
}
