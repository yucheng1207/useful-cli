import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store, { key } from '@/store/index'
import styleImport from '@/utils/style-import'
// 加载全局样式
import './styles/index.scss'

const app = createApp(App)

styleImport(app).use(router).use(store, key).mount('#app')
