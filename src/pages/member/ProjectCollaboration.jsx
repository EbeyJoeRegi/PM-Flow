import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function ProjectCollaboration() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [taskDetails, setTaskDetails] = useState(
    location.state?.taskDetails || {
      name: 'N/A',
      dueDate: 'N/A',
      status: 'Not Started',
      manager: 'Manager',
      project: projectId,
    }
  );
  const [editStatus, setEditStatus] = useState(taskDetails.status);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`messages-${projectId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [projectId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePost = () => {
    if (!newComment.trim()) return;

    const now = new Date();
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      receiver: taskDetails.manager || 'Manager',
      message: newComment,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], timeOptions).toUpperCase(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem(`messages-${projectId}`, JSON.stringify(updatedMessages));
    setNewComment('');
  };

  const handleStatusChange = (e) => setEditStatus(e.target.value);

  const handleSaveStatus = () => {
    const updated = { ...taskDetails, status: editStatus };
    setTaskDetails(updated);
    const storedTasks = JSON.parse(localStorage.getItem('assignedTasks') || '[]');
    const updatedTasks = storedTasks.map((task) => {
      if (task.name === updated.name && task.project === updated.project) {
        return { ...task, status: editStatus };
      }
      return task;
    });
    localStorage.setItem('assignedTasks', JSON.stringify(updatedTasks));
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push(msg);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMessages).sort((a, b) => new Date(a) - new Date(b));

  const statusColors = {
    'Not Started': 'primary',
    'In Progress': 'warning',
    'Completed': 'success',
    'On Hold': 'secondary',
  };

  return (
    <div className="collab-chat-full-page p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/member/assigned-tasks')}>
          ← Go Back
        </button>
        <h3 className="collab-chat-header mb-0">Collaboration - Project {projectId}</h3>
      </div>

      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h4 className="mb-1">Task: {taskDetails.name}</h4>
          <p className="mb-1 text-muted">Manager: {taskDetails.manager}</p>
          <p className="mb-1 text-muted">Due Date: {taskDetails.dueDate}</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="statusSelect" className="fw-semibold mb-0">Status:</label>
          <span className={`badge bg-${statusColors[taskDetails.status]} px-3 py-2`}>{taskDetails.status}</span>
          <select
            id="statusSelect"
            className="form-select form-select-sm w-auto border border-primary"
            value={editStatus}
            onChange={handleStatusChange}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
          <button className="btn btn-sm btn-primary" onClick={handleSaveStatus}>Save</button>
        </div>
      </div>

      <div className="collab-chat-box" ref={chatBoxRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted mt-4">No chat</div>
        ) : (
          sortedDates.map((date) => (
            <React.Fragment key={date}>
              <div className="collab-chat-date-separator">{new Date(date).toDateString()}</div>
              {groupedMessages[date].map((msg) => (
                <div
                  key={msg.id}
                  className={`collab-chat-message-wrapper ${msg.sender === 'You' ? 'collab-self' : 'collab-other'}`}
                >
                  <div className={`collab-chat-message ${msg.sender === 'You' ? 'collab-self' : 'collab-other'}`}>
                    <span className="collab-sender">{msg.sender}</span>
                    <span className="collab-text">{msg.message}</span>
                    <span className="collab-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </div>

      <div className="collab-chat-input d-flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePost()}
          className="form-control"
        />
        <button className="btn btn-primary" onClick={handlePost}>Post</button>
      </div>
    </div>
  );
}
