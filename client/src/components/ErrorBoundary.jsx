/** @format */

import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		console.error("❌ Unhandled error:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="text-center my-5">
					<h2>🚨 Something went wrong.</h2>
					<p>Please refresh the page or try again later.</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
