import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {  ToastContainer } from "react-toastify";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';


import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import AddEvent from "./pages/AddEvent";
import CombinedAuth from "./pages/CombinedAuth";

import ProtectedRoute from "./utils/ProtectedRoute";


// Layouts
import Layout from "./layouts/Layout";         // Admin Layout with AdminSidebar
import AuthLayout from "./layouts/AuthLayout"; // User Layout with UserSidebar

// Admin Pages
import AdminDashboard from "./pages/Dashboards/Admin/AdminDashboard";
import UserManagement from "./admin/UserManagement";
import EventManagement from "./admin/EventMangement";
import OwnEventMangement from "./pages/OwnEventMangement";
import EditEvent from "./pages/EditEvent";

function App() {




  return (
    <Router>
      <Header />
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<CombinedAuth />} />
      
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/user-events" element={
          <ProtectedRoute><OwnEventMangement /></ProtectedRoute>
        } />
          <Route path="/user-events/:id" element={
          <ProtectedRoute><EditEvent /></ProtectedRoute>
        } />


        {/* Protected User Routes */}
        <Route element={<ProtectedRoute><AuthLayout /></ProtectedRoute>}>

          <Route path="/profile" element={<Profile />} />
          <Route path="/addEvent" element={<AddEvent />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole={['admin']}><Layout /></ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="events" element={<EventManagement />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

