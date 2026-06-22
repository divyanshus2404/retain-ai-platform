import React, { useState, useEffect } from 'react';
import { Play, Settings2, BarChart2 } from 'lucide-react';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => setCampaigns(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="campaigns-page animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-md">Automated Workflows</h2>
        <button className="btn btn-primary">Create Workflow</button>
      </div>

      <div className="campaigns-grid">
        {campaigns.map(camp => (
          <div key={camp.id} className="campaign-card card glass-panel">
            <div className="camp-header border-b">
              <div>
                <h3 className="heading-sm font-medium">{camp.name}</h3>
                <span className="text-small text-muted" style={{ textTransform: 'capitalize' }}>
                  {camp.type.replace('_', ' ')}
                </span>
              </div>
              <div className={`status-badge ${camp.status}`}>
                {camp.status}
              </div>
            </div>
            
            <div className="camp-stats">
              <div className="stat-box">
                <span className="stat-label">Messages Sent</span>
                <span className="stat-value text-primary">{camp.stats?.sent || 0}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Converted</span>
                <span className="stat-value" style={{ color: 'var(--success-green)' }}>{camp.stats?.converted || 0}</span>
              </div>
            </div>

            <div className="camp-actions border-t">
              <button className="icon-btn"><Settings2 size={18} /></button>
              <button className="icon-btn"><BarChart2 size={18} /></button>
              {camp.status !== 'active' && <button className="icon-btn" style={{ color: 'var(--success-green)' }}><Play size={18} /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
