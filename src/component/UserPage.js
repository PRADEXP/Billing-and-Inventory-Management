import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserPage.css';


export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // For adding a new user
  const [newUserName, setNewUserName] = useState('');
  const [newUserMoney, setNewUserMoney] = useState('');

  // For editing a user
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserName, setEditingUserName] = useState('');
  const [editingUserMoney, setEditingUserMoney] = useState('');

  // Fetch users
  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/user/get')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch users');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleAddUser = () => {
    if (!newUserName || isNaN(parseFloat(newUserMoney)) || parseFloat(newUserMoney) < 0) {
      alert('Please enter valid name and non-negative money');
      return;
    }

    const user = {
      name: newUserName,
      money: parseFloat(newUserMoney),
      // Simple unique ID (use backend-generated id if possible)
    };

    axios.post('http://localhost:5000/api/user/post', user)
      .then(() => {
        fetchUsers();
        setNewUserName('');
        setNewUserMoney('');
      })
      .catch(() => alert('Failed to add user'));
  };

  // Start editing a user
  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditingUserName(user.name);
    setEditingUserMoney(user.money);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUserId(null);
    setEditingUserName('');
    setEditingUserMoney('');
  };

  // Save edited user
  const saveEdit = () => {
    if (!editingUserName || isNaN(parseFloat(editingUserMoney)) || parseFloat(editingUserMoney) < 0) {
      alert('Please enter valid name and non-negative money');
      return;
    }

    axios.put(`http://localhost:5000/api/user/put/${editingUserId}`, {
      name: editingUserName,
      money: parseFloat(editingUserMoney)
    })
      .then(() => {
        fetchUsers();
        cancelEdit();
      })
      .catch(() => alert('Failed to update user'));
  };

  if (loading) return <div>Loading users...</div>;

  return (
<div className="userdata-container">
  <h2 className="userdata-title">User Data</h2>

  {/* Add User */}
  <div className="userdata-add-section" style={{ marginBottom: '2rem' }}>
    <h3 className="userdata-subtitle">Add New User</h3>
    <input
      className="userdata-input"
      placeholder="Name"
      value={newUserName}
      onChange={e => setNewUserName(e.target.value)}
      style={{ marginRight: 10 }}
    />
    <input
      className="userdata-input"
      type="number"
      placeholder="Money"
      value={newUserMoney}
      onChange={e => setNewUserMoney(e.target.value)}
      style={{ marginRight: 10 }}
    />
    <button className="userdata-button" onClick={handleAddUser}>Add User</button>
  </div>

  {/* Users List */}
  <h3 className="userdata-subtitle">Users</h3>
  <table className="userdata-table" cellPadding="8">
    <thead>
      <tr>
        <th className="userdata-th">ID</th>
        <th className="userdata-th">Name</th>
        <th className="userdata-th">Money</th>
        <th className="userdata-th">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user =>
        editingUserId === user._id ? (
          <tr key={user._id} className="userdata-edit-row">
            <td>
              <input
                className="userdata-edit-input"
                value={editingUserName}
                onChange={e => setEditingUserName(e.target.value)}
              />
            </td>
            <td>
              <input
                className="userdata-edit-input"
                type="number"
                value={editingUserMoney}
                onChange={e => setEditingUserMoney(e.target.value)}
              />
            </td>
            <td>
              <button className="userdata-save-button" onClick={saveEdit}>Save</button>
              <button className="userdata-cancel-button" onClick={cancelEdit}>Cancel</button>
            </td>
          </tr>
        ) : (
          <tr key={user._id} className="userdata-row">
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>₹{user.money.toFixed(2)}</td>
            <td>
              <button className="userdata-edit-button" onClick={() => startEdit(user)}>Edit</button>
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>

  );
}
