import { matrixState } from '$lib/state/matrixClient.svelte';
import type { UIRoom } from '$lib/types/room';
import { ClientEvent, EventType, RoomEvent, type MatrixClient, type Room } from 'matrix-js-sdk';
import { client } from './client';


const getRoomCaption = (room: Room): string => {
const event = room.getLastLiveEvent();
if (!event) return '';
if (event.getType() !== EventType.RoomMessage) return '';
const body = event.getContent().body;
if (typeof body !== 'string') return '';
const sender = event.getSender() ?? '';
const name = room.getMember(sender)?.name ?? sender;
return name + ": " + body;

}

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
const  onRoomChange = (): void => {
	if (matrixState.loading) return;
	loadRooms();
}
export const setupRoomListeners = (client: MatrixClient): void => {
	client.on(RoomEvent.Timeline, onRoomChange);
	client.on(RoomEvent.MyMembership, onRoomChange);
	client.on(RoomEvent.Name, onRoomChange);
	client.on(ClientEvent.Room, onRoomChange);
}