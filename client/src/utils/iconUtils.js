/** @format */

export const getIconCode = (main) => {
	switch (main) {
		case "Clear":
			return "CLEAR_DAY";
		case "Clouds":
			return "CLOUDY";
		case "Rain":
		case "Drizzle":
			return "RAIN";
		case "Snow":
			return "SNOW";
		case "Thunderstorm":
			return "WIND";
		default:
			return "PARTLY_CLOUDY_DAY";
	}
};
