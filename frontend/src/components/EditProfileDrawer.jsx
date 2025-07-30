import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import './EditProfileDrawer.css';
import { useDispatch } from 'react-redux';
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';
import { useState } from 'react';

import { userProfileUpdate } from '../redux/usersSlice';

const EditProfileDrawer = ({ show, handleClose, user }) => {
  const { Formik } = formik;
  const dispatch = useDispatch();
  const toaster = useToasterAndNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileEditSchema = yup.object().shape({
    username: yup.string().required('Username is required').min(3, 'Must be at least 3 characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const handleUserProfileEdit = async (updatedUser) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('username', updatedUser.username);
      formData.append('email', updatedUser.email);

      const data = await dispatch(userProfileUpdate(formData)).unwrap();
      const redirectPath = user?.role === 'tour_operator' ? '/operatorArea/profile' : '/profile';
      toaster(data?.success, data?.message, redirectPath);
      handleClose();
    } catch (err) {
      toaster(false, err?.message || 'Profile update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="edit-profile-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="edit-profile-modal" // changed class name
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="edit-profile-title"
          >
            <div className="edit-profile-header">
              <h5 id="edit-profile-title">Edit Profile</h5>
              <button onClick={handleClose} className="edit-profile-close-button" aria-label="Close">
                &times;
              </button>
            </div>

            <Formik
              validationSchema={profileEditSchema}
              onSubmit={handleUserProfileEdit}
              enableReinitialize
              initialValues={{
                username: user?.username || '',
                email: user?.email || '',
              }}
            >
              {({ handleSubmit, handleChange, values, errors, touched }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        isInvalid={touched.username && !!errors.username}
                        placeholder="Username"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && !!errors.email}
                      placeholder="Email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="text-end mt-4">
                    <Button type="submit" variant="warning" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileDrawer;
