import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/managerProjects.css';

const ManagerProjects = () => {
  const navigate = useNavigate();

  const allProjects = useMemo(() => [
  {
    "id": 1,
    "name": "Corporate Website Revamp",
    "description": "This project focuses on a comprehensive redesign of the company's official website. The goal is to modernize the user interface and improve user experience across devices. Key tasks include restructuring the site architecture, optimizing page load speeds, and ensuring accessibility compliance. The updated site will better reflect the brand identity and support marketing efforts. Cross-team collaboration will ensure consistency in design and messaging.",
    "status": "In Progress",
    "start": "2024-12-01",
    "end": "2025-03-01"
  },
  {
    "id": 2,
    "name": "NextGen Mobile App Development",
    "description": "This initiative aims to design and develop a feature-rich mobile application for our customer base. The app will support both iOS and Android platforms, offering core services such as account management, notifications, and real-time updates. User engagement and intuitive UX are top priorities. The project involves UI/UX design, API integration, testing, and deployment. Launch success will be measured by user adoption and retention metrics.",
    "status": "Not Started",
    "start": "2025-06-01",
    "end": "2025-09-01"
  },
  {
    "id": 3,
    "name": "Cloud Infrastructure Migration",
    "description": "The objective of this project is to migrate our on-premise servers and databases to a scalable cloud environment. This transition will enhance reliability, scalability, and disaster recovery capabilities. Tasks include assessing current workloads, designing the cloud architecture, and performing phased migration. The team will conduct performance benchmarks and security audits throughout the process. Downtime mitigation strategies are in place to ensure a seamless transition.",
    "status": "On Hold",
    "start": "2024-11-15",
    "end": "2025-05-30"
  },
  {
    "id": 4,
    "name": "Q1 Marketing Launch",
    "description": "This marketing campaign was aimed at boosting product awareness and generating leads in Q1. It involved coordinated digital marketing efforts including SEO, PPC ads, email campaigns, and social media outreach. Content strategy and targeted messaging were tailored to specific customer personas. Cross-departmental collaboration ensured alignment with sales goals. The campaign performance was tracked through analytics platforms and reported monthly.",
    "status": "Completed",
    "start": "2024-10-01",
    "end": "2025-01-10"
  },
  {
    "id": 5,
    "name": "Dashboard UI Modernization",
    "description": "This project seeks to overhaul the user interface of our core analytics dashboard. The focus is on adopting a modern design system, improving usability, and implementing responsive layouts. User feedback has driven many of the planned changes. The team will utilize front-end frameworks and design tools to streamline the workflow. Enhancements will improve overall customer satisfaction and product perception.",
    "status": "In Progress",
    "start": "2025-02-10",
    "end": "2025-08-01"
  },
  {
    "id": 6,
    "name": "Advanced SEO Optimization",
    "description": "The goal of this project is to significantly improve our website’s organic search visibility. Strategies include technical SEO audits, keyword optimization, content improvements, and backlink acquisition. A data-driven approach will guide decision-making throughout the project. The team will monitor progress using SEO tools and analytics platforms. Expected outcomes include higher SERP rankings and increased organic traffic.",
    "status": "On Hold",
    "start": "2025-03-01",
    "end": "2025-10-10"
  },
  {
    "id": 7,
    "name": "API Backend Refactoring",
    "description": "This backend engineering project involves restructuring and optimizing our existing API architecture. Goals include improved performance, scalability, and maintainability. Legacy code will be audited and rewritten where necessary. The project also introduces standardized documentation and versioning. This refactor lays the groundwork for future service integrations and faster deployment cycles.",
    "status": "Completed",
    "start": "2025-01-15",
    "end": "2025-06-15"
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


  return (
    <div className="manager-projects-container">
      <div className="projects-header">
        <h2>Projects Management</h2>
        <div className="filters">
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
      <div className="projects-table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th onClick={() => setSortField('start')} className="sortable">Start Date ⬍</th>
              <th onClick={() => setSortField('end')} className="sortable">End Date ⬍</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan="5">No projects found.</td></tr>
            ) : (
              paginated.map(p => (
                <tr key={p.id} onClick={() => goToDetail(p.name)} className="clickable-row">
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.status}</td>
                  <td>{p.start}</td>
                  <td>{p.end}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
};

export default ManagerProjects;
