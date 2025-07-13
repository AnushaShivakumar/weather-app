/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const weatherRoutes = require("./routes/weatherRoutes");

dotenv.config();
console.log("PORT from .env:", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5050;

// Allow all Vercel preview URLs + production domain
const allowedOrigins = [
	/^https:\/\/weather-[a-z0-9]+-anushashivakumars-projects\.vercel\.app$/,
	"https://weather-app-sigma-taupe.vercel.app",
];

const corsOptions = {
	origin: function (origin, callback) {
		if (
			!origin || // allow non-browser tools like Postman
			allowedOrigins.some((allowed) =>
				typeof allowed === "string" ? allowed === origin : allowed.test(origin)
			)
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server is up and running");
});

app.use("/api/weather", weatherRoutes);

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: "weatherApp",
	})
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => console.error("MongoDB connection error:", err.message));
