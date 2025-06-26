import { useState, useEffect } from 'react';
import '../../styles/Admin.css';

export default function Users() {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: 'John Smith', email: 'john.incture@gmail.com', role: 'Admin' },
      { id: 2, name: 'Emily Johnson', email: 'emily.incture@gmail.com', role: 'Manager' }
    ];
  });

  const [editId, setEditId] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleStartEdit = (id, currentName, currentRole) => {
    setEditId(id);
    setSelectedName(currentName);
    setSelectedRole(currentRole);
  };

  const handleSave = () => {
    const updated = users.map(user =>
      user.id === editId ? { ...user, name: selectedName, role: selectedRole } : user
    );
    setUsers(updated);
    setEditId(null);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setSelectedName('');
    setSelectedRole('');
  };

  const handleDelete = (id) => {
    const updated = users.filter(user => user.id !== id);
    setUsers(updated);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      <div className="table-container">
        <table className="table table-bordered table-hover bg-white">
          <thead>
            <tr>
              <th>Name</th>
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
                      value={selectedName}
                      onChange={(e) => setSelectedName(e.target.value)}
                    />
                  ) : user.name}
                </td>
                <td>{user.email}</td>
                <td>
                  {editId === user.id ? (
                    <select
                      className="form-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Member</option>
                    </select>
                  ) : user.role}
                </td>
                <td>
                  {editId === user.id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleStartEdit(user.id, user.name, user.role)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
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
    </div>
  );
}
