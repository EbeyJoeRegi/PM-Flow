import { useState, useEffect } from 'react';
import { getAllUsers, updateUserByAdmin } from '../../api/adminApi';
import { FaPen, FaTrash } from 'react-icons/fa';
import '../../styles/Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pagination } from '../../components/Pagination'; // Update path if needed

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    getAllUsers()
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const handleStartEdit = (user) => {
    setEditId(user.id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setSelectedRole(user.role);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        firstName,
        lastName,
        role: selectedRole
      };
      await updateUserByAdmin(editId, updatedData);
      const updated = users.map(user =>
        user.id === editId ? { ...user, ...updatedData } : user
      );
      setUsers(updated);
      setEditId(null);
      toast.success('User updated successfully');
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFirstName('');
    setLastName('');
    setSelectedRole('');
  };

  const handleDelete = (id) => {
    const updated = users.filter(user => user.id !== id);
    setUsers(updated);
    toast.success('User deleted (from UI only)');
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const formatRole = (role) => {
    if (role === 'ADMIN') return 'ADMIN';
    if (role === 'PROJECT_MANAGER') return 'MANAGER';
    if (role === 'MEMBER') return 'MEMBER';
    return role;
  };

  return (
    <div className="user-management">
      <div className="header d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3>User Management</h3>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // reset page on search
          }}
        />
      </div>

      <div className="table-container" style={{ fontSize: '18px' }}>
        <table className="table table-hover mb-0 rounded-4 overflow-hidden bg-white user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id}>
                <td>
                  {editId === user.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  ) : (
                    user.firstName
                  )}
                </td>
                <td>
                  {editId === user.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  ) : (
                    user.lastName
                  )}
                </td>
                <td>{user.email}</td>
                <td>
                  {editId === user.id ? (
                    <select
                      className="form-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="PROJECT_MANAGER">Manager</option>
                      <option value="MEMBER">Member</option>
                    </select>
                  ) : (
                    formatRole(user.role)
                  )}
                </td>
                <td>
                  {editId === user.id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleStartEdit(user)}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredUsers.length > rowsPerPage && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
