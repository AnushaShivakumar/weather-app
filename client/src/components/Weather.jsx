/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "../App.css";

import {
	fetchWeatherByCity,
	fetchForecastByCity,
	saveWeatherToDB,
} from "../api/weather";
import "leaflet/dist/leaflet.css";

import ForecastCard from "./ForecastCard";
import SearchBar from "./SearchBar";
import CurrentWeatherCard from "./CurrentWeatherCard";
import MapCard from "./MapCard";

const getBackground = (weatherCondition) => {
	switch (weatherCondition.toLowerCase()) {
		case "sunny":
		case "clear":
			return "url('https://source.unsplash.com/1600x900/?sunny,sky')";
		case "cloudy":
		case "overcast":
		case "clouds":
			return "url('https://source.unsplash.com/1600x900/?cloudy,sky')";
		case "rain":
		case "drizzle":
			return "url('https://source.unsplash.com/1600x900/?rain')";
		case "thunderstorm":
			return "url('https://source.unsplash.com/1600x900/?thunderstorm')";
		case "snow":
			return "url('https://source.unsplash.com/1600x900/?snow')";
		default:
			return "url('https://source.unsplash.com/1600x900/?weather')";
	}
};

const Weather = () => {
	const [city, setCity] = useState("");
	const [data, setData] = useState(null);
	const [darkMode, setDarkMode] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [forecastData, setForecastData] = useState([]);
	const [showHourly, setShowHourly] = useState(false);
	const navigate = useNavigate();

	const getWeather = async () => {
		setLoading(true);
		setError("");

		if (!city.trim()) {
			setError("Please enter a city.");
			setLoading(false);
			return;
		}

		try {
			const result = await fetchWeatherByCity(city.trim());
			const forecast = await fetchForecastByCity(city.trim());

			setData(result);
			setForecastData(forecast.forecast.forecastday);

			await saveWeatherToDB({
				location: result.location.name,
				temperature: result.current.temp_c,
				condition: result.current.condition.text,
				humidity: result.current.humidity,
				windSpeed: result.current.wind_kph,
				date: new Date(),
				forecast: forecast.forecast.forecastday.map((day) => ({
					date: day.date,
					temperature: day.day.avgtemp_c,
					condition: day.day.condition.text,
				})),
			});
		} catch (err) {
			setError("City not found or network error.");
			setData(null);
			setForecastData([]);
		} finally {
			setLoading(false);
		}
	};

	const getWeatherByLocation = () => {
		setLoading(true);
		setError("");

		navigator.geolocation.getCurrentPosition(
			async ({ coords }) => {
				try {
					const query = `${coords.latitude},${coords.longitude}`;
					const result = await fetchWeatherByCity(query);
					const forecast = await fetchForecastByCity(query);

					setData(result);
					setForecastData(forecast.forecast.forecastday);
					setCity(result.location.name);

					await saveWeatherToDB({
						location: result.location.name,
						temperature: result.current.temp_c,
						condition: result.current.condition.text,
						humidity: result.current.humidity,
						windSpeed: result.current.wind_kph,
						date: new Date(),
						forecast: forecast.forecast.forecastday.map((day) => ({
							date: day.date,
							temperature: day.day.avgtemp_c,
							condition: day.day.condition.text,
						})),
					});
				} catch {
					setError("Failed to get weather for your location.");
					setData(null);
					setForecastData([]);
				} finally {
					setLoading(false);
				}
			},
			() => {
				setError("Location access denied.");
				setLoading(false);
			}
		);
	};

	return (
		<div
			className={`app ${darkMode ? "dark-mode" : "light-mode"} dynamic-bg`}
			style={{
				backgroundImage: data
					? getBackground(data.current.condition.text)
					: "none",
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				minHeight: "100vh",
			}}
		>
			{/* Header Section */}
			<div className="container py-4">
				<div className="d-flex justify-content-between align-items-center">
					<h2>🌤️ Current Weather</h2>
					<button
						className="btn btn-outline-secondary"
						onClick={() => navigate("/history")}
					>
						View History
					</button>
				</div>

				{/* Theme Toggle */}
				<div className="my-3 text-end">
					<button
						className="btn btn-sm btn-secondary"
						onClick={() => setDarkMode(!darkMode)}
					>
						Toggle {darkMode ? "Light" : "Dark"} Mode
					</button>
				</div>

				{/* Search Bar */}
				<SearchBar
					city={city}
					setCity={setCity}
					getWeather={getWeather}
					getWeatherByLocation={getWeatherByLocation}
					loading={loading}
				/>

				{/* Status Messages */}
				{loading && <p className="text-info mt-3">Fetching weather data...</p>}
				{error && <p className="text-danger mt-2">{error}</p>}

				{/* Weather Details */}
				{data && (
					<>
						{/* Current Weather */}
						<CurrentWeatherCard data={data} darkMode={darkMode} />

						{/* Hourly Toggle Button */}
						<div className="text-center my-4">
							<button
								className="btn btn-outline-secondary"
								onClick={() => setShowHourly(!showHourly)}
							>
								{showHourly ? "Hide" : "Show"} Hourly Forecast
							</button>
						</div>

						{/* Animated Hourly Forecast */}
						<AnimatePresence>
							{showHourly && forecastData[0]?.hour && (
								<motion.div
									className="card p-4 shadow-sm"
									style={{
										backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
										borderRadius: "12px",
									}}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 30 }}
									transition={{ duration: 0.5 }}
								>
									<h5 className="text-center mb-3">⏰ Hourly Forecast</h5>
									<div className="table-responsive">
										<table className="table table-bordered text-center">
											<thead
												className={darkMode ? "table-dark" : "table-light"}
											>
												<tr>
													<th>Time</th>
													<th>Temp (°C)</th>
													<th>Condition</th>
													<th>Wind (kph)</th>
													<th>Humidity (%)</th>
												</tr>
											</thead>
											<tbody>
												{forecastData[0].hour.map((hour, i) => (
													<motion.tr
														key={i}
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: i * 0.03, duration: 0.3 }}
													>
														<td>{hour.time.split(" ")[1]}</td>
														<td>{hour.temp_c}</td>
														<td>{hour.condition.text}</td>
														<td>{hour.wind_kph}</td>
														<td>{hour.humidity}</td>
													</motion.tr>
												))}
											</tbody>
										</table>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* 5-Day Forecast */}
						<ForecastCard forecast={forecastData} darkMode={darkMode} />

						{/* Map Card */}
						<MapCard
							cityName={data.location.name}
							coordinates={{
								lat: data.location.lat,
								lon: data.location.lon,
							}}
							darkMode={darkMode}
						/>

						{/* Attribution */}
						<p className="text-center text-muted mt-4 small">
							Weather data from WeatherAPI.com | Maps by OpenStreetMap
						</p>
					</>
				)}
			</div>

			{/* Fixed Footer */}
			<footer
				style={{
					position: "fixed",
					bottom: 0,
					left: 0,
					width: "100%",
					backgroundColor: darkMode ? "#222" : "#f8f9fa",
					color: darkMode ? "#fff" : "#000",
					textAlign: "center",
					padding: "1rem",
					borderTop: "1px solid #ccc",
					zIndex: 9999,
				}}
			>
				<p className="mb-1">Created by Anusha Shiva Kumar</p>
				<button
					className="btn btn-sm btn-secondary"
					onClick={() =>
						window.open(
							"https://www.linkedin.com/company/product-manager-accelerator",
							"_blank"
						)
					}
				>
					ℹ️ About PM Accelerator
				</button>
			</footer>
		</div>
	);
};

export default Weather;
