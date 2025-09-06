import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import './Settings.css';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { themes, currentTheme, setTheme, createCustomTheme } = useTheme();
  const { language, changeLanguage } = useI18n();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="settings-page">
      <h2>{t('settings.title')}</h2>
      
      <div className="settings-section">
        <h3>{t('settings.theme')}</h3>
        <div className="setting-item">
          <label htmlFor="theme-select">{t('settings.selectTheme')}</label>
          <select id="theme-select" value={currentTheme.name} onChange={handleThemeChange}>
            {themes.map(theme => (
              <option key={theme.name} value={theme.name}>
                {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="setting-item">
          <button onClick={() => {
            // This would open a custom theme editor in a real app
            alert(t('settings.customThemeAlert', 'Custom theme editor would open here'));
          }}>
            {t('settings.createCustomTheme')}
          </button>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>{t('settings.language')}</h3>
        <div className="setting-item">
          <label htmlFor="language-select">{t('settings.selectLanguage')}</label>
          <select id="language-select" value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>{t('settings.preferences')}</h3>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            {t('settings.enableNotifications')}
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            {t('settings.autoSave')}
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;