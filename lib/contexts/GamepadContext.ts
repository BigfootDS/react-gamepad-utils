import { createContext } from "react";
import { GamepadState } from "../interfaces/GamepadState";

interface GamepadBaseProviderValues {
	currentGamepadData?: (Gamepad | null)[] | null;
	setCurrentGamepadData?: React.Dispatch<React.SetStateAction<(Gamepad | null)[] | null>>;
	shouldBePolling?: boolean;
	setShouldBePolling?: React.Dispatch<React.SetStateAction<boolean>>;
	pollingRate?: number;
	setPollingRate?: React.Dispatch<React.SetStateAction<number>>;
	latestFrameId?: number;
	setLatestFrameId?: React.Dispatch<React.SetStateAction<number>>;
	frameTime?: number;
	setFrameTime?: React.Dispatch<React.SetStateAction<number>>;
	gamepads?: GamepadState[];
	setGamepads?: React.Dispatch<React.SetStateAction<GamepadState[]>>;
}

let initialValue: GamepadBaseProviderValues = {

}

export const GamepadContext = createContext(initialValue);
