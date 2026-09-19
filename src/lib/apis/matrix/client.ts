// this, is the main file thing yay and yes I WILL USE TYPESCRIPT AND NOT JAVASCRIPT OKAY?? OKAY.
import { matrixState } from '$lib/state/matrixClient.svelte';
import { createClient, type MatrixClient } from 'matrix-js-sdk';
import { loadSession, saveSession, type Session } from '../session';
import { setupSync } from './sync';

export let client: MatrixClient | undefined;

const normalizeHomeserver = (rawHomeserver: string): string => {
	let homeserver = rawHomeserver.trim();
	if (!homeserver.startsWith('https://') && !homeserver.startsWith('http://')) {
		homeserver = 'https://' + homeserver;
	}

	return homeserver;
};

const setupAndStart = async (c: MatrixClient) => {
	await c.initRustCrypto();

	setupSync(c);

	c.startClient();
};

export const load = async (): Promise<void> => {
	matrixState.loading = true;
	const session = await loadSession();

	if (!session) {
		matrixState.loading = false;
		matrixState.loggedIn = false; // It's already logged off by default, but doesn't hurt.
		// Don't set loading to false; this is handled on a SyncState.PREPARED callback
		return;
	}

	try {
		client = createClient({
			accessToken: session.accessToken,
			deviceId: session.deviceId,
			userId: session.userId,
			baseUrl: session.homeserver
		});

		matrixState.loggedIn = true;
		matrixState.loading = false;

		await setupAndStart(client);
	} catch {
		matrixState.loggedIn = false;
		matrixState.loading = false;
	}
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
	client = createClient({
		baseUrl: homeserver,
		accessToken: session.accessToken,
		userId: session.userId,
		deviceId: session.deviceId
	});

	matrixState.loggedIn = true;

	await setupAndStart(client);
};
