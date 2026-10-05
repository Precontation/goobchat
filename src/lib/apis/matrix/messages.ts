import { sendNotif } from '$lib/services/notifications';
import { matrixState } from '$lib/state/matrixClient.svelte';
import type { MessageData, TimelineEvent, TimelineMessage } from '$lib/types/event';
import {
	EventType,
	MatrixClient,
	MatrixEvent,
	MatrixEventEvent,
	MsgType,
	Room,
	RoomEvent
} from 'matrix-js-sdk';
import type { RoomMessageEventContent } from 'matrix-js-sdk/lib/types';
import { client } from './client';
import { getRoomCaption } from './rooms';

const isStillActive = (roomId: string, activeClient: MatrixClient): boolean =>
	matrixState.currentRoom?.roomId === roomId && client === activeClient;

const handleRoomMessage = (
	event: MatrixEvent,
	eventRoom: Room,
	timelineEvent: TimelineEvent
): TimelineMessage | null => {
	if (!client) return null;

	const sender = event.getSender();
	if (!sender) return null; // Messages have to have a sender!
	const member = eventRoom.getMember(sender);

	const content = event.getContent<RoomMessageEventContent>();

	let data: MessageData;
	switch (content.msgtype) {
		case MsgType.Text:
			data = {
				kind: 'text',
				content: content.body
			};
			break;
		case MsgType.Image:
			if (!content.url) return null;

			data = {
				kind: 'image',
				caption: content.filename ? content.body : undefined, // Only show caption when filename exists
				filename: content.filename ?? content.body,
				src: content.url,
				height: content.info?.h,
				width: content.info?.w,
				mimeType: content.info?.mimetype,
				size: content.info?.size
			};
			break;
		case MsgType.File:
			if (!content.url) return null;

			data = {
				kind: 'file',
				caption: content.filename ? content.body : undefined, // Only show caption when filename exists
				filename: content.filename ?? content.body,
				src: content.url,
				mimeType: content.info?.mimetype,
				size: content.info?.size
			};
			break;
		case MsgType.Audio:
			// TODO: audio not just file
			if (!content.url) return null;

			data = {
				kind: 'file',
				caption: content.filename ? content.body : undefined, // Only show caption when filename exists
				filename: content.filename ?? content.body,
				src: content.url,
				mimeType: content.info?.mimetype,
				size: content.info?.size
			};
			break;
		case MsgType.Video:
			// TODO: video not just file
			if (!content.url) return null;

			data = {
				kind: 'file',
				caption: content.filename ? content.body : undefined, // Only show caption when filename exists
				filename: content.filename ?? content.body,
				src: content.url,
				mimeType: content.info?.mimetype,
				size: content.info?.size
			};
			break;
		// TODO: there are more but mehhh
		default:
			return null;
	}

	const message: TimelineMessage = {
		...timelineEvent,

		// replyToMessage: event.replyEventId // TODO
		sender: {
			displayName: member?.name ?? sender,
			userId: sender,
			avatarSrc: member?.getMxcAvatarUrl()
		},

		data: data,

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

	const activeClient = client; // Make a constant so if the client changes during the await it doesn't break
	if (!activeClient) return;

	await activeClient.decryptEventIfNeeded(event);

	if (!isStillActive(room.roomId, activeClient)) return;
	sendNotif('event!', 'a timeline event occurred.');

	mergeRoomMessages(room);
};

const onLocalEchoUpdated = async (event: MatrixEvent, room: Room | null, oldEventId?: string) => {
	if (!room) return;

	if (room.roomId !== event.getRoomId()) return;
	if (matrixState.currentRoom?.roomId !== room.roomId) return;

	const activeClient = client; // Make a constant so if the client changes during the await it doesn't break
	if (!activeClient) return;

	await activeClient.decryptEventIfNeeded(event);

	if (!isStillActive(room.roomId, activeClient)) return;

	const timelineEvent = toTimelineEvent(event, room);
	if (!timelineEvent) return;

	if (oldEventId && oldEventId !== timelineEvent.id) {
		matrixState.events = matrixState.events.filter((event) => event.id !== oldEventId);
	}

	const index = matrixState.events.findIndex((event) => event.id === timelineEvent.id);

	if (index === -1) {
		matrixState.events.push(timelineEvent);
	} else {
		matrixState.events[index] = timelineEvent;
	}

	mergeRoomMessages(room);
};

const onMessageDecrypted = (event: MatrixEvent, err?: Error) => {
	if (err || !client) return;

	const roomId = event.getRoomId();
	if (!roomId || matrixState.currentRoom?.roomId !== roomId) return;

	const room = client.getRoom(roomId);
	if (!room) return;

	const timelineEvent = toTimelineEvent(event, room);
	if (!timelineEvent) return;

	const eventIndex = matrixState.events.findIndex(
		(stateEvent) => stateEvent.id === timelineEvent.id
	);

	if (eventIndex === -1) {
		mergeRoomMessages(room);
	} else {
		matrixState.events[eventIndex] = timelineEvent;
	}
};

export const setupMessageListener = (client: MatrixClient) => {
	client.on(RoomEvent.Timeline, onTimelineEvent);
	client.on(RoomEvent.LocalEchoUpdated, onLocalEchoUpdated);

	// why does matrix have a MatrixEventEvent WHY IS THIS SO WEIRD
	// i guess i was spoiled with the bluesky api which is so good
	client.on(MatrixEventEvent.Decrypted, onMessageDecrypted);
};

export const cleanupMessageListener = (client: MatrixClient) => {
	client.off(RoomEvent.Timeline, onTimelineEvent);
	client.off(RoomEvent.LocalEchoUpdated, onLocalEchoUpdated);
	client.off(MatrixEventEvent.Decrypted, onMessageDecrypted);
};

/** Merges the timeline events that happened during the initial load */
const mergeRoomMessages = (room: Room) => {
	if (matrixState.currentRoom?.roomId !== room.roomId) return;

	const sdkEvents = room.getLiveTimeline().getEvents();

	const byId = new Map(matrixState.events.map((event) => [event.id, event]));

	for (const event of sdkEvents) {
		const converted = toTimelineEvent(event, room);
		if (converted) byId.set(converted.id, converted);
	}

	const order = new Map(sdkEvents.map((event, index) => [event.getId(), index]));

	matrixState.events = [...byId.values()].sort(
		(a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity)
	);
};

let roomLoadVersion = 0;
export const setupMessages = async (roomId: string) => {
	// When switching rooms and loading new stuff, clear.
	matrixState.events = [];

	const version = ++roomLoadVersion;
	const activeClient = client;
	if (!activeClient) return;

	const newRoom = activeClient.getRoom(roomId);
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

	// Decrypt initial messages
	await Promise.all(
		newRoom
			.getLiveTimeline()
			.getEvents()
			.map((event) => activeClient.decryptEventIfNeeded(event))
	);

	// Do some checks to make sure it's still valid to set the events
	if (version !== roomLoadVersion) return;
	if (!isStillActive(roomId, activeClient)) return;

	mergeRoomMessages(newRoom);
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

export const sendFileMessage = (uri: string, body: string, roomId: string) => {
	if (!client) return;

	client.sendMessage(
		roomId,
		null, // TODO: add thread support
		{
			msgtype: MsgType.File,
			body: body,
			url: uri
		}
	);
};

export const sendImageMessage = (uri: string, body: string, roomId: string) => {
	if (!client) return;

	client.sendMessage(
		roomId,
		null, // TODO: add thread support
		{
			msgtype: MsgType.Image,
			body: body,
			url: uri
		}
	);
};
