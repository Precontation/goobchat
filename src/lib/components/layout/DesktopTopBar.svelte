<script>
	import { currentUser } from '$lib/state/currentUser.svelte';
	import ContextMenu from '../ui/ContextMenu.svelte';
	import UserSummary from '../ui/UserSummary.svelte';
	import Bar from './Bar.svelte';
</script>

<Bar direction="horizontal" class="relative">
	<button class="container w-fit" popovertarget="user-summary">
		<UserSummary user={currentUser} reversed={true} />
	</button>
	<ContextMenu
		elements={[
			{
				name: 'Settings',
				action: () => {}
			},
			{
				name: 'Log Out',
				action: () => {}
			}
		]}
	></ContextMenu>
</Bar>

<style>
	.container {
		position: relative;
		margin-left: auto;
		height: 100%;

		display: flex;
		flex-direction: row-reverse;

		cursor: pointer;
	}

	.container::after {
		content: '';
		inset: 0;
		position: absolute;
		pointer-events: none;
		background-color: white;

		opacity: 0;
	}
	.container:hover::after {
		opacity: 0.1;
	}

	.container:active::after {
		opacity: 0.2;
	}
</style>
