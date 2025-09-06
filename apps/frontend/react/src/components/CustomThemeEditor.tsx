import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import './CustomThemeEditor.css';

interface ThemeEditorProps {
  onClose: () => void;
  initialTheme?: any;
}

const CustomThemeEditor: React.FC<ThemeEditorProps> = ({ onClose, initialTheme }) => {
  const { t } = useTranslation();
  const { createCustomTheme, themes } = useTheme();
  
  // Initialize state with default values or the provided initial theme
  const [themeName, setThemeName] = useState(initialTheme?.name || '');
  const [primaryColor, setPrimaryColor] = useState(initialTheme?.palette?.primary || '#1976d2');
  const [secondaryColor, setSecondaryColor] = useState(initialTheme?.palette?.secondary || '#dc004e');
  const [backgroundColor, setBackgroundColor] = useState(initialTheme?.palette?.background || '#ffffff');
  const [textColor, setTextColor] = useState(initialTheme?.palette?.text || '#000000');
  const [fontFamily, setFontFamily] = useState(initialTheme?.typography?.fontFamily || 'Roboto, sans-serif');
  const [fontSize, setFontSize] = useState(initialTheme?.typography?.fontSize || 16);
  
  const isNameValid = themeName.trim() !== '' && !themes.some(theme => theme.name === themeName.trim());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNameValid) {
      return;
    }
    
    const newTheme = {
      name: themeName.trim(),
      palette: {
        primary: primaryColor,
        secondary: secondaryColor,
        background: backgroundColor,
        text: textColor,
      },
      typography: {
        fontFamily,
        fontSize: Number(fontSize),
      },
    };
    
    createCustomTheme(newTheme);
    onClose();
  };

  return createPortal(
    <div className="custom-theme-editor">
      <div className="theme-editor-overlay" onClick={onClose}></div>
      <div className="theme-editor-modal">
        <div className="theme-editor-header">
          <h2>{t('settings.createCustomTheme')}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="theme-editor-form">
          <div className="form-group">
            <label htmlFor="theme-name">{t('settings.themeName')}</label>
            <input
              id="theme-name"
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder={t('settings.enterThemeName')}
              required
            />
            {!isNameValid && themeName.trim() !== '' && (
              <span className="error-message">
                {t('settings.themeNameExists')}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="primary-color">{t('settings.primaryColor')}</label>
            <div className="color-input-wrapper">
              <input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
              <span>{primaryColor}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="secondary-color">{t('settings.secondaryColor')}</label>
            <div className="color-input-wrapper">
              <input
                id="secondary-color"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
              <span>{secondaryColor}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="background-color">{t('settings.backgroundColor')}</label>
            <div className="color-input-wrapper">
              <input
                id="background-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
              <span>{backgroundColor}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="text-color">{t('settings.textColor')}</label>
            <div className="color-input-wrapper">
              <input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
              <span>{textColor}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="font-family">{t('settings.fontFamily')}</label>
            <input
              id="font-family"
              type="text"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              placeholder="e.g., Arial, sans-serif"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="font-size">{t('settings.fontSize')}</label>
            <input
              id="font-size"
              type="number"
              min="10"
              max="30"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
          
          <div className="theme-preview" style={{
            backgroundColor: backgroundColor,
            color: textColor,
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginTop: '1rem'
          }}>
            <h3>{t('settings.preview')}</h3>
            <p>{t('settings.themePreviewText')}</p>
            <button 
              type="button" 
              style={{
                backgroundColor: primaryColor,
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '0.5rem'
              }}
            >
              {t('common.save')}
            </button>
            <button 
              type="button" 
              style={{
                backgroundColor: secondaryColor,
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {t('common.cancel')}
            </button>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
            >
              {t('common.cancel')}
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={!isNameValid}
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CustomThemeEditor;