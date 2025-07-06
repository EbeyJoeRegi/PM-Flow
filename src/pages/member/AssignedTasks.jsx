import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Member.css';
import { getTasksByUserId } from '../../api/teamMemberApi';

export default function AssignedTasks() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const previewOnly = location.state?.previewOnly || false;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const userId = user?.id;
        if (!userId) return;

        const fetchedTasks = await getTasksByUserId(userId);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleSort = (key) => {
    const order = key === sortKey && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
    const sorted = [...tasks].sort((a, b) => {
      if (key === 'dueDate') {
        return order === 'asc'
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate);
      }
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setTasks(sorted);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      HIGH: 'danger',
      MEDIUM: 'warning',
      LOW: 'success'
    };
    return <span className={`badge bg-${colors[priority] || 'secondary'}`}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      NOT_STARTED: 'primary',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      ON_HOLD: 'secondary',
      TO_DO: 'info'
    };
    return <span className={`badge bg-${variants[status] || 'dark'}`}>{status.replaceAll('_', ' ')}</span>;
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(search.toLowerCase()) ||
    (task.project || '').toLowerCase().includes(search.toLowerCase())
  );

  const visibleTasks = previewOnly ? filteredTasks.slice(0, 3) : filteredTasks;

  return (
    <div className="assigned-tasks-container">
      <header className="assigned-tasks-header d-flex justify-content-between align-items-center flex-wrap px-3 py-3 border-bottom">
        <h2 className="title m-0">MY TASKS</h2>
      </header>

      <main className="assigned-tasks-main p-3">
        <div className="tasks-card card p-3">
          <div className="tasks-card-header d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              placeholder="Search tasks..."
              className="form-control w-100"
              style={{ maxWidth: '550px', fontSize: '1rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Task</th>
                  <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>Priority ⇅</th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status ⇅</th>
                  <th>Project</th>
                  <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>Due Date ⇅</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task, index) => (
                  <tr
                    key={index}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate(`/member/project/${task.projectId || task.project || 'na'}/collaboration`, {
                        state: { taskDetails: task },
                      })
                    }
                  >
                    <td>{task.name}</td>
                    <td>{getPriorityBadge(task.priority)}</td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>{task.project || 'N/A'}</td>
                    <td>{formatDate(task.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between mt-3 flex-wrap">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate('/member')}
            >
              ← Go Back
            </button>

            {!previewOnly && (
              <span className="view-all-link text-muted">All Tasks Displayed</span>
            )}

            {previewOnly && (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/assigned-tasks', { state: { previewOnly: false } })}
              >
                View All
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
