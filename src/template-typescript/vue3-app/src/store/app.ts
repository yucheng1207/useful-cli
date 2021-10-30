import { Module } from 'vuex';
import { State } from './index';

// 存储应用公用state
export interface AppState {
    count: number;
}

const appModule: Module<AppState, State> = {
    namespaced: true, // 带命名空间的模块
    state: {
        count: 0,
    },
    mutations: {
        increment(state) {
            state.count++;
        },
    },
    actions: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        increment({ state, commit, rootState }) {
            commit('increment');
        },
    },
    getters: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        double(state, getters, rootState) {
            return 2 * state.count;
        },
    },
};

export default appModule;
