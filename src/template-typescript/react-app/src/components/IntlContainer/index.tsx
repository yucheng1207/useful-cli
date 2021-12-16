import * as React from "react";
import { IntlProvider } from "react-intl";
import { getLocales, ILocales } from "src/intl";

interface Props {
	locale: ILocales;
}

export class IntlContainer extends React.PureComponent<Props, {}> {
	public render() {
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<IntlProvider
					locale={this.props.locale}
					messages={getLocales(this.props.locale)}
					onError={(err: any) => {
						console.warn(err)
					}}
				>
					{this.props.children}
				</IntlProvider>
			</div>
		);
	}
}

export default IntlContainer;
