import { useState } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import {
  Container, Form, Button, InputGroup, Row, Card, 
} from 'react-bootstrap';
import { EnvelopeAtFill, PersonFill } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import "./CombinedAuth.css";
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { userLogin, userRegister } from '../redux/usersSlice';

const CombinedAuth = () => {
  const dispatch = useDispatch();
  const toaster = useToasterAndNavigate();
  const { isAuthenticated } = useSelector((state) => state.usersState);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // Toggle form
  const { Formik } = formik;

  if (isAuthenticated) return <Navigate to="/" />;

  // Validation Schemas
  const registerSchema = yup.object().shape({
    username: yup.string().required('Username required').min(3),
    email: yup.string().email('Invalid email').required('Email required'),
    password: yup.string().min(5).required('Password required'),
  });

  const loginSchema = yup.object().shape({
    email: yup.string().required('Email is required'),
    password: yup.string().min(5).required('Password is required'),
  });

  // Handlers
  const handleRegisterForm = (newUser) => {
    dispatch(userRegister(newUser))
      .unwrap()
      .then((data) => {
        toaster(data?.success, data?.message);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowRegister(false); // Back to login form
        }, 3000);
      })
      .catch((err) => toaster(false, err?.message));
  };

  const handleLoginForm = (loginData) => {
    dispatch(userLogin(loginData))
      .unwrap()
      .then((data) => {
        toaster(data?.success, data?.message, "/");
      })
      .catch((err) => toaster(false, err?.message));
  };

  return (
    <Container fluid className="auth-container px-4">
      <AnimatePresence>
        {showConfetti && (
          <>
            <Confetti numberOfPieces={400} recycle={false}
              colors={['#FFD700', '#FF6347', '#4CAF50', '#1E90FF']} />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="confetti-success-banner"
            >
              <h3 className="text-success fw-bold">Registration Successful!</h3>
              <p>You can now login.</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Row className="shadow-lg rounded-4 overflow-hidden auth-card">
        <Card.Title className="text-center mb-4">
          <h2 className="fw-bold text-dark">{showRegister ? "Register" : "Login"}</h2>
          <p className="text-muted small">
            {showRegister ? "Create your account" : "Access your account"}
          </p>
        </Card.Title>

        {showRegister ? (
          // Register Form
          <Formik
            validationSchema={registerSchema}
            onSubmit={handleRegisterForm}
            initialValues={{
              username: '',
              email: '',
              password: '',
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                      placeholder="Username"
                    />
                    <InputGroup.Text><PersonFill /></InputGroup.Text>
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Email"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Password"
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="warning" type="submit" className="w-100 mb-3">
                  Register
                </Button>

                <div className="text-center">
                  Already have an account?{" "}
                  <Button variant="link" onClick={() => setShowRegister(false)}>Login</Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          // Login Form
          <Formik
            validationSchema={loginSchema}
            onSubmit={handleLoginForm}
            initialValues={{ email: '', password: '' }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="loginEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      placeholder="your@email.com"
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <InputGroup.Text><EnvelopeAtFill /></InputGroup.Text>
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="loginPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                {/* <Row>
                  <Col className='mb-3 text-end'>
                    <Link to={"/reset-passOtp"}>Forgot Password?</Link>
                  </Col>
                </Row> */}

                <Button variant="warning" type="submit" className="w-100 mb-3">
                  Login
                </Button>

                <div className="text-center">
                  Don't have an account?{" "}
                  <Button variant="link" onClick={() => setShowRegister(true)}>Register</Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Row>
    </Container>
  );
};

export default CombinedAuth;
