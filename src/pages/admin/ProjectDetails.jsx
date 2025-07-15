import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import { FaPen } from 'react-icons/fa'
import { capitalizeFirstLetter } from '../../utils/Helper'
import { getProjectById, updateProjectById } from '../../api/adminApi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
        setProject(data)
        setDescription(data.description || '')
      } catch {
        setProject(undefined)
        toast.error('Failed to fetch project')
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
      toast.success('Description updated successfully')
    } catch {
      setEditDesc(false)
      toast.error('Failed to update description')
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-4">
        Loading project details...
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    )
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
    <div className="project-details p-4 rounded bg-white">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">{name}</h2>
        <span className={`badge bg-primary text-white`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="mb-2">
  <strong>Manager:</strong> {capitalizeFirstLetter(managerName)}
</div>


      <div className="d-flex justify-content-between align-items-start flex-wrap mb-3">
        <div className="flex-grow-1">
          <strong>Team Members:</strong>
          {teamMembers?.length > 0 ? (
            <ul className="ms-3 mb-0">
              {teamMembers.map((member, index) => (
                <li key={index}>{capitalizeFirstLetter(member.includes(':') ? member.split(':')[1] : member)}</li>
              ))}
            </ul>
          ) : (
            <span> N/A</span>
          )}
        </div>
        <div className="d-flex flex-column justify-content-start" style={{ minWidth: '250px' }}>
          <div className="mb-2">
            <strong>Start Date :</strong> <span>{formatDashDate(startDate)}</span>
          </div>
          <div>
            <strong>End Date &nbsp; : </strong> <span>{formatDashDate(endDate)}</span>
          </div>
        </div>

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
        <p style={{ textAlign: 'justify' }}>{description || 'No description provided.'}</p>
      )}

      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />
    </div>
  )
}
