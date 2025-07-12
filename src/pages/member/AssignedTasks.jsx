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
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8;
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
      } catch (error) {}
    };
    fetchTasks();
  }, []);

  const handleSort = (key) => {
    const order = key === sortKey && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
    setCurrentPage(1);
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
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const getPriorityLabel = (priority) => {
    const colors = {
      HIGH: 'text-danger',
      MEDIUM: 'text-warning',
      LOW: 'text-success'
    };
    return <span className={`${colors[priority] || 'text-secondary'} fw-semibold`}>{priority}</span>;
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

  const getManagerName = (task) => {
    return task.projectManagerName || `${task.assigneeFirstName || ''} ${task.assigneeLastName || ''}`.trim();
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(search.toLowerCase()) ||
    (task.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
    getManagerName(task).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const visibleTasks = previewOnly
    ? filteredTasks.slice(0, 3)
    : filteredTasks.slice(startIndex, endIndex);

  return (
    <div className="assigned-tasks-container">
      <header className="assigned-tasks-header px-3 py-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h2 className="title m-0">MY TASKS</h2>
          <input
            type="text"
            placeholder="Search tasks"
            className="form-control"
            style={{ maxWidth: '400px', fontSize: '1rem' }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </header>
      <main className="assigned-tasks-main p-3">
        <div className="tasks-card card p-3">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Task</th>
                  <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>Priority ⇅</th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status ⇅</th>
                  <th>Project</th>
                  <th>Manager</th>
                  <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>Due Date ⇅</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task, index) => (
                  <tr
                    key={index}
                    style={{ cursor: 'pointer', height: '60px' }}
                    onClick={() =>
                      navigate(`/member/project/${task.projectId || 'na'}/collaboration`, {
                        state: { taskDetails: task }
                      })
                    }
                  >
                    <td>{task.name}</td>
                    <td>{getPriorityLabel(task.priority)}</td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>{task.projectName || 'Untitled Project'}</td>
                    <td>{getManagerName(task) || 'N/A'}</td>
                    <td>{formatDate(task.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!previewOnly && totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
              <button
                className="btn btn-outline-dark"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                ← Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-outline-dark"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next →
              </button>
            </div>
          )}

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
