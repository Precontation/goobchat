import { matrixState } from '$lib/state/matrixClient.svelte';
import type { UIRoom } from '$lib/types/room';
import {
	ClientEvent,
	EventType,
	RoomEvent,
	RoomMember,
	type MatrixClient,
	type Room
} from 'matrix-js-sdk';
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

/** Returns the avatar src of the DMed user if it's a dm and undefined if it isn't (more than you and one other user) OR if the other user doesn't have an avatar url */
export const getDMAvatar = (members: RoomMember[]): string | undefined => {
	if (members.length > 2) return;

	return members
		.find((element) => {
			/* Optionally, I could filter for joined members with:
			element.membership === KnownMembership.Join
			However, i think that's not a good idea considering
			the fact you should still see the user avatar
			even if they left.
			*/
			return element.userId !== client?.getUserId();
		})
		?.getMxcAvatarUrl();
};

export const loadRooms = (): void => {
	if (!client) return;
	const cachedClient = client;

	matrixState.rooms = cachedClient.getRooms().map((room): UIRoom => {
		return {
			name: room.name,
			roomId: room.roomId,
			caption: getRoomCaption(room),
			avatarSrc: room.getMxcAvatarUrl() ?? getDMAvatar(room.getMembers()) ?? null
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
