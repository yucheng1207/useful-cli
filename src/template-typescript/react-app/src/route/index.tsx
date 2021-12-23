import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { URLS } from 'src/constants/urls'
import Home from '../pages/Home/index'
import Error from '../pages/Error/index'

const RouterContainer: React.FC = (props) => {
	return <BrowserRouter>
		<Routes>
			<Route path={URLS.HOME} element={<Home />} />
			<Route path={URLS.ERROR} element={<Error />} />
			<Route path="*" element={<Navigate replace to={URLS.HOME.replace('/*', '')} />} />
		</Routes>
	</BrowserRouter>
}

export default RouterContainer