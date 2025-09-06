import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Import required libraries
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Import cache utility
import { documentCache } from '../../utils/documentCache';

interface OfficeDocumentPreviewProps {
  content: ArrayBuffer;
  type: string;
}

const OfficeDocumentPreview: React.FC<OfficeDocumentPreviewProps> = ({ content, type }) => {
  const { t } = useTranslation();
  const [processedContent, setProcessedContent] = useState<React.ReactNode>(null);
  const [officeError, setOfficeError] = useState<string | null>(null);
  const [officeLoading, setOfficeLoading] = useState(false);

  useEffect(() => {
    const processOfficeDocument = async () => {
      try {
        setOfficeLoading(true);
        setOfficeError(null);
        
        // Create a copy of the ArrayBuffer to avoid detached buffer issues
        const dataCopy = content.slice(0);
        
        if (type === 'docx') {
          // Convert ArrayBuffer to Uint8Array for mammoth
          const result = await mammoth.convertToHtml({ arrayBuffer: dataCopy });
          setProcessedContent(<div dangerouslySetInnerHTML={{ __html: result.value }} />);
        } else if (type === 'xlsx') {
          // Parse Excel file
          const workbook = XLSX.read(dataCopy, { type: 'array' });
          
          // Get first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to HTML table
          const html = XLSX.utils.sheet_to_html(worksheet);
          setProcessedContent(<div dangerouslySetInnerHTML={{ __html: html }} />);
        } else {
          // For other office documents, show file info
          setProcessedContent(
            <div className="document-file-preview">
              <div className="document-icon">{type.toUpperCase()}</div>
              <p>{t('documents.documentPreview', 'Document preview for {{name}}', { name: 'document' })}</p>
              <p>{t('documents.downloadPrompt', 'Download the file to view its contents')}</p>
            </div>
          );
        }
        
        // Cache the original content
        documentCache.set('office-document', content);
        
        setOfficeLoading(false);
      } catch (err) {
        setOfficeError('Failed to process document: ' + (err as Error).message);
        setOfficeLoading(false);
      }
    };

    if (content instanceof ArrayBuffer) {
      processOfficeDocument();
    }
  }, [content, type]);

  if (officeError) {
    return (
      <div className="error">
        <p>{t('documents.error', 'Error processing document: {{error}}', { error: officeError })}</p>
      </div>
    );
  }

  return (
    <div className="office-document-preview">
      {officeLoading && <div className="loading">{t('documents.loading', 'Processing document...')}</div>}
      {processedContent}
    </div>
  );
};

export default OfficeDocumentPreview;