import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import { FaPen } from 'react-icons/fa'

export default function ProjectDetails() {
  const { state } = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(state || null)
  const [editDesc, setEditDesc] = useState(false)
  const [description, setDescription] = useState('')
  const [tempDescription, setTempDescription] = useState('')

  useEffect(() => {
    if (!state) {
      const stored = JSON.parse(localStorage.getItem('projects')) || []
      const found = stored.find(p => p.id.toString() === id)
      if (found) {
        setProject(found)
        setDescription(found.description || '')
      } else {
        setProject(undefined)
      }
    } else {
      setDescription(state.description || '')
    }
  }, [id, state])

  const handleSave = () => {
    const updatedProjects = JSON.parse(localStorage.getItem('projects')).map(p =>
      p.id === project.id ? { ...p, description: tempDescription } : p
    )
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
    setDescription(tempDescription)
    setEditDesc(false)
  }

  const handleCancel = () => {
    setTempDescription(description)
    setEditDesc(false)
  }

  const startEdit = () => {
    setTempDescription(description)
    setEditDesc(true)
  }

  if (project === undefined) {
    return (
      <div className="p-4 text-center text-danger">
        Project not found.{' '}
        <button className="btn btn-link" onClick={() => navigate(-1)}>Go back</button>
      </div>
    )
  }

  if (!project) {
    return <div className="p-4">Loading project details...</div>
  }

  const formatDashDate = (dateStr) => dateStr || 'N/A'
  const { name, manager, members, progress, endDate, startDate } = project

  return (
    <div className="project-details p-4 shadow rounded bg-white" style={{ maxWidth: '800px', margin: 'auto' }}>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">{name}</h2>
        <span className={`badge progress-${progress.toLowerCase().replace(' ', '-')}`}>{progress}</span>
      </div>

      <div className="mb-2"><strong>Manager:</strong> {manager}</div>
      <div className="mb-2"><strong>Members:</strong> {members.join(', ')}</div>

      <div className="mb-2 d-flex gap-3">
        <div><strong>Start Date:</strong> <span className="badge bg-light text-dark">{formatDashDate(startDate)}</span></div>
        <div><strong>End Date:</strong> <span className="badge bg-light text-dark">{formatDashDate(endDate)}</span></div>
      </div>

      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-2">Description</h5>
        {!editDesc && (
          <FaPen
            className="text-secondary"
            style={{ cursor: 'pointer' }}
            onClick={startEdit}
          />
        )}
      </div>

      {editDesc ? (
        <>
          <textarea
            className="form-control mb-2"
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            rows={4}
          />
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-success" onClick={handleSave}>Save</button>
            <button className="btn btn-sm btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </>
      ) : (
        <p>{description || 'No description provided.'}</p>
      )}
    </div>
  )
}
