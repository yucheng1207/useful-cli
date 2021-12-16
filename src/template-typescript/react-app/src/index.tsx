import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getLCP, getFID, getCLS } from 'web-vitals';
import Home from './pages/Home/index';
import 'src/styles/app.scss';
import IntlContainer from './components/IntlContainer/index';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

const render = () => {
	ReactDOM.render(
		<IntlContainer locale='zh-CN'>
			<Home />
		</IntlContainer>
		,
		document.getElementById('react-app')
	);
};

render();
