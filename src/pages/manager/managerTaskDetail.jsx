import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/managerTaskDetail.css';

const ManagerTaskDetail = () => {
  const { taskname } = useParams();

  const [taskDetails] = useState({
    project: taskname,
    status: 'In Progress', // Change to Completed or To Do as needed
    description: 'This task focuses on redesigning the header component to improve user experience and responsiveness across devices.',
    assignee: 'Alice',
    priority: 'High',
    dueDate: '2025-04-10',
  });

  const [comments, setComments] = useState([
    { id: 1, sender: 'Alice', message: 'Started working on wireframes.', time: '10:00 AM', date: '2025-06-21' },
    { id: 2, sender: 'Bob', message: 'Make sure it’s mobile responsive.', time: '10:05 AM', date: '2025-06-22' },
    { id: 3, sender: 'Alice', message: 'Sure, will update by today.', time: '10:15 AM', date: '2025-06-23' },
    { id: 4, sender: 'You', message: 'Sure, will update by today.', time: '10:15 AM', date: '2025-03-23' }
  ]);

  const [newComment, setNewComment] = useState('');
  const chatBoxRef = useRef(null);

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

  const statusClass = {
    'Completed': 'status-completed',
    'In Progress': 'status-inprogress',
    'To Do': 'status-todo',
  }[taskDetails.status] || '';

  const groupedComments = groupCommentsByDate();

  return (
    <div className="task-detail-page">
      <div className="task-detail-container">
        <div className="task-detail-header">
          <h2>{taskDetails.project}</h2>
          <span className={`task-status ${statusClass}`}>{taskDetails.status}</span>
        </div>

        <p className="task-description">{taskDetails.description}</p>

        <div className="task-info-section">
          <div className="task-info-column">
            <p><strong>Assignee:</strong> {taskDetails.assignee}</p>
            <p><strong>Priority:</strong> {taskDetails.priority}</p>
          </div>
          <div className="task-info-column">
            <p><strong>Due Date:</strong> {taskDetails.dueDate}</p>
          </div>
        </div>
      </div>

      <div className="task-comment-container">
        <h3>Comments</h3>
        <div className="chat-box" ref={chatBoxRef}>
          {Object.entries(groupedComments)
            .sort((a, b) => new Date(b[1][0].date) - new Date(a[1][0].date)) // latest date last
            .map(([date, msgs]) => (
              <div key={date} className="comment-group">
                <div className="comment-date-header">{date}</div>
                {[...msgs]
                  .sort((a, b) => new Date(a.time) - new Date(b.time)) // sort by time
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
    </div>
  );
};

export default ManagerTaskDetail;
