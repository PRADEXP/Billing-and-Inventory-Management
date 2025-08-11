import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Product1 from './Product1';
import SalesComponent from './SalesComponent';
import './EmployeePage.css'; // keep using shared CSS

export default function ManagerDashboard() {
  const [p, setP] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const nav = useNavigate();

  const handleClick = (val) => {
    setP(val);
  };

  const handlenav = () => {
    nav('/profile');
  };

  const handleLogout = () => {
    nav('/');
  };

  return (
    <div>
      {/* NavBar */}
      <nav className="navbar">
        <h1 className="employee-h1">Manager Dashboard</h1>
        
        <div className="nav-buttons">
          <button onClick={() => handleClick(true)}>Product</button>
          <button onClick={() => handleClick(false)}>Sale Analytics</button>
        </div>

        {/* Profile Dropdown */}
        <div
          className="profile-section"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src="IMAGE/Profile.png"
            alt="Profile"
            className="profile-image"
          />
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handlenav}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div className="dashboard-content">
        {p ? <Product1 /> : <SalesComponent />}
      </div>
    </div>
  );
}

