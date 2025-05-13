import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">Talento</div>
      <nav>
        <a href="http://localhost:3000/posts">Home</a>
        <a href="http://localhost:3000/tutorials">Tutorials</a>
      </nav>
    </header>
  );
}

export default Header;
