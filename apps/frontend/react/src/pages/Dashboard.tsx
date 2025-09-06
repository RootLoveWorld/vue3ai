import React from 'react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <h2>{t('dashboard.title')}</h2>
      <p>{t('dashboard.welcome')}</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{t('documents.title')}</h3>
          <p>125</p>
        </div>
        <div className="stat-card">
          <h3>{t('users.title')}</h3>
          <p>42</p>
        </div>
        <div className="stat-card">
          <h3>{t('organizations.title')}</h3>
          <p>8</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;