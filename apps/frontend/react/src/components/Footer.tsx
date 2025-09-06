import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <p>{t('common.copyright', '© 2025 React App. All rights reserved.')}</p>
    </footer>
  );
};

export default Footer;