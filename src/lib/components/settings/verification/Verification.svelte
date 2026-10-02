<script lang="ts">
	import { requestVerificationOtherDevice } from '$lib/apis/matrix/client';
	import LoadingCircle from '$lib/components/ui/LoadingCircle.svelte';
	import {
		VerificationPhase,
		VerificationRequestEvent,
		type VerificationRequest
	} from 'matrix-js-sdk/lib/crypto-api';
	import { VerificationMethod } from 'matrix-js-sdk/lib/types';
	import { onMount } from 'svelte';
	import CompareEmojis from './CompareEmojis.svelte';

	let request = $state<VerificationRequest | null>();
	let requestPhase = $state<VerificationPhase>();

	const onRequestChange = () => {
		requestPhase = request?.phase;
	};

	onMount(() => {
		const setup = async () => {
			request = await requestVerificationOtherDevice();
			if (!request) return;

			requestPhase = request.phase;
			request.on(VerificationRequestEvent.Change, onRequestChange);
		};

		setup();

		return () => {
			if (!request) return;
			request.off(VerificationRequestEvent.Change, onRequestChange);
		};
	});
</script>

<div
	class="flex h-full w-full flex-col items-center justify-center gap-theme border-4 border-border bg-background p-theme"
>
	{#if request && requestPhase && requestPhase !== VerificationPhase.Unsent}
		{#if requestPhase === VerificationPhase.Requested}
			<h1>Waiting for another device to accept.</h1>
			<LoadingCircle />
		{:else if requestPhase === VerificationPhase.Ready}
			<h1>Waiting for the other device to choose a verification method.</h1>
			<span>We haven't implemented choice yet :)</span>
			<LoadingCircle />
		{:else if requestPhase === VerificationPhase.Started}
			{#if request.chosenMethod == VerificationMethod.Sas}
				<CompareEmojis {request} />
			{/if}
		{:else if requestPhase === VerificationPhase.Cancelled}
			<h1>Request cancelled.</h1>
			<!-- TODO: maybe automatically just go away? -->
		{:else if requestPhase === VerificationPhase.Done}
			<h1>Request finished!</h1>
			<!-- TODO: maybe automatically just go away? -->
		{:else}
			<h1>uhh you shouldn't see this</h1>
			<span>Current request phase: {VerificationPhase[requestPhase]}</span>
		{/if}
	{:else if request === undefined}
		<LoadingCircle />
	{:else}
		<h1>Verification failed.</h1>
	{/if}
</div>

<style>
	h1 {
		font-size: x-large;
		text-align: center;
	}
</style>
