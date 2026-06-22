import React, { useState, useEffect } from 'react';
import { User, MessageSquare } from 'lucide-react';
import './Inbox.css';

const Inbox = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="inbox-container animate-fade-in">
      <div className="inbox-sidebar card glass-panel">
        <h3 className="heading-sm mb-4">Conversations</h3>
        <div className="conversations-list">
          {messages.map(msg => (
            <div key={msg.id} className="conversation-item">
              <div className="avatar"><User size={16}/></div>
              <div className="convo-info">
                <span className="font-medium">{msg.customer.firstName || 'Unknown'} {msg.customer.lastName || 'Customer'}</span>
                <span className="text-small text-muted truncate">{msg.content}</span>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-muted text-small">No messages yet.</p>}
        </div>
      </div>

      <div className="inbox-main card glass-panel flex-col">
        {messages.length > 0 ? (
          <>
            <div className="chat-header border-b">
              <h3 className="heading-sm">{messages[0].customer.firstName} {messages[0].customer.lastName}</h3>
              <span className="text-small text-muted">{messages[0].customer.phone || messages[0].customer.email}</span>
            </div>
            <div className="chat-history flex-1 p-4" style={{ overflowY: 'auto' }}>
              {messages.slice().reverse().map(msg => (
                <div key={msg.id} className={`message-bubble ${msg.direction === 'inbound' ? 'user' : 'bot'} mb-4`}>
                  <div className="message-content">
                    <p>{msg.content}</p>
                    {msg.isAiGenerated && <div className="text-small text-muted mt-2">✨ Sent by AI Agent</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input p-4 border-t">
               <input type="text" placeholder="Type a reply..." className="w-full bg-transparent border-none outline-none text-primary" />
            </div>
          </>
        ) : (
          <div className="empty-state flex items-center justify-center flex-1 text-muted">
             <MessageSquare size={48} className="mb-4 opacity-50" />
             <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
