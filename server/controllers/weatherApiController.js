/** @format */

const axios = require("axios");
const WeatherEntry = require("../models/WeatherEntry");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const getWeatherData = async (req, res) => {
	const location = req.query.location;
	if (!location) {
		return res.status(400).json({ error: "Please enter a location." });
	}

	const apiKey = process.env.WEATHER_API_KEY;
	const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

	try {
		const response = await axios.get(url);
		const data = response.data;

		// ✅ Prepare entry
		const newEntry = new WeatherEntry({
			location: data.location.name,
			temperature: data.current.temp_c,
			condition: data.current.condition.text,
			humidity: data.current.humidity,
			windSpeed: data.current.wind_kph,
			date: new Date(),
		});

		// ⏳ Check if recent entry exists within last 10 minutes
		const recentEntry = await WeatherEntry.findOne({
			location: data.location.name,
		}).sort({ date: -1 });

		if (!recentEntry || new Date() - recentEntry.date > 10 * 60 * 1000) {
			await newEntry.save();
			console.log("✅ Weather data saved for:", data.location.name);
		} else {
			console.log("⏱️ Skipped saving duplicate entry for", data.location.name);
		}

		// ✅ Return data to frontend
		res.json(data);
	} catch (error) {
		console.error("❌ Weather API error:", error.message);
		res.status(500).json({ error: "Failed to fetch weather data" });
	}
};

const getForecastData = async (req, res) => {
	const location = req.query.location;
	if (!location) {
		return res.status(400).json({ error: "Please enter a location." });
	}

	const apiKey = process.env.WEATHER_API_KEY;
	const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5`;

	try {
		const response = await axios.get(url);
		const data = response.data;
		res.json(data);
	} catch (error) {
		console.error("Forecast error:", error.message);
		res.status(500).json({ error: "Failed to fetch forecast data" });
	}
};

module.exports = { getWeatherData, getForecastData };
