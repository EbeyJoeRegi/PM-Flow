import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  sendGroupMessage,
  getGroupChatSummary,
  getTasksByUserId
} from '../../api/teamMemberApi';
import '../../styles/projectChatPage.css';

export default function MemberCollaboration() {
  const { state } = useLocation();
  const projectName = state?.projectName || 'Unknown Project';
  const projectStatus = state?.projectStatus || '';

  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [projectId, setProjectId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const senderId = user?.id;

  useEffect(() => {
    const resolveProjectId = async () => {
      try {
        const tasks = await getTasksByUserId(senderId);
        const match = tasks.find(task => task.projectName === projectName);
        if (match?.projectId) setProjectId(match.projectId);
      } catch (err) {
        console.error('Error resolving project ID:', err);
      }
    };
    resolveProjectId();
  }, [projectName, senderId]);

  useEffect(() => {
    if (!projectId) return;
    const fetchMessages = async () => {
      try {
        const fetched = await getGroupChatSummary(projectId);
        setMessages(fetched);
      } catch (err) {
        console.error('Failed to fetch group messages', err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !projectId) return;
    try {
      await sendGroupMessage(senderId, projectId, newMsg);
      const updated = await getGroupChatSummary(projectId);
      setMessages(updated);
      setNewMsg('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const groupMessagesByDate = (msgs) => {
    const grouped = {};
    msgs.forEach(msg => {
      const dateOnly = msg.timestamp.split('T')[0];
      if (!grouped[dateOnly]) grouped[dateOnly] = [];
      grouped[dateOnly].push(msg);
    });
    return grouped;
  };

  const getDateLabel = (dateStr) => {
    const today = new Date();
    const msgDate = new Date(dateStr);
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
    const msgMidnight = new Date(msgDate.setHours(0, 0, 0, 0));
    const diff = (todayMidnight - msgMidnight) / (1000 * 60 * 60 * 24);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return msgMidnight.toDateString();
  };

  const formatTime = (isoStr) => {
    const time = new Date(isoStr);
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace('am', 'AM').replace('pm', 'PM');
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="collab-chat-full-page">
      <div className="collab-chat-header d-flex justify-content-between align-items-center ps-3 pt-2 pe-3">
        <h4 className="mb-0">{projectName}</h4>
        <span className="badge bg-info text-white">{projectStatus.replace('_', ' ')}</span>
      </div>

      <div className="collab-chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div className="text-center text-muted mt-4">No chat yet.</div>
        ) : (
          Object.keys(groupedMessages).sort().map(date => (
            <div key={date}>
              <div className="collab-chat-date-separator">{getDateLabel(date)}</div>
              {groupedMessages[date].map((m, idx) => (
                <div key={`${date}-${idx}`} className={`collab-chat-message-wrapper ${m.senderId === senderId ? 'collab-self' : 'collab-other'}`}>
                  <div className={`collab-chat-message ${m.senderId === senderId ? 'collab-self' : 'collab-other'}`}>
                    <span className="collab-sender">{m.senderId === senderId ? 'You' : m.senderName}</span>
                    <span className="collab-text">{m.content}</span>
                    <span className="collab-time">{formatTime(m.timestamp)}</span>
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
        <button onClick={handleSend} disabled={!newMsg.trim()}>Send</button>
      </div>
    </div>
  );
}
