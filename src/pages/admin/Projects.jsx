import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/Admin.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editedProject, setEditedProject] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  const managerOptions = ['Abhishek Kumar Jah', 'Moushmi', 'Aishwarya']
  const progressOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold']

  const [newProject, setNewProject] = useState({
    name: '',
    manager: '',
    members: '',
    progress: 'Not Started',
    endDate: ''
  })

  const [projects, setProjects] = useState([])

  const statusColors = {
    'Not Started': 'primary',
    'In Progress': 'warning',
    'Completed': 'success',
    'On Hold': 'secondary'
  }

  useEffect(() => {
    const stored = localStorage.getItem('projects')
    if (stored) {
      const parsed = JSON.parse(stored).map(p => ({
        ...p,
        members: Array.isArray(p.members)
          ? p.members
          : p.members.split(',').map(m => m.trim())
      }))
      setProjects(parsed)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }, [projects, isLoaded])

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const handleAddProject = () => {
    if (!newProject.name || !newProject.manager) return

    const newEntry = {
      id: Date.now(),
      name: newProject.name,
      manager: newProject.manager,
      members: newProject.members.split(',').map(m => m.trim()),
      progress: newProject.progress,
      endDate: newProject.endDate,
      startDate: new Date().toISOString().split('T')[0]
    }

    setProjects([...projects, newEntry])
    setShowModal(false)
    setNewProject({
      name: '',
      manager: '',
      members: '',
      progress: 'Not Started',
      endDate: ''
    })
  }

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const handleFieldChange = (field, value) => {
    setEditedProject({
      ...editedProject,
      [field]: field === 'members'
        ? value.split(',').map(m => m.trim())
        : value
    })
  }

  const handleSaveEdit = () => {
    const updated = projects.map(p => (p.id === editId ? editedProject : p))
    setProjects(updated)
    setEditId(null)
    setEditedProject(null)
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditedProject(null)
  }

  return (
    <div className="project-view p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Project Oversight</h3>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Search projects"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="project-table-scroll">
        <table className="table table-bordered table-hover bg-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Project Manager</th>
              <th>Progress</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(project => (
              <tr
                key={project.id}
                className="py-10 align-middle"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (editId !== project.id) {
                    navigate(`/admin/project/${project.id}`, { state: project })
                  }
                }}
              >
                <td>{project.name}</td>
                <td>
                  {editId === project.id ? (
                    <select
                      className="form-select"
                      value={editedProject.manager}
                      onChange={e => handleFieldChange('manager', e.target.value)}
                      onClick={e => e.stopPropagation()}
                    >
                      {managerOptions.map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    project.manager
                  )}
                </td>
                <td>
                  <span className={`badge bg-${statusColors[project.progress] || 'secondary'} text-white`}>
                    {project.progress}
                  </span>
                </td>
                <td>
                  {editId === project.id ? (
                    <input
                      type="date"
                      className="form-control"
                      value={editedProject.endDate}
                      onChange={e => handleFieldChange('endDate', e.target.value)}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    formatDate(project.endDate)
                  )}
                </td>
                <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  {editId === project.id ? (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={handleSaveEdit}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => {
                          setEditId(project.id)
                          setEditedProject({ ...project })
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <option value="">Select Project Manager</option>
              {managerOptions.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
            <input
              className="form-control mb-2"
              placeholder="Team Members (comma-separated)"
              value={newProject.members}
              onChange={e => setNewProject({ ...newProject, members: e.target.value })}
            />
            <select
              className="form-select mb-2"
              value={newProject.progress}
              onChange={e => setNewProject({ ...newProject, progress: e.target.value })}
            >
              {progressOptions.map((status, idx) => (
                <option key={idx} value={status}>{status}</option>
              ))}
            </select>
            <input
              type="date"
              className="form-control mb-3"
              value={newProject.endDate}
              onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
            />
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddProject}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
