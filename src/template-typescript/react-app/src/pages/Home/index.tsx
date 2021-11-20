import React from 'react';
import styles from './index.module.scss';
import HelloWorld from '../../components/HelloWorld';

interface Props {}

const App: React.FunctionComponent<Props> = (props) => {
    return (
        <div className={styles.home}>
            <HelloWorld />
        </div>
    );
};

export default App;
