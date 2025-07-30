import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./Layout.css";
import AdminSidebar from "../pages/Dashboards/Admin/AdminSidebar";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <AdminSidebar isMobile={isMobile} onClose={closeSidebar} />
      <div className="admin-content">
        <header className="admin-header">
          {isMobile && (
            <button className="menu-btn" onClick={toggleSidebar}>
              ☰
            </button>
          )}
          <h2>Admin Dashboard</h2>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;