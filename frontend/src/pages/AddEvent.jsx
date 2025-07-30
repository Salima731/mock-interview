import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Container, Form, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';
import { addEvent } from '../redux/eventSlice';

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
        .test("fileSize", "File too large", value => !value || (value && value.size <= 5 * 1024 * 1024))
        .test("fileType", "Unsupported file format", value =>
            !value || (['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
        ),
});

const AddEvent = () => {
    const dispatch = useDispatch();
    const toaster = useToasterAndNavigate();

    const handleEventForm = (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key]) {
                formData.append(key, values[key]);
            }
        });

        dispatch(addEvent(formData))
            .unwrap()
            .then((data) => {
                toaster(data?.success, data?.message, "/");
                resetForm();
            })
            .catch((err) => toaster(false, err?.message))
            .finally(() => setSubmitting(false));
    };

    return (
        <Container className=" mt-5 mb-5" style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <Card className="p-4 shadow-sm" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h2 className="mb-4 mt-5 text-center">Create New Event</h2>
                <Formik
                    validationSchema={validationSchema}
                    onSubmit={handleEventForm}
                    initialValues={{
                        title: '',
                        description: '',
                        category: '',
                        location: '',
                        startDateTime: '',
                        endDateTime: '',
                        maxParticipants: '',
                        image: null
                    }}
                >
                    {({ handleSubmit, handleChange, setFieldValue, values, touched, errors, isSubmitting }) => (
                        <Form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            {/* Single Column */}
                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label>Event Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    isInvalid={touched.title && !!errors.title}
                                    placeholder="Enter event title"
                                />
                                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label>Description *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    isInvalid={touched.description && !!errors.description}
                                    placeholder="Enter event description"
                                />
                                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="category" className="mb-3">
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

                            <Form.Group controlId="location" className="mb-3">
                                <Form.Label>Location *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={values.location}
                                    onChange={handleChange}
                                    isInvalid={touched.location && !!errors.location}
                                    placeholder="Event location"
                                />
                                <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="startDateTime" className="mb-3">
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

                            <Form.Group controlId="endDateTime" className="mb-3">
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

                            <Form.Group controlId="maxParticipants" className="mb-3">
                                <Form.Label>Max Participants</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="maxParticipants"
                                    value={values.maxParticipants}
                                    onChange={handleChange}
                                    isInvalid={touched.maxParticipants && !!errors.maxParticipants}
                                    placeholder="Optional"
                                />
                                <Form.Control.Feedback type="invalid">{errors.maxParticipants}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="image" className="mb-3">
                                <Form.Label>Event Banner (JPEG, PNG, Max 5MB)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    onChange={(e) => setFieldValue('image', e.currentTarget.files[0])}
                                    isInvalid={touched.image && !!errors.image}
                                />
                                <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Button at bottom */}
                            <div className="text-center mt-3">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Add Event'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default AddEvent;
