import type { UploadProgress, UploadResponse } from 'matrix-js-sdk';
import { client } from './client';

const THUMBNAIL_SIZE = 64;
const thumbnailCache = new Map<string, string>();

export const loadThumbnail = async (url: string): Promise<string | undefined> => {
	if (!url.startsWith('mxc://')) return url;

	const cached = thumbnailCache.get(url);
	if (cached) return cached;

	if (!client) return undefined;
	const httpUrl = client.mxcUrlToHttp(
		url,
		THUMBNAIL_SIZE,
		THUMBNAIL_SIZE,
		'crop',
		false,
		true,
		true
	);
	const accessToken = client.getAccessToken();
	if (!httpUrl || !accessToken) return undefined;

	try {
		const response = await fetch(httpUrl, {
			headers: { Authorization: 'Bearer ' + accessToken }
		});
		if (!response.ok) return undefined;

		const objectUrl = URL.createObjectURL(await response.blob());
		thumbnailCache.set(url, objectUrl);
		return objectUrl;
	} catch {
		return undefined;
	}
};

export const loadMedia = async (url: string): Promise<string | undefined> => {
	if (!url.startsWith('mxc://')) return url;

	if (!client) return undefined;
	const httpUrl = client.mxcUrlToHttp(url, undefined, undefined, undefined, false, true, true);
	const accessToken = client.getAccessToken();
	if (!httpUrl || !accessToken) return undefined;

	try {
		const response = await fetch(httpUrl, {
			headers: { Authorization: 'Bearer ' + accessToken }
		});
		if (!response.ok) return undefined;

		return URL.createObjectURL(await response.blob());
	} catch {
		return undefined;
	}
};

/** Uploads a file to the Matrix server.
 * @param file The file to upload
 * @param onProgress Optional callback receiving upload progress from 0-total
 */
export const uploadFile = async (
	file: File,
	onProgress?: (loaded: number, total: number) => void
): Promise<UploadResponse | undefined> => {
	// TODO: local const reference of client for edge case where they log out after or something
	return await client?.uploadContent(file, {
		progressHandler: (progress: UploadProgress) => {
			onProgress?.(progress.loaded, progress.total);
		}
	});
};

export const clearThumbnailCache = (): void => {
	for (const objectUrl of thumbnailCache.values()) {
		URL.revokeObjectURL(objectUrl);
	}
	thumbnailCache.clear();
};
