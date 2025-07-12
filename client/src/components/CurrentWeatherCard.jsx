/** @format */

// File: src/components/CurrentWeatherCard.jsx
import { WeatherIcon } from "./WeatherIcon";

const CurrentWeatherCard = ({ data, darkMode }) => {
	if (!data || !data.location || !data.current) return null;

	const { location, current } = data;

	return (
		<div
			className={`card mt-4 p-4 shadow rounded ${
				darkMode ? "bg-dark text-white" : "bg-light text-dark"
			}`}
		>
			<h2 className="mb-3">
				{location.name}, {location.country}
			</h2>
			<p className="lead text-capitalize">{current.condition.text}</p>

			<div className="row">
				<div className="col-md-6">
					<p>🌡️ Temperature: {current.temp_c} °C</p>
					<p>💧 Humidity: {current.humidity}%</p>
					<p>🌬️ Wind Speed: {current.wind_kph} kph</p>
				</div>
				<div className="col-md-6">
					<p>🤒 Feels Like: {current.feelslike_c} °C</p>
					<p>☁️ Cloud Cover: {current.cloud}%</p>
					<p>🧭 Wind Direction: {current.wind_dir}</p>
					<p>🔍 UV Index: {current.uv}</p>
				</div>
			</div>

			<div className="d-flex justify-content-center mt-3">
				<WeatherIcon weatherMain={current.condition.text} darkMode={darkMode} />
			</div>
		</div>
	);
};

export default CurrentWeatherCard;
