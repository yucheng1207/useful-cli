import React, { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import styles from './index.module.scss';
import { useAppDispatch } from 'src/store';
import { AppState } from 'src/store/index';
import { ILoading } from 'src/store/application/slice';
import { actionCreators } from 'src/store/application/thunk';
import showAlertDialog from '../ModalDialog/AlertDialog';

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

	const showAlert = useCallback(() => {
		showAlertDialog({
			title: intl.formatMessage({ id: 'TIPS' }),
			buttonType: 'confirm',
			text: intl.formatMessage({ id: 'HELLO_WORLD' }),
			onOk: () => { console.log('onOk') }
		})
	}, [intl])

	return (
		<div className={styles.container}>
			<span>{intl.formatMessage({ id: 'HELLO_WORLD' })}</span>
			<Button onClick={showLoading}>测试 Loading</Button>
			<Button onClick={showAlert}>测试 Alert</Button>
		</div>
	);
};

export default HelloWorld;
