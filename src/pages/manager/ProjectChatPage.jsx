import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/projectChatPage.css';

const ProjectChatPage = () => {
  const { id } = useParams();
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alice', message: 'Project kickoff done.', date: '2025-06-22', time: '10:00 AM' },
    { id: 2, sender: 'Bob', message: 'Working on initial draft.', date: '2025-06-23', time: '11:15 AM' },
    { id: 3, sender: 'You', message: 'Started testing.', date: '2025-06-23', time: '01:30 PM' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const now = new Date();
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      message: newMsg,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setNewMsg('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const groupMessagesByDate = (msgs) => {
    const grouped = {};
    msgs.forEach(msg => {
      if (!grouped[msg.date]) grouped[msg.date] = [];
      grouped[msg.date].push(msg);
    });
    return grouped;
  };

  const getDateLabel = (dateStr) => {
    const today = new Date();
    const msgDate = new Date(dateStr);
    const diff = (today.setHours(0,0,0,0) - msgDate.setHours(0,0,0,0)) / (1000 * 3600 * 24);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return new Date(dateStr).toDateString();
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="collab-chat-full-page">
      <h2 className="collab-chat-header">Project Chat - ID #{id}</h2>
      <div className="collab-chat-box" ref={chatBoxRef}>
        {Object.keys(groupedMessages).sort().map(date => (
          <div key={date}>
            <div className="collab-chat-date-separator">{getDateLabel(date)}</div>
            {groupedMessages[date].map(m => (
              <div key={m.id} className={`collab-chat-message-wrapper ${m.sender === 'You' ? 'collab-self' : 'collab-other'}`}>
                <div className={`collab-chat-message ${m.sender === 'You' ? 'collab-self' : 'collab-other'}`}>
                  <span className="collab-sender">{m.sender}</span>
                  <span className="collab-text">{m.message}</span>
                  <span className="collab-time">{m.time}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="collab-chat-input">
        <input
          ref={inputRef}
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ProjectChatPage;