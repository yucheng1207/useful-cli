import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '../index';
export const moduleName = 'app';
// 存储应用公用state
export interface AppState {
    count: number;
}

const state: AppState = {
    count: 0,
};

const getters: GetterTree<AppState, RootState> = {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    double(state, getters, rootState) {
        return 2 * state.count;
    },
};

const mutations: MutationTree<AppState> = {
    increment(state) {
        state.count++;
    },
};

const actions: ActionTree<AppState, RootState> = {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    increment({ state, commit, rootState }) {
        commit('increment');
    },
};

const appStore: Module<AppState, RootState> = {
    namespaced: true, // 带命名空间的模块
    state,
    getters,
    mutations,
    actions,
};

export default appStore;
