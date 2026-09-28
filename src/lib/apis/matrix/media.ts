import { client } from './client';

const THUMBNAIL_SIZE = 64;
const thumbnailCache = new Map<string, string>();

export const loadThumbnail = async (url: string): Promise<string | undefined> => {
	if (!url.startsWith('mxc://')) return url;

	const cached = thumbnailCache.get(url);
	if (cached) return cached;

	if (!client) return undefined;
	const httpUrl = client.mxcUrlToHttp(url, THUMBNAIL_SIZE, THUMBNAIL_SIZE, 'crop', false, true, true);
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

export const clearThumbnailCache = (): void => {
	for (const objectUrl of thumbnailCache.values()) {
		URL.revokeObjectURL(objectUrl);
	}
	thumbnailCache.clear();
};
