import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaRegCalendarAlt } from 'react-icons/fa';
import '../../styles/managerProjectDetail.css';
import { getManagerProjectByName, getTasksByProjectId } from '../../api/managerApi';

const ManagerProjectDetail = () => {
  const { projectName } = useParams();
  const { token } = useSelector((state) => state.user);
  const id = "ebey"; // Temporary until dynamic manager ID used
  const navigate = useNavigate();

  const [projectDetail, setProjectDetail] = useState(null);
  const [status, setStatus] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({ name: '', dueDate: '', priority: 'Medium', assignee: '' });
  const [showModal, setShowModal] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [searchTask, setSearchTask] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortField, setSortField] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        setLoading(true);
        const projectData = await getManagerProjectByName(id, projectName, token);
        setProjectDetail(projectData);
        setStatus(projectData.status);
        setEndDate(projectData.endDate);
        setMembers(projectData.teamMembers);

        const taskData = await getTasksByProjectId(projectData.id, token);
        const transformedTasks = taskData.map(task => ({
          id: task.id,
          name: task.name,
          dueDate: task.dueDate.split('T')[0],
          priority: task.priority,
          status: task.status, //? capitalize(task.status.toLowerCase()) : 'N/A',
          assignee: `${task.assigneeFirstName} ${task.assigneeLastName}`
        }));
        setTasks(transformedTasks);
      } catch (err) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndTasks();
  }, [id, projectName, token]);

  //const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const toggleAssignee = (name) => {
    setSelectedAssignees(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
    setPage(1);
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('.checkbox-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (searchTask) result = result.filter(t => t.name.toLowerCase().includes(searchTask.toLowerCase()));
    if (selectedAssignees.length > 0) result = result.filter(t => selectedAssignees.includes(t.assignee));
    if (sortField === 'dueDate') result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    else if (sortField === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortField === 'status') {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }
    return result;
  }, [tasks, searchTask, selectedAssignees, sortField]);

  const totalPages = Math.ceil(filteredTasks.length / perPage);
  const paginatedTasks = filteredTasks.slice((page - 1) * perPage, page * perPage);

  const handleTaskCreate = () => {
    if (!newTask.name || !newTask.dueDate || !newTask.priority || !newTask.assignee) {
      setTaskError('Please fill in all the fields.');
      return;
    }
    setTasks([...tasks, { id: tasks.length + 1, ...newTask, status: 'Not Started' }]);
    setShowModal(false);
    setNewTask({ name: '', dueDate: '', priority: 'Medium', assignee: members[0] || '' });
    setTaskError('');
  };

  if (loading) return <div className="manager-project-container"><p>Loading...</p></div>;
  if (error) return <div className="manager-project-container"><p className="error">{error}</p></div>;

  const getStatusBgClass = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-secondary';
      case 'In Progress': return 'bg-primary';
      case 'Completed': return 'bg-success';
      case 'On Hold': return 'bg-warning';
      default: return 'bg-light text-dark';
    }
  };

  const getPriorityTextClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-danger';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-info';
      default:
        return '';
    }
  };

  return (
    <div className="manager-project-container">
      <div className="manager-project-details-section">
        <div className="manager-project-title-bar">
          <h2>{projectDetail.name}</h2>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="manager-project-description-date">
          <div className="manager-project-description-block">
            <p><strong>Description:</strong> {projectDetail.description}</p>
            <p><strong>Team Members:</strong></p>
            <ul>{members.map(m => <li key={m}>{m}</li>)}</ul>
          </div>

          <div className="manager-project-date-block">
            <div className="manager-project-date-display">
              <label>Start Date:</label>
              <span>{projectDetail.startDate}</span>
            </div>
            <div className="manager-project-date-display">
              <label>End Date:</label>
              {isEditingDate ? (
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onBlur={() => setIsEditingDate(false)}
                  autoFocus
                />
              ) : (
                <span>{endDate} <FaRegCalendarAlt className="manager-project-calendar-icon" onClick={() => setIsEditingDate(true)} /></span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="manager-project-task-section">
        <div className="manager-project-task-header">
          <h3>Tasks</h3>
          <div className="manager-project-task-filters">
            <input
              placeholder="Search by Task Name"
              value={searchTask}
              onChange={e => {
                setSearchTask(e.target.value);
                setPage(1);
              }}
            />
            <div className={`manager-project-checkbox-dropdown ${showDropdown ? 'open' : ''}`}>
              <button onClick={() => setShowDropdown(!showDropdown)}>Filter Assignees</button>
              <div className="manager-project-dropdown-content">
                {members.map(m => (
                  <label key={m}>
                    <input
                      type="checkbox"
                      checked={selectedAssignees.includes(m)}
                      onChange={() => toggleAssignee(m)}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => setShowModal(true)}>Create Task</button>
          </div>
        </div>

        <div className="manager-project-task-table-wrapper">
          <div className="manager-project-table-center">
            <table className="manager-project-task-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th onClick={() => setSortField('dueDate')} className="sortable">Due Date</th>
                  <th onClick={() => setSortField('priority')} className="sortable">Priority</th>
                  <th onClick={() => setSortField('status')} className="sortable">Status</th>
                  <th>Assignee</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.length === 0 ? (
                  <tr><td colSpan="5">No tasks found.</td></tr>
                ) : (
                  paginatedTasks.map(t => (
                    <tr key={t.id} onClick={() => navigate(`tasks/${t.name}`)} className="manager-project-task-row">
                      <td>{t.name}</td>
                      <td>{t.dueDate}</td>
                      <td className={`fw-semibold ${getPriorityTextClass(t.priority)}`}>
                        {t.priority}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBgClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>

                      <td>{t.assignee}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="manager-project-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="manager-project-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="manager-project-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Create New Task</h4>
            <input
              placeholder="Task Name"
              value={newTask.name}
              onChange={e => setNewTask({ ...newTask, name: e.target.value })}
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select
              value={newTask.assignee}
              onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
            >
              {members.map(m => <option key={m}>{m}</option>)}
            </select>
            {taskError && <div className="manager-project-error">{taskError}</div>}
            <div className="manager-project-modal-actions">
              <button onClick={handleTaskCreate}>Add Task</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProjectDetail;
