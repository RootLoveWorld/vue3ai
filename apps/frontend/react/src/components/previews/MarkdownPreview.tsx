import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

// Import cache utility
import { documentCache } from '../../utils/documentCache';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const { t } = useTranslation();
  const [markdownError, setMarkdownError] = useState<string | null>(null);
  
  useEffect(() => {
    // Cache the content
    documentCache.set('markdown-document', content);
  }, [content]);
  
  try {
    return (
      <div className="markdown-preview">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  } catch (err) {
    setMarkdownError('Failed to render markdown: ' + (err as Error).message);
    return (
      <div className="error">
        <p>{t('documents.error', 'Error rendering markdown: {{error}}', { error: markdownError })}</p>
      </div>
    );
  }
};

export default MarkdownPreview;