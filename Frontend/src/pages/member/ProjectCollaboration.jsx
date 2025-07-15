import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getPrivateChatSummary,
  sendPrivateMessage,
  updateTaskStatus,
  getTaskDetailsById
} from '../../api/teamMemberApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEdit } from "react-icons/md";
import '../../styles/ProjectCollab.css';
import { formatStatus } from '../../utils/Helper';

export default function ProjectCollaboration() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatBoxRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const senderId = user?.id;

  const [messages, setMessages] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const [taskDetails, setTaskDetails] = useState(
    location.state?.taskDetails || {
      id: null,
      name: 'N/A',
      dueDate: 'N/A',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      projectManagerName: '',
      description: 'No description provided.',
      projectName: '',
      assigneeId: null,
      projectManagerId: null
    }
  );
  const [editStatus, setEditStatus] = useState(taskDetails.status);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!location.state?.taskDetails && taskId) {
      getTaskDetailsById(taskId).then((task) => {
        setTaskDetails(task);
        setEditStatus(task.status);
      });
    }
  }, [taskId, location.state]);

  useEffect(() => {
    if (taskDetails?.assigneeId && taskDetails?.projectManagerId && senderId) {
      const id = senderId === taskDetails.assigneeId ? taskDetails.projectManagerId : taskDetails.assigneeId;
      setReceiverId(id);
    }
  }, [taskDetails, senderId]);

  useEffect(() => {
    if (!(senderId && receiverId && projectId && taskDetails.id)) return;
    const fetchMessages = async () => {
      const data = await getPrivateChatSummary(senderId, receiverId, projectId, taskDetails.id);
      setMessages(data);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [senderId, receiverId, projectId, taskDetails.id]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePost = async () => {
    if (!newComment.trim() || !(senderId && receiverId && projectId && taskDetails.id)) return;
    try {
      await sendPrivateMessage(senderId, receiverId, projectId, taskDetails.id, newComment.trim());
      setNewComment('');
      const data = await getPrivateChatSummary(senderId, receiverId, projectId, taskDetails.id);
      setMessages(data);
    } catch { }
  };

  const handleStatusChange = (e) => setEditStatus(e.target.value);

  const handleSaveStatus = async () => {
    if (!taskDetails.id) return;
    await updateTaskStatus(taskDetails.id, editStatus);
    setTaskDetails({ ...taskDetails, status: editStatus });
    setEditing(false);
    toast.success(`Status updated to ${editStatus}`, { position: 'top-right', autoClose: 2000 });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = msg.timestamp?.split('T')[0] || 'Unknown';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMessages).sort((a, b) => new Date(a) - new Date(b));

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

  return (
    <div className="collab-chat-full-page p-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/member/assigned-tasks')}>
          ← Go Back
        </button>
        <div className="ms-auto">
          <h3 className="collab-chat-header mb-0 fs-4 fw-bold">{taskDetails.projectName || 'NA'}</h3>
        </div>

      </div>

      <div className="mb-4 d-flex justify-content-between align-items-start flex-wrap">
        <div className="me-3" style={{ maxWidth: '60%' }}>
          <h4 className="mb-2">{taskDetails.name}</h4>
          <p className="mb-1 text-muted">Manager: {taskDetails.projectManagerName || 'N/A'}</p>
          <p className="mb-1 text-muted">Due Date: {taskDetails.dueDate !== 'N/A' ? formatDate(taskDetails.dueDate) : 'N/A'}</p>
        </div>

        <div className="d-flex flex-column align-items-end text-end" style={{ minWidth: '160px' }}>
          <div className="status-group mb-2">
            <label className="fw-semibold me-2"></label>
            <span className={`badge bg-${statusColors[taskDetails.status] || 'info'} px-3 py-2`}>
              {taskDetails.status.replace('_', ' ')}
            </span>
            {!editing && (
              <button
                className="btn btn-sm ms-1"
                onClick={() => setEditing(true)}
              >
                <MdEdit
                  size={25}
                  className={`edit-icon icon-${formatStatus(taskDetails.status)
                    .toLowerCase()
                    .replace(/\s/g, '')}`}
                />
              </button>
            )}
            {editing && (
              <div className="mt-2">
                <select
                  className="form-select form-select-sm border border-primary"
                  value={editStatus}
                  onChange={handleStatusChange}
                  style={{ width: '130px', fontSize: '0.85rem' }}
                >
                  {['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'].map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-primary mt-1"
                  onClick={handleSaveStatus}
                  style={{ fontSize: '0.85rem' }}
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="priority-group">
            <label className="fw-semibold me-2">Priority:</label>
            <span className={`fw-semibold text-${priorityColors[taskDetails.priority] || 'secondary'}`}>
              {taskDetails.priority || 'NA'}
            </span>
          </div>
        </div>
        <p className="mb-1 text-muted text-justify" style={{ textAlign: 'justify' }}>
          <strong>Description:</strong> {taskDetails.description}
        </p>
      </div>
      <div className="collab-chat-container">
        <div className="collab-chat-box" ref={chatBoxRef}>
          {messages.length === 0 ? (
            <div className="text-center text-muted mt-4">No chat</div>
          ) : (
            sortedDates.map((date) => (
              <React.Fragment key={date}>
                <div className="collab-chat-date-separator">{formatDate(date)}</div>
                {groupedMessages[date].map((msg, index) => (
                  <div className={`collab-chat-message-wrapper ${msg.senderId === senderId ? 'collab-self' : ''}`}>
                    <div
                      className="collab-chat-message"
                      style={{
                        backgroundColor: msg.senderId === senderId ? '#c7ecdaff' : '#cbd0d6ff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        maxWidth: '60%',
                        minWidth: '10%',
                        alignSelf: msg.senderId === senderId ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <span className="collab-sender fw-bold d-block mb-1">
                        {msg.senderId === senderId ? 'You' : msg.senderName || 'Manager'}
                      </span>
                      <span className="collab-text d-block">{msg.content}</span>
                      <span className="collab-time d-block text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
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
        <button className="btn btn-primary" onClick={handlePost} disabled={!newComment.trim()}>
          Post
        </button>
      </div>
    </div>
  );
}
