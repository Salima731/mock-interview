import { Dropdown } from "react-bootstrap";
import { motion } from "framer-motion";
import { BoxArrowRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import "./UserDropdown.css";
import UserAvatar from "../utils/UserAvatar";
import { User } from "lucide-react";

const UserDropdown = ({ isAuthenticated, user, handleLogout }) => {
  if (!isAuthenticated) {
    return <Link className="nav-link" to="/auth"><User /></Link>;
  }

  return (
    <Dropdown className="user-dropdown">
      <Dropdown.Toggle
        as={motion.div}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="user-toggle"
      >
        <UserAvatar
          src={user?.profilePhoto ? `${process.env.REACT_APP_SERVER_URL}/${user.profilePhoto}` : null}
          fullname={user?.fullname}
          size={50}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-menu">

        {/* <Dropdown.Item as={Link} to="/operatorArea">My Packages</Dropdown.Item> */}
        {user?.role === "user" && (
          <>
            <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
             <Dropdown.Item as={Link} to="/user-events">My Events</Dropdown.Item>
            <Dropdown.Divider />
            
            {/* <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item> */}
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/admin/users">User Management</Dropdown.Item>
            <Dropdown.Item as={Link} to="/admin/dashboard">Admin Dashboard</Dropdown.Item>
            <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
          </>
        )}

        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout}>
          Logout <BoxArrowRight className="ms-1" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserDropdown;