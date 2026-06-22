import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShieldCheck, ArrowUpRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    mrrSaved: 0,
    subscriptionsRetained: 0,
    activeNegotiations: 0,
    recentSaves: []
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  const chartData = [
    { name: 'Jan', saved: 1200 },
    { name: 'Feb', saved: 1900 },
    { name: 'Mar', saved: 2400 },
    { name: 'Apr', saved: 2100 },
    { name: 'May', saved: 3200 },
    { name: 'Jun', saved: 4800 },
  ];

  return (
    <div className="dashboard animate-fade-in">
      <div className="metrics-grid">
        <div className="metric-card card glass-panel">
          <div className="metric-header">
            <h3 className="text-muted">MRR Saved</h3>
            <div className="metric-icon" style={{ background: 'var(--success-green-glow)', color: 'var(--success-green)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value">${stats.mrrSaved}</div>
          <div className="metric-trend text-small" style={{ color: 'var(--success-green)' }}>
            <ArrowUpRight size={14} /> +24% from last month
          </div>
        </div>

        <div className="metric-card card glass-panel">
          <div className="metric-header">
            <h3 className="text-muted">Subscriptions Retained</h3>
            <div className="metric-icon" style={{ background: 'var(--accent-blue-glow)', color: 'var(--accent-blue)' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="metric-value">{stats.subscriptionsRetained}</div>
          <div className="metric-trend text-small" style={{ color: 'var(--success-green)' }}>
            <ArrowUpRight size={14} /> +12% from last month
          </div>
        </div>

        <div className="metric-card card glass-panel">
          <div className="metric-header">
            <h3 className="text-muted">Active Negotiations</h3>
            <div className="metric-icon" style={{ background: 'var(--accent-purple-glow)', color: 'var(--accent-purple)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">{stats.activeNegotiations}</div>
          <div className="metric-trend text-small text-muted">
            <span className="status-indicator pulse inline-block mr-2"></span>
            AI is currently chatting
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="chart-section card glass-panel flex-2">
          <h3 className="heading-sm mb-4">Revenue Saved Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="saved" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorSaved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-saves-section card glass-panel flex-1">
          <h3 className="heading-sm mb-4">Recent AI Saves</h3>
          <div className="saves-list">
            {stats.recentSaves.map(save => (
              <div key={save.id} className="save-item">
                <div className="save-info">
                  <span className="save-customer font-medium">{save.customer}</span>
                  <span className="save-product text-small text-muted">{save.product}</span>
                </div>
                <div className="save-meta flex-col items-end">
                  <span className="save-value text-gradient font-medium">{save.value}</span>
                  <span className="save-status text-small" style={{ color: 'var(--success-green)' }}>{save.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
