export type History = {
	id: number;
	text: string;
	htmlAsText: string;
	title: string;
	timestamp: Date;
};

export class HistoryManager {
	private dbRequest: Promise<IDBDatabase>;

	private static initDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = window.indexedDB.open('HistoryDB', 1);

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				if (!db.objectStoreNames.contains('History')) {
					const store = db.createObjectStore('History', {
						keyPath: 'id',
						autoIncrement: true
					});

					// Optionally create indexes
					store.createIndex('timestamp', 'timestamp', { unique: false });
					console.log('Object store "History" created');
				}
			};

			request.onsuccess = () => {
				console.log('DB Init Success');
				resolve(request.result);
			};

			request.onerror = () => {
				console.warn('DB Failed To Initialize');
				reject(request.error);
			};
		});
	}

	constructor() {
		this.dbRequest = HistoryManager.initDB();
	}

	async getAllStore(): Promise<History[]> {
		const db = await this.dbRequest;
		return new Promise((resolve, reject) => {
			const transaction = db.transaction('History', 'readonly');
			const store = transaction.objectStore('History');
			const request = store.getAll();

			request.onsuccess = () => resolve(request.result as History[]);
			request.onerror = () => reject(request.error);
		});
	}

	async addStore(payload: Omit<History, 'id'>): Promise<number> {
		const db = await this.dbRequest;
		return new Promise((resolve, reject) => {
			const transaction = db.transaction('History', 'readwrite');
			const store = transaction.objectStore('History');
			const request = store.add(payload);

			request.onsuccess = () => {
				console.log('Added successful');
				resolve(request.result as number);
			};
			request.onerror = () => reject(request.error);
		});
	}

	async deleteStore(id: number): Promise<void> {
		const db = await this.dbRequest;
		return new Promise((resolve, reject) => {
			const transaction = db.transaction('History', 'readwrite');
			const store = transaction.objectStore('History');
			const request = store.delete(id);

			request.onsuccess = () => {
				console.log('Deletion Successful');
				resolve();
			};
			request.onerror = () => reject(request.error);
		});
	}

	async clearAll(): Promise<void> {
		const db = await this.dbRequest;
		return new Promise((resolve, reject) => {
			const transaction = db.transaction('History', 'readwrite');
			const store = transaction.objectStore('History');
			const request = store.clear();

			request.onsuccess = () => {
				console.log('All data cleared');
				resolve();
			};
			request.onerror = () => reject(request.error);
		});
	}
}
