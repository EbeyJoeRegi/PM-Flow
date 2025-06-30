import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import { FaPen } from 'react-icons/fa'
import { getProjectById, updateProjectById } from '../../api/adminApi'

export default function ProjectDetails() {
  const { state } = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(state || null)
  const [editDesc, setEditDesc] = useState(false)
  const [description, setDescription] = useState('')
  const [tempDescription, setTempDescription] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id)
        console.log('Fetched project data:', data)
        setProject(data)
        setDescription(data.description || '')
      } catch {
        setProject(undefined)
      }
    }

    if (!state) {
      fetchProject()
    } else {
      setProject(state)
      setDescription(state.description || '')
    }
  }, [id, state])

  const handleSave = async () => {
    try {
      await updateProjectById(id, { description: tempDescription })
      setDescription(tempDescription)
      setEditDesc(false)
    } catch {
      setEditDesc(false)
    }
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
        Project not found. <button className="btn btn-link" onClick={() => navigate(-1)}>Go back</button>
      </div>
    )
  }

  if (!project) {
    return <div className="p-4">Loading project details...</div>
  }

  const {
    name = 'N/A',
    managerName = 'N/A',
    teamMembers = [],
    status = 'N/A',
    endDate = '',
    startDate = ''
  } = project

  const formatDashDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`
  }

  return (
    <div className="project-details p-4 shadow rounded bg-white" style={{ maxWidth: '800px', margin: 'auto' }}>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">{name}</h2>
        <span className={`badge progress-${status.toLowerCase().replace(/_/g, '-')}`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="mb-2"><strong>Manager:</strong> {managerName}</div>

      <div className="mb-2">
        <strong>Team Members:</strong>
        {teamMembers.length > 0 ? (
          <ul className="ms-3">
            {teamMembers.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        ) : (
          <span> N/A</span>
        )}
      </div>

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
