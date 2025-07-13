/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const weatherRoutes = require("./routes/weatherRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Smart CORS config: allows Vercel domains & localhost
const corsOptions = {
	origin: (origin, callback) => {
		if (
			!origin ||
			origin.endsWith(".vercel.app") ||
			origin === "http://localhost:5173"
		) {
			callback(null, true);
		} else {
			console.log("❌ Blocked by CORS:", origin);
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
	res.send("Server is up and running");
});

// ✅ Weather routes
app.use("/api/weather", weatherRoutes);

// ✅ MongoDB connection
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: "weatherApp",
	})
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	})
	.catch((err) => console.error("MongoDB connection error:", err.message));
