import React from 'react';
import styles from './index.module.scss'

interface Props {

}

const App: React.FunctionComponent<Props> = (props) => {
	return <div className={styles.App}>
		<span>hello_world</span>
	</div>
}

export default App;
