import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ILocales } from 'src/intl';

export interface ILoading {
	visible: boolean,
	text?: string,
}

export interface IApplicationState {
	isMobile: boolean,
	isPad: boolean,
	locale: ILocales,
	loading: ILoading,
}

const userAgent = window && window.navigator && window.navigator.userAgent
const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
const isPad = /iPad/i.test(userAgent);
const initialState: IApplicationState = {
	isMobile,
	isPad,
	locale: 'zh-CN',
	loading: {
		visible: false
	}
}

/**
 * 使用`createSlice`创建一个带有`action creators`和`action types`的`reducer`数据切片
 * Redux 规定我们不可以直接在 switch cases 函数中直接修改 state 值，而是返回一个修改后的拷贝值
 * 而 Redux ToolKit 的 createSlice 和 createReducer 函数内部使用了 immer 让我们可以直接在函数中修改 state 中的属性值。
 * 但是需要注意的是，在同一个函数中我们不可以 既修改 state 又返回修改后的拷贝值，immer 是无法区分这两种情况的。
 */
const slice = createSlice({
	name: 'application',
	initialState,
	reducers: {
		SetLoadingAction(state: IApplicationState, action: PayloadAction<ILoading>) {
			state.loading = action.payload
		},
	}
})

export const {
	SetLoadingAction,
} = slice.actions

export default slice.reducer