import React, { ReactNode, useEffect } from 'react';
import { Button } from 'antd';
import styles from './index.module.scss';

interface Props {
	text?: string | ReactNode,
	className?: string,
}

/**
 * 该组件用于测试 Moudle Federation， 本工程作为主应用输出该组件
 * @param props
 * @returns
 */
export const LocalExportButton: React.FunctionComponent<Props> = (props) => {
	useEffect(() => {
		console.log('Useful Export Button Loaded!')
	}, [])
	return (
		<Button className={`${styles.container} ${props.className}`}>
			{props.text || props.children || 'Module Federation Test Button'}
		</Button>
	);
};

export default LocalExportButton;
