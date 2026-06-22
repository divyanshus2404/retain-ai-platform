import React from 'react';
import { Bell, Search } from 'lucide-react';
import './Header.css';

const Header = ({ title }) => {
  return (
    <header className="header glass-panel">
      <div className="header-content">
        <h1 className="heading-md">{title}</h1>
        
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search customers, orders..." className="search-input" />
          </div>
          
          <button className="icon-btn">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
          
          <button className="btn btn-primary">
            Connect Store
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
