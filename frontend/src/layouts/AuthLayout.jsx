import React from "react";
import { Outlet } from "react-router-dom";
import './AuthLayout.css';
import UserSidebar from "../pages/Dashboards/User/UserSidebar";

const AuthLayout = () => {
  return (
    <div className="auth-layout d-flex min-vh-100">
      <UserSidebar />
      <main className="flex-grow-1 p-3 bg-light">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
