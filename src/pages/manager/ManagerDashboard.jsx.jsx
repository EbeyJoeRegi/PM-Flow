import '../../styles/managerDashboard.css';
import { useState, useMemo, useEffect } from 'react';
import { getManagerProjects } from '../../api/managerApi';
import { useSelector } from "react-redux";
import { formatStatus, getBootstrapBgClass, formatDate } from '../../utils/Helper';

const ManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [statusAsc, setStatusAsc] = useState(true);
  const [statusSortActive, setStatusSortActive] = useState(false);

  const { id, token } = useSelector((state) => state.user); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getManagerProjects(id, token);
        const formatted = data.map(p => ({
          name: p.name,
          status: formatStatus(p.status),
          start: p.startDate,
          end: p.endDate
        }));
        setProjects(formatted);
      } catch (err) {
        console.error("Failed to fetch projects:", err.message);
      }
    };

    fetchProjects();
  }, [id, token]);

  const totalProjects = projects.length;
  const defaultStatuses = ["Not Started", "In Progress", "On Hold", "Completed"];

  const statusCount = useMemo(() => {
    const countMap = projects.reduce((acc, curr) => {
      if (defaultStatuses.includes(curr.status)) {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
      }
      return acc;
    }, {});

    defaultStatuses.forEach(status => {
      if (!countMap[status]) countMap[status] = 0;
    });

    return countMap;
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

    if (statusSortActive) {
      sorted.sort((a, b) =>
        statusAsc
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      );
    } else {
      sorted.sort((a, b) => new Date(a.end) - new Date(b.end));
    }

    return sorted;
  }, [closestProjects, statusAsc, statusSortActive]);

  const handleStatusSort = () => {
    setStatusSortActive(true);
    setStatusAsc(prev => !prev);
  };

  const handleEndDateSort = () => {
    setStatusSortActive(false);
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
          {defaultStatuses.map(status => {
            const count = statusCount[status];
            const percent = (count / totalProjects) * 100 || 0;
            return (
              <div className="status-bar" key={status}>
                <label>{status}</label>
                <div className="progress-container">
                  {count > 0 ? (
                    <div
                      className={`progress-fill ${getBootstrapBgClass(status)}`}
                      style={{ width: `${percent}%` }}
                    >
                      {count}
                    </div>
                  ) : (
                    <div
                      className="progress-fill empty-bar"
                      style={{ width: `0%` }}
                    >
                      0
                    </div>
                  )}
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
                <th onClick={handleEndDateSort} className="clickable">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: '#999' }}>
                    No projects currently managed.
                  </td>
                </tr>
              ) : (
                sortedProjects.map((proj, idx) => (
                  <tr key={idx}>
                    <td>{proj.name}</td>
                    <td>
                      <span className={`status-badge ${getBootstrapBgClass(proj.status)}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td>{formatDate(proj.start)}</td>
                    <td>{formatDate(proj.end)}</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
