import { useMemo } from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { getLocales, ILocales } from "src/intl";
import { AppState } from "src/store";

interface Props {
}


const IntlContainer: React.FC<Props> = (props) => {

	const locale = useSelector<AppState, ILocales>(state => state.application.locale)

	const messages = useMemo(() => {
		return getLocales(locale)
	}, [locale])

	return <div style={{ width: '100%', height: '100%' }}>
		<IntlProvider
			locale={locale}
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
