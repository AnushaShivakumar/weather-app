/** @format */

import { Routes, Route } from "react-router-dom";
import Weather from "./components/Weather";
import History from "./components/History";
import ErrorBoundary from "./components/ErrorBoundary";
import AboutModal from "./components/AboutModal";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	const [showAboutMe, setShowAboutMe] = useState(false);
	const [showAboutPM, setShowAboutPM] = useState(false);

	const aboutMeContent = {
		title: "👩‍💻 About Me",
		body: (
			<>
				<p>
					Hi! I'm <strong>Anusha Shiva Kumar</strong>, a passionate developer
					with a strong interest in <strong>Data Science</strong> and{" "}
					<strong>Full Stack Development</strong>.
				</p>
				<p>
					This Weather Forecast App is part of my{" "}
					<strong>Assessment 1 and 2</strong> for the{" "}
					<strong>PM Accelerator Bootcamp</strong>, where I'm actively expanding
					my skills through real-world, project-based learning.
				</p>
			</>
		),
		links: [
			{
				label: "LinkedIn",
				url: "https://www.linkedin.com/in/anusha-shivakumar/",
			},
			{
				label: "Portfolio",
				url: "https://anushashivakumar.github.io/Portfolio/",
			},
			{ label: "GitHub", url: "https://github.com/AnushaShivakumar" },
			{
				label: "Resume",
				url: "https://drive.google.com/file/d/1SEqrswMGGW8lG87G35D6IVYZlfE-ZS7y/view",
			},
		],
	};

	const aboutPMContent = {
		title: "🏢 About PM Accelerator",
		body: (
			<>
				<p>
					<strong>PM Accelerator</strong> is a{" "}
					<strong>US-based AI innovation hub</strong> with global reach,
					offering
					<strong> award-winning mentorship</strong> from experts at
					<strong> Google, Meta, and Apple</strong>.
				</p>
				<p>
					Their <strong>AI PM Bootcamp</strong> equips aspiring professionals
					with
					<strong> real-world, project-based experience</strong> in
					<strong> GenAI, LLMs, and AI engineering</strong>.
				</p>
			</>
		),
		links: [
			{
				label: "LinkedIn",
				url: "https://www.linkedin.com/school/pmaccelerator/",
			},
			{
				label: "Internship Page",
				url: "https://www.pmaccelerator.io/AI-ML-Software-Engineer-Intern",
			},
			{ label: "Official Website", url: "https://www.pmaccelerator.io/" },
		],
	};

	return (
		<ErrorBoundary>
			<div className="text-center p-4">
				<h1>🌤️ Weather Forecast App</h1>

				<div className="my-3">
					<button
						className="btn btn-secondary mx-2"
						onClick={() => setShowAboutMe(true)}
					>
						👩‍💻 About Me
					</button>
					<button
						className="btn btn-secondary mx-2"
						onClick={() => setShowAboutPM(true)}
					>
						🏢 About PM Accelerator
					</button>
				</div>

				<Routes>
					<Route path="/" element={<Weather />} />
					<Route path="/history" element={<History />} />
				</Routes>

				<ToastContainer position="top-center" />

				{/* Modals */}
				<AboutModal
					show={showAboutMe}
					handleClose={() => setShowAboutMe(false)}
					content={aboutMeContent}
				/>
				<AboutModal
					show={showAboutPM}
					handleClose={() => setShowAboutPM(false)}
					content={aboutPMContent}
				/>
			</div>
		</ErrorBoundary>
	);
}

export default App;
