// this, is the main file thing yay and yes I WILL USE TYPESCRIPT AND NOT JAVASCRIPT OKAY?? OKAY.
import { matrixState } from '$lib/state/matrixClient.svelte';
import { createClient, IndexedDBStore, type MatrixClient } from 'matrix-js-sdk';
import { loadSession, saveSession, type Session } from '../session';
import { setupMessageListener } from './messages';
import { setupSync } from './sync';

export let client: MatrixClient | undefined;

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
			store: store
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

	await client.startClient();

	matrixState.loggedIn = true;
};

export const load = async (): Promise<void> => {
	matrixState.loading = true;
	const session = await loadSession();

	if (!session) {
		matrixState.loggedIn = false; // It's already logged off by default, but doesn't hurt.
		matrixState.loading = false;
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
