import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManagerProjects } from '../../api/managerApi';
import '../../styles/managerProjects.css';
import { useSelector } from "react-redux";

const ManagerProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [page, setPage] = useState(1);

  const { token } = useSelector((state) => state.user); //id need be included
  const managerId = "ebey";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getManagerProjects(managerId, token);
        const formatted = data.map(p => ({
          id: p.id,
          name: p.name,
          status: formatStatus(p.status),
           start: p.startDate,
          end: p.endDate
        }));
        setProjects(formatted);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
      }
    };

    fetchProjects();
  }, [managerId, token]);

  const formatStatus = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 'Not Started';
      case 'IN_PROGRESS': return 'In Progress';
      case 'ON_HOLD': return 'On Hold';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  };

  const getStatusBgClass = (status) => { //projectDasgboard.css
    switch (status) {
      case 'Not Started': return 'bg-secondary';
      case 'In Progress': return 'bg-primary';
      case 'Completed': return 'bg-success';
      case 'On Hold': return 'bg-warning';
      default: return 'bg-light text-dark';
    }
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (sortField === 'start') {
      filtered.sort((a, b) => new Date(a.start || '1970-01-01') - new Date(b.start || '1970-01-01'));
    } else if (sortField === 'end') {
      filtered.sort((a, b) => new Date(a.end) - new Date(b.end));
    }

    return filtered;
  }, [projects, statusFilter, searchQuery, sortField]);

  const perPage = 5;
  const totalPages = Math.ceil(filteredProjects.length / perPage);
  const paginated = filteredProjects.slice((page - 1) * perPage, page * perPage);

  const goToDetail = (name) => navigate(`${name}`);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery, sortField]);

  return (
    <div className="manager-projects-container">
      <div className="manager-projects-header">
        <h2>Projects Management</h2>
        <div className="manager-projects-filters">
          <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
            <option value="">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Search by project name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="manager-projects-table-wrapper">
        <table className="manager-projects-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th onClick={() => setSortField('start')} className="manager-sortable">Start Date ⬍</th>
              <th onClick={() => setSortField('end')} className="manager-sortable">End Date ⬍</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan="4">No projects found.</td></tr>
            ) : (
              paginated.map(p => (
                <tr key={p.id} onClick={() => goToDetail(p.name)} className="manager-clickable-row">
                  <td>{p.name}</td>
                  <td>
                    <span className={`status-badge ${getStatusBgClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>

                  <td>{p.start}</td>
                  <td>{p.end}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="manager-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
};

export default ManagerProjects;
