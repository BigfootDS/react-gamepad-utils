import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { GamepadContext } from "../contexts/GamepadContext";
import { getGamepadsData } from "../utils/GamepadsData";



export function GamepadBaseProvider({children}: {children: React.ReactElement}){
	let [currentGamepadData, setCurrentGamepadData] = useState<(Gamepad | null)[] | null>([]); // last-retrieved controller input data
	let [shouldBePolling, setShouldBePolling] = useState(false); // if we should be checking for controller input at all
	let [pollingRate, setPollingRate] = useState(16.67); // how often we should be checking for controller input
	let [latestFrameId, setLatestFrameId] = useState(0);
	const [frameTime, setFrameTime] = useState(0);

	// Detect gamepads ASAP when page loads
	// This is useful for any controller that is already connected before page load
	window.addEventListener("gamepadconnected", () => {
		setCurrentGamepadData(getGamepadsData());
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
				setCurrentGamepadData(getGamepadsData());

			}
			requestAnimationFrame(frame);
		} else {
			cancelAnimationFrame(latestFrameId)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldBePolling]);


	return(
		<GamepadContext.Provider value={{
			currentGamepadData, 
			setCurrentGamepadData,
			shouldBePolling, 
			setShouldBePolling,
			pollingRate, 
			setPollingRate,
			latestFrameId, 
			setLatestFrameId,
			frameTime, 
			setFrameTime
		}}>
			{children}
		</GamepadContext.Provider>
	)
}

GamepadBaseProvider.propTypes = {
	children: PropTypes.object.isRequired
}