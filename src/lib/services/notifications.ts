import { browser } from '$app/environment';
import { isTauri } from '@tauri-apps/api/core';
import {
	createChannel,
	isPermissionGranted,
	requestPermission,
	sendNotification
} from '@tauri-apps/plugin-notification';
import { platform } from '@tauri-apps/plugin-os';

const notificationFilename = 'notification';
const desktopFilename = 'notification.wav';
const androidChannelId = 'default-alerts';

const setupAndroidChannel = async () => {
	await createChannel({
		id: androidChannelId,
		name: 'Message alerts',
		sound: notificationFilename
	});
};

export const requestNotifications = async (): Promise<boolean> => {
	let permissionGranted: boolean = false;

	if (isTauri()) {
		// Do you have permission to send a notification?
		permissionGranted = await isPermissionGranted();

		// If not we need to request it
		if (!permissionGranted) {
			const permission = await requestPermission();
			permissionGranted = permission === 'granted';
		}

		if (permissionGranted && platform() === 'android') {
			await setupAndroidChannel();
		}
	} else {
		if (browser) {
			if (Notification.permission === 'default') {
				await Notification.requestPermission();
			}

			return Notification.permission === 'granted';
		}
	}

	return permissionGranted;
};

// TODO: play sfx in app rather than through the notif
export const sendNotif = async (title: string, body: string) => {
	if (isTauri()) {
		const permissionGranted = await isPermissionGranted();
		const currentPlatform = platform();
		let soundAsset: string;
		let channelId: string | undefined;

		if (currentPlatform === 'android') {
			soundAsset = notificationFilename;
			channelId = androidChannelId;
			if (permissionGranted) {
				await setupAndroidChannel();
			}
		} else {
			soundAsset = desktopFilename;
		}

		if (permissionGranted) {
			sendNotification({ title, body, sound: soundAsset, channelId });
		}
	} else {
		if (browser && Notification.permission === 'granted') {
			new Notification(title, {
				body: body
			});
		}
	}
};

/* TODO
import { registerActionTypes } from '@tauri-apps/plugin-notification';

await registerActionTypes([
  {
    id: 'messages',
    actions: [
      {
        id: 'reply',
        title: 'Reply',
        input: true,
        inputButtonTitle: 'Send',
        inputPlaceholder: 'Type your reply...',
      },
      {
        id: 'mark-read',
        title: 'Mark as Read',
        foreground: false,
      },
    ],
  },
]);
*/
