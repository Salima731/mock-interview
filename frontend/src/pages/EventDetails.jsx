import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import getImageUrl from '../utils/getImageUrl';
import './EventDetails.css';

const EventDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const { events, loading, error } = useSelector(state => state.eventState);

  const event = events.find((ev) => ev._id === id);

    if (loading) {
        return <div className="text-center my-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    if (!event) {
        return <div className="text-center text-muted">Event not found.</div>;
    }

    const {
        title,
        description,
        category,
        location,
        startDateTime,
        endDateTime,
        organizerName,
        organizerContact,
        image
    } = event;

    return (
        <Container className="event-details my-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Row className="align-items-center mb-4">
                    <Col md={6}>
                        <img 
                            src={getImageUrl(image)}
                            alt={title}
                            className="img-fluid rounded shadow-lg"
                        />
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold">{title}</h2>
                        <Badge bg="primary" className="mb-2">{category}</Badge>
                        <p className="text-muted mb-1"><strong>Location:</strong> {location}</p>
                        <p className="text-muted mb-1"><strong>Starts:</strong> {new Date(startDateTime).toLocaleString()}</p>
                        <p className="text-muted mb-3"><strong>Ends:</strong> {new Date(endDateTime).toLocaleString()}</p>
                        <Button variant="primary" className="me-2">Register</Button>
                        <Button variant="outline-secondary">Contact Organizer</Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h4>Description</h4>
                        <p>{description}</p>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
                        <h5>Organized by:</h5>
                        <p>{organizerName} - <a href={`mailto:${organizerContact}`}>{organizerContact}</a></p>
                    </Col>
                </Row>
            </motion.div>
        </Container>
    );
};

export default EventDetails;
