<script>
	import { currentUser } from '$lib/state/currentUser.svelte';
	import UserSummary from '../ui/UserSummary.svelte';
	import Bar from './Bar.svelte';
</script>

<Bar direction="horizontal">
	<div class="container">
		<UserSummary user={currentUser} reversed={false} />
	</div>
</Bar>

<style>
	.container {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: row;
	}
</style>
