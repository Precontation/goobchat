<script lang="ts">
	import LoadingCircle from '$lib/components/ui/LoadingCircle.svelte';
	import {
		VerifierEvent,
		type ShowSasCallbacks,
		type VerificationRequest
	} from 'matrix-js-sdk/lib/crypto-api';
	import { onMount } from 'svelte';

	let { request }: { request: VerificationRequest } = $props();
	let callbacks = $state<ShowSasCallbacks | null>();
	let pressedTheyMatch = $state(false);

	const setCallbacks = (sasCallbacks: ShowSasCallbacks) => {
		callbacks = sasCallbacks;
	};

	onMount(() => {
		const verifier = request.verifier;
		if (!verifier) return;

		verifier.on(VerifierEvent.ShowSas, setCallbacks);

		verifier.verify();

		return () => {
			if (!verifier) return;
			verifier.off(VerifierEvent.ShowSas, setCallbacks);
		};
	});

	const theyMatch = async () => {
		pressedTheyMatch = true;
		await callbacks?.confirm();
	};

	const theyDontMatch = () => {
		callbacks?.mismatch();
	};
</script>

<h1>Compare emojis</h1>
{#if callbacks}
	<div>
		<div class="flex flex-wrap gap-theme">
			{#each callbacks.sas.emoji as emoji}
				<div class="flex flex-col">
					<span>{emoji[0]}</span>
					<span>{emoji[1]}</span>
				</div>
			{/each}
		</div>

		<div class="flex gap-theme">
			<button onclick={theyMatch}>They match</button>
			<button onclick={theyDontMatch}>They don't match</button>
		</div>
	</div>
{:else if callbacks === undefined}
	<LoadingCircle />
{:else}
	<h1>Emojis failed to load.</h1>
{/if}

<style>
	h1 {
		font-size: xx-large;
	}

	button {
		border: 2px solid var(--color-border);
		padding: 0.5rem;
	}
</style>
