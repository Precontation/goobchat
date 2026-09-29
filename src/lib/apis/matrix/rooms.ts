import { matrixState } from '$lib/state/matrixClient.svelte';
import type { UIRoom } from '$lib/types/room';
import { ClientEvent, EventType, RoomEvent, type MatrixClient, type Room } from 'matrix-js-sdk';
import { client } from './client';

export const getRoomCaption = (room: Room): string => {
	const event = room.getLastLiveEvent();
	if (!event) return '';
	if (event.getType() !== EventType.RoomMessage) return '';
	const body = event.getContent().body;
	if (typeof body !== 'string') return '';
	const sender = event.getSender() ?? '';
	const name = room.getMember(sender)?.name ?? sender;
	return name + ': ' + body;
};

export const loadRooms = (): void => {
	if (!client) return;
	const cachedClient = client;

	matrixState.rooms = cachedClient.getRooms().map((room): UIRoom => {
		return {
			name: room.name,
			roomId: room.roomId,
			caption: getRoomCaption(room),
			avatarSrc: room.getMxcAvatarUrl()
		};
	});
};
const onRoomChange = (): void => {
	if (matrixState.loading) return;
	loadRooms();
};
export const setupRoomListeners = (client: MatrixClient): void => {
	client.on(RoomEvent.Timeline, onRoomChange);
	client.on(RoomEvent.MyMembership, onRoomChange);
	client.on(RoomEvent.Name, onRoomChange);
	client.on(ClientEvent.Room, onRoomChange);
};
