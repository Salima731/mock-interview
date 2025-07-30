import React from 'react'; 
import './Footer.css';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        {/* Branding */}
        <div className="footer-branding">
        <img 
  src="https://th.bing.com/th/id/OIP.ST9HKz2AOTEItRdQNceRLgHaEc?w=286&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" 
  alt="EventSphere Logo" 
  className="footer-logo"
/>

          <h2>EventSphere</h2>
          <p>Your one-stop platform for planning and managing events effortlessly.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/events">Upcoming Events</Link></li>
            <li><Link to="/addevent">Create Event</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>EventSphere HQ, Tech Park, Bangalore, India</p>
          <p><Mail size={16} /> Email: support@eventsphere.com</p>
          <p><Phone size={16} /> Phone: +91 98765 43210</p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com/eventsphere" target="_blank" rel="noreferrer"><Facebook size={20} /></a>
            <a href="https://instagram.com/eventsphere" target="_blank" rel="noreferrer"><Instagram size={20} /></a>
            <a href="https://twitter.com/eventsphere" target="_blank" rel="noreferrer"><Twitter size={20} /></a>
            <a href="https://youtube.com/eventsphere" target="_blank" rel="noreferrer"><Youtube size={20} /></a>
            <a href="mailto:support@eventsphere.com" target="_blank" rel="noreferrer"><Mail size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EventSphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
