export type MatrixState = {
	loggedIn: boolean;
	loading: boolean;
};

export const initState: MatrixState = {
	loggedIn: false,
	loading: true
};
