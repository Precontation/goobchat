<script lang="ts">
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import { platform } from '@tauri-apps/plugin-os';

	// when using `"withGlobalTauri": true`, you may use
	// const { getCurrentWindow } = window.__TAURI__.window;

	const appWindow = getCurrentWindow();

	const handleMouseDown = (e: MouseEvent) => {
		if (e.buttons === 1) {
			// Primary (left) button
			e.detail === 2
				? appWindow.toggleMaximize() // Maximize on double click
				: appWindow.startDragging(); // Else start dragging
		}
	};

	const controlSize = 18;
	const isMac = platform() === 'macos';
</script>

<div class="titlebar">
	<div
		data-tauri-drag-region
		role="presentation"
		class="w-full"
		onmousedown={handleMouseDown}
	></div>
	{#if !isMac}
		<div class="controls">
			<button
				class="cursor-pointer hover:bg-surface-hover active:bg-surface-active"
				onclick={() => {
					appWindow.minimize();
				}}
			>
				<!-- https://api.iconify.design/mdi:window-minimize.svg -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={controlSize}
					height={controlSize}
					viewBox="0 0 24 24"
				>
					<path fill="currentColor" d="M19 13H5v-2h14z" />
				</svg>
			</button>
			<button
				class="cursor-pointer hover:bg-surface-hover active:bg-surface-active"
				onclick={() => {
					appWindow.toggleMaximize();
				}}
			>
				<!-- For some reason comments hide warnings from svelte uhhhhhhh -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={controlSize}
					height={controlSize}
					viewBox="0 0 24 24"
				>
					<rect
						x="5"
						y="5"
						width="14"
						height="14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					/>
				</svg>
			</button>
			<button
				class="cursor-pointer hover:bg-warn active:bg-red-500"
				onclick={() => {
					appWindow.close();
				}}
			>
				<!-- https://api.iconify.design/mdi:close.svg -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={controlSize}
					height={controlSize}
					viewBox="0 0 24 24"
				>
					<path
						fill="currentColor"
						d="M13.46 12L19 17.54V19h-1.46L12 13.46L6.46 19H5v-1.46L10.54 12L5 6.46V5h1.46L12 10.54L17.54 5H19v1.46z"
					/>
				</svg>
			</button>
		</div>
	{/if}
</div>

<style>
	.titlebar {
		background-color: var(--color-surface);
		height: 30px;
		user-select: none;
		display: grid;
		grid-template-columns: 1fr max-content;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
	}

	.controls {
		display: flex;
	}

	button {
		padding-inline: 0.75rem;
	}
</style>
