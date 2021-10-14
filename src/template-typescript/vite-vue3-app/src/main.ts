import { createApp } from 'vue'
import App from './App.vue'

import styleImport from '@/utils/style-import'

import router from '@/router/index'
import store, { key } from '@/store/index'

const app = createApp(App)

styleImport(app).use(router).use(store, key).mount('#app')
