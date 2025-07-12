/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportToPDF } from "../utils/exportToPDF";

const History = () => {
	const navigate = useNavigate();
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editedData, setEditedData] = useState({});

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const response = await fetch(
					import.meta.env.VITE_BACKEND_URL + "/api/weather"
				);
				if (!response.ok) throw new Error("Failed to fetch history");
				const data = await response.json();
				setEntries(data);
			} catch (err) {
				setError("❌ Unable to load history");
			} finally {
				setLoading(false);
			}
		};

		fetchHistory();
	}, []);

	const handleDelete = async (id) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/weather/${id}`,
				{ method: "DELETE" }
			);
			if (!response.ok) throw new Error("Failed to delete entry");
			setEntries((prev) => prev.filter((entry) => entry._id !== id));
		} catch (err) {
			console.error("❌ Failed to delete entry:", err);
		}
	};

	const handleEdit = (entry) => {
		setEditingId(entry._id);
		setEditedData({
			location: entry.location,
			temperature: entry.temperature,
			condition: entry.condition,
			humidity: entry.humidity,
			windSpeed: entry.windSpeed,
		});
	};

	const handleSave = async (id) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/weather/${id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(editedData),
				}
			);
			if (!response.ok) throw new Error("Failed to update entry");
			setEntries((prev) =>
				prev.map((entry) =>
					entry._id === id ? { ...entry, ...editedData } : entry
				)
			);
			setEditingId(null);
			setEditedData({});
		} catch (err) {
			console.error("❌ Failed to update entry:", err);
		}
	};

	const exportToJSON = () => {
		const json = JSON.stringify(entries, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "weather_history.json";
		link.click();
		URL.revokeObjectURL(url);
	};

	const exportToCSV = () => {
		const header = [
			"Location",
			"Date",
			"Temperature",
			"Condition",
			"Humidity",
			"Wind Speed",
		];
		const rows = entries.map((e) => [
			e.location,
			new Date(e.date).toLocaleString(),
			e.temperature,
			e.condition,
			e.humidity,
			e.windSpeed,
		]);

		const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "weather_history.csv";
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="container my-5">
			<div className="d-flex justify-content-between mb-3">
				<button
					className="btn btn-outline-success"
					onClick={() => navigate("/")}
				>
					⬅️ Back to Weather
				</button>
				<div>
					<button
						className="btn btn-sm btn-outline-info me-2"
						onClick={exportToCSV}
					>
						📄 Export CSV
					</button>
					<button
						className="btn btn-sm btn-outline-warning me-2"
						onClick={exportToJSON}
					>
						📥 Export JSON
					</button>
					<button
						className="btn btn-sm btn-outline-dark"
						onClick={() => exportToPDF(entries)}
					>
						📄 Export PDF
					</button>
				</div>
			</div>

			<h2 className="mb-4">📜 Weather History</h2>

			{loading && <p>Loading history...</p>}
			{error && <p className="text-danger">{error}</p>}

			{entries.map((entry) => (
				<div key={entry._id} className="card mb-4 p-3 shadow-sm">
					{editingId === entry._id ? (
						<div>
							<input
								type="text"
								value={editedData.location}
								onChange={(e) =>
									setEditedData({ ...editedData, location: e.target.value })
								}
								placeholder="Location"
								className="form-control mb-2 text-black bg-white"
							/>
							<input
								type="number"
								value={editedData.temperature}
								onChange={(e) =>
									setEditedData({ ...editedData, temperature: e.target.value })
								}
								placeholder="Temperature in °C"
								className="form-control mb-2 text-black bg-white"
							/>
							<input
								type="text"
								value={editedData.condition}
								onChange={(e) =>
									setEditedData({ ...editedData, condition: e.target.value })
								}
								placeholder="Weather condition"
								className="form-control mb-2 text-black bg-white"
							/>
							<input
								type="number"
								value={editedData.humidity}
								onChange={(e) =>
									setEditedData({ ...editedData, humidity: e.target.value })
								}
								placeholder="Humidity %"
								className="form-control mb-2 text-black bg-white"
							/>
							<input
								type="number"
								value={editedData.windSpeed}
								onChange={(e) =>
									setEditedData({ ...editedData, windSpeed: e.target.value })
								}
								placeholder="Wind speed (kph)"
								className="form-control mb-2 text-black bg-white"
							/>
							<button
								className="btn btn-sm btn-success me-2"
								onClick={() => handleSave(entry._id)}
							>
								Save
							</button>
							<button
								className="btn btn-sm btn-secondary"
								onClick={() => setEditingId(null)}
							>
								Cancel
							</button>
						</div>
					) : (
						<>
							<h5>
								📍 {entry.location} —{" "}
								<small className="text-muted">
									{new Date(entry.date).toLocaleString()}
								</small>
							</h5>
							<p>🌡️ Temp: {entry.temperature} °C</p>
							<p>🌤️ Condition: {entry.condition}</p>
							<p>💧 Humidity: {entry.humidity}%</p>
							<p>🌬️ Wind: {entry.windSpeed} kph</p>
							{entry.forecast && entry.forecast.length > 0 && (
								<div style={{ marginTop: "1rem" }}>
									<h6>🗓️ 5-Day Forecast</h6>
									<div className="forecast-history-container">
										{entry.forecast.map((day, index) => (
											<div
												key={index}
												style={{
													background: "#f3f3f3",
													padding: "0.8rem",
													borderRadius: "8px",
													width: "120px",
													textAlign: "center",
												}}
											>
												<strong>{day.date}</strong>
												<p>{day.temperature}°C</p>
												<p>{day.condition}</p>
											</div>
										))}
									</div>
								</div>
							)}

							<button
								className="btn btn-sm btn-secondary me-2 mt-3"
								onClick={() => handleEdit(entry)}
							>
								Edit
							</button>
							<button
								className="btn btn-sm btn-danger mt-3"
								onClick={() => handleDelete(entry._id)}
							>
								Delete
							</button>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default History;
