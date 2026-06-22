import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NegotiationsFeed from './pages/NegotiationsFeed';
import Inbox from './pages/Inbox';
import Campaigns from './pages/Campaigns';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'negotiations':
        return <NegotiationsFeed />;
      case 'inbox':
        return <Inbox />;
      case 'campaigns':
        return <Campaigns />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Overview';
      case 'negotiations': return 'Live AI Feed';
      case 'inbox': return 'Omnichannel Inbox';
      case 'campaigns': return 'Automated Workflows';
      case 'customers': return 'Customers';
      case 'settings': return 'Settings';
      default: return 'Overview';
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-col" style={{ flex: 1, overflow: 'hidden' }}>
        <Header title={getPageTitle()} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
