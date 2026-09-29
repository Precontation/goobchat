import type { TimelineEvent } from '$lib/types/event';
import type { UIRoom } from '$lib/types/room';

export type MatrixState = {
	loggedIn: boolean;
	loading: boolean;
	loadingSession: boolean;
	rooms: UIRoom[];
	events: TimelineEvent[];
};

const initState: MatrixState = {
	loggedIn: false,
	loading: true,
	loadingSession: true,
	rooms: [],
	events: []
};

export const matrixState: MatrixState = $state(initState);
