import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './DocumentPreview.css';

// Import cache utility
import { documentCache } from '../../utils/documentCache';

// Import types
import { Document, DocumentPreviewProps } from './types';

// Import sub-components
import { ImagePreview, PDFPreview, TextPreview, CSVPreview, MarkdownPreview, OfficeDocumentPreview } from './index';

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if document content is cached
  useEffect(() => {
    const cachedContent = documentCache.get(document.id);
    if (cachedContent !== undefined) {
      // Update document with cached content
      document.content = cachedContent;
    }
  }, [document]);

  // Implement lazy loading using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Helper function to convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    // Remove the data URL prefix if present
    const base64Data = base64.includes('data:application/pdf;base64,') 
      ? base64.split(',')[1] 
      : base64;
      
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Helper function to create a copy of an ArrayBuffer
  const copyArrayBuffer = (buffer: ArrayBuffer): ArrayBuffer => {
    return buffer.slice(0);
  };

  // Render preview based on file type
  const renderPreview = () => {
    const { type, content, previewUrl } = document;
    
    // Show loading state if not visible yet
    if (!isVisible) {
      return <div className="loading">{t('documents.loading', 'Loading preview...')}</div>;
    }
    
    // Show error if any
    if (error) {
      return (
        <div className="error">
          <p>{t('documents.error', 'Error loading preview: {{error}}', { error })}</p>
        </div>
      );
    }
    
    // Check if content is available
    if (content === undefined || content === null) {
      return (
        <div className="default-preview">
          <p>{t('documents.noContent', 'No content available for preview')}</p>
        </div>
      );
    }
    
    // Normalize file type - handle both extensions and MIME types
    let normalizedType = type.toLowerCase();
    
    // Handle MIME types for Office documents
    if (normalizedType.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      normalizedType = 'docx';
    } else if (normalizedType.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      normalizedType = 'xlsx';
    } else if (normalizedType.includes('vnd.openxmlformats-officedocument.presentationml.presentation')) {
      normalizedType = 'pptx';
    } else if (normalizedType.includes('application/msword')) {
      normalizedType = 'doc';
    } else if (normalizedType.includes('application/vnd.ms-excel')) {
      normalizedType = 'xls';
    } else if (normalizedType.includes('application/vnd.ms-powerpoint')) {
      normalizedType = 'ppt';
    } else if (normalizedType.includes('application/pdf')) {
      normalizedType = 'pdf';
    } else if (normalizedType.includes('text/plain')) {
      normalizedType = 'txt';
    } else if (normalizedType.includes('text/csv')) {
      normalizedType = 'csv';
    } else if (normalizedType.includes('text/markdown')) {
      normalizedType = 'md';
    }
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(normalizedType) && previewUrl) {
      return <ImagePreview url={previewUrl} />;
    }
    
    // PDF files - handle both ArrayBuffer and base64 formats
    if (normalizedType === 'pdf') {
      if (content instanceof ArrayBuffer) {
        // Create a copy of the ArrayBuffer to avoid detached buffer issues
        const bufferCopy = copyArrayBuffer(content);
        return <PDFPreview data={bufferCopy} />;
      } else if (typeof content === 'string' && content.startsWith('data:application/pdf;base64,')) {
        try {
          const arrayBuffer = base64ToArrayBuffer(content);
          return <PDFPreview data={arrayBuffer} />;
        } catch (err) {
          setError('Failed to process PDF data: ' + (err as Error).message);
        }
      } else if (typeof content === 'string' && content.startsWith('JVBERi0')) {
        // PDF files that start with the PDF header in base64
        try {
          const arrayBuffer = base64ToArrayBuffer(content);
          return <PDFPreview data={arrayBuffer} />;
        } catch (err) {
          setError('Failed to process PDF data: ' + (err as Error).message);
        }
      }
    }
    
    // Text files
    if (normalizedType === 'txt' && typeof content === 'string') {
      return <TextPreview content={content} />;
    }
    
    // CSV files
    if (normalizedType === 'csv' && typeof content === 'string') {
      return <CSVPreview content={content} />;
    }
    
    // Markdown files
    if (normalizedType === 'md' && typeof content === 'string') {
      return <MarkdownPreview content={content} />;
    }
    
    // Office documents
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(normalizedType) && content instanceof ArrayBuffer) {
      // Create a copy of the ArrayBuffer to avoid detached buffer issues
      const bufferCopy = copyArrayBuffer(content);
      return <OfficeDocumentPreview content={bufferCopy} type={normalizedType} />;
    }
    
    // Default fallback
    return (
      <div className="default-preview">
        <p>{t('documents.unsupportedFormat', 'Preview not available for this file type')}</p>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="document-container">
      <div className="preview-header">
        <h3>{document.name}</h3>
        <p>{t('documents.fileInfo', 'Type: {{type}} | Size: {{size}} KB | Uploaded: {{date}}', {
          type: document.type.toUpperCase(),
          size: (document.size / 1024).toFixed(1),
          date: document.uploadDate
        })}</p>
      </div>
      <div className="preview-content">
        {renderPreview()}
      </div>
    </div>
  );
};

export default DocumentPreview;