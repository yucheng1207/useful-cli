import { DataStoreOptions } from "nedb";
import { autoupdateConfig } from '../updater/AutoUpdater';

const StoreConfigs: { name: string, options?: DataStoreOptions }[] = [
	{
		name: "hot_update_record",
		options: {
			filename: autoupdateConfig.hotUpdateDatastorePath,
		}
	}
];

export default StoreConfigs;