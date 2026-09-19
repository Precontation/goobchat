import type { TimelineMessage } from '$lib/types/event';
import type { UIRoom } from '$lib/types/room';

export const debugMessages: TimelineMessage[] = $state([]);
export const debugRooms: UIRoom[] = $state([
	{
		name: 'room 1',
		roomId: 'def',
		caption: 'Username: hi my names username',
		avatarSrc: null
	},
	{
		name: 'room 2',
		roomId: 'abc',
		caption: 'Username: im going to leave room 3. the quick blaksjdflkasjdflkasjdfasdfasdf',
		avatarSrc: null
	},
	{
		name: 'room 3',
		roomId: 'ghi',
		caption: 'Username left the room.',
		avatarSrc: null
	}
]);
