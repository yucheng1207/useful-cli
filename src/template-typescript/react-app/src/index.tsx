import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Home from './pages/Home/index';
import 'src/styles/app.scss';

const render = () => {
	ReactDOM.render(
		<Home />,
		document.getElementById('react-app')
	);
};

render();
