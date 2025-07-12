/** @format */

const ForecastCard = ({ forecast, darkMode }) => {
	if (!forecast.length) return null;

	return (
		<div
			className={`card mt-4 p-4 shadow rounded ${
				darkMode ? "bg-dark text-white" : "bg-light text-dark"
			}`}
		>
			<h3 className="mb-3">5-Day Forecast</h3>
			<div className="d-flex justify-content-between flex-wrap">
				{forecast.map((day, index) => (
					<div key={index} className="text-center mx-2 mb-3">
						<p className="mb-1 fw-bold">
							{new Date(day.date).toLocaleDateString("en-US", {
								weekday: "short",
								month: "short",
								day: "numeric",
							})}
						</p>
						<div className="d-flex justify-content-center mt-3">
							<img
								src={day.day.condition.icon}
								alt={day.day.condition.text}
								style={{ height: 48 }}
							/>
						</div>
						<p className="mb-0">{day.day.avgtemp_c.toFixed(1)}°C</p>
						<p className="text-capitalize">{day.day.condition.text}</p>
					</div>
				))}
			</div>
		</div>
	);
};
export default ForecastCard;
