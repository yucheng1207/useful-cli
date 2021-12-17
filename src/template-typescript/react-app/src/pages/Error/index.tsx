
import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { URLS } from 'src/constants/urls'
import NotFound from './NotFound'

export default class Error extends React.PureComponent<{}, {}>
{
	public render() {
		return (
			<section>
				<Routes>
					<Route path={URLS.NOT_FOUND} element={<NotFound />} />
					<Route path="*" element={<Navigate replace to={URLS.NOT_FOUND} />} />
				</Routes>
			</section>
		);
	}
}