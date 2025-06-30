import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles//MemberCollaborationProjects.css';

export default function MemberCollaborationProjects() {
  const navigate = useNavigate();

  const projects = [
    { id: 1, name: 'Redesign Header', status: 'In Progress' },
    { id: 2, name: 'Dashboard Analytics', status: 'Completed' },
    { id: 3, name: 'New Feature Integration', status: 'Not Started' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'collab-status-completed';
      case 'In Progress': return 'collab-status-inprogress';
      case 'Not Started': return 'collab-status-notstarted';
      default: return '';
    }
  };

  return (
    <div className="collab-projects-page">
      <h2 className="collab-header">Collaboration</h2>
      <div className="collab-project-list">
        {projects.map(project => (
          <div
            key={project.id}
            className="collab-project-card"
            onClick={() => navigate(`${project.id}`)}
          >
            <span className="collab-project-name">{project.name}</span>
            <span className={`collab-project-status ${getStatusClass(project.status)}`}>
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
