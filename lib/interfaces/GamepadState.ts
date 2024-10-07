

export interface GamepadState {
	readonly id: string;

	readonly buttons: GamepadButtonSerialized[];

	readonly axes: number[];

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