/** @format */

// 🔥 USE ONLY WeatherAPI.com and your own backend
import { toast } from "react-toastify";

export const fetchWeatherByCity = async (city) => {
	try {
		const backendUrl = import.meta.env.VITE_BACKEND_URL;

		if (!city) throw new Error("City name is required");

		const response = await fetch(
			`${backendUrl}/api/weather/live?location=${encodeURIComponent(city)}`
		);

		if (!response.ok) {
			throw new Error("Failed to fetch weather data from backend");
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching weather from backend:", error);
		throw error;
	}
};

export const fetchForecastByCity = async (city) => {
	try {
		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		const response = await fetch(
			`${backendUrl}/api/weather/forecast?location=${encodeURIComponent(city)}`
		);

		if (!response.ok) throw new Error("Failed to fetch forecast data");
		return await response.json();
	} catch (error) {
		console.error("Error fetching forecast:", error);
		throw error;
	}
};

export const saveWeatherToDB = async (weatherData) => {
	try {
		const response = await fetch(
			import.meta.env.VITE_BACKEND_URL + "/api/weather",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(weatherData),
			}
		);

		if (response.status === 409) {
			toast.info("You've already saved weather for this location today!");
		} else if (!response.ok) {
			throw new Error("Server error");
		} else {
			toast.success("✅ Weather saved successfully!");
		}
	} catch (error) {
		console.error("Save failed:", error);
		toast.error("❌ Failed to save weather data");
	}
};
