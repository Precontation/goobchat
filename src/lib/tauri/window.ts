import { hide } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const createCloseHandler = () => {
	const window = getCurrentWindow();
	window.onCloseRequested(async (event) => {
		event.preventDefault();
		await hide();
	});
};
