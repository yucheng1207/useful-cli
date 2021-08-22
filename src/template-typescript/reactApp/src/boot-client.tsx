import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App/index";

const render = () =>
{
	ReactDOM.render(
		<App />,
		document.getElementById('react-app')
	);
}

render();
