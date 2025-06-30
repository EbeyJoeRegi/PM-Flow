import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Member.css';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const employeeName = 'Employee';

  useEffect(() => {
    localStorage.setItem('employeeName', employeeName);

    const taskData = [
      { name: 'Task 1', priority: 'High', status: 'In Progress', dueDate: '2025-06-25', project: 'Project A' },
      { name: 'Task 2', priority: 'Medium', status: 'Completed', dueDate: '2025-06-26', project: 'Project B' },
      { name: 'Task 3', priority: 'Low', status: 'On Hold', dueDate: '2025-06-27', project: 'Project C' },
      { name: 'Task 4', priority: 'High', status: 'In Progress', dueDate: '2025-06-26', project: 'Project D' }
    ];

    setTasks(taskData);
    localStorage.setItem('tasks', JSON.stringify(taskData));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDate = (str) => new Date(str);

    const upcoming = taskData
      .filter(task => task.status === 'In Progress')
      .map(task => {
        const due = parseDate(task.dueDate);
        const timeDiff = due - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return {
          date: task.dueDate,
          task: task.name,
          isUrgent: daysLeft <= 3 && daysLeft >= 0,
          daysLeft
        };
      })
      .filter(item => item.isUrgent);

    setDeadlines(upcoming);
  }, []);

  const handleAssignedTaskClick = () => {
    navigate('/member/assigned-tasks', { state: { tasks, previewOnly: false } });
  };

  const countByStatus = (status) => tasks.filter((task) => task.status === status).length;
  const total = tasks.length || 1;

  const progress = {
    notStarted: (countByStatus('Not Started') / total) * 100,
    inProgress: (countByStatus('In Progress') / total) * 100,
    completed: (countByStatus('Completed') / total) * 100,
    onHold: (countByStatus('On Hold') / total) * 100
  };

  const statusColors = {
    'Not Started': 'primary',
    'In Progress': 'warning',
    'Completed': 'success',
    'On Hold': 'secondary'
  };

  return (
    <div className="member-dashboard-container container-fluid px-4">
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
                      <td>{task.priority}</td>
                      <td>
                        <span className={`badge bg-${statusColors[task.status]} text-white`}>
                          {task.status}
                        </span>
                      </td>
                      <td>{task.dueDate}</td>
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
              <span><span className="legend-box bg-blue me-2"></span> Not Started</span>
              <span><span className="legend-box bg-yellow me-2"></span> In Progress</span>
              <span><span className="legend-box bg-green me-2"></span> Completed</span>
              <span><span className="legend-box bg-gray me-2"></span> On Hold</span>
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
