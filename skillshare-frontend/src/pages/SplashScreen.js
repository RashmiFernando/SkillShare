import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="branding-container">
        <h1 className="branding-title">Talento</h1>
        <p className="branding-subtitle">Connect. Learn. Share.</p>
      </div>
    </div>
  );
};

export default SplashScreen;
