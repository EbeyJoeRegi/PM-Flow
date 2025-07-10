import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignedProjects } from '../../api/teamMemberApi';
import '../../styles/collaborationProjects.css';

export default function MemberCollaborationProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAssignedProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const statusColors = {
    'NOT_STARTED': 'bg-primary text-white',
    'IN_PROGRESS': 'bg-warning text-white',
    'COMPLETED': 'bg-success text-white',
    'ON_HOLD': 'bg-secondary text-white'
  };

  const getStatusClass = (status) => {
    return statusColors[status] || 'bg-light text-dark';
  };

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'NOT_STARTED', label: 'Not Started' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ON_HOLD', label: 'On Hold' }
  ];

  const filteredProjects = projects.filter(p =>
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || p.status === statusFilter)
  );

  return (
    <div className="collab-projects-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 px-2">
        <h2 className="collab-header mb-0">Collaboration</h2>
        <div className="d-flex gap-2 align-items-center mt-2 mt-sm-0">
          <input
            type="text"
            className="form-control collab-search"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="collab-project-list">
        {filteredProjects.map((project, index) => (
          <div
            key={project.projectId || `project-${index}`}
            className="collab-project-card"
            onClick={() =>
              navigate(`/member/collaboration/${project.projectId}`, {
                state: {
                  projectName: project.projectName,
                  projectStatus: project.status
                }
              })
            }
          >
            <span className="collab-project-name">{project.projectName}</span>
            <span className={`collab-project-status badge px-2 py-1 rounded ${getStatusClass(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
