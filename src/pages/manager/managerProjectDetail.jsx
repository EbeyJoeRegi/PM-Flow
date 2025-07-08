import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  formatDate,
  formatStatus,
  getBootstrapBgClass,
  getTaskPriorityClass,
} from '../../utils/Helper';
import { MdModeEditOutline } from 'react-icons/md';
import '../../styles/managerProjectDetail.css';
import {
  getManagerProjectByName,
  getTasksByProjectId,
  createTask,
  getTeamMembersByProjectId,
  updateProjectStatusAndEndDate,
} from '../../api/managerApi';
import { Pagination } from '../../components/Pagination';

const ManagerProjectDetail = () => {
  const { projectName } = useParams();
  const { id, token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [teamMembersMap, setTeamMembersMap] = useState([]);
  const [projectDetail, setProjectDetail] = useState(null);
  const [status, setStatus] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editPopup, setEditPopup] = useState(false);
  const [editedStatus, setEditedStatus] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');
  const [saveError, setSaveError] = useState('');

  const [newTask, setNewTask] = useState({
    name: '',
    dueDate: '',
    priority: 'MEDIUM',
    assignee: '',
  });
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
        const transformedTasks = taskData.map((task) => ({
          id: task.id,
          name: task.name,
          dueDate: task.dueDate ? formatDate(task.dueDate.split('T')[0]) : 'N/A',
          priority: task.priority,
          status: formatStatus(task.status),
          assignee: `${task.assigneeFirstName} ${task.assigneeLastName}`,
        }));
        setTasks(transformedTasks);

        const teamMembersResponse = await getTeamMembersByProjectId(id, projectData.id, token);
        setTeamMembersMap(teamMembersResponse);
        setMembers(teamMembersResponse.map((m) => m.username));
      } catch (err) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndTasks();
  }, [id, projectName, token]);

  const toggleAssignee = (name) => {
    setSelectedAssignees((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
    setPage(1);
  };

useEffect(() => {
  const handleClickOutside = (e) => {
    const isDropdown = e.target.closest('.manager-project-checkbox-dropdown');
    if (!isDropdown) {
      setShowDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (searchTask) result = result.filter((t) => t.name.toLowerCase().includes(searchTask.toLowerCase()));
    if (selectedAssignees.length > 0) result = result.filter((t) => selectedAssignees.includes(t.assignee));
    if (sortField === 'dueDate') result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    else if (sortField === 'priority') {
      const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortField === 'status') {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }
    return result;
  }, [tasks, searchTask, selectedAssignees, sortField]);

  const totalPages = Math.ceil(filteredTasks.length / perPage);
  const paginatedTasks = filteredTasks.slice((page - 1) * perPage, page * perPage);
  const assigneeList = [...new Set(tasks.map(t => t.assignee).filter(Boolean))];

  const handleTaskCreate = async () => {
    if (!newTask.name || !newTask.dueDate || !newTask.priority || !newTask.assignee) {
      setTaskError('Please fill in all the fields.');
      return;
    }

    const assigneeObj = teamMembersMap.find((tm) => tm.username === newTask.assignee);
    if (!assigneeObj) {
      setTaskError('Selected assignee not found.');
      return;
    }

    try {
      const payload = {
        name: newTask.name,
        priority: newTask.priority,
        status: 'NOT_STARTED',
        dueDate: newTask.dueDate,
        projectId: projectDetail.id,
        assigneeId: assigneeObj.id,
      };

      const createdTask = await createTask(payload, token);
      setTasks((prev) => [
        ...prev,
        {
          id: createdTask.id,
          name: createdTask.name,
          dueDate: formatDate(createdTask.dueDate),
          priority: createdTask.priority,
          status: formatStatus(createdTask.status),
          assignee: `${createdTask.assigneeFirstName} ${createdTask.assigneeLastName}`,
        },
      ]);

      setShowModal(false);
      setNewTask({ name: '', dueDate: '', priority: 'MEDIUM', assignee: '' });
      setTaskError('');
    } catch (err) {
      setTaskError(err.message || 'Failed to create task.');
    }
  };

  if (loading) return <div className="manager-project-container"><p>Loading...</p></div>;
  if (error) return <div className="manager-project-container"><p className="error">{error}</p></div>;
  return (
    <div className="manager-project-container">
      <div className="manager-project-details-section">
        <div className="manager-project-title-bar">
          <h2>{projectDetail.name}</h2>
          <div className="status-edit-display">
            <span className={`status-badges ${formatStatus(status).toLowerCase().replace(/\s/g, '')}`}>
              {formatStatus(status)}
            </span>
            <MdModeEditOutline
              className={`edit-icon icon-${formatStatus(status).toLowerCase().replace(/\s/g, '')}`}
              onClick={() => {
                setEditPopup(true);
                setEditedStatus(status);
                setEditedEndDate(endDate);
                setSaveError('');
              }}
            />
          </div>
        </div>

        <div className="manager-project-description-date">
          <div className="manager-project-description-block">
            <p><strong>Description:</strong> {projectDetail.description}</p>
          </div>

          <div className="manager-project-info-pair">
            <div className="manager-project-team-block">
              <p><strong>Team Members</strong></p>
              <ul>{members.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>

            <div className="manager-project-date-block">
              <div className="manager-project-date-display">
                <label>Start Date :</label>
                <span>{formatDate(projectDetail.startDate)}</span>
              </div>
              <div className="manager-project-date-display">
                <label>Due Date &nbsp;:</label>
                <span>{formatDate(endDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Section */}
      <div className="manager-project-task-section">
        <div className="manager-project-task-header">
          <h3>Tasks</h3>
          <div className="manager-project-task-filters">
            <input
              placeholder="Search by Task Name"
              value={searchTask}
              onChange={(e) => {
                setSearchTask(e.target.value);
                setPage(1);
              }}
            />
            <div className={`manager-project-checkbox-dropdown ${showDropdown ? 'open' : ''}`}>
              <button
                onClick={() => {
                  if (assigneeList.length > 0) setShowDropdown(!showDropdown);
                }}
                disabled={assigneeList.length === 0}
                className={assigneeList.length === 0 ? 'disabled-button' : ''}
              >
                Filter Assignees
              </button>

              {assigneeList.length > 0 && (
                <div className="manager-project-dropdown-content">
                  {assigneeList.map(assignee => (
                    <label key={assignee}>
                      <input
                        type="checkbox"
                        checked={selectedAssignees.includes(assignee)}
                        onChange={() => toggleAssignee(assignee)}
                      />
                      {assignee}
                    </label>
                  ))}
                </div>
              )}
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
                  paginatedTasks.map((t) => (
                    <tr key={t.id} onClick={() => navigate(`tasks/${t.id}`)} className="manager-project-task-row">
                      <td>{t.name}</td>
                      <td>{t.dueDate}</td>
                      <td className={`fw-semibold ${getTaskPriorityClass(t.priority)}`}>{t.priority}</td>
                      <td><span className={`status-badge text-light ${getBootstrapBgClass(t.status)}`}>{t.status}</span></td>
                      <td>{t.assignee}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

      {showModal && (
        <div
          className="manager-project-modal-overlay"
          onClick={() => {
            setShowModal(false);
            setNewTask({ name: '', dueDate: '', priority: 'MEDIUM', assignee: '' });
            setTaskError('');
          }}
        >
          <div
            className="manager-project-modal"
            onClick={(e) => e.stopPropagation()}
          >
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
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select
              value={newTask.assignee}
              onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
            >
              <option value="" disabled>Select Assignee</option>
              {teamMembersMap.map(tm => (
                <option key={tm.id} value={tm.username}>{tm.username}</option>
              ))}
            </select>

            {taskError && <div className="manager-project-error">{taskError}</div>}

            <div className="manager-project-modal-actions">
              <button onClick={handleTaskCreate}>Add Task</button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setNewTask({ name: '', dueDate: '', priority: 'Medium', assignee: '' });
                  setTaskError('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editPopup && (
        <div className="edit-modal-overlay" onClick={() => setEditPopup(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Edit Project Info</h4>
            <label>Status</label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <label>End Date</label>
            <input
              type="date"
              value={editedEndDate}
              onChange={(e) => setEditedEndDate(e.target.value)}
            />

            {saveError && <div className="manager-project-error">{saveError}</div>}

            <div className="edit-modal-actions">
              <button
                onClick={async () => {
                  try {
                    if (editedStatus === status && editedEndDate === endDate) {
                      setSaveError('No changes made.');
                      return;
                    }

                    await updateProjectStatusAndEndDate(id, projectDetail.id, editedStatus, editedEndDate, token);
                    setStatus(editedStatus);
                    setEndDate(editedEndDate);
                    setProjectDetail((prev) => ({ ...prev, status: editedStatus, endDate: editedEndDate }));
                    setEditPopup(false);
                  } catch (err) {
                    setSaveError(err.message || 'Failed to update project info');
                  }
                }}
              >
                Save
              </button>
              <button className="cancel-btn" onClick={() => setEditPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProjectDetail;
