// this, is the main file thing yay and yes I WILL USE TYPESCRIPT AND NOT JAVASCRIPT OKAY?? OKAY.
import { matrixState } from '$lib/state/matrixClient.svelte';
import { createClient, IndexedDBStore, type MatrixClient } from 'matrix-js-sdk';
import {
	decodeRecoveryKey,
	type CryptoCallbacks,
	type VerificationRequest
} from 'matrix-js-sdk/lib/crypto-api';
import { VerificationMethod } from 'matrix-js-sdk/lib/types';
import { clearSession, loadSession, saveSession, type Session } from '../session';
import { clearThumbnailCache } from './media';
import { cleanupMessageListener, setupMessageListener } from './messages';
import { setupRoomListeners } from './rooms';
import { setupSync } from './sync';
import { loadCurrentUser, resetCurrentUser } from './user';

export let client: MatrixClient | undefined;

let cachedSecretStorageKey: [string, Uint8Array<ArrayBuffer>] | null = null;
let recoveryKeyInput: string | null = null;

const matrixCryptoCallbacks: CryptoCallbacks = {
	getSecretStorageKey: async ({ keys }) => {
		if (cachedSecretStorageKey) return cachedSecretStorageKey;

		if (!recoveryKeyInput) return null;

		const key = decodeRecoveryKey(recoveryKeyInput);
		const keyId = Object.keys(keys)[0];
		const defaultKeyId = await client?.secretStorage.getDefaultKeyId();

		// Use the default Secret Storage key when available; otherwise fall back to the first accepted key
		// The default key is the account's preferred current key, so prefer it when valid
		cachedSecretStorageKey = [defaultKeyId && defaultKeyId in keys ? defaultKeyId : keyId, key];

		return cachedSecretStorageKey;
	}
};

const normalizeHomeserver = (rawHomeserver: string): string => {
	let homeserver = rawHomeserver.trim();
	if (!homeserver.startsWith('https://') && !homeserver.startsWith('http://')) {
		homeserver = 'https://' + homeserver;
	}

	return homeserver;
};

const setupAndStart = async (session: Session) => {
	// Set up and start up a IndexedDB store for caching
	// a persistent Matrix room, sync, and timeline state
	const store = new IndexedDBStore({
		indexedDB: window.indexedDB,
		localStorage: window.localStorage
	});

	try {
		client = createClient({
			accessToken: session.accessToken,
			deviceId: session.deviceId,
			userId: session.userId,
			baseUrl: session.homeserver,
			store: store,
			cryptoCallbacks: matrixCryptoCallbacks,
			verificationMethods: [VerificationMethod.Sas] // TODO: add QR verification ONLY FOR MOBILE
		});
	} catch {
		matrixState.loggedIn = false;
		matrixState.loading = false;

		return;
	}

	await store.startup();

	await client.initRustCrypto();

	setupSync(client);
	setupMessageListener(client);
	setupRoomListeners(client);

	await client.startClient();
	await loadCurrentUser(client);

	matrixState.loggedIn = true;
	matrixState.loading = false;
};

export const load = async (): Promise<void> => {
	matrixState.loading = true;
	matrixState.loadingSession = true;
	const session = await loadSession();

	matrixState.loadingSession = false; // Session is loaded by this point no matter what

	if (!session) {
		matrixState.loggedIn = false; // It's already logged off by default, but doesn't hurt.
		matrixState.loading = false; // Loading = false only in this case because otherwise it should still load the account
		return;
	}

	await setupAndStart(session);
};

export const login = async (
	rawHomeserver: string,
	username: string,
	password: string
): Promise<void> => {
	const homeserver = normalizeHomeserver(rawHomeserver);

	const tempClient = createClient({ baseUrl: homeserver });
	await tempClient.clearStores();
	const response = await tempClient.loginRequest({
		type: 'm.login.password',
		identifier: { type: 'm.id.user', user: username },
		password,
		initial_device_display_name: 'goobchat'
	});

	const session: Session = {
		accessToken: response.access_token,
		deviceId: response.device_id,
		userId: response.user_id,
		homeserver: homeserver
	};

	await saveSession(session);
	await setupAndStart(session);
};

export const logout = async (): Promise<void> => {
	if (!client) return;
	cleanupMessageListener(client);
	try {
		await client.logout(true);
	} catch (error) {
		console.warn('server logout failed :( clearing local data anyways', error);
	}
	await client.clearStores();
	await clearSession();
	client = undefined;
	matrixState.loggedIn = false;
	matrixState.rooms = [];
	matrixState.events = [];
	recoveryKeyInput = null;
	cachedSecretStorageKey = null;
	resetCurrentUser();
	clearThumbnailCache();
};

export const requestVerificationOtherDevice = async (): Promise<VerificationRequest | null> => {
	const crypto = client?.getCrypto();
	if (!crypto) return null;

	return await crypto.requestOwnUserVerification();
};

export const verifyWithRecoveryKey = async (key: string): Promise<void> => {
	recoveryKeyInput = key;

	const crypto = client?.getCrypto();
	if (!crypto) return;

	try {
		await crypto.bootstrapCrossSigning({});
	} finally {
		recoveryKeyInput = null;
		cachedSecretStorageKey = null;
	}
};
