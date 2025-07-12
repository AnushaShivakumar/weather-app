/** @format */

import AnimatedWeather from "react-animated-weather";
import { getIconCode } from "../utils/iconUtils";

export const WeatherIcon = ({ weatherMain, darkMode }) => {
	if (!weatherMain) return null;

	return (
		<AnimatedWeather
			icon={getIconCode(weatherMain)}
			color={darkMode ? "white" : "black"}
			size={64}
			animate={true}
		/>
	);
};
