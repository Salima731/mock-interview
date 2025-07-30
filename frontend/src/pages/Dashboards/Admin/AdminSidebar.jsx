import { NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import "./AdminSidebar.css";

const AdminSidebar = ({ isMobile, onClose }) => {
  return (
    <aside className={`admin-sidebar ${isMobile ? "mobile-sidebar" : ""}`}>
      {isMobile && (
        <button className="sidebar-close-btn" onClick={onClose}>×</button>
      )}
      <h4 className="sidebar-title">Admin Panel</h4>
      <nav className="nav flex-column sidebar-nav">
        <NavLink to="/admin/dashboard" className="nav-link">
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        {/* <NavLink to="/admin/users" className="nav-link">
          <Users size={18} /> Users
        </NavLink>
        <NavLink to="/admin/events" className="nav-link">
          <Calendar size={18} /> Events
        </NavLink> */}
      </nav>
      <div className="logout-section mt-auto">
        <button className="logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
