import { DataStoreOptions } from 'nedb';
import { autoupdateConfig } from '../updater/AutoUpdater';
import StoreNames from './StoreName';

const StoreConfigs: { name: string; options?: DataStoreOptions }[] = [
	{
		name: StoreNames.HOT_UPDATE_RECORD_STORE,
		options: {
			filename: autoupdateConfig.hotUpdateDatastorePath,
		}
	}
];

export default StoreConfigs;
