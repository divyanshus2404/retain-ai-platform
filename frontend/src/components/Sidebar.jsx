import React from 'react';
import { LayoutDashboard, MessageSquare, Users, Settings, Activity } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'negotiations', label: 'Live AI Feed', icon: Activity, pulse: true },
    { id: 'inbox', label: 'Omnichannel Inbox', icon: MessageSquare },
    { id: 'campaigns', label: 'Workflows', icon: Users },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h2 className="logo-text text-gradient">RetainAI</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.pulse && <div className="status-indicator pulse ml-auto"></div>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile card">
          <div className="avatar"></div>
          <div className="user-info">
            <span className="font-medium text-small">Divyanshu</span>
            <span className="text-muted text-small" style={{ fontSize: '0.75rem' }}>Founder</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
