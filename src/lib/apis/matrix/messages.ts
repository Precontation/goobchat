import { matrixState } from '$lib/state/matrixClient.svelte';
import type { TimelineEvent, TimelineMessage } from '$lib/types/event';
import { EventType, MatrixClient, MatrixEvent, MsgType, Room, RoomEvent } from 'matrix-js-sdk';
import { client } from './client';
import { getRoomCaption } from './rooms';

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
			avatarSrc: member?.getMxcAvatarUrl()
		},

		data: {
			kind: 'text',
			content: event.getContent().body
		},

		status: event.status
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

const onTimelineEvent = async (event: MatrixEvent, room: Room | undefined) => {
	if (!room) return;

	if (matrixState.currentRoom?.roomId !== event.getRoomId()) return;

	await client?.decryptEventIfNeeded(event);

	const timelineEvent = toTimelineEvent(event, room);

	if (!timelineEvent) return;

	const eventInTimeline = matrixState.events.some(
		(stateEvent) => stateEvent.id === timelineEvent.id
	);

	if (!eventInTimeline) {
		// If the event doesn't exist, then it's a new message; add it to the timeline
		matrixState.events.push(timelineEvent);
	}
};

const onLocalEchoUpdated = async (event: MatrixEvent, room: Room | null, oldEventId?: string) => {
	if (!room) return;

	if (room.roomId !== event.getRoomId()) return;

	await client?.decryptEventIfNeeded(event);

	const timelineEvent = toTimelineEvent(event, room);
	if (!timelineEvent) return;

	const eventIndex = matrixState.events.findIndex(
		(stateEvent) => stateEvent.id === (oldEventId ?? timelineEvent.id)
	);
	if (eventIndex === -1) return;

	matrixState.events[eventIndex] = timelineEvent;
};

export const setupMessageListener = (client: MatrixClient) => {
	client.on(RoomEvent.Timeline, onTimelineEvent);
	client.on(RoomEvent.LocalEchoUpdated, onLocalEchoUpdated);
};

export const cleanupMessageListener = (client: MatrixClient) => {
	client.off(RoomEvent.Timeline, onTimelineEvent);
	client.off(RoomEvent.LocalEchoUpdated, onLocalEchoUpdated);
};

export const setupMessages = async (roomId: string) => {
	if (!client) return;
	const newRoom = client.getRoom(roomId);
	if (!newRoom) {
		matrixState.currentRoom = undefined;
		return;
	}

	matrixState.currentRoom = {
		avatarSrc: newRoom.getMxcAvatarUrl(),
		caption: getRoomCaption(newRoom),
		name: newRoom.name,
		roomId: newRoom.roomId
	};

	// Get initial messages in room
	const events = await Promise.all(
		newRoom
			.getLiveTimeline()
			.getEvents()
			.map(async (event) => {
				await client?.decryptEventIfNeeded(event);
				return toTimelineEvent(event, newRoom);
			})
	);

	matrixState.events = events.filter((event): event is TimelineEvent => event !== null);
};

export const sendTextMessage = (content: string, roomId: string) => {
	if (!client) return;

	client.sendMessage(
		roomId,
		null, // TODO: add thread support
		{
			msgtype: MsgType.Text,
			body: content
		}
	);
};
