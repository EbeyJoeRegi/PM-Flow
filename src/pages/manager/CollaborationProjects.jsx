import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import '../../styles/collaborationProjects.css';
import { Pagination } from '../../components/Pagination';
import { getManagerProjects } from '../../api/managerApi';
import { useSelector } from 'react-redux';
import { formatStatus } from '../../utils/Helper';

const CollaborationProjects = () => {
  const navigate = useNavigate();
  const { id, token } = useSelector((state) => state.user);

  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getManagerProjects(id, token);
        setAllProjects(projects);
      } catch (error) {
        console.error("Error fetching manager projects:", error.message);
      }
    };
    fetchProjects();
  }, [id, token]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
      const formattedStatus = formatStatus(project.status) || project.status;
      const matchesStatus = statusFilter ? formattedStatus === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [allProjects, searchTerm, statusFilter]);

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
            <option value="On Hold">On Hold</option>
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
                onClick={() => { 
                  localStorage.setItem('selectedProjectId', project.id);
                  navigate(`${project.name}`)}
                }
              >
                <span className="collab-project-name">{project.name}</span>
                <span className={`status-badges ${project.status.toLowerCase().replace(/_/g, '')}`}>
                  {formatStatus(project.status) || project.status}
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
