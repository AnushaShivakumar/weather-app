/** @format */

import React from "react";
import { Modal, Button } from "react-bootstrap";

const AboutModal = ({ show, handleClose, content }) => {
	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>{content.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>{content.body}</p>
				<div className="d-flex flex-wrap gap-2 mt-3">
					{content.links.map((link, index) => (
						<a
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-secondary mx-2"
						>
							{link.label}
						</a>
					))}
				</div>
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default AboutModal;
