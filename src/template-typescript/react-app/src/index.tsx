import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getLCP, getFID, getCLS } from 'web-vitals';
import Home from './pages/Home/index';
import 'src/styles/app.scss';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

const render = () => {
	ReactDOM.render(
		<Home />,
		document.getElementById('react-app')
	);
};

render();
