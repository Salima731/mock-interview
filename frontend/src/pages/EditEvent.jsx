import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Container, Form, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';
import { updateOwnEvent } from '../redux/eventSlice';


const validationSchema = yup.object().shape({
  title: yup.string().required("Event title is required").min(3).max(50),
  description: yup.string().required("Description is required").min(10),
  category: yup.string().required("Category is required"),
  location: yup.string().required("Location is required"),
  startDateTime: yup.date().required("Start Date/Time is required"),
  endDateTime: yup
    .date()
    .required("End Date/Time is required")
    .min(yup.ref('startDateTime'), "End Date/Time must be after Start Date/Time"),
  maxParticipants: yup.number().nullable().min(1, "Must be at least 1 if specified"),
  image: yup.mixed()
    .nullable()
    .test("fileSize", "File too large", value => !value || value.size <= 5 * 1024 * 1024)
    .test("fileType", "Unsupported file format", value =>
      !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    ),
});

const EditEvent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toaster = useToasterAndNavigate();

  const { events, loading } = useSelector(state => state.eventState);
  const event = events.find(ev => ev._id === id);

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (event) {
      setInitialValues({
        _id: event._id,
        title: event.title || '',
        description: event.description || '',
        category: event.category || '',
        location: event.location || '',
        startDateTime: event.startDateTime?.slice(0, 16) || '',
        endDateTime: event.endDateTime?.slice(0, 16) || '',
        maxParticipants: event.maxParticipants || '',
        image: null,
      });
    }
  }, [event]);

  const handleUpdate = (values, { setSubmitting }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    dispatch(updateOwnEvent({ id: values._id, updatedData: formData }))

      .unwrap()
      .then((data) => {
        toaster(data?.success, data?.message, '/');
      })
      .catch((err) => {
        toaster(false, err?.message || 'Something went wrong');
      })
      .finally(() => setSubmitting(false));
  };

  if (loading || !initialValues) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm">
        <h2 className="mb-4 text-center">Edit Event</h2>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleUpdate}
        >
          {({ handleSubmit, handleChange, setFieldValue, values, touched, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="title">
                    <Form.Label>Event Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      isInvalid={touched.title && !!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="description" className="mt-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      isInvalid={touched.description && !!errors.description}
                      rows={3}
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="category" className="mt-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      isInvalid={touched.category && !!errors.category}
                    >
                      <option value="">Select Category</option>
                      {['Conference', 'Workshop', 'Webinar', 'Meetup', 'Seminar', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="location" className="mt-3">
                    <Form.Label>Location *</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={values.location}
                      onChange={handleChange}
                      isInvalid={touched.location && !!errors.location}
                    />
                    <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="startDateTime">
                    <Form.Label>Start Date & Time *</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="startDateTime"
                      value={values.startDateTime}
                      onChange={handleChange}
                      isInvalid={touched.startDateTime && !!errors.startDateTime}
                    />
                    <Form.Control.Feedback type="invalid">{errors.startDateTime}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="endDateTime" className="mt-3">
                    <Form.Label>End Date & Time *</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="endDateTime"
                      value={values.endDateTime}
                      onChange={handleChange}
                      isInvalid={touched.endDateTime && !!errors.endDateTime}
                    />
                    <Form.Control.Feedback type="invalid">{errors.endDateTime}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="maxParticipants" className="mt-3">
                    <Form.Label>Max Participants</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxParticipants"
                      value={values.maxParticipants}
                      onChange={handleChange}
                      isInvalid={touched.maxParticipants && !!errors.maxParticipants}
                    />
                    <Form.Control.Feedback type="invalid">{errors.maxParticipants}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="image" className="mt-3">
                    <Form.Label>Event Banner (JPEG, PNG, Max 5MB)</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={(e) => setFieldValue('image', e.currentTarget.files[0])}
                      isInvalid={touched.image && !!errors.image}
                    />
                    <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-4 text-center">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Event'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default EditEvent;

