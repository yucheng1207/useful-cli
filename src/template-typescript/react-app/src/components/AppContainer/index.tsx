import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { ILoading } from 'src/store/application/slice';
import styles from './index.module.scss';
import { AppState } from 'src/store/index';

const AppContainer: React.FC<{}> = function (props) {
	const { children } = props
	const intl = useIntl()
	const loading = useSelector<AppState, ILoading>(state => state.application.loading)
	return (
		<div className={styles.container}>
			<Spin
				spinning={loading.visible}
				tip={loading.text || intl.formatMessage({ id: 'LOADING' })}
				size="large"
			/>
			{children}
		</div>
	);
}

export default AppContainer