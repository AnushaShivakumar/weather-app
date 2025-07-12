/** @format */

const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema({
	date: { type: String, required: true },
	temperature: { type: Number, required: true },
	condition: { type: String, required: true },
});

const weatherEntrySchema = new mongoose.Schema({
	location: { type: String, required: true },
	temperature: { type: Number, required: true },
	condition: { type: String, required: true },
	humidity: { type: Number, required: true },
	windSpeed: { type: Number, required: true },
	date: { type: Date, required: true },

	forecast: [forecastSchema],

	savedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("WeatherEntry", weatherEntrySchema);
