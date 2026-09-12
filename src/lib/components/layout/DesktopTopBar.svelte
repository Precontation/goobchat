<script>
	import { currentUser } from '$lib/state/currentUser.svelte';
	import UserSummary from '../ui/UserSummary.svelte';
	import Bar from './Bar.svelte';
</script>

<Bar direction="horizontal">
	<div class="container">
		<UserSummary user={currentUser} reversed={true} />
	</div>
</Bar>

<style>
	.container {
		margin-left: auto;
		height: 100%;

		display: flex;
		flex-direction: row-reverse;
	}
</style>
