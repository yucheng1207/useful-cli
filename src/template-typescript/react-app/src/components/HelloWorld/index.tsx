import React from 'react';
import styles from './index.module.scss';

interface Props { }

const HelloWorld: React.FunctionComponent<Props> = (props) => {
	return (
		<div className={styles.container}>
			<span>hello_world</span>
		</div>
	);
};

export default HelloWorld;
