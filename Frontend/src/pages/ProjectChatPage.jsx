import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/projectChatPage.css';
import { useSelector } from 'react-redux';
import { getGroupMessages, sendGroupMessage } from '../api/managerApi';
import { useNavigate } from 'react-router-dom';
import { getBootstrapBgClass, formatStatus } from '../utils/Helper';

const ProjectChatPage = () => {
  const { ProjectID } = useParams();
  const Project = JSON.parse(localStorage.getItem('selectedProjectId'));
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const { id, name, token, role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getGroupMessages(ProjectID, token);
        const formatted = data.map((msg, index) => {
          const dateObj = new Date(msg.timestamp);
          return {
            id: index + 1,
            sender: msg.senderName,
            message: msg.content,
            date: dateObj.toISOString().split('T')[0],
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        setMessages(formatted);
        setFetchError(null);


        if (!intervalRef.current) {
          const newInterval = setInterval(fetchMessages, 5000);
          intervalRef.current = newInterval;
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
        if (error.message.includes('Failed to fetch group messages')) {
          setFetchError("You do not have access to this project.");
        } else {
          setFetchError("Something went wrong. Please try again later.");
        }


        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [ProjectID, token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if(role === "PROJECT_MANAGER")
    var srole="manager";
  else
    var srole="member";

  const handleSend = async () => {
    if (!newMsg.trim() || fetchError) return;

    const now = new Date();

    try {
      await sendGroupMessage(id, ProjectID, newMsg, token);

      const newMessage = {
        id: messages.length + 1,
        sender: name,
        message: newMsg,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newMessage]);
      setNewMsg('');
    } catch (error) {
      console.error('Send error:', error.message);
    }
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
    const diff = (today.setHours(0, 0, 0, 0) - msgDate.setHours(0, 0, 0, 0)) / (1000 * 3600 * 24);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return new Date(dateStr).toDateString();
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="collab-chat-full-page">
      <div className="collab-chat-header-container">
        <button className="btn btn-outline-secondary btn-sm back-btn" onClick={() => navigate(`/${srole}/collaboration`)}>
          ← Back
        </button>
        <div className="collab-chat-header">Project Chat - {Project.projectName}</div>
        <span className={`status-badge ${getBootstrapBgClass(formatStatus(Project.status))}`}>
          {Project.status.replace('_', ' ')}
        </span>
      </div>
      <div className="collab-chat-box" ref={chatBoxRef}>
        {fetchError ? (
          <div className="error-msg">{fetchError}</div>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <div className="collab-chat-placeholder">No messages yet. Start the conversation!</div>
        ) : (
          Object.keys(groupedMessages).sort().map(date => (
            <div key={date}>
              <div className="collab-chat-date-separator">{getDateLabel(date)}</div>
              {groupedMessages[date].map(m => (
                <div key={m.id} className={`collab-chat-message-wrapper ${m.sender === name ? 'collab-self' : 'collab-other'}`}>
                  <div className={`collab-chat-message ${m.sender === name ? 'collab-self' : 'collab-other'}`}>
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
          placeholder={fetchError ? "Cannot send message" : "Type a message..."}
          disabled={!!fetchError}
        />
        <button onClick={handleSend} disabled={!!fetchError}>Send</button>
      </div>
    </div>
  );
};

export default ProjectChatPage;
