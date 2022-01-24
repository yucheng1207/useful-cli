import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from "react-redux";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import { getLCP, getFID, getCLS } from 'web-vitals';
import 'src/styles/app.scss';
import AppContainer from './components/AppContainer/index';
import IntlContainer from './components/IntlContainer/index';
import RouterContainer from './route/index';
import store from './store/index';

/**
 * web-vitals log
 */
getCLS(console.log);
getFID(console.log);
getLCP(console.log);

/**
 * Init App
 */
const render = () => {
	ReactDOM.render(
		<ReduxProvider store={store}>
			<IntlContainer>
				<ConfigProvider
					autoInsertSpaceInButton={false}
					locale={store.getState().application.locale === 'zh-CN' ? zhCN : enUS}
					getPopupContainer={trigger => ((trigger && trigger.parentElement) || document.body)}
				>
					<AppContainer>
						<RouterContainer />
					</AppContainer>
				</ConfigProvider>

			</IntlContainer>
		</ReduxProvider>,
		document.getElementById('react-app')
	);
};

render();
