import { useContext } from "react";
import { GamepadContext } from "../contexts/GamepadContext";


export function useGamepadContext(){
	return useContext(GamepadContext);
}