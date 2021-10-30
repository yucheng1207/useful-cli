import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState, RootMutations, RootActions, RootGetters } from '../index'
import { IStore, ICommit, IDispatch, IActionContext, GettersReturnType } from '../type'

export const moduleName = 'app'
type IModuleName = typeof moduleName
// 存储应用公用state

/**
 * 定义 state
 */
export interface IAppState {
  count: number
}

const state: IAppState = {
  count: 0
}

/**
 * 定义 getters
 */

const GettersTypes = {
  double: 'double'
} as const
type VGettersTypes = typeof GettersTypes[keyof typeof GettersTypes]

export type IAppGetters = {
  readonly [key in VGettersTypes]: (
    state: IAppState,
    getters: GettersReturnType<IAppGetters, key>,
    rootState: RootState,
    rootGetters: RootGetters
  ) => key extends typeof GettersTypes.double ? number : any
}

const getters: GetterTree<IAppState, RootState> & IAppGetters = {
  double(state, getters, rootState) {
    return 2 * state.count
  }
}

/**
 * 定义 mutation
 */
const MutationTypes = {
  increment: 'increment',
  update: 'update'
} as const
export type IAppMutations = {
  [MutationTypes.increment](state: IAppState): void
  [MutationTypes.update]<T extends { data: number }>(state: IAppState, payload: T): void
}
const mutations: MutationTree<IAppState> & IAppMutations = {
  increment(state) {
    state.count++
  },
  update(state, { data }) {
    state.count = data
  }
}

/**
 * 定义 actions
 */
export const ActionTypes = {
  increment: 'increment',
  update: 'update'
} as const
type IAppActionContext = IActionContext<
  IAppState,
  RootState,
  IAppActions,
  RootActions,
  IAppMutations,
  RootMutations,
  IAppGetters,
  RootGetters
>
export type IAppActions = {
  [ActionTypes.increment]: (context: IAppActionContext) => void
  [ActionTypes.update]: (context: IAppActionContext, payload: number) => void
}
const actions: ActionTree<IAppState, RootState> & IAppActions = {
  increment({ commit, state, getters, dispatch, rootGetters, rootState }) {
    commit(MutationTypes.increment, undefined)
  },
  update({ commit, state, getters, dispatch, rootGetters, rootState }, data) {
    commit(MutationTypes.update, { data })
  }
}

export type IAppStore = IStore<
  { [moduleName]: IAppState },
  ICommit<IAppMutations, RootMutations, true>,
  IDispatch<IAppActions, RootActions, true>,
  {
    [key in keyof IAppGetters as `${IModuleName}/${key}`]: ReturnType<IAppGetters[key]>
  }
>

const appStore: Module<IAppState, RootState> = {
  namespaced: true, // 带命名空间的模块
  state,
  getters,
  mutations,
  actions
}

export default appStore
