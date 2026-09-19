import { matrixState } from '$lib/state/matrixClient.svelte';
import type { TimelineEvent, TimelineMessage } from '$lib/types/event';
import { EventType, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk';
import { client } from './client';

const USER_AVATAR_SIZE = 64;
const toTimelineEvent = (event: MatrixEvent, room: Room): TimelineEvent | null => {
	const id = event.getId();
	if (!id) return null;
	if (!client) return null;

	const timelineEvent: TimelineEvent = {
		id: id,
		timestamp: event.localTimestamp
	};

	switch (event.getType()) {
		case EventType.RoomMessage: {
			const sender = event.getSender();
			if (!sender) return null; // Messages have to have a sender!
			const member = room.getMember(sender);

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
		}
		default:
			console.warn("Event type '" + event.getType() + "' not implemented yet!");
			return null;
	}

	// Just in case I'm dumb
	return timelineEvent;
};

export const setupMessages = (roomId: string) => {
	if (!client) return;
	const room = client.getRoom(roomId);
	if (!room) return;

	// Get initial messages in room
	matrixState.events = room
		.getLiveTimeline()
		.getEvents()
		.map((event) => toTimelineEvent(event, room))
		.filter((event): event is TimelineEvent => event !== null);

	room.on(RoomEvent.Timeline, () => {});
};
