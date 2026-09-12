import type { Message } from '$lib/types/message';
import type { Room } from '$lib/types/room';

export const debugMessages: Message[] = $state([]);
export const debugRooms: Room[] = $state([
        {
            displayName: 'room 1',
            roomId: 'def',
            caption: 'Username: hi my names username'
        },
        {
            displayName: 'room 2',
            roomId: 'abc',
            caption: 'Username: im going to leave room 3. the quick blaksjdflkasjdflkasjdfasdfasdf'
        },
        {
            displayName: 'room 3',
            roomId: 'ghi',
            caption: 'Username left the room.'
        }
    ])