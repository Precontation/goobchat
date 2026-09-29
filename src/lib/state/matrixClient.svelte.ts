import type { TimelineEvent } from '$lib/types/event';
import type { UIRoom } from '$lib/types/room';

export type MatrixState = {
	loggedIn: boolean;
	loading: boolean;
	loadingSession: boolean;
	currentRoom?: UIRoom;
	rooms: UIRoom[];
	events: TimelineEvent[];
};

const initState: MatrixState = {
	loggedIn: false,
	loading: true,
	loadingSession: true,
	currentRoom: undefined,
	rooms: [],
	events: []
};

export const matrixState: MatrixState = $state(initState);
