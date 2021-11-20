import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Home from './pages/Home/index';
import 'src/styles/app.scss';

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <Home />
        </AppContainer>,
        document.getElementById('react-app')
    );
};

render();
