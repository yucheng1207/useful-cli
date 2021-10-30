import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import appModules, { AppState } from './app';

// 为 store state 声明类型
// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
export interface State {
    app: AppState;
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol();

// 定义自己的 `useStore` 组合式函数
export function useStore() {
    return baseUseStore(key);
}

export default createStore({
    // state: {},
    // mutations: {},
    // actions: {},
    modules: {
        app: appModules,
    },
});
