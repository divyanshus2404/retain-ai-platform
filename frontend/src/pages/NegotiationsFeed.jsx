import React, { useState, useEffect } from 'react';
import { Send, Bot, User, CheckCircle2 } from 'lucide-react';
import './NegotiationsFeed.css';

const NegotiationsFeed = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hey Sarah, saw you are pausing your Daily Vitamins subscription. Is everything okay? I can pause it for a month or swap your flavor right here!', time: '10:42 AM' },
    { id: 2, sender: 'user', text: 'Hey! Honestly I just have too many right now, haven\'t finished the last bottle.', time: '10:45 AM' },
    { id: 3, sender: 'bot', text: 'Got it! Makes total sense. Instead of fully cancelling, how about I pause your next shipment for 4 weeks? You keep your loyal customer pricing, and it gives you time to catch up.', time: '10:45 AM' },
  ]);

  const [input, setInput] = useState('');
  const [status, setStatus] = useState('negotiating');

  useEffect(() => {
    // Simulate AI saving the sub after a few seconds
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, { id: 4, sender: 'user', text: 'Yeah actually a 4 week pause sounds perfect. Let\'s do that.', time: '10:46 AM' }]);
      setStatus('saved');
      
      setTimeout(() => {
         setMessages(prev => [...prev, { id: 5, sender: 'bot', text: 'Awesome! I\'ve paused it for 4 weeks. You\'ll get a reminder before the next one ships. Have a great day! 🎉', time: '10:46 AM' }]);
      }, 1000);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="negotiations-feed animate-fade-in">
      <div className="feed-layout">
        
        {/* Left Side: Active Sessions List */}
        <div className="sessions-list card glass-panel flex-1">
          <h3 className="heading-sm mb-4">Active Interventions</h3>
          <div className="session-item active">
            <div className="session-avatar"><User size={16} /></div>
            <div className="session-info">
              <span className="font-medium">Sarah Smith</span>
              <span className="text-small text-muted">Daily Vitamins ($30)</span>
            </div>
            <div className="session-status">
              <span className="status-indicator pulse"></span>
            </div>
          </div>
          <div className="session-item">
            <div className="session-avatar"><User size={16} /></div>
            <div className="session-info">
              <span className="font-medium">Mike Johnson</span>
              <span className="text-small text-muted">Protein Powder ($60)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="chat-interface card glass-panel flex-2 flex-col">
          <div className="chat-header">
            <div className="flex items-center gap-4">
              <div className="avatar-large">S</div>
              <div>
                <h3 className="heading-sm">Sarah Smith</h3>
                <span className="text-small text-muted">Attempting to save $30/mo subscription</span>
              </div>
            </div>
            {status === 'saved' && (
               <div className="save-badge">
                 <CheckCircle2 size={16} /> Subscription Saved
               </div>
            )}
          </div>

          <div className="chat-messages flex-1">
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                <div className="message-icon">
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <div className="input-box">
              <input 
                type="text" 
                placeholder="AI is currently handling this negotiation..." 
                disabled 
                className="message-input"
              />
              <button className="icon-btn send-btn" disabled>
                <Send size={18} />
              </button>
            </div>
            <p className="text-small text-muted mt-2" style={{ textAlign: 'center' }}>
              Human intervention is disabled while the AI Negotiator is active.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NegotiationsFeed;
