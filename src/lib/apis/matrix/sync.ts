import { matrixState } from '$lib/state/matrixClient.svelte';
import { ClientEvent, MatrixClient, SyncState } from 'matrix-js-sdk';
import { loadRooms } from './rooms';

export const setupSync = (client: MatrixClient): void => {
	client.on(ClientEvent.Sync, (state) => {
		switch (state) {
			case SyncState.Prepared:
				matrixState.loading = false;
				loadRooms();
				break;

			case SyncState.Error:
				break;
		}
	});
};
