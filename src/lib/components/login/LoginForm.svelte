<script lang="ts">
	import { login } from '$lib/apis/matrix/client';
	import LoadingCircle from '../ui/LoadingCircle.svelte';

	const placeholderHomeserver = 'matrix.org';

	let loading = $state(false);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const formEl = event.target as HTMLFormElement;
		const formData = new FormData(formEl);

		// Object.fromEntries turns formData into a flat object of strings so I can add more without having to spam formData.get()
		const data = Object.fromEntries(formData) as Record<string, string>;

		// If rawClient is blank, then set it to placeholderHomeserver
		const homeserver = data.homeserver || placeholderHomeserver;
		const username = data.username.trim();
		const password = data.password;

		if (!username || !password) {
			// TODO: show UI error
			console.error('No username and/or password provided!');
		}

		loading = true;
		await login(homeserver, username, password);
		loading = false;
	};
</script>

<div class="login">
	<h1>Log in</h1>
	<form class="flex w-full flex-col gap-theme" onsubmit={handleSubmit}>
		<div class="flex flex-col">
			<label for="username">Username</label>
			<input type="text" autocomplete="username" id="username" name="username" />
		</div>

		<div class="flex flex-col">
			<label for="password">Password</label>
			<input type="password" name="password" id="password" autocomplete="current-password" />
		</div>

		<button
			type="submit"
			class="flex justify-center bg-background py-2 hover:bg-surface-hover active:bg-surface-active"
			disabled={loading}
			>{#if loading}<LoadingCircle />{:else}Submit{/if}</button
		>

		<div class="h-px w-full bg-border"></div>
		<div class="h-px w-full bg-border"></div>

		<div class="flex flex-col">
			<label for="homeserver">Homeserver</label>
			<input
				type="text"
				name="homeserver"
				id="homeserver"
				autocomplete="off"
				placeholder={placeholderHomeserver}
			/>
		</div>
	</form>
</div>

<style>
	.login {
		padding: var(--padding-theme);

		background-color: var(--color-surface);
		width: 200px;
	}

	input {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
	}

	label {
		color: var(--color-secondary);
	}
</style>
