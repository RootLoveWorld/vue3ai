import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { themes, currentTheme, setTheme, createCustomTheme } = useTheme();
  const { language, changeLanguage } = useI18n();
  const { t } = useTranslation();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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
          {/* Theme Switcher */}
          <div className="dropdown">
            <button 
              className="dropdown-button"
              onClick={() => {
                setShowThemeDropdown(!showThemeDropdown);
                setShowLanguageDropdown(false);
              }}
            >
              {currentTheme.name.charAt(0).toUpperCase() + currentTheme.name.slice(1)}
            </button>
            {showThemeDropdown && (
              <div className="dropdown-menu">
                {themes.map(theme => (
                  <button
                    key={theme.name}
                    className={`dropdown-item ${currentTheme.name === theme.name ? 'active' : ''}`}
                    onClick={() => {
                      setTheme(theme.name);
                      setShowThemeDropdown(false);
                    }}
                  >
                    {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Language Switcher */}
          <div className="dropdown">
            <button 
              className="dropdown-button"
              onClick={() => {
                setShowLanguageDropdown(!showLanguageDropdown);
                setShowThemeDropdown(false);
              }}
            >
              {language === 'en' ? 'English' : '中文'}
            </button>
            {showLanguageDropdown && (
              <div className="dropdown-menu">
                <button
                  className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage('en');
                    setShowLanguageDropdown(false);
                  }}
                >
                  English
                </button>
                <button
                  className={`dropdown-item ${language === 'zh' ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage('zh');
                    setShowLanguageDropdown(false);
                  }}
                >
                  中文
                </button>
              </div>
            )}
          </div>
          
          <button className="logout-button" onClick={handleLogout}>
            {t('common.logout', 'Logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;