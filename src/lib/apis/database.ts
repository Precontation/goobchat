const IDB_DATABASE_NAME = 'goobchat'; // chatgoob

let dbPromise: Promise<IDBDatabase> | undefined;

export const initializeDatabase = () => {
	if (dbPromise) return dbPromise;

	dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
		const request = window.indexedDB.open(IDB_DATABASE_NAME, 1);

		request.onerror = (event) => {
			console.error('error when trying to open the indexedDB db: ', event);
			dbPromise = undefined;
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = () => {
			const db = request.result;

			if (!db.objectStoreNames.contains('sessions')) {
				db.createObjectStore('sessions');
			}
		};
	});

	return dbPromise;
};

export const createTransaction = async (
	storeNames: string | Iterable<string>,
	mode?: IDBTransactionMode,
	options?: IDBTransactionOptions
) => {
	const db = await initializeDatabase();
	return db.transaction(storeNames, mode, options);
};
