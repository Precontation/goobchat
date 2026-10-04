<script lang="ts">
	import { sendFileMessage, sendImageMessage, sendTextMessage } from '$lib/apis/matrix/messages';
	import { matrixState } from '$lib/state/matrixClient.svelte';
	import { onMount } from 'svelte';
	import UploadedFile from './uploads/UploadedFile.svelte';

	let textAreaRef = $state<HTMLTextAreaElement>();

	const onSubmit = () => {
		if (!textAreaRef || !matrixState.currentRoom) return;

		files.forEach((file) => {
			if (!file.uri || !matrixState.currentRoom) return; // TODO: still somehow send but cache it or something idk maybe its built in or maybe ill have to rework the entire messages list

			if (file.file.type.startsWith('image/')) {
				sendImageMessage(file.uri, file.file.name, matrixState.currentRoom.roomId);
			} else {
				sendFileMessage(file.uri, file.file.name, matrixState.currentRoom.roomId);
			}
		});

		// Clean up and remove each file that IS loaded now that it's sent
		files = files.filter((file) => !file.uri || !matrixState.currentRoom);

		if (textAreaRef.value.trim() !== '') {
			sendTextMessage(textAreaRef.value, matrixState.currentRoom.roomId);
			textAreaRef.value = '';
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (!textAreaRef) return;

		const MODIFIER_KEYS = [
			'Shift',
			'Meta',
			'Control',
			'Alt',
			'CapsLock',
			'ArrowDown',
			'ArrowUp',
			'ArrowRight',
			'ArrowLeft',
			'Tab',
			'Escape',
			'F1',
			'F2',
			'F3',
			'F4',
			'F5',
			'F6',
			'F7',
			'F8',
			'F9',
			'F10',
			'F11',
			'F12',
			'Home',
			'End',
			'PageUp',
			'PageDown',
			'Insert',
			' '
		];

		const isPaste = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v';

		if (
			isPaste ||
			!(MODIFIER_KEYS.includes(event.key) || event.ctrlKey || event.metaKey || event.altKey)
		) {
			textAreaRef.focus();
		}

		if (event.key == 'Enter' && !event.shiftKey) {
			if (textAreaRef.value.trim() !== '' || files.length > 0) {
				onSubmit();
			}

			event.preventDefault();
		}
	};

	type Upload = {
		file: File;
		uri: string | null;
	};
	let files = $state<Upload[]>([]);

	let fileInput = $state<HTMLInputElement>();

	const uploadImage = () => {
		fileInput?.click();
	};

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const eventFiles = target.files;

		const newFiles: File[] = eventFiles ? [...eventFiles] : [];

		files.push(
			...newFiles.map((newFile) => {
				return {
					file: newFile,
					uri: null
				};
			})
		);
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	const onXButton = (file: File) => {
		const index = files.findIndex((newFile) => {
			return newFile.file === file;
		});

		files.splice(index, 1);
	};
</script>

<input type="file" multiple bind:this={fileInput} onchange={handleFileChange} class="hidden" />

<form class="flex h-fit w-full flex-col gap-theme rounded-bubble bg-surface">
	{#if files && files.length > 0}
		<div class="flex">
			{#each files as file}
				<UploadedFile file={file.file} bind:uri={file.uri} {onXButton} />
			{/each}
		</div>
	{/if}
	<div class="flex w-full">
		<!-- TODO: custom icon would be much nicer than this ugly css -->
		<div class="h-15 w-15 p-theme">
			<button
				class="h-full w-full cursor-pointer rounded-bubble hover:bg-surface-hover active:bg-surface-active"
				type="button"
				onclick={uploadImage}
			>
				<div
					class="flex h-full w-full -translate-y-0.75 items-center justify-center text-3xl leading-none select-none"
				>
					+
				</div>
			</button>
		</div>

		<!-- TODO: `Message (room name)` -->
		<textarea
			bind:this={textAreaRef}
			name="content"
			class="field-sizing-content max-h-50 min-h-15 w-full resize-none content-center border-0 bg-transparent"
			placeholder={matrixState.currentRoom
				? `Message ${matrixState.currentRoom.name}`
				: 'Send message'}></textarea>
	</div>
</form>
