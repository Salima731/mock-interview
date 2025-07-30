import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import './UserSidebar.css';

const UserSidebar = () => {
  return (
    <aside className="user-sidebar bg-dark text-white p-3">
      <h5>User Panel</h5>
      <nav className="nav flex-column mt-3">
        <NavLink to="/profile" className="nav-link text-white">
          <User size={18} /> Profile
        </NavLink>
        {/* Removed Add Event, Logout, and Register */}
      </nav>
    </aside>
  );
};

export default UserSidebar;

