import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import CustomThemeEditor from '../components/CustomThemeEditor';
import './Settings.css';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { themes, currentTheme, setTheme } = useTheme();
  const { language, changeLanguage } = useI18n();
  const [showCustomThemeEditor, setShowCustomThemeEditor] = useState(false);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleCustomThemeClick = () => {
    setShowCustomThemeEditor(true);
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
          <button onClick={handleCustomThemeClick}>
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
      
      {showCustomThemeEditor && (
        <CustomThemeEditor onClose={() => setShowCustomThemeEditor(false)} />
      )}
    </div>
  );
};

export default Settings;