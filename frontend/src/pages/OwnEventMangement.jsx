import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOwnEvent, deleteOwnEvent } from '../redux/eventSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus } from 'lucide-react';

import './OwnEventManagement.css'; // Import your custom CSS
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';
import { GeoAltFill } from 'react-bootstrap-icons';

const OwnEventManagement = () => {
    const dispatch = useDispatch();
    const toaster = useToasterAndNavigate();
    const navigate = useNavigate();
    const { events, loading, error } = useSelector(state => state.eventState);

    useEffect(() => {
        dispatch(getOwnEvent());
    }, [dispatch]);

    const handleDelete = (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            dispatch(deleteOwnEvent(eventId))
                .unwrap()
                .then((data) => {
                    toaster(data?.success, data?.message);
                })
                .catch((err) => toaster(false, err?.message));

        }
    };

    const handleEdit = (eventId) => {
        navigate(`/user-events/${eventId}`);
    };

    return (
        <div className="event-container">
            <div className="event-header">
                <h2>My Events</h2>
                <button className="create-btn" onClick={() => navigate('/dashboard/events/create')}>
                    <Plus size={18} />
                    Create Event
                </button>
            </div>

            {loading && <p className="info-text">Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && events.length === 0 && <p className="info-text">No events found.</p>}

            <div className="event-grid">
                {events.map(event => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="event-card"
                    >
                        <h3>{event.title}</h3>
                        <p className="desc">{event.description}</p>
                        <p><GeoAltFill className="me-1" /> {event.location}</p>
                        <p>📁 {event.category}</p>
                        <p> Starting time: {new Date(event.startDateTime).toLocaleString()}</p>
                        <p> Ending time: {new Date(event.endDateTime).toLocaleString()}</p>

                        <div className="card-actions">
                            <button className="edit-btn" onClick={() => handleEdit(event._id)}>
                                <Pencil size={16} /> Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(event._id)}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OwnEventManagement;


