import React, { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import styles from './index.module.scss';
import { useAppDispatch } from 'src/store';
import { AppState } from 'src/store/index';
import { ILoading } from 'src/store/application/slice';
import { actionCreators } from 'src/store/application/thunk';

interface Props { }

const HelloWorld: React.FunctionComponent<Props> = (props) => {
	const intl = useIntl()
	const dispatch = useAppDispatch()
	const loading = useSelector<AppState, ILoading>(state => state.application.loading)

	useEffect(() => {
		console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)
		console.log(`process.env.PUBLIC_URL: ${process.env.PUBLIC_URL}`)
		console.log(`process.env.ENV: ${process.env.ENV}`)
	}, [])

	const showLoading = useCallback(() => {
		if (!loading.visible) {
			dispatch(actionCreators.showLoading())
			setTimeout(() => {
				dispatch(actionCreators.hideLoading())
			}, 2000)
		}
	}, [loading, dispatch])

	return (
		<div className={styles.container}>
			<span>{intl.formatMessage({ id: 'HELLO_WORLD' })}</span>
			<Button onClick={showLoading}>Show Loading</Button>
		</div>
	);
};

export default HelloWorld;
