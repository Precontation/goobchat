import { matrixState } from '$lib/state/matrixClient.svelte';
import type { UIRoom } from '$lib/types/room';
import type { Room } from 'matrix-js-sdk';
import { client } from './client';

const getRoomCaption = (room: Room): string => {
	const event = room.getLastLiveEvent();
	if (!event) return '';

	const eventContent = event.getContent();

	console.log(eventContent);
	return eventContent.displayname + ': ' + eventContent.body;
};

const ROOM_AVATAR_SIZE = 64;
export const loadRooms = (): void => {
	if (!client) return;
	const cachedClient = client;

	matrixState.rooms = cachedClient.getRooms().map((room): UIRoom => {
		return {
			name: room.name,
			roomId: room.roomId,
			caption: getRoomCaption(room),
			avatarSrc: room.getAvatarUrl(
				cachedClient.getHomeserverUrl(),
				ROOM_AVATAR_SIZE,
				ROOM_AVATAR_SIZE,
				'crop',
				false,
				false
			) // TODO: make last false true and make all avatars have authentication
		};
	});
};
