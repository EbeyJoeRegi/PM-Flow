import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Admin.css';
import {
  getAllProjects,
  createProject,
  getAllUsers,
  getProjectById,
  updateProjectById,
  deleteProjectById
} from '../../api/adminApi';
import { FaPen, FaTrash } from 'react-icons/fa';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [managerOptions, setManagerOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [teamSize, setTeamSize] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', manager: '', endDate: '' });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editProjectId, setEditProjectId] = useState(null);
  const [editedProject, setEditedProject] = useState({ name: '', managerId: '', endDate: '' });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectList, users] = await Promise.all([
          getAllProjects(),
          getAllUsers()
        ]);

        const managers = users.filter(u => (u.role || '').toLowerCase().includes('manager'));
        const members = users.filter(u => (u.role || '').toLowerCase().includes('member'));

        setManagerOptions(managers.map(u => ({ id: String(u.id), name: `${u.firstName} ${u.lastName}`.trim() })));
        setMemberOptions(members.map(u => ({ id: String(u.id), name: `${u.firstName} ${u.lastName}`.trim() })));

        const detailedProjects = await Promise.all(projectList.map(p => getProjectById(p.id)));
        setProjects(detailedProjects || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDateDDMMYYYY = (str) => {
    if (!str) return 'N/A';
    const date = new Date(str);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const formatDateMMDDYYYY = (str) => {
    if (!str) return '';
    const date = new Date(str);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleAddProject = async () => {
    if (!newProject.name || !newProject.manager) return;

    const payload = {
      name: newProject.name,
      description: 'N/A',
      managerId: Number(newProject.manager),
      teamMemberIds: teamMembers.filter(id => id !== '').map(id => Number(id)),
      endDate: formatDateMMDDYYYY(newProject.endDate)
    };

    try {
      const added = await createProject(payload);

      const managerName = managerOptions.find(m => String(m.id) === String(added.managerId))?.name || 'N/A';
      const memberNames = (added.teamMemberIds || []).map(id =>
        memberOptions.find(m => String(m.id) === String(id))?.name || 'Unknown'
      );

      setProjects(prev => [...prev, { ...added, managerName, memberNames }]);
      setNewProject({ name: '', manager: '', endDate: '' });
      setTeamSize(0);
      setTeamMembers([]);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add project:", error);
      alert('Failed to add project. Check console for details.');
    }
  };

  const handleEditClick = (project) => {
    setEditProjectId(project.id);
    setEditedProject({
      name: project.name || '',
      managerId: String(project.managerId) || '',
      endDate: project.endDate ? project.endDate.split('T')[0] : ''
    });
  };

  const handleSaveEdit = async (projectId) => {
    try {
      const original = projects.find(p => p.id === projectId);

      const updatedPayload = {
        name: editedProject.name,
        description: original.description || 'Updated project',
        status: original.status || 'NOT_STARTED',
        managerId: Number(editedProject.managerId),
        teamMemberIds: original.teamMembers?.map(m => m.id) || [],
        endDate: formatDateMMDDYYYY(editedProject.endDate)
      };

      const updated = await updateProjectById(projectId, updatedPayload);
      const updatedManagerName = managerOptions.find(m => String(m.id) === String(updated.managerId))?.name || 'N/A';

      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, ...updated, managerName: updatedManagerName } : p
      ));
      setEditProjectId(null);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProjectById(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  const filtered = projects.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 project-view">
      <div className="d-flex justify-content-between mb-3">
        <h4>Projects</h4>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
      </div>

      <input
        className="form-control mb-3 search-input"
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {loading ? <div>Loading...</div> : (
        <div className="project-table-scroll">
          <table className="table table-bordered bg-white project-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Manager</th>
                <th>Status</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(proj => (
                <tr key={proj.id}>
                  {editProjectId === proj.id ? (
                    <>
                      <td>
                        <input
                          className="form-control"
                          value={editedProject.name}
                          onChange={e => setEditedProject({ ...editedProject, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          value={editedProject.managerId}
                          onChange={e => setEditedProject({ ...editedProject, managerId: e.target.value })}
                        >
                          <option value="">Select Manager</option>
                          {managerOptions.map(({ id, name }) => (
                            <option key={id} value={id}>{name}</option>
                          ))}
                        </select>
                      </td>
                      <td>{proj.status?.replace('_', ' ') || 'N/A'}</td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={editedProject.endDate}
                          onChange={e => setEditedProject({ ...editedProject, endDate: e.target.value })}
                        />
                      </td>
                      <td>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleSaveEdit(proj.id)}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditProjectId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/admin/project/${proj.id}`, {
                          state: {
                            ...proj,
                            manager: proj.managerName || managerOptions.find(m => String(m.id) === String(proj.managerId))?.name || 'N/A',
                            members: proj.teamMembers || proj.memberNames || []
                          }
                        })}
                      >
                        {proj.name}
                      </td>
                      <td>{proj.managerName || managerOptions.find(m => String(m.id) === String(proj.managerId))?.name || 'N/A'}</td>
                      <td>
                        <span className={`px-1 py-1 rounded text-uppercase fw-semibold ${
                          proj.status === 'IN_PROGRESS' ? 'status-in-progress' :
                          proj.status === 'COMPLETED' ? 'status-completed' :
                          proj.status === 'NOT_STARTED' ? 'status-not-started' :
                          proj.status === 'ON_HOLD' ? 'status-on-hold' : ''
                        }`}>
                          {proj.status?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td>{formatDateDDMMYYYY(proj.endDate)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(proj)} title="Edit">
                          <FaPen />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProject(proj.id)} title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h5>Add New Project</h5>
            <input
              className="form-control mb-2"
              placeholder="Project Name"
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            />
            <select
              className="form-select mb-2"
              value={newProject.manager}
              onChange={e => setNewProject({ ...newProject, manager: e.target.value })}
            >
              <option value="">Select Manager</option>
              {managerOptions.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Team Size"
              min={0}
              value={teamSize}
              onChange={e => {
                const val = parseInt(e.target.value) || 0;
                setTeamSize(val);
                setTeamMembers(Array(val).fill(''));
              }}
            />

            {teamMembers.map((val, i) => (
              <select
                key={i}
                className="form-select mb-2"
                value={val}
                onChange={e => {
                  const copy = [...teamMembers];
                  copy[i] = e.target.value;
                  setTeamMembers(copy);
                }}
              >
                <option value="">Select Member {i + 1}</option>
                {memberOptions.map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            ))}

            <input
              type="date"
              className="form-control mb-3"
              value={newProject.endDate}
              onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
            />
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleAddProject}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
