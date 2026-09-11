import type { User } from '$lib/types/user';
export const currentUser = $state<User>({
	displayName: 'Example user',
	userId: 'example:matrix.org'
});
