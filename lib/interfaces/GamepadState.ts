

export interface GamepadState {
	readonly id: string;

	readonly buttons: GamepadButtonSerialized[];

	readonly axes: GamepadAxisWithDeadzone[];

	readonly mapping: string;

	readonly timestamp: number;

	readonly connected: boolean;

	readonly index: number;


	readonly vibrationActuator: {
		readonly playEffect: (type: GamepadHapticEffectType, params?: GamepadEffectParameters | undefined) => Promise<GamepadHapticsResult>;

		readonly reset: () => Promise<GamepadHapticsResult>;
	}
}

export interface GamepadButtonSerialized {
	pressed: boolean;

	touched: boolean;

	value: number;

	
}

export interface GamepadAxisWithDeadzone {
	
	
	/**
	 * The raw axis value from the Gamepad system.
	 * @author BigfootDS
	 */
	raw: number;

	
	/**
	 * Let the user configure this as part of the app settings.
	 * @author BigfootDS
	 */
	deadzoneOffset: number;

	
	/**
	 * This should be the result of raw minus the deadzoneOffset.
	 * @author BigfootDS
	 */
	value: number;
}