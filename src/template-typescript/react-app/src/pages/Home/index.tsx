import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import HelloWorld from 'src/components/HelloWorld';
import HttpManager from 'src/http/HttpManager';

interface Props { }

const App: React.FunctionComponent<Props> = (props) => {
	/**
	 * 从路由中获取accessToken
	 */
	const params = useParams()
	useEffect(() => {
		if (params.accessToken) {
			HttpManager.getInstance().setAccessToken(params.accessToken)
		}
	}, [params])

	return (
		<div className={styles.home}>
			<HelloWorld />
		</div>
	);
};

export default App;
