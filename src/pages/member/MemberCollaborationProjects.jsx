import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignedProjects } from '../../api/teamMemberApi';
import '../../styles/collaborationProjects.css';

export default function MemberCollaborationProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

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

  return (
    <div className="collab-projects-page">
      <h2 className="collab-header">Collaboration</h2>
      <div className="collab-project-list">
        {projects.map((project, index) => (
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
