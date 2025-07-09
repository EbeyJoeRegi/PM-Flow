import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoMdSend } from "react-icons/io";
import { getTaskById, updateTaskById, fetchPrivateMessages, sendPrivateMessage } from '../../api/managerApi';
import { getTaskPriorityClass, formatDate, formatStatus } from '../../utils/Helper';
import '../../styles/managerTaskDetail.css';
import { MdModeEditOutline } from "react-icons/md";

const ManagerTaskDetail = () => {
  const { taskID } = useParams();
  const { id, token } = useSelector((state) => state.user);
  const [taskDetails, setTaskDetails] = useState(null);
  const [comments, setComments] = useState([]);
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
          status: formatStatus(task.status),
          assignee: `${task.assigneeFirstName} ${task.assigneeLastName}`,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : 'N/A',
          projectID: task.projectId,
          assigneeID: task.assigneeId,
        });
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    const fetchMessages = async () => {
      if (!taskDetails) return;

      try {
        const response = await fetchPrivateMessages(
          id,
          taskDetails.assigneeID,
          taskDetails.projectID,
          taskID,
          token
        );

        const messages = response.data.map((msg, index) => ({
          id: index + 1,
          sender: msg.senderName === taskDetails.assignee ? taskDetails.assignee : 'You',
          message: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: msg.timestamp.split('T')[0],
        }));

        setComments(messages);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();
    fetchTask();
  }, [id, taskDetails, taskID, token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSend = async () => {
    if (!newComment.trim()) return;

    try {
      await sendPrivateMessage(
        id,
        taskDetails.assigneeID,
        taskDetails.projectID,
        taskID,
        newComment,
        token
      );
      const now = new Date();
      const newMsg = {
        id: comments.length + 1,
        sender: 'You',
        message: newComment,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: now.toISOString().split('T')[0],
      };

      setComments((prev) => [...prev, newMsg]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
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
  {comments.length === 0 ? (
    <div className="no-messages">No messages yet. Start the conversation!</div>
  ) : (
    Object.entries(groupedComments)
      .sort((a, b) => new Date(b[1][0].date) - new Date(a[1][0].date))
      .map(([date, msgs]) => (
        <div key={date} className="comment-group">
          <div className="comment-date-header">{date}</div>
          {[...msgs]
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(c => (
              <div key={c.id} className={`chat-message-wrapper ${c.sender === 'You' ? 'self' : 'other'}`}>
                <div className={`chat-message ${c.sender === 'You' ? 'self' : 'other'}`}>
                  <span className="text">{c.message}</span>
                  <span className="time">{c.time}</span>
                </div>
              </div>
            ))}
        </div>
      ))
  )}
</div>
        <div className="chat-input">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="send-btn" onClick={handleSend}>
            <span className="send-text">Send</span>
            <IoMdSend className="send-icon" />
          </button>
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
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {editError && <div className="manager-project-error">{editError}</div>}

            <div className="edit-modal-actions">
              <button
                onClick={async () => {
                  if (
                    editedTask.name === taskDetails.name &&
                    editedTask.description === taskDetails.description &&
                    editedTask.dueDate === taskDetails.dueDate &&
                    editedTask.priority === taskDetails.priority
                  ) {
                    setEditError('No changes made.');
                    return;
                  }

                  try {
                    await updateTaskById(taskID, editedTask, token);
                    setTaskDetails({
                      ...taskDetails,
                      name: editedTask.name,
                      description: editedTask.description,
                      dueDate: editedTask.dueDate,
                      priority: editedTask.priority,
                    });
                    setEditModalOpen(false);
                  } catch (err) {
                    setEditError(err);
                  }
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
