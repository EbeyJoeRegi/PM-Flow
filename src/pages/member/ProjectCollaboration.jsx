import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateTaskStatus } from '../../api/teamMemberApi';

export default function ProjectCollaboration() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [taskDetails, setTaskDetails] = useState(
    location.state?.taskDetails || {
      id: null,
      name: 'N/A',
      dueDate: 'N/A',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      manager: 'NA',
      project: projectId,
      description: 'No description provided.',
      projectName: 'NA'
    }
  );
  const [editStatus, setEditStatus] = useState(taskDetails.status);
  const [editing, setEditing] = useState(false);

  const statusColors = {
    NOT_STARTED: 'primary',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    ON_HOLD: 'secondary'
  };

  const priorityColors = {
    HIGH: 'danger',
    MEDIUM: 'warning',
    LOW: 'success'
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const d = new Date(isoDate);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

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
      receiver: taskDetails.manager || 'NA',
      message: newComment,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], timeOptions).toUpperCase()
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem(`messages-${projectId}`, JSON.stringify(updatedMessages));
    setNewComment('');
  };

  const handleStatusChange = (e) => setEditStatus(e.target.value);

  const handleSaveStatus = async () => {
    if (!taskDetails.id) return;
    try {
      await updateTaskStatus(taskDetails.id, editStatus);
      const updated = { ...taskDetails, status: editStatus };
      setTaskDetails(updated);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push(msg);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMessages).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="collab-chat-full-page p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/member/assigned-tasks')}>
          ← Go Back
        </button>
        <h3 className="collab-chat-header mb-0">{taskDetails.projectName || 'NA'}</h3>
      </div>

      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h4 className="mb-1">Task: {taskDetails.name}</h4>
          <p className="mb-1 text-muted">Manager: {taskDetails.manager || 'NA'}</p>
          <p className="mb-1 text-muted">Due Date: {formatDate(taskDetails.dueDate)}</p>
          <p className="mb-1 text-muted"><strong>Description:</strong> {taskDetails.description}</p>
        </div>

        <div className="collab-info-panel mt-3 mt-md-0">
          <div className="d-flex flex-column flex-sm-column flex-md-row gap-3 align-items-start align-items-md-center">
            <div className="status-group">
              <label className="fw-semibold mb-0">Status:</label>
              <span className={`badge bg-${statusColors[taskDetails.status] || 'info'} px-3 py-2`}>
                {taskDetails.status}
              </span>
              {!editing && (
                <button className="btn btn-sm " onClick={() => setEditing(true)}>✏️</button>
              )}
              {editing && (
                <>
                  <select
                    className="form-select form-select-sm w-auto border border-primary"
                    value={editStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="NOT_STARTED">NOT_STARTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                  </select>
                  <button className="btn btn-sm btn-primary" onClick={handleSaveStatus}>Save</button>
                </>
              )}
            </div>

            <div className="priority-group">
              <label className="fw-semibold mb-0">Priority:</label>
              <span className={`badge bg-${priorityColors[taskDetails.priority] || 'secondary'} px-3 py-2`}>
                {taskDetails.priority || 'NA'}
              </span>
            </div>
          </div>
        </div>
      </div>

<div className="collab-chat-container">
  <div className="collab-chat-box" ref={chatBoxRef}>
    {messages.length === 0 ? (
      <div className="text-center text-muted mt-4">No chat</div>
    ) : (
      sortedDates.map((date) => (
        <React.Fragment key={date}>
          <div className="collab-chat-date-separator">{new Date(date).toDateString()}</div>
          {groupedMessages[date].map((msg) => (
            <div key={msg.id} className={`collab-chat-message-wrapper ${msg.sender === 'You' ? 'collab-self' : 'collab-other'}`}>
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
