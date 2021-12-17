
import * as React from 'react';
import { useIntl } from 'react-intl';

const NotFound: React.FC = () => {
	const intl = useIntl()
	return <div>
		{intl.formatMessage({ id: 'PAGE_NOT_FOUND' })}
	</div>
}

export default NotFound