import '../../styles/managerDashboard.css';
import { useState, useMemo } from 'react';

const ManagerDashboard = () => {
  const [statusAsc, setStatusAsc] = useState(true);

  const projects = useMemo(() => [
    { name: "Website Redesign", status: "In Progress", start: "2024-12-01", end: "2026-03-01" },
    { name: "Mobile App Launch", status: "Not Started", start: "2025-06-01", end: "2025-09-01" },
    { name: "Cloud Migration", status: "On Hold", start: "2024-11-15", end: "2025-05-30" },
    { name: "Marketing Campaign", status: "Completed", start: "2024-10-01", end: "2025-01-10" },
    { name: "UI Overhaul", status: "In Progress", start: "2025-02-10", end: "2025-08-01" },
    { name: "SEO Optimization", status: "On Hold", start: "2025-03-01", end: "2025-10-10" },
  ], []);

  const totalProjects = projects.length;

  const statusCount = useMemo(() => {
    return projects.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
  }, [projects]);

  const closestProjects = useMemo(() => {
      const today = new Date();
    return [...projects]
      .filter(project => new Date(project.end) >= today)
      .sort((a, b) =>
        Math.abs(new Date(a.end) - today) - Math.abs(new Date(b.end) - today)
      )
      .slice(0, 5);
  }, [projects]);

  const sortedProjects = useMemo(() => {
    const sorted = [...closestProjects];
    sorted.sort((a, b) =>
      statusAsc
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    );
    return sorted;
  }, [closestProjects, statusAsc]);

  const handleStatusSort = () => {
    setStatusAsc(prev => !prev);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Top Section */}
      <div className="dashboard-top">
        <div className="overview-box">
          <h3>Project Overview</h3>
          <div className="project-count">
            <span className="big-number">{totalProjects}</span>
            <span>Projects Managed</span>
          </div>
        </div>

        <div className="status-box">
          <h3>Project Status</h3>
          {Object.entries(statusCount).map(([status, count]) => {
            const percent = (count / totalProjects) * 100;
            return (
              <div className="status-bar" key={status}>
                <label>{status}</label>
                <div className="progress-container">
                  <div
                    className={`progress-fill ${status.toLowerCase().replace(' ', '-')}`}
                    style={{ width: `${percent}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dashboard-bottom">
        <div className="projects-header">
          <h3>Projects Managed</h3>
        </div>
        <div className="table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project</th>
                <th onClick={handleStatusSort} className="clickable">Status ⬍</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((proj, idx) => (
                <tr key={idx}>
                  <td>{proj.name}</td>
                  <td>{proj.status}</td>
                  <td>{proj.start}</td>
                  <td>{proj.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
