import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Trash2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { deleteEvents, getAllEvents } from '../redux/eventSlice';
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';

const EventManagement = () => {
  const dispatch = useDispatch();
  const toaster = useToasterAndNavigate();
  const { events, loading } = useSelector((state) => state.eventState);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvents(id))
        .unwrap()
        .then((data) => {
          toaster(data?.success, data?.message);
          dispatch(getAllEvents())
        })
        .catch((err) => toaster(false, err?.message));
    }
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Admin Event Management</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-center">No events found.</p>
      ) : (
        <Row>
          {events.map((event) => (
            <Col key={event._id} xs={12} md={6} lg={4} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="shadow-sm rounded-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title>{event.title}</Card.Title>
                      <CalendarDays size={20} className="text-secondary" />
                    </div>

                    <Card.Text>Category: <strong>{event.category}</strong></Card.Text>
                    <Card.Text>Location: <strong>{event.location}</strong></Card.Text>
                    <Card.Text>Start: {new Date(event.startDateTime).toLocaleString()}</Card.Text>
                    <Card.Text>End: {new Date(event.endDateTime).toLocaleString()}</Card.Text>
                    <Card.Text>Created by: <strong>{event.createdBy?.username || 'N/A'}</strong></Card.Text>

                    <Button
                      variant="danger"
                      className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleDelete(event._id)}
                    >
                      <Trash2 size={16} /> Delete Event
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EventManagement;

