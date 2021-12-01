import * as nedb from 'nedb';

export default class NeDBManager {
	/**
	 * Database container for using NeDB
	 */
	private dbContainer: { [key: string]: nedb };

	private static _manager: NeDBManager;

	constructor() {
		this.dbContainer = {};
	}

	public static getInstance(): NeDBManager {
		if (!this._manager) {
			this._manager = new NeDBManager();
		}

		return this._manager;
	}

	/**
	 * Launch a new database and add it to dbContainer
	 * This method should ONLY be called during app launch
	 *
	 * @param {string} key - key of the data store stored in dbContainer
	 * @param {nedb.DataStoreOptions} options - options passed to create the data store
	 */
	public addDataStore(key: string, options: nedb.DataStoreOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			const db = new nedb(options);
			this.dbContainer[key] = db;

			if (!options.autoload) {
				db.loadDatabase((err: Error) => {
					if (err) {
						reject(err)
					}
					else {
						resolve()
					}
				});
			}
			else {
				resolve()
			}
		})
	}

	/**
	 * Inserts a document to a specific data store
	 *
	 * @param {string} key - key of the data store stored in dbContainer
	 * @param {T} document - documentation to be inserted
	 */
	public insert<T>(key: string, document: T): Promise<T> {
		this.validate(key, "insert");
		return new Promise((resolve, reject) => {
			this.dbContainer[key].insert(document, (err: Error, newDoc: T) => {
				// newDoc is the newly inserted document, including its _id
				if (err) {
					reject(err);
				}
				else {
					resolve(newDoc);
				}
			});
		});
	}

	/**
	 * Finds document list with certain `query` and return as specified `projection`, if any
	 *
	 * @param {string} key - key of the data store we are querying on
	 * @param {any} query - query, should be constructed per the official NeDB doc
	 * @param {T} projection - the wanted returned fields (i.e. projection)
	 */
	public find<T>(key: string, query: any, projection?: T): Promise<T[]> {
		this.validate(key, "find");
		return new Promise((resolve, reject) => {
			this.dbContainer[key].find(query, projection, (err: Error, documents: T[]) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(documents);
				}
			})
		});
	}

	/**
	 * Finds a document with certain `query` and return as specified `projection`, if any
	 *
	 * @param {string} key - key of the data store we are querying on
	 * @param {any} query - query, should be constructed per the official NeDB doc
	 * @param {T} projection - the wanted returned fields (i.e. projection)
	 */
	public findOne<T>(key: string, query: any, projection?: T): Promise<T> {
		this.validate(key, "findOne");
		return new Promise((resolve, reject) => {
			this.dbContainer[key].findOne(query, projection, (err: Error, document: T) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(document);
				}
			})
		});
	}

	/**
	 * Query to update a document satisifying certain conditions
	 *
	 * @param {string} key - key of the data store we are querying on
	 * @param {any} query - query to target documents we want to update
	 * @param {any} updateQuery - query to update (i.e. changes to be applied) documents
	 * @param {UpdateOptions} options - update options provided by NeDB
	 */
	public update(key: string, query: any, updateQuery: any, options?: nedb.UpdateOptions) {
		this.validate(key, "update");
		return new Promise((resolve, reject) => {
			this.dbContainer[key].update(query, updateQuery, options || {}, (err: Error, numberOfUpdated: number, affectedDocuments: any, upsert: boolean) => {
				if (err) {
					console.log("update error")
					console.log(err);
					reject(err);
				}
				else {
					// see https://github.com/louischatriot/nedb/issues/527 https://github.com/louischatriot/nedb#persistence
					this.dbContainer[key].persistence.compactDatafile();
					resolve(numberOfUpdated);
				}
			})
		});
	}

	/**
	 * Query to remove a document satisfying certain conditions
	 *
	 * @param {string} key - key of the data store we are querying on
	 * @param {any} query - query to target documents we want to remove
	 * @param {UpdateOptions} options - remove options provided by NeDB
	 */
	public remove(key: string, query: any, options?: nedb.UpdateOptions): Promise<number> {
		this.validate(key, "remove");
		return new Promise((resolve, reject) => {
			this.dbContainer[key].remove(query, options || {}, (err: Error, n: number) => {
				if (err) {
					reject(err);
				}
				else {
					this.dbContainer[key].persistence.compactDatafile();
					resolve(n);
				}
			});
		});
	}

	/**
	 * Validate operations against NeDB
	 *
	 * @param {string} key - key of data store to be validated
	 * @param {string} scenario - description of the scenario we are validating on, used to throw an error
	 */
	private validate(key: string, scenario: string) {
		if (!this.dbContainer[key]) throw new Error(`Invalid DataStore key when performing ${key} ${scenario}`);
	}
}