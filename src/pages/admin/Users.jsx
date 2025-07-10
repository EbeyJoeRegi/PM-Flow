import { useState, useEffect } from 'react';
import { getAllUsers, updateUserByAdmin } from '../../api/adminApi';
import { FaPen, FaTrash } from 'react-icons/fa';
import '../../styles/Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="user-management">
      <div className="header d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3>User Management</h3>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container" style={{fontSize:'18px'}}>
        <table className="table table-bordered table-hover bg-white">
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
            {filteredUsers.map(user => (
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
                    user.role
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
