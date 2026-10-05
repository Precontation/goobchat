export enum Menu {
	SETTINGS,
	VERIFICATION
}

export const menusOpened = $state<Menu[]>([]); // Make this an array so you can have nested menus

export const openMenu = (menu: Menu) => {
	const existingMenu = menusOpened.indexOf(menu);
	if (existingMenu > -1) {
		menusOpened.splice(menu, 1);
	}
	menusOpened.push(menu);
};
