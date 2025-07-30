import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "./Header.css";
import UserDropdown from "./UserDropdown";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../redux/usersSlice";
import useToasterAndNavigate from "../hooks/useToasterAndNavigate";

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state?.usersState ?? {});
  const toaster = useToasterAndNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout())
      .unwrap()
      .then((data) => toaster(data?.success, data?.message, "/auth"))
      .catch((err) => toaster(false, err?.message));
  };

  return (
    <Navbar expand="lg" className="main-navbar shadow-sm" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={"https://th.bing.com/th/id/OIP.ST9HKz2AOTEItRdQNceRLgHaEc?w=286&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"} alt="KeralaUX Logo" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-4">
            <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>Home</Nav.Link>
            <Nav.Link as={Link} to="/events" className={location.pathname === "/events" ? "active" : ""}>Events</Nav.Link>
            <Nav.Link as={Link} to="/addEvent" className={location.pathname === "/addEvent" ? "active" : ""}>Add Event</Nav.Link>
            <Nav.Link as={Link} to="/recipes" className={location.pathname === "/recipes" ? "active" : ""}>About</Nav.Link>
            <Nav.Link as={Link} to="/packages" className={location.pathname === "/packages" ? "active" : ""}>Contact Us</Nav.Link>
            <UserDropdown
              isAuthenticated={isAuthenticated}
              user={user}
              handleLogout={handleLogout}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;





