import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Organizations.css';

interface Organization {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const Organizations: React.FC = () => {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: '1', name: 'Acme Inc', description: 'A leading technology company', memberCount: 120 },
    { id: '2', name: 'Globex Corp', description: 'Global solutions provider', memberCount: 85 },
    { id: '3', name: 'Wayne Enterprises', description: 'Innovative research and development', memberCount: 210 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const handleAddOrg = () => {
    setEditingOrg(null);
    setShowForm(true);
  };

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setShowForm(true);
  };

  const handleDeleteOrg = (id: string) => {
    if (window.confirm(t('organizations.confirmDelete', 'Are you sure you want to delete this organization?'))) {
      setOrganizations(organizations.filter(org => org.id !== id));
    }
  };

  return (
    <div className="organizations-page">
      <div className="organizations-header">
        <h2>{t('organizations.title')}</h2>
        <button onClick={handleAddOrg}>{t('organizations.addOrg')}</button>
      </div>

      {showForm ? (
        <OrganizationForm 
          organization={editingOrg} 
          onClose={() => setShowForm(false)} 
          onSave={(org) => {
            if (editingOrg) {
              // Update existing organization
              setOrganizations(organizations.map(o => o.id === org.id ? org : o));
            } else {
              // Add new organization
              setOrganizations([...organizations, { ...org, id: Date.now().toString(), memberCount: 0 }]);
            }
            setShowForm(false);
          }}
        />
      ) : (
        <div className="organizations-grid">
          {organizations.map(org => (
            <div key={org.id} className="organization-card">
              <h3>{org.name}</h3>
              <p>{org.description}</p>
              <div className="org-stats">
                <span>{t('organizations.members', '{{count}} members', { count: org.memberCount })}</span>
              </div>
              <div className="org-actions">
                <button onClick={() => handleEditOrg(org)}>{t('common.edit')}</button>
                <button onClick={() => handleDeleteOrg(org.id)}>{t('common.delete')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface OrganizationFormProps {
  organization: Organization | null;
  onClose: () => void;
  onSave: (org: Organization) => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization, onClose, onSave }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(organization?.name || '');
  const [description, setDescription] = useState(organization?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: organization?.id || Date.now().toString(),
      name,
      description,
      memberCount: organization?.memberCount || 0
    });
  };

  return (
    <div className="org-form-overlay">
      <div className="org-form">
        <h3>{organization ? t('organizations.editOrg') : t('organizations.addOrg')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('organizations.name')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">{t('organizations.description')}</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
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

export default Organizations;