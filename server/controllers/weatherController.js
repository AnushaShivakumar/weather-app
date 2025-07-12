/** @format */

const WeatherEntry = require("../models/WeatherEntry");

// ✅ CREATE new weather entry with optional forecast
const createWeatherEntry = async (req, res) => {
	try {
		const {
			location,
			temperature,
			condition,
			humidity,
			windSpeed,
			date,
			forecast,
		} = req.body;

		const entryDate = new Date(date);
		const startOfDay = new Date(entryDate.setHours(0, 0, 0, 0));
		const endOfDay = new Date(entryDate.setHours(23, 59, 59, 999));

		let existingEntry = await WeatherEntry.findOne({
			location,
			date: { $gte: startOfDay, $lt: endOfDay },
		});

		if (existingEntry) {
			// Instead of skipping, UPDATE the forecast
			existingEntry.forecast = forecast;
			await existingEntry.save();
			return res
				.status(200)
				.json({ message: "Forecast updated", entry: existingEntry });
		}

		const newEntry = new WeatherEntry({
			location,
			temperature,
			condition,
			humidity,
			windSpeed,
			date: new Date(date),
			forecast,
		});

		const saved = await newEntry.save();
		res.status(201).json(saved);
	} catch (err) {
		console.error("❌ Failed to save entry:", err);
		res.status(400).json({ error: "Invalid data" });
	}
};

// ✅ READ all entries with latest first
const getAllEntries = async (req, res) => {
	try {
		const entries = await WeatherEntry.find().sort({ savedAt: -1 });
		res.json(entries);
	} catch (err) {
		console.error("❌ Failed to fetch entries:", err.message);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ UPDATE entry
const updateEntry = async (req, res) => {
	const { id } = req.params;
	try {
		const updated = await WeatherEntry.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!updated) {
			return res.status(404).json({ error: "Entry not found" });
		}
		res.json(updated);
	} catch (err) {
		console.error("❌ Update error:", err.message);
		res.status(400).json({ error: "Invalid update" });
	}
};

// ✅ DELETE entry
const deleteEntry = async (req, res) => {
	const { id } = req.params;
	try {
		const deleted = await WeatherEntry.findByIdAndDelete(id);
		if (!deleted) {
			return res.status(404).json({ error: "Entry not found" });
		}
		res.status(204).send();
	} catch (err) {
		console.error("❌ Delete error:", err.message);
		res.status(400).json({ error: "Failed to delete entry" });
	}
};

module.exports = {
	createWeatherEntry,
	getAllEntries,
	updateEntry,
	deleteEntry,
};
