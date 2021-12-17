import * as React from "react";
import { IntlProvider } from "react-intl";
import { getLocales, ILocales } from "src/intl";

interface Props {
	locale: ILocales;
}


const IntlContainer: React.FC<Props> = (props) => {

	const messages = React.useMemo(() => {
		return getLocales(props.locale)
	}, [props.locale])

	return <div style={{ width: '100%', height: '100%' }}>
		<IntlProvider
			locale={props.locale}
			messages={messages}
			onError={(err: any) => {
				console.warn(err)
			}}
		>
			{props.children}
		</IntlProvider>
	</div>
}

export default IntlContainer;
