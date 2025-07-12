/** @format */

import jsPDF from "jspdf";

export const exportToPDF = (entries) => {
	const doc = new jsPDF();
	let y = 10;

	doc.setFontSize(16);
	doc.text("Weather History Export", 10, y);
	y += 10;

	entries.forEach((entry, idx) => {
		doc.setFontSize(12);
		doc.text(`Location: ${entry.location}`, 10, y);
		y += 6;
		doc.text(`Date: ${new Date(entry.date).toLocaleString()}`, 10, y);
		y += 6;
		doc.text(`Temp: ${entry.temperature} °C`, 10, y);
		y += 6;
		doc.text(`Condition: ${entry.condition}`, 10, y);
		y += 6;
		doc.text(`Humidity: ${entry.humidity}%`, 10, y);
		y += 6;
		doc.text(`Wind: ${entry.windSpeed} kph`, 10, y);
		y += 6;

		if (entry.forecast?.length > 0) {
			doc.text("Forecast (5 Days):", 10, y);
			y += 6;
			entry.forecast.forEach((f) => {
				doc.text(`${f.date} - ${f.temperature} °C, ${f.condition}`, 12, y);
				y += 6;
			});
		}

		y += 8;

		if (y >= 280) {
			doc.addPage();
			y = 10;
		}
	});

	doc.save("weather-history.pdf");
};
