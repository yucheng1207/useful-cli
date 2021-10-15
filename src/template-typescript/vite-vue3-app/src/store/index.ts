import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

const defaultState = {
  count: 0
}

interface RootStateTypes {
  count: number
}

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')
export function useStore<T = RootStateTypes>() {
  return baseUseStore<T>(key)
}

// Create a new store instance.
export default createStore<RootStateTypes>({
  state() {
    return defaultState
  },
  mutations: {
    increment(state: typeof defaultState) {
      state.count++
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  },
  getters: {
    double(state: typeof defaultState) {
      return 2 * state.count
    }
  }
})
