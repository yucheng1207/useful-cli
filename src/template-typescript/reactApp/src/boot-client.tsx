import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./components/App/index";
import 'src/styles/app.scss';

const render = () => {
	ReactDOM.render(
		<AppContainer>
			<App />
		</AppContainer>,
		document.getElementById('react-app')
	);
}

render();
