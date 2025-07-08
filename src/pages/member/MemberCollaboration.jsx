import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/projectChatPage.css';

export default function MemberCollaboration() {
  const { projectId } = useParams();
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  const storageKey = `chat_${projectId}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [
      { id: 1, sender: 'Aish', message: 'Started design phase.', date: '2025-06-22', time: '10:00 AM' },
      { id: 2, sender: 'You', message: 'Testing collaboration chat.', date: '2025-06-23', time: '01:30 PM' }
    ];
  });

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

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace('am', 'AM').replace('pm', 'PM');
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      message: newMsg,
      date: now.toISOString().split('T')[0],
      time: timeString
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
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
    const msgMidnight = new Date(msgDate.setHours(0, 0, 0, 0));
    const diffInDays = (todayMidnight - msgMidnight) / (1000 * 60 * 60 * 24);
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return msgMidnight.toDateString();
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="collab-chat-full-page">
      <h2 className="collab-chat-header">Project Collaboration - ID #{projectId}</h2>
      <div className="collab-chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div className="text-center text-muted mt-4">No chat yet.</div>
        ) : (
          Object.keys(groupedMessages).sort().map(date => (
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
          ))
        )}
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
}
