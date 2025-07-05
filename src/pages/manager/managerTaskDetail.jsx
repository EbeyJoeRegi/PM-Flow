import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTaskById } from '../../api/managerApi';
import { getTaskPriorityClass, formatDate } from '../../utils/Helper';
import '../../styles/managerTaskDetail.css';
import { MdModeEditOutline } from "react-icons/md";

const ManagerTaskDetail = () => {
  const { taskID } = useParams();
  const { token } = useSelector((state) => state.user);
  const [taskDetails, setTaskDetails] = useState(null);
  const [comments, setComments] = useState([
    { id: 1, sender: 'Alice', message: 'Started working on wireframes.', time: '10:00 AM', date: '2025-06-21' },
    { id: 2, sender: 'Bob', message: 'Make sure it’s mobile responsive.', time: '10:05 AM', date: '2025-06-22' },
    { id: 3, sender: 'Alice', message: 'Sure, will update by today.', time: '10:15 AM', date: '2025-06-23' },
    { id: 4, sender: 'You', message: 'Sure, will update by today.', time: '10:15 AM', date: '2025-03-23' }
  ]);
  const [newComment, setNewComment] = useState('');
  const chatBoxRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [editError, setEditError] = useState('');


  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await getTaskById(taskID, token);
        setTaskDetails({
          name: task.name,
          description: task.description || 'N/A',
          status: task.status,
          assignee: `${task.assigneeFirstName} ${task.assigneeLastName}`,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : 'N/A',
        });
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [taskID, token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSend = () => {
    if (!newComment.trim()) return;

    const now = new Date();
    const newMsg = {
      id: comments.length + 1,
      sender: 'You',
      message: newComment,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toISOString().split('T')[0],
    };

    setComments(prev => [...prev, newMsg]);
    setNewComment('');
  };

  const groupCommentsByDate = () => {
    const grouped = {};
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    comments.forEach(c => {
      const key =
        c.date === today
          ? 'Today'
          : c.date === yesterday
            ? 'Yesterday'
            : new Date(c.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(c);
    });

    return grouped;
  };

  const groupedComments = groupCommentsByDate();

  if (!taskDetails) return <div className="task-detail-page">Loading...</div>;

  return (
    <div className="task-detail-page">
      <div className="task-detail-container">
        <div className="task-detail-header">
          <h2>{taskDetails.name}</h2>
          <div className="status-edit-display">
            <span className={`status-badges ${taskDetails.status.toLowerCase().replace(/\s/g, '')}`}>{taskDetails.status}</span>
            <MdModeEditOutline
              className={`edit-icon icon-${taskDetails.status.toLowerCase().replace(/\s/g, '')}`}
              onClick={() => {
                setEditModalOpen(true);
                setEditedTask({
                  name: taskDetails.name,
                  description: taskDetails.description,
                  dueDate: taskDetails.dueDate,
                  priority: taskDetails.priority,
                });
                setEditError('');
              }}
            />
          </div>
        </div>
        
        <p className="task-description">{taskDetails.description}</p>

        <div className="task-info-section">
          <div className="task-info-column">
            <p><strong>Assignee:</strong> {taskDetails.assignee}</p>
            <p><strong>Priority:</strong> <span className={`${getTaskPriorityClass(taskDetails.priority)}`}>
              {taskDetails.priority}
            </span></p>
          </div>
          <div className="task-info-column">
            <p><strong>Due Date:</strong> {formatDate(taskDetails.dueDate)}</p>
          </div>
        </div>
      </div>

      <div className="task-comment-container">
        <h3>Comments</h3>
        <div className="chat-box" ref={chatBoxRef}>
          {Object.entries(groupedComments)
            .sort((a, b) => new Date(b[1][0].date) - new Date(a[1][0].date))
            .map(([date, msgs]) => (
              <div key={date} className="comment-group">
                <div className="comment-date-header">{date}</div>
                {[...msgs]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(c => (
                    <div key={c.id} className={`chat-message-wrapper ${c.sender === 'You' ? 'self' : 'other'}`}>
                      <div className={`chat-message ${c.sender === 'You' ? 'self' : 'other'}`}>
                        <span className="sender">{c.sender}</span>
                        <span className="text">{c.message}</span>
                        <span className="time">{c.time}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>

        <div className="chat-input">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      {editModalOpen && (
        <div className="edit-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Edit Task Info</h4>

            <label>Task Name</label>
            <input
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
            />

            <label>Description</label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            />

            <label>Due Date</label>
            <input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            />

            <label>Priority</label>
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {editError && <div className="manager-project-error">{editError}</div>}

            <div className="edit-modal-actions">
              <button
                onClick={() => {
                  if (
                    editedTask.name === taskDetails.name &&
                    editedTask.description === taskDetails.description &&
                    editedTask.dueDate === taskDetails.dueDate &&
                    editedTask.priority === taskDetails.priority
                  ) {
                    setEditError('No changes made.');
                    return;
                  }

                  // while updating to backend, API call here
                  console.log('Changes Saved:', editedTask);
                  setEditModalOpen(false);
                }}
              >
                Save
              </button>
              <button className="cancel-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagerTaskDetail;
