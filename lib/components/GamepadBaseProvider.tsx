import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { GamepadContext } from "../contexts/GamepadContext";
import { getRawGamepadsData } from "../utils/GamepadsData";
import { GamepadState } from "../interfaces/GamepadState";



export function GamepadBaseProvider({children}: {children: React.ReactElement}){
	let [rawGamepadData, setRawGamepadData] = useState<(Gamepad | null)[] | null>([]); // last-retrieved controller input data
	let [shouldBePolling, setShouldBePolling] = useState(false); // if we should be checking for controller input at all
	let [pollingRate, setPollingRate] = useState(16.67); // how often we should be checking for controller input
	let [latestFrameId, setLatestFrameId] = useState(0);
	const [frameTime, setFrameTime] = useState(0);
	let [gamepads, setGamepads] = useState<GamepadState[]>([]);
	let deadzoneOffsetRaws = useRef<Array<Array<number>>>([[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]);

	// Detect gamepads ASAP when page loads
	// This is useful for any controller that is already connected before page load
	window.addEventListener("gamepadconnected", () => {
		setRawGamepadData(getRawGamepadsData());
	});

	

	useEffect(() => {
		
		console.log("Gamepad Context Provider loaded.");
		
		
	}, []);

	useEffect(() => {
		// When component unloads, stop polling 
		return () => cancelAnimationFrame(latestFrameId);
	}, [latestFrameId]);

	useEffect(() => {
		if (shouldBePolling == true && !latestFrameId){
			const frame = (time: DOMHighResTimeStamp) => {
			
				// "time" is from the requestAnimationFrame callback
				// and represents the end timestamp of the previous frame's rendering
				// so we can render frames at the highest framerate possible
				setFrameTime(time);
				// Make sure we keep track of animation frames so we can cancel them if needed
				setLatestFrameId(requestAnimationFrame(frame));

				// Per-frame gamepad stuff now:
				let gamepadRaws = getRawGamepadsData();
				setRawGamepadData(gamepadRaws);

				let editableGamepads = Array.from(gamepads, original => original);
				for (let index = 0; index < gamepadRaws.length; index++) {
					const detectedGamepadRaw = gamepadRaws[index];
				
					if (detectedGamepadRaw){

						let tempAxesCopy = [...detectedGamepadRaw.axes];
						let tempAxesWithDeadzone = tempAxesCopy.map((singularAxis, axisIndex) => {
							// console.log(index, axisIndex, deadzoneOffsetRaws.current[index], deadzoneOffsetRaws.current[index][axisIndex]);
							let tempValue = singularAxis;
							if (deadzoneOffsetRaws.current[index][axisIndex] > 0) {
								tempValue -= deadzoneOffsetRaws.current[index][axisIndex];
							} else if (deadzoneOffsetRaws.current[index][axisIndex] < 0) {
								tempValue += deadzoneOffsetRaws.current[index][axisIndex];
							} 

							tempValue = Math.max(-1, Math.min(tempValue, 1));
							
							return {
								raw: singularAxis,
								deadzoneOffset: deadzoneOffsetRaws.current[index][axisIndex],
								value: tempValue
							}
						});

						// console.log(JSON.stringify(tempAxesWithDeadzone, null, 4));
						
						editableGamepads[index] = {
							id: detectedGamepadRaw.id,
							buttons: detectedGamepadRaw.buttons.map((button) => {return {pressed: button.pressed, touched: button.touched, value: button.value}}),
							axes: JSON.parse(JSON.stringify(tempAxesWithDeadzone)),
							mapping: detectedGamepadRaw.mapping, 
							timestamp: detectedGamepadRaw.timestamp, 
							connected: detectedGamepadRaw.connected, 
							index: detectedGamepadRaw.index, 
							vibrationActuator: {
								playEffect: detectedGamepadRaw.vibrationActuator.playEffect,
								reset: detectedGamepadRaw.vibrationActuator.reset
							}
						}
					}
				}
				setGamepads(editableGamepads);
			}
			requestAnimationFrame(frame);
		} else {
			cancelAnimationFrame(latestFrameId)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldBePolling]);

	const setAxesDeadzonesForGamepad = (gamepadIndex: number = 0) => {
		// Tell the user not to touch the joysticks while this function is running.
		// Save the joystick values to their equivalent position in the deadzoneOffsetRaws state.

		console.log("Updating deadzone for gamepad at index " + gamepadIndex);

		let gamepadRaws = getRawGamepadsData();
		setRawGamepadData(gamepadRaws);

		let tempDeadzoneOffsetRaws = JSON.parse(JSON.stringify(deadzoneOffsetRaws));

		tempDeadzoneOffsetRaws[gamepadIndex] = gamepadRaws[gamepadIndex] ? gamepadRaws[gamepadIndex].axes : [0,0,0,0];

		deadzoneOffsetRaws.current = JSON.parse(JSON.stringify(tempDeadzoneOffsetRaws));
	}


	return(
		<GamepadContext.Provider value={{
			currentGamepadData: rawGamepadData, 
			setCurrentGamepadData: setRawGamepadData,
			shouldBePolling, 
			setShouldBePolling,
			pollingRate, 
			setPollingRate,
			latestFrameId, 
			setLatestFrameId,
			frameTime, 
			setFrameTime,
			gamepads,
			setGamepads,
			deadzoneOffsetRaws,
			setAxesDeadzonesForGamepad
		}}>
			{children}
		</GamepadContext.Provider>
	)
}

GamepadBaseProvider.propTypes = {
	children: PropTypes.object.isRequired
}