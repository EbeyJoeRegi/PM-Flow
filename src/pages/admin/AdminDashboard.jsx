import { useState, useEffect } from 'react';
import '../../styles/Admin.css';

export default function Dashboard() {
  const [filter, setFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  const managerOptions = ['Abhishek Kumar Jah', 'Aishwarya', 'Moushmi'];

  const statusColors = {
    'Not Started': 'primary',
    'In Progress': 'warning',
    'Completed': 'success',
    'On Hold': 'secondary'
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects).map(p => {
        return {
          ...p,
          startDate: p.startDate || new Date(p.id || Date.now()).toISOString().split('T')[0],
          endDate: p.endDate || getRandomFutureDate(),
        };
      });

      setProjects(parsedProjects);
      localStorage.setItem('projects', JSON.stringify(parsedProjects));
    }
  }, []);

  const getRandomFutureDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30) + 1;
    const futureDate = new Date(today.setDate(today.getDate() + randomDays));
    return futureDate.toISOString().split('T')[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredProjects = projects.filter(p => {
    const statusMatch = filter === 'All' || p.progress === filter;
    const managerMatch = managerFilter === 'All' || p.manager === managerFilter;
    return statusMatch && managerMatch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key.includes('Date')) {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="dashboard-page">
      <div className="overview-cards">
        <div className="card">
          <h5>Total Users</h5>
          <p>{users.length}</p>
        </div>
        <div className="card">
          <h5>Active Projects</h5>
          <p>{projects.length}</p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Projects</h4>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            value={filter}
          >
            <option>All</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Not Started</option>
            <option>On Hold</option>
          </select>

          <select
            className="form-select"
            onChange={(e) => {
              setManagerFilter(e.target.value);
              setCurrentPage(1);
            }}
            value={managerFilter}
          >
            <option value="All">All Managers</option>
            {managerOptions.map((mgr, idx) => (
              <option key={idx} value={mgr}>{mgr}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="project-table mt-3">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
                Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Status</th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('startDate')}>
                Start Date {sortConfig.key === 'startDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('endDate')}>
                End Date {sortConfig.key === 'endDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Project Manager</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((proj, index) => (
              <tr key={proj.id || index}>
                <td>{proj.name}</td>
                <td>
                  <span className={`badge bg-${statusColors[proj.progress] || 'secondary'}`}>
                    {proj.progress}
                  </span>
                </td>
                <td>{formatDate(proj.startDate)}</td>
                <td>{formatDate(proj.endDate)}</td>
                <td>{proj.manager}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
