export interface UIRoom {
	name: string;
	roomId: string;

	/** Can be from "Username: Hello!" to "Username left the room." */
	caption: string;

	avatarSrc: string | null;
}
