import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Product1 from './Product1';
import Billing1 from './Billing1';
import './EmployeePage.css';

export default function EmployeePage() {
  const [p, setp] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const nav = useNavigate();

  const handleClick = (a) => {
    setp(a);
  };

  const handlenav = () => {
    nav('/profile');
  };

  const handleuser = () => {
    nav('/users');
  };

  const handleLogout = () => {
    nav('/');
  };

  return (
    <div>
      {/* NavBar */}
      <nav className="navbar">
        <h1 className="employee-h1">Employee Dashboard</h1>
        <div className="nav-buttons">
          <button onClick={() => handleClick(true)}>Product</button>
          <button onClick={() => handleClick(false)}>Billing</button>
          <button onClick={handleuser}>User</button>
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
        {p ? <Product1 /> : <Billing1 />}
      </div>
    </div>
  );
}