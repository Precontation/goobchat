<script lang="ts">
	import { getCurrentWindow } from '@tauri-apps/api/window';

	// when using `"withGlobalTauri": true`, you may use
	// const { getCurrentWindow } = window.__TAURI__.window;

	const appWindow = getCurrentWindow();

	function handleMouseDown(e: MouseEvent) {
		if (e.buttons === 1) {
			// Primary (left) button
			e.detail === 2
				? appWindow.toggleMaximize() // Maximize on double click
				: appWindow.startDragging(); // Else start dragging
		}
	}
</script>

<div class="titlebar" role="presentation" onmousedown={handleMouseDown}>
	<div data-tauri-drag-region></div>
</div>

<style>
	.titlebar {
		height: 30px;
		background: transparent;
		user-select: none;
		display: grid;
		grid-template-columns: auto max-content;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
	}
</style>
