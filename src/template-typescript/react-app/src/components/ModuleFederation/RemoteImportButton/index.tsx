import React, { useEffect } from 'react';
// import { Button as RemoteButton, ButtonProps } from "app2/Button";
// or
// const RemoteButton = React.lazy(() => import("app2/Button"));
// or
// const RemoteButton = React.lazy(() => import("app2/Button").then(({ Button }) => ({ default: Button })));

interface Props {
}

/**
 * 该组件用于测试 Moudle Federation， 本工程作为子应用引入remote组件
 * 测试前要先确保RemoteButton存在
 * @param props
 * @returns
 */
const RemoteImportButton: React.FunctionComponent<Props> = (props) => {
	useEffect(() => {
		console.log('RemoteImportButton Loaded!')
	}, [])
	return <React.Suspense fallback="Loading Button">
		{/* <RemoteButton /> */}
	</React.Suspense>;
};

export default RemoteImportButton;
