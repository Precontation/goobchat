<!-- @component A summary of a user with a gradient. -->

<script lang="ts">
	import type { User } from '$lib/types/user';
	import Avatar from './Avatar.svelte';

	let { user, reversed }: { user: User; reversed: boolean } = $props();
</script>

<div class="summary" class:reversed>
	<Avatar displayName={user.displayName} src={user.avatarSrc} />
	<div class="user-name flex flex-col">
		<span class="displayName">{user.displayName}</span>
		<span class="userId text-secondary">{user.userId}</span>
	</div>
</div>

<style>
	.summary {
		display: flex;
		gap: var(--gap-theme);

		width: fit-content;
		height: 100%;

		padding: var(--padding-theme);

		align-items: center;

		background: linear-gradient(90deg, var(--color-theme) 0%, transparent 100%);
		flex-direction: row;
		padding-right: calc(var(--padding-theme) * 5);
	}

	.reversed {
		background: linear-gradient(90deg, transparent 0%, var(--color-theme) 100%);
		flex-direction: row-reverse;
		text-align: end;
		padding-right: calc(var(--padding-theme) * 5);
	}
</style>
