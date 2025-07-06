import { useNavigate } from 'react-router-dom';
import '../../styles/collaborationProjects.css';
const CollaborationProjects = () => {
  const navigate = useNavigate();

  const projects = [
    { id: 1, name: 'Redesign Header', status: 'In Progress' },
    { id: 2, name: 'Dashboard Analytics', status: 'Completed' },
    { id: 3, name: 'New Feature Integration', status: 'Not Started' }
  ];
  
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
            <span className={`status-badges ${(project.status).toLowerCase().replace(/\s/g, '')}`}>
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationProjects;
