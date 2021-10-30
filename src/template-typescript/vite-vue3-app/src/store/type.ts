import { Store as VuexStore, CommitOptions, DispatchOptions, ActionContext } from 'vuex'

export type GettersReturnType<T, K extends string> = {
  readonly [key in Exclude<keyof T, K>]: T[key] extends (...args: any) => any
    ? ReturnType<T[key]>
    : never
}

export type RootGettersReturnType<T extends Record<string, any>, TModuleName extends string> = {
  readonly [key in keyof T as `${TModuleName}/${Extract<key, string>}`]: T[key] extends (
    ...args: any
  ) => any
    ? ReturnType<T[key]>
    : never
}

type TObjFn = Record<string, (...args: any) => any>
type UnionToIntersection<U extends TObjFn> = (U extends TObjFn ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
type FlatRootObj<T extends Record<string, TObjFn>> = T extends Record<infer U, TObjFn>
  ? U extends keyof T
    ? {
        [key in keyof T[U] as `${Extract<U, string>}/${Extract<key, string>}`]: T[U][key]
      }
    : never
  : never

export type ICommit<
  IMutations extends TObjFn,
  IRootMutations extends Record<string, TObjFn>,
  UseInGlobal extends boolean
> = {
  commit<
    M = UseInGlobal extends true
      ? UnionToIntersection<FlatRootObj<IRootMutations>>
      : UnionToIntersection<FlatRootObj<IRootMutations>> & IMutations,
    K extends keyof M = keyof M
  >(
    key: K,
    payload: Parameters<Extract<M[K], (...args: any) => any>>[1],
    options?: CommitOptions
  ): void
}

export type IDispatch<
  IActions extends TObjFn,
  IRootActions extends Record<string, TObjFn>,
  UseInGlobal extends boolean
> = {
  dispatch<
    M = UseInGlobal extends true
      ? UnionToIntersection<FlatRootObj<IRootActions>>
      : UnionToIntersection<FlatRootObj<IRootActions>> & IActions,
    K extends keyof M = keyof M
  >(
    key: K,
    payload: Parameters<Extract<M[K], (...args: any) => any>>[1],
    options?: DispatchOptions
  ): Promise<ReturnType<Extract<M[K], (...args: any) => any>>>
}

export type IActionContext<
  IState,
  IRootState,
  IActions extends TObjFn,
  IRootActions extends Record<string, TObjFn>,
  IMutations extends TObjFn,
  IRootMutations extends Record<string, TObjFn>,
  IGetters extends TObjFn,
  TRootGetters extends Record<string, any>
> = Omit<ActionContext<IState, IRootState>, 'commit' | 'dispatch' | 'getters' | 'rootGetters'> &
  ICommit<IMutations, IRootMutations, false> &
  IDispatch<IActions, IRootActions, false> & {
    getters: {
      [key in keyof IGetters]: ReturnType<IGetters[key]>
    }
  } & { rootGetters: TRootGetters }

export type IStore<
  IState extends Record<string, any>,
  ICommit extends {
    commit(type: string, payload?: any, options?: CommitOptions | undefined): void
  },
  IDispatch extends {
    dispatch(type: string, payload?: any, options?: DispatchOptions | undefined): Promise<any>
  },
  IGetters
> = Omit<VuexStore<IState>, 'commit' | 'dispatch' | 'getters'> &
  ICommit &
  IDispatch & {
    getters: IGetters
  }
