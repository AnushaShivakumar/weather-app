/** @format */

const express = require("express");
const {
	createWeatherEntry,
	getAllEntries,
	updateEntry,
	deleteEntry,
} = require("../controllers/weatherController");

const {
	getWeatherData,
	getForecastData,
} = require("../controllers/weatherApiController");

const router = express.Router();

// Routes for MongoDB-stored weather entries
router.post("/", createWeatherEntry); // POST /api/weather
router.get("/", getAllEntries); // GET /api/weather
router.put("/:id", updateEntry); // PUT /api/weather/:id
router.delete("/:id", deleteEntry); // DELETE /api/weather/:id
// Route for live weather from external API

router.get("/live", getWeatherData);
router.get("/forecast", getForecastData);

module.exports = router;
