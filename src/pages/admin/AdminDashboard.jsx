import { useState, useEffect } from 'react';
import '../../styles/Admin.css';
import { getAllProjects, getProjectById, getAllUsers } from '../../api/adminApi';

export default function Dashboard() {
  const [filter, setFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [managerOptions, setManagerOptions] = useState(['All']);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  const statusColors = {
    'Not Started': 'primary',
    'In Progress': 'warning',
    'Completed': 'success',
    'On Hold': 'secondary'
  };

  const toTitleCase = (str) =>
    str?.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectList, userList] = await Promise.all([
          getAllProjects(),
          getAllUsers()
        ]);

        setUsers(userList);

        const detailedProjects = await Promise.all(
          projectList.map(p => getProjectById(p.id))
        );

        setProjects(detailedProjects);
        localStorage.setItem('projects', JSON.stringify(detailedProjects));

        const uniqueManagers = Array.from(
          new Set(detailedProjects.map(p => p.managerName))
        ).filter(Boolean);
        setManagerOptions(['All', ...uniqueManagers]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredProjects = projects.filter(p => {
    const statusMatch = filter === 'All' || toTitleCase(p.status?.replace(/_/g, ' ')) === filter;
    const managerMatch = managerFilter === 'All' || p.managerName === managerFilter;
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
      aVal = (aVal || '').toLowerCase();
      bVal = (bVal || '').toLowerCase();
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
          <h4>Total Users</h4>
          <p className="highlighter">{users.length}</p>

        </div>
        <div className="card">
          <h4>Active Projects</h4>
          <p className="highlighter">{projects.length}</p>

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
                Name
                <span className="sort-icon">
                  {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th>Status</th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('startDate')}>
                Start Date
                <span className="sort-icon">
                  {sortConfig.key === 'startDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('endDate')}>
                End Date
                <span className="sort-icon">
                  {sortConfig.key === 'endDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th>Project Manager</th>
            </tr>
          </thead>

          <tbody>
            {currentProjects.map((proj, index) => (
              <tr key={proj.id || index} style={{ height: '60px' }}>
                <td>{proj.name}</td>
                <td>
                  <span className={`status-badge bg-${statusColors[toTitleCase(proj.status?.replace(/_/g, ' '))] || 'secondary'} text-light`}>
                    {toTitleCase(proj.status?.replace(/_/g, ' ')) || 'N/A'}
                  </span>
                </td>
                <td>{formatDate(proj.startDate)}</td>
                <td>{formatDate(proj.endDate)}</td>
                <td>{proj.managerName || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4 manager-pagination gap-3 flex-wrap">
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
      </div>
    </div>
  );
}
