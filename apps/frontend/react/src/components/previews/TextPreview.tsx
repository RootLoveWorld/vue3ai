import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Import cache utility
import { documentCache } from '../../utils/documentCache';

interface TextPreviewProps {
  content: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({ content }) => {
  const { t } = useTranslation();
  const [textError, setTextError] = useState<string | null>(null);
  
  useEffect(() => {
    // Cache the content
    documentCache.set('text-document', content);
  }, [content]);
  
  try {
    return <pre className="text-preview">{content}</pre>;
  } catch (err) {
    setTextError('Failed to render text: ' + (err as Error).message);
    return (
      <div className="error">
        <p>{t('documents.error', 'Error rendering text: {{error}}', { error: textError })}</p>
      </div>
    );
  }
};

export default TextPreview;