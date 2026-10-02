export enum Menu {
	SETTINGS,
	VERIFICATION
}

export const menusOpened = $state<Menu[]>([]); // Make this an array so you can have nested menus
