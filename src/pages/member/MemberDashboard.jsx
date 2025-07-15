import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles/Member.css'
import { getTasksByUserId } from '../../api/teamMemberApi'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function MemberDashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [deadlines, setDeadlines] = useState([])

  useEffect(() => {


    const fetchTasks = async () => {
      try {
        const userString = localStorage.getItem('user')
        const user = JSON.parse(userString)
        const userId = user?.id
        if (!userId) return
        const taskData = await getTasksByUserId(userId)
        setTasks(taskData)
        localStorage.setItem('tasks', JSON.stringify(taskData))

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const upcoming = taskData
          .filter(task => ['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD'].includes(task.status))
          .map(task => {
            const due = new Date(task.dueDate)
            const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate())
            const timeDiff = dueDateOnly - today
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
            return {
              date: due.toLocaleDateString('en-GB').replaceAll('/', '-'),
              task: task.name,
              isUrgent: daysLeft <= 3 && daysLeft >= 0,
              daysLeft
            }
          })
          .filter(item => item.isUrgent)

        setDeadlines(upcoming)
      } catch {}
    }

    fetchTasks()
  }, [])

  const handleAssignedTaskClick = () => {
    navigate('/member/assigned-tasks', { state: { tasks, previewOnly: false } })
  }

  const countByStatus = (status) => tasks.filter((task) => task.status === status).length

  const pieData = [
    { name: 'Not Started', value: countByStatus('NOT_STARTED'), color: '#0d6efd' },
    { name: 'In Progress', value: countByStatus('IN_PROGRESS'), color: '#ffc107' },
    { name: 'Completed', value: countByStatus('COMPLETED'), color: '#198754' },
    { name: 'On Hold', value: countByStatus('ON_HOLD'), color: '#6c757d' }
  ]

  const statusColors = {
    NOT_STARTED: 'primary',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    ON_HOLD: 'secondary'
  }

  const priorityColors = {
    HIGH: 'text-danger',
    MEDIUM: 'text-warning',
    LOW: 'text-success'
  }

  return (
  <div className="member-dashboard-container container-fluid px-4" style={{ overflowX: 'auto', width: '100%' }}>
    <div className="row gx-4">
      <div className="col-lg-8 mb-4">
        <div className="card tasks-card p-3 h-100 d-flex flex-column">
          <h2 className="mb-3">My Assigned Tasks</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3">Task</th>
                  <th className="py-3">Priority</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task, index) => (
                  <tr key={index}>
                    <td>{task.name}</td>
                    <td>
                      <span className={`fw-semibold ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge bg-${statusColors[task.status]} text-light`}>
                        {task.status.replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(task.dueDate).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-3">
            <button className="btn btn-primary btn-md" onClick={handleAssignedTaskClick}>View All</button>
          </div>
        </div>
      </div>

      <div className="col-lg-4 mb-4">
        <div className="card status-card p-3 h-100 text-center">
          <h4 className="mb-2">Task Status</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 d-flex flex-column align-items-start px-2">
            {pieData.map((entry, index) => (
              <div key={index} className="d-flex justify-content-between w-100 mb-1">
                <span className="fw-semibold" style={{ color: entry.color }}>{entry.name}</span>
                <span className="fw-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="row gx-4">
      <div className="col-12 mb-4">
        <div className="card deadlines-card p-3">
          <h4 className="mb-3">Upcoming Deadlines</h4>
          {deadlines.length === 0 ? (
            <p className="text-muted">No upcoming deadlines within 3 days.</p>
          ) : (
            <ul className="deadlines-list list-unstyled">
              {deadlines.map((item, index) => (
                <li key={index} className="mb-2">
                  <span className={item.isUrgent ? 'dot-green' : 'dot-yellow'}></span> {item.date} {item.task}
                  <span className="highlight ms-2">
                    {item.daysLeft === 0 ? 'Due today' : `Next ${item.daysLeft} ${item.daysLeft === 1 ? 'day' : 'days'}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
)
}