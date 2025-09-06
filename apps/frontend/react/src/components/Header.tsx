import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { themes, currentTheme, setTheme, createCustomTheme } = useTheme();
  const { language, changeLanguage } = useI18n();
  const { t } = useTranslation();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    // Remove auth token and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>{t('common.appName', 'React App')}</h1>
        <div className="header-controls">
          <select value={currentTheme.name} onChange={handleThemeChange}>
            {themes.map(theme => (
              <option key={theme.name} value={theme.name}>
                {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
              </option>
            ))}
          </select>
          
          <select value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
          
          <button onClick={handleLogout}>{t('common.logout', 'Logout')}</button>
        </div>
      </div>
    </header>
  );
};

export default Header;