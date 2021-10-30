import { App } from 'vue';
import { ElButton, ElLoading, ElMessage } from 'element-plus/lib/components';

// 引入所有样式
// import 'element-plus/dist/index.css';

// 手动引入样式
// import 'element-plus/theme-chalk/base.css';
// import 'element-plus/theme-chalk/el-button.css';

const components = [ElButton, ElLoading, ElMessage];

export default {
    install: (app: App) => {
        components.forEach((item) => app.use(item));
    },
};
