import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import useToasterAndNavigate from '../hooks/useToasterAndNavigate';
import './ChangePasswordModal.css';
import { userPasswordUpdate } from '../redux/usersSlice';

const ChangePasswordModal = ({ show, handleClose }) => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const dispatch = useDispatch();
  const toaster = useToasterAndNavigate();

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required('Please enter current password')
      .min(5, 'Minimum 5 characters required'),
    newPassword: yup
      .string()
      .required('Please enter new password')
      .min(5, 'Minimum 5 characters required')
      .notOneOf([yup.ref('currentPassword')], 'New password should not be the same as current password'),
    confirmPassword: yup
      .string()
      .required('Please confirm new password')
      .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
  });

  const handleSubmitPassword = (values, { setSubmitting }) => {
    dispatch(userPasswordUpdate(values))
      .unwrap()
      .then((res) => {
        toaster(res?.success, res?.message);
        if (res?.success) {
          setTimeout(() => {
            handleClose(); // Auto-close on success
          }, 1000);
        }
      })
      .catch((err) => {
        toaster(false, err?.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="blur-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="password-modal-wrapper"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal show centered onHide={handleClose} backdrop="static" keyboard={false} className="change-password-modal">
              <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  validationSchema={schema}
                  onSubmit={handleSubmitPassword}
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  }}
                >
                  {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      {[
                        { label: 'Current Password', name: 'currentPassword', show: showPassword.current, toggle: () => togglePassword('current') },
                        { label: 'New Password', name: 'newPassword', show: showPassword.new, toggle: () => togglePassword('new') },
                        { label: 'Confirm Password', name: 'confirmPassword', show: showPassword.confirm, toggle: () => togglePassword('confirm') },
                      ].map((field, idx) => (
                        <Form.Group key={idx} className="mb-3" controlId={field.name}>
                          <Form.Label>{field.label}</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={field.show ? 'text' : 'password'}
                              name={field.name}
                              value={values[field.name]}
                              onChange={handleChange}
                              isInvalid={touched[field.name] && !!errors[field.name]}
                              isValid={touched[field.name] && !errors[field.name]}
                              className="rounded-start"
                            />
                            <InputGroup.Text onClick={field.toggle} className="password-toggle">
                              {field.show ? <FaEye /> : <FaEyeSlash />}
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                              {errors[field.name]}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      ))}

                      <div className="d-grid mt-4">
                        <Button
                          type="submit"
                          className="bg-warning border-0 text-dark fw-semibold rounded-pill"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Updating...' : 'Change Password'}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;