import { routerReducer, routerMiddleware } from 'react-router-redux'
import { configureStore as _configureStore, combineReducers } from "@reduxjs/toolkit"
import { useDispatch } from 'react-redux';
import application from './application/slice'

/**
 * Refrence: https://redux-toolkit.js.org/usage/usage-with-typescript
 */
const rootReducer = combineReducers({
	application,
	routing: routerReducer,
})
function configureStore() {
	return _configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({ immutableCheck: false, serializableCheck: false })
		// .concat([routerMiddleware(history)]),
	})
}

const store = configureStore();

export type AppState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types

export default store

