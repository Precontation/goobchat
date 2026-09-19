import { matrixState } from '$lib/state/matrixClient.svelte';
import type { TimelineEvent, TimelineMessage } from '$lib/types/event';
import { EventType, MatrixClient, MatrixEvent, MsgType, Room, RoomEvent } from 'matrix-js-sdk';
import { client } from './client';

let room: Room | null;

const USER_AVATAR_SIZE = 64;

const handleRoomMessage = (
	event: MatrixEvent,
	eventRoom: Room,
	timelineEvent: TimelineEvent
): TimelineMessage | null => {
	if (!client) return null;

	const sender = event.getSender();
	if (!sender) return null; // Messages have to have a sender!
	const member = eventRoom.getMember(sender);

	const message: TimelineMessage = {
		...timelineEvent,

		// replyToMessage: event.replyEventId // TODO
		sender: {
			displayName: member?.name ?? sender,
			userId: sender,
			avatarSrc:
				member?.getAvatarUrl(
					client.getHomeserverUrl(),
					USER_AVATAR_SIZE,
					USER_AVATAR_SIZE,
					'crop',
					false,
					false,
					false
				) ?? undefined
		},

		data: {
			kind: 'text',
			content: event.getContent().body
		}
	};

	return message;
};

const toTimelineEvent = (event: MatrixEvent, eventRoom: Room): TimelineEvent | null => {
	const id = event.getId();
	if (!id) return null;
	if (!client) return null;

	const timelineEvent: TimelineEvent = {
		id: id,
		timestamp: event.localTimestamp
	};

	switch (event.getType()) {
		case EventType.RoomMessage:
			return handleRoomMessage(event, eventRoom, timelineEvent);
		default:
			console.warn("Event type '" + event.getType() + "' not implemented yet!");
			return null;
	}

	// Just in case I'm dumb
	return timelineEvent;
};

const onTimelineEvent = async (event: MatrixEvent) => {
	if (!room) return;
	if (room?.roomId !== event.getRoomId()) return;

	await client?.decryptEventIfNeeded(event);

	const timelineEvent = await toTimelineEvent(event, room);
	if (timelineEvent) matrixState.events.push(timelineEvent);
};

export const setupMessages = async (roomId: string) => {
	if (room) {
		// Remove old listener if it exists
		room.off(RoomEvent.Timeline, onTimelineEvent);
	}

	if (!client) return;
	room = client.getRoom(roomId);
	if (!room) return;

	// Get initial messages in room
	const events = await Promise.all(
		room
			.getLiveTimeline()
			.getEvents()
			.map(async (event) => {
				await client?.decryptEventIfNeeded(event);
				return toTimelineEvent(event, room!);
			})
	);

	matrixState.events = events.filter((event): event is TimelineEvent => event !== null);
};

export const setupMessageListener = (client: MatrixClient) => {
	client.on(RoomEvent.Timeline, onTimelineEvent);
};

export const sendTextMessage = (content: string) => {
	if (!client || !room) return;

	client.sendMessage(
		room.roomId,
		null, // TODO: add thread support
		{
			msgtype: MsgType.Text,
			body: content
		}
	);
};
