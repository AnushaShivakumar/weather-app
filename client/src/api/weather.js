/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const weatherRoutes = require("./routes/weatherRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ CORS: Only allow Vercel domains
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || origin.endsWith(".vercel.app")) {
				callback(null, true);
			} else {
				console.log("❌ Blocked by CORS:", origin);
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST"],
		credentials: true,
	})
);

app.use(express.json());
app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
	res.send("✅ Backend live");
});

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: "weatherApp",
	})
	.then(() => {
		console.log("✅ MongoDB connected");
		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	})
	.catch((err) => console.error("❌ MongoDB error:", err.message));
