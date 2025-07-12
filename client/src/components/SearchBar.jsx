/** @format */

// File: src/components/SearchBar.jsx

const SearchBar = ({
	city,
	setCity,
	getWeather,
	getWeatherByLocation,
	loading,
}) => {
	return (
		<div className="input-group mb-3">
			<input
				type="text"
				className="form-control bg-white text-black dark:bg-gray-800 dark:text-white placeholder-gray-400"
				placeholder="Enter city"
				value={city}
				onChange={(e) => setCity(e.target.value)}
			/>

			<button
				className="btn btn-secondary"
				onClick={getWeather}
				disabled={loading}
			>
				{loading ? "Loading..." : "Search"}
			</button>

			<button
				className="btn btn-outline-secondary ms-2"
				onClick={getWeatherByLocation}
			>
				Use My Location
			</button>
		</div>
	);
};

export default SearchBar;
