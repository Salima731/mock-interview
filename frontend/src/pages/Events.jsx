import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getAllPublicEvents } from '../redux/eventSlice';
import getImageUrl from '../utils/getImageUrl';
import { Link } from 'react-router-dom';
import './Events.css';

const Events = () => {
    const dispatch = useDispatch();
    const { events, loading, error } = useSelector(state => state.eventState);

    useEffect(() => {
        dispatch(getAllPublicEvents());
    }, [dispatch]);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4 fw-bold">Upcoming Events</h2>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            <Row className="g-4">
                {!loading && events?.length > 0 ? (
                    events.map((event, index) => (
                        <Col key={event._id} xs={12} md={6} lg={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                                whileHover={{ scale: 1.02 }}
                                className="event-card"
                            >
                                <div className="event-image-wrapper">
                                    <img 
                                        src={getImageUrl(event.image)}
                                        alt={event.title}
                                        className="event-image"
                                    />
                                </div>
                                <div className="event-content">
                                    <h5 className="event-title">{event.title}</h5>
                                    <p className="event-description">{event.description?.slice(0, 80)}...</p>
                                    <span className="event-category">{event.category}</span>
                                    <div className="mt-3 borde">
                                        <Link to={`/events/${event._id}`}>
                                            <Button variant="primary" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </Col>
                    ))
                ) : !loading && (
                    <p className="text-center text-muted">No events available yet.</p>
                )}
            </Row>
        </Container>
    );
};

export default Events;


