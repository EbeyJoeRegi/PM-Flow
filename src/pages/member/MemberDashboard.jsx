import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Member.css';
import { getTasksByUserId } from '../../api/teamMemberApi';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const employeeName = 'Employee';

  useEffect(() => {
    localStorage.setItem('employeeName', employeeName);
    const fetchTasks = async () => {
      try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const userId = user?.id;
        if (!userId) return;
        const taskData = await getTasksByUserId(userId);
        setTasks(taskData);
        localStorage.setItem('tasks', JSON.stringify(taskData));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = taskData
          .filter(task => ['NOT_STARTED', 'IN_PROGRESS', 'TO_DO'].includes(task.status))
          .map(task => {
            const due = new Date(task.dueDate);
            const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
            const timeDiff = dueDateOnly - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            return {
              date: due.toLocaleDateString('en-GB').replaceAll('/', '-'),
              task: task.name,
              isUrgent: daysLeft <= 3 && daysLeft >= 0,
              daysLeft
            };
          })
          .filter(item => item.isUrgent);
        setDeadlines(upcoming);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleAssignedTaskClick = () => {
    navigate('/member/assigned-tasks', { state: { tasks, previewOnly: false } });
  };

  const countByStatus = (status) => tasks.filter((task) => task.status === status).length;
  const total = tasks.length || 1;

  const progress = {
    notStarted: (countByStatus('NOT_STARTED') / total) * 100,
    inProgress: (countByStatus('IN_PROGRESS') / total) * 100,
    completed: (countByStatus('COMPLETED') / total) * 100,
    onHold: (countByStatus('ON_HOLD') / total) * 100
  };

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
    <div className="member-dashboard-container container-fluid px-4" style={{ overflowX: 'auto', width: '100%' }}>
      <div className="row gx-4">
        <div className="col-lg-8 mb-4">
          <div className="card tasks-card p-3 h-100 d-flex flex-column">
            <h4 className="mb-3">My Assigned Tasks</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 3).map((task, index) => (
                    <tr key={index}>
                      <td>{task.name}</td>
                      <td>
                        <span className={`badge bg-${priorityColors[task.priority] || 'secondary'}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${statusColors[task.status] || 'secondary'} text-white`}>
                          {task.status.replaceAll('_', ' ')}
                        </span>
                      </td>
                      <td>{new Date(task.dueDate).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-end mt-2">
              <button className="btn btn-primary btn-sm" onClick={handleAssignedTaskClick}>View All</button>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card status-card p-3 h-100">
            <h4 className="mb-3">Task Status</h4>
            <div className="status-bar mb-3">
              <div className="bar-not-started" style={{ width: `${progress.notStarted}%` }}></div>
              <div className="bar-in-progress" style={{ width: `${progress.inProgress}%` }}></div>
              <div className="bar-completed" style={{ width: `${progress.completed}%` }}></div>
              <div className="bar-on-hold" style={{ width: `${progress.onHold}%` }}></div>
            </div>
            <div className="status-legend d-flex flex-column gap-2">
              <span><span className="legend-box bg-primary me-2"></span> Not Started</span>
              <span><span className="legend-box bg-warning me-2"></span> In Progress</span>
              <span><span className="legend-box bg-success me-2"></span> Completed</span>
              <span><span className="legend-box bg-secondary me-2"></span> On Hold</span>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card deadlines-card p-3">
            <h4 className="mb-3">Upcoming Deadlines</h4>
            {deadlines.length === 0 ? (
              <p className="text-muted">No upcoming deadlines within 3 days.</p>
            ) : (
              <ul className="deadlines-list list-unstyled">
                {deadlines.map((item, index) => (
                  <li key={index} className="mb-2">
                    <span className={item.isUrgent ? 'dot-green' : 'dot-yellow'}></span> {item.date} {item.task}
                    <span className="highlight ms-2">
                      {item.daysLeft === 0 ? 'Due today' : `Next ${item.daysLeft} ${item.daysLeft === 1 ? 'day' : 'days'}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
