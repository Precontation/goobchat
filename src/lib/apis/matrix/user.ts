import {currentUser} from '$lib/state/currentUser.svelte';
import type {MatrixClient} from 'matrix-js-sdk';




export const loadCurrentUser = async (client: MatrixClient): Promise<void> => {
const userId = client.getUserId();
if (!userId) return;

currentUser.userId = userId;
currentUser.displayName = userId;
currentUser.avatarSrc = undefined;

try {
const profile = await client.getProfileInfo(userId);

currentUser.displayName = profile.displayname ?? userId;

currentUser.avatarSrc = profile.avatar_url;


} catch (error) {
    console.warn('could not load the profile, using user id instead', error);
}

};

export const resetCurrentUser = (): void => {
    currentUser.displayName = '';
    currentUser.userId = '';
    currentUser.avatarSrc = undefined;
}