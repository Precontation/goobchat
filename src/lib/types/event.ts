import type { User } from './user';

export type MessageKind = 'text' | 'image' | 'file';

export interface TextMessage {
	kind: 'text';

	/** @todo make content an array for custom formatting */
	content: string;
}

/** Holds basic info for images, files, audio, etc. */
interface AttachmentData {
	src: string;
	filename: string;
	mimeType?: string;
	caption?: string;
}

export interface FileMessage extends AttachmentData {
	kind: 'file';
}

export interface ImageMessage extends AttachmentData {
	kind: 'image';
	width: number;
	height: number;
}

/** A message of any message type. */
export interface TimelineMessage extends TimelineEvent {
	/** The message being replied to, if any.
	 * @todo This works fine with mock data, but when implementing the matrix protocol, this will need to be changed to `replyToId?: string` and loaded dynamically. */
	replyToMessage?: TimelineMessage;

	/** The User object of the sender. */
	sender: User;

	/** Content and metadata specific to the message kind. */
	data: TextMessage | FileMessage | ImageMessage;
}

/** The event itself */
export interface TimelineEvent {
	/** The ID of the event. For example, `$AJ2vFQnIereIZFkzO14Or8IKTf4jsM5XoaUDgc7zMtM`. */
	id: string;

	/** The timestamp of the event! Pretty self-explanatory haha*/
	timestamp: number;
}
