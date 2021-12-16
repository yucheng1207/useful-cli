import React from 'react';
import { useIntl } from 'react-intl';
import styles from './index.module.scss';

interface Props { }

const HelloWorld: React.FunctionComponent<Props> = (props) => {
	const intl = useIntl()
	return (
		<div className={styles.container}>
			<span>{intl.formatMessage({ id: 'HELLO_WORLD' })}</span>
		</div>
	);
};

export default HelloWorld;
