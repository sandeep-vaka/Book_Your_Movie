import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, User as UserIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  // Read auth state
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="text-accent">Movie</span>Tickets
        </Link>
        
        <div className="navbar-search">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search for Movies, Events, Plays..." />
        </div>

        <div className="navbar-actions">
          <div className="location-selector">
            <MapPin size={18} />
            <span>Select City</span>
          </div>

          {token ? (
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="btn-login" onClick={() => navigate('/login')}>
              <UserIcon size={18} /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
