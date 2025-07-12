/** @format */

import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const MapCard = ({ cityName, coordinates, darkMode }) => {
	return (
		<div
			className={`card mt-4 p-4 shadow rounded mb-5 ${
				darkMode ? "bg-dark text-white" : "bg-light text-dark"
			}`}
			style={{ zIndex: 1 }} // ✅ ensures it stays under footer
		>
			<h3 className="mb-3">Map of {cityName}</h3>
			<MapContainer
				center={[coordinates.lat, coordinates.lon]}
				zoom={10}
				scrollWheelZoom={false}
				style={{ height: "300px", width: "100%" }}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker position={[coordinates.lat, coordinates.lon]} />
			</MapContainer>
		</div>
	);
};

export default MapCard;
