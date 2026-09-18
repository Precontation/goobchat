// this will be for the stuff that reads and writes store in IndexedDB using the database.ts like the tokens, users ids, etc.

import { createTransaction } from './database';
const SESSION_KEY = 'current';
export interface Session {
	accessToken: string;
	userId: string;
	deviceId: string;
	homeserver: string;
}

export const saveSession = async (session: Session): Promise<void> => {
	const transaction = await createTransaction(['sessions'], 'readwrite');
	const objectStore = transaction.objectStore('sessions');
	const request = objectStore.put(session, SESSION_KEY);

	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};

export const loadSession = async (): Promise<Session | undefined> => {
	const transaction = await createTransaction(['sessions'], 'readonly');
	const objectStore = transaction.objectStore('sessions');
	const request = objectStore.get(SESSION_KEY);

	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
};

export const clearSession = async (): Promise<void> => {
	const transaction = await createTransaction(['sessions'], 'readwrite');
	const objectStore = transaction.objectStore('sessions');
	const request = objectStore.delete(SESSION_KEY);

	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};
