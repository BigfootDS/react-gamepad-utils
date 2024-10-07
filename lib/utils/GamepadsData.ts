

export const getRawGamepadsData = () => {
	let result: (Gamepad | null)[] = [];
	try{
		result = window.navigator.getGamepads();
	} catch (error){
		console.warn("Error getting gamepad info:" + JSON.stringify(error));
	}
	return result;
}

export const serializeGamepads = () => {
	
}