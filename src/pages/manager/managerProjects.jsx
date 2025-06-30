import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/managerProjects.css';

const ManagerProjects = () => {
  const navigate = useNavigate();

  const allProjects = useMemo(() => [
    {
      id: 1,
      name: "Corporate Website Revamp",
      status: "In Progress",
      start: "2024-12-01",
      end: "2025-03-01"
    },
    {
      id: 2,
      name: "NextGen Mobile App Development",
      status: "Not Started",
      start: "2025-06-01",
      end: "2025-09-01"
    },
    {
      id: 3,
      name: "Cloud Infrastructure Migration",
      status: "On Hold",
      start: "2024-11-15",
      end: "2025-05-30"
    },
    {
      id: 4,
      name: "Q1 Marketing Launch",
      status: "Completed",
      start: "2024-10-01",
      end: "2025-01-10"
    },
    {
      id: 5,
      name: "Dashboard UI Modernization",
      status: "In Progress",
      start: "2025-02-10",
      end: "2025-08-01"
    },
    {
      id: 6,
      name: "Advanced SEO Optimization",
      status: "On Hold",
      start: "2025-03-01",
      end: "2025-10-10"
    },
    {
      id: 7,
      name: "API Backend Refactoring",
      status: "Completed",
      start: "2025-01-15",
      end: "2025-06-15"
    }
  ], []);

  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(() => {
    let filtered = [...allProjects];

    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (sortField === 'start') {
      filtered.sort((a, b) => new Date(a.start) - new Date(b.start));
    } else if (sortField === 'end') {
      filtered.sort((a, b) => new Date(a.end) - new Date(b.end));
    }

    return filtered;
  }, [allProjects, statusFilter, searchQuery, sortField]);

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
                  <td>{p.status}</td>
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
