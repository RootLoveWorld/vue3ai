import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  const menuItems = [
    { path: '/dashboard', label: t('dashboard.title', 'Dashboard') },
    { path: '/documents', label: t('documents.title', 'Documents') },
    { path: '/users', label: t('users.title', 'Users') },
    { path: '/organizations', label: t('organizations.title', 'Organizations') },
    { path: '/settings', label: t('settings.title', 'Settings') },
    { path: '/gsap-demo', label: 'GSAP Examples' },
    { path: '/gsap-showcase', label: 'GSAP Showcase' },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;