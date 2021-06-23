import StoreManager from 'store/storeManager'
import { formatTime } from 'utils/util'

Page({
    data: {
        logs: Array<{
            date: string
            timeStamp: string
        }>(),
    },
    onLoad() {
        const logs = StoreManager.getInstance().getLogs()
        this.setData({
            logs: (logs || []).map((log: string) => {
                return {
                    date: formatTime(new Date(Number(log))),
                    timeStamp: log,
                }
            }),
        })
    },
})
