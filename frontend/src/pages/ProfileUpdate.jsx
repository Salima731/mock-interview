import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileUpdate } from '../redux/usersSlice';
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';

const ProfileUpdate = () => {
    const { user } = useSelector((state) => state.usersState);

    const { Formik } = formik;
    const schema = yup.object().shape({
        fullName: yup
            .string()
            .required("Please enter your full name")
            .min(3, "Minimum 3 letters required"),
        eMail: yup
            .string()
            .email("Please enter a valid e-mail")
            .required("Please enter your e-mail"),
    });

    const dispatch = useDispatch();
    const toaster = useToasterAndNavigate();

    const handleUserProfileEdit = async (updatedUser) => {
        const formData = new FormData();
        formData.append("fullName", updatedUser.fullName);
        formData.append("eMail", updatedUser.eMail);
        formData.append("password", updatedUser.password || ""); // optional

        dispatch(userProfileUpdate(formData))
            .unwrap()
            .then((data) => {
                toaster(data?.success, data?.message, "/profile");
            })
            .catch((err) => {
                toaster(false, err?.message);
            });
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Formik
                        validationSchema={schema}
                        onSubmit={handleUserProfileEdit}
                        initialValues={{
                            fullName: user?.fullName ?? '',
                            eMail: user?.eMail ?? '',
                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationFullName" className="position-relative">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fullName"
                                            value={values.fullName}
                                            onChange={handleChange}
                                            isValid={touched.fullName && !errors.fullName}
                                            isInvalid={!!errors.fullName}
                                        />
                                        <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.fullName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <Form.Group as={Col} controlId="validationEmail">
                                        <Form.Label>E-mail</Form.Label>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                placeholder="e-mail"
                                                aria-describedby="inputGroupPrepend"
                                                name="eMail"
                                                value={values.eMail}
                                                onChange={handleChange}
                                                isValid={touched.eMail && !errors.eMail}
                                                isInvalid={!!errors.eMail}
                                            />
                                            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.eMail}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Row>

                                <Button type="submit" className="mt-3 w-100">
                                    Update Profile
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileUpdate;
