import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentPreview from '../components/DocumentPreview';
import './Documents.css';

// Define maximum file size for preview (5MB)
const MAX_PREVIEW_SIZE = 5 * 1024 * 1024;

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  content?: string | ArrayBuffer | null;
  previewUrl?: string;
}

const Documents: React.FC = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'sample.pdf', type: 'pdf', size: 1024000, uploadDate: '2025-01-15' },
    { id: '2', name: 'report.docx', type: 'docx', size: 512000, uploadDate: '2025-01-10' },
    { id: '3', name: 'data.xlsx', type: 'xlsx', size: 256000, uploadDate: '2025-01-05' },
    { id: '4', name: 'presentation.pptx', type: 'pptx', size: 2048000, uploadDate: '2025-01-01' },
  ]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file size
      if (file.size > MAX_PREVIEW_SIZE) {
        // For large files, only store basic info without content
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.split('/')[1] || file.name.split('.').pop() || 'unknown',
          size: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          content: null, // Don't load content for large files
        };
        setDocuments(prev => [...prev, newDocument]);
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.split('/')[1] || file.name.split('.').pop() || 'unknown',
          size: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          content: event.target?.result,
        };
        
        // For image files, set previewUrl
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(newDocument.type)) {
          newDocument.previewUrl = event.target?.result as string;
        }
        
        setDocuments(prev => [...prev, newDocument]);
      };
      
      // Read file based on type
      const fileType = file.type.split('/')[1] || file.name.split('.').pop() || '';
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf'].includes(fileType)) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h2>{t('documents.title')}</h2>
        <button onClick={triggerFileInput}>{t('documents.upload')}</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.md,.jpg,.jpeg,.png,.gif,.bmp,.webp"
        />
      </div>

      <div className="documents-content">
        <div className="documents-list">
          <h3>{t('documents.documentList', 'Document List')}</h3>
          <ul>
            {documents.map(document => (
              <li 
                key={document.id} 
                onClick={() => handleDocumentSelect(document)}
                className={selectedDocument?.id === document.id ? 'selected' : ''}
              >
                <span className="document-name">{document.name}</span>
                <span className="document-type">{document.type}</span>
                <span className="document-size">{(document.size / 1024).toFixed(1)} KB</span>
                {document.size > MAX_PREVIEW_SIZE && (
                  <span className="document-warning">Large file - preview limited</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="document-preview-container">
          {selectedDocument ? (
            <DocumentPreview document={selectedDocument} />
          ) : (
            <div className="preview-placeholder">
              <p>{t('documents.selectDocument', 'Select a document to preview')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;