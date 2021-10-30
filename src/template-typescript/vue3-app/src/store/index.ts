import { InjectionKey } from 'vue';
import {
    createStore,
    createLogger,
    useStore as baseUseStore,
    Store,
} from 'vuex';
import appStore, { IAppState, IAppActions, IAppGetters } from './modules/app';
import { RootGettersReturnType } from './type';
import {
    moduleName as appModuleName,
    IAppMutations,
    IAppStore,
} from '@/store/modules/app';
const debug = process.env.NODE_ENV !== 'production';

// 为 store state 声明类型
// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
// 参考：[赋予Vuex 4.x 更好的 TypeScript体验](https://juejin.cn/post/6999886459343732772#comment)
export interface RootState {
    [appModuleName]: IAppState;
}

export type RootMutations = {
    [appModuleName]: IAppMutations;
};

export type RootActions = {
    [appModuleName]: IAppActions;
};

type IAppGettersType = RootGettersReturnType<IAppGetters, typeof appModuleName>;
export type RootGetters = IAppGettersType;

export type RootStore = IAppStore;

// 定义 injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// 定义自己的 `useStore` 组合式函数
export function useStore(): RootStore {
    return baseUseStore(key);
}

export default createStore({
    strict: debug,
    plugins: debug ? [createLogger()] : [],
    modules: {
        [appModuleName]: appStore,
    },
});
