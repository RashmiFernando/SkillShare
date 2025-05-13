import React from 'react';
import './profile.css'; // Import the CSS file where alert styles are defined

function Alert({ message, details, type, onClose }) {
  return (
    <div className="alert-container">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
        {details && <div className="alert-details">{details}</div>}
        <button className="alert-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

export default Alert;