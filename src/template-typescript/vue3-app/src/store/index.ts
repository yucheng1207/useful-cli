import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import appStore, { AppState } from './modules/app';
import { moduleName as appModuleName } from '@/store/modules/app';
const debug = process.env.NODE_ENV !== 'production';

// 为 store state 声明类型
// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
export interface RootState {
    [appModuleName]: AppState;
}

// 定义 injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// 定义自己的 `useStore` 组合式函数
export function useStore() {
    return baseUseStore(key);
}

export default createStore({
    strict: debug,
    modules: {
        [appModuleName]: appStore,
    },
});
