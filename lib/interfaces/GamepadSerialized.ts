

export type GamepadSerialized = {
	controller: Gamepad;

	turbo: boolean;

	connect: boolean;

	disconnect: boolean;

	update: boolean;

	getButtonPress: boolean;

	buttons: [];

	buttonsCache: [];

	buttonsStatus: [];

	axesStatus: [];
}