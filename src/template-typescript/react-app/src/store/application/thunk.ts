

import { AppDispatch } from '..'
import { SetLoadingAction } from './slice'

export type ApplicationAction = typeof actionCreators

export const actionCreators = {
	showLoading: (text?: string) => (dispatch: AppDispatch) => dispatch(SetLoadingAction({ visible: true, text })),
	hideLoading: () => async (dispatch: AppDispatch) => {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				dispatch(SetLoadingAction({ visible: false }))
				resolve()
			}, 100)
		})
	},
}
