import React from 'react';
import './PageNotfound.css';
import { Link } from 'react-router-dom';

export default function PageNotfound() {
  return (
  <div className="page-notfound-container">
  <h1>404</h1>
  <p>Oops! Page not found.</p>
  <Link to="/">Return to Home</Link>
</div>

  );
}
