import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Users.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

const Users: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', organization: 'Acme Inc' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', organization: 'Acme Inc' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', organization: 'Globex Corp' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm(t('users.confirmDelete', 'Are you sure you want to delete this user?'))) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>{t('users.title')}</h2>
        <button onClick={handleAddUser}>{t('users.addUser')}</button>
      </div>

      {showForm ? (
        <UserForm 
          user={editingUser} 
          onClose={() => setShowForm(false)} 
          onSave={(user) => {
            if (editingUser) {
              // Update existing user
              setUsers(users.map(u => u.id === user.id ? user : u));
            } else {
              // Add new user
              setUsers([...users, { ...user, id: Date.now().toString() }]);
            }
            setShowForm(false);
          }}
        />
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>{t('users.name')}</th>
                <th>{t('users.email')}</th>
                <th>{t('users.role')}</th>
                <th>{t('users.organization')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.organization}</td>
                  <td>
                    <button onClick={() => handleEditUser(user)}>{t('common.edit')}</button>
                    <button onClick={() => handleDeleteUser(user.id)}>{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

interface UserFormProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSave }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'User');
  const [organization, setOrganization] = useState(user?.organization || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: user?.id || Date.now().toString(),
      name,
      email,
      role,
      organization
    });
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form">
        <h3>{user ? t('users.editUser') : t('users.addUser')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('users.name')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('users.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">{t('users.role')}</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="organization">{t('users.organization')}</label>
            <input
              type="text"
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose}>{t('common.cancel')}</button>
            <button type="submit">{t('common.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Users;