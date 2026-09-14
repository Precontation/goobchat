import type { Component } from 'svelte';

export interface ContextMenuItem {
	name: string;
	action: () => void;
	icon?: Component;
}
