import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import '../../styles/collaborationProjects.css';
import { Pagination } from '../../components/Pagination';

const CollaborationProjects = () => {
  const navigate = useNavigate();

  const allProjects = [
    { id: 1, name: 'Redesign Header', status: 'In Progress' },
    { id: 2, name: 'Dashboard Analytics', status: 'Completed' },
    { id: 3, name: 'New Feature Integration', status: 'Not Started' },
    { id: 4, name: 'API Improvements', status: 'In Progress' },
    { id: 5, name: 'User Feedback System', status: 'Completed' },
    { id: 6, name: 'Mobile Optimization', status: 'Not Started' },
    { id: 7, name: 'Bug Fixes', status: 'Completed' },
    { id: 8, name: 'Testing Automation', status: 'In Progress' },
    { id: 9, name: 'Marketing Dashboard', status: 'In Progress' },
    { id: 10, name: 'Documentation Update', status: 'Not Started' },
    { id: 11, name: 'Security Audit', status: 'Completed' },
    { id: 12, name: 'Dark Mode', status: 'Not Started' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? project.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const projectsPerPage = 10;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  return (
    <div className="collab-projects-page">
      <div className="collab-header-row">
        <h2 className="collab-header">Collaboration</h2>
        <div className="collab-controls">
          <input
            type="text"
            placeholder="Search by name"
            className="collab-search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="collab-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>

      {currentProjects.length === 0 ? (
        <p className="no-projects-msg">No projects found.</p>
      ) : (
        <>
          <div className="collab-project-list">
            {currentProjects.map(project => (
              <div
                key={project.id}
                className="collab-project-card"
                onClick={() => navigate(`${project.id}`)}
              >
                <span className="collab-project-name">{project.name}</span>
                <span className={`status-badges ${(project.status).toLowerCase().replace(/\s/g, '')}`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>

          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default CollaborationProjects;
