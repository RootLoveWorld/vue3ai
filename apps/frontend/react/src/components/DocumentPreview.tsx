import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './DocumentPreview.css';

// Import required libraries
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';

// Import PDF.js worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

// Import cache utility
import { documentCache } from '../utils/documentCache';

// Set up PDF.js worker using local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  content?: string | ArrayBuffer | null;
  previewUrl?: string;
}

interface DocumentPreviewProps {
  document: Document;
}

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

  // Image Preview Component with zoom and rotation features
  const ImagePreview: React.FC<{ url: string }> = ({ url }) => {
    const [imageError, setImageError] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showControls, setShowControls] = useState(false);
    const imageRef = React.useRef<HTMLImageElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    if (imageError) {
      return (
        <div className="error">
          <p>{t('documents.error', 'Error loading image preview')}</p>
        </div>
      );
    }

    // Reset view
    const resetView = () => {
      setZoomLevel(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };

    // Zoom in
    const zoomIn = () => {
      setZoomLevel(prev => Math.min(prev + 0.2, 3));
    };

    // Zoom out
    const zoomOut = () => {
      setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    };

    // Rotate left
    const rotateLeft = () => {
      setRotation(prev => (prev - 90) % 360);
    };

    // Rotate right
    const rotateRight = () => {
      setRotation(prev => (prev + 90) % 360);
    };

    // Handle mouse down for dragging
    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    // Handle mouse move for dragging
    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    // Handle mouse up for dragging
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Handle wheel for zooming
    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    };

    // Handle keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!showControls) return;
        
        switch (e.key) {
          case '+':
          case '=':
            zoomIn();
            break;
          case '-':
          case '_':
            zoomOut();
            break;
          case 'r':
            resetView();
            break;
          case 'ArrowLeft':
            rotateLeft();
            break;
          case 'ArrowRight':
            rotateRight();
            break;
          default:
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [showControls, zoomLevel, rotation]);

    return (
      <div 
        className="image-preview-container"
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Image controls */}
        {showControls && (
          <div 
            className="image-controls"
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '4px',
              padding: '8px',
              display: 'flex',
              gap: '5px'
            }}
          >
            <button 
              onClick={zoomIn}
              style={{
                background: 'none',
                border: '1px solid white',
                color: 'white',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
              title={t('documents.zoomIn', 'Zoom In')}
            >
              +
            </button>
            <button 
              onClick={zoomOut}
              style={{
                background: 'none',
                border: '1px solid white',
                color: 'white',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
              title={t('documents.zoomOut', 'Zoom Out')}
            >
              -
            </button>
            <button 
              onClick={rotateLeft}
              style={{
                background: 'none',
                border: '1px solid white',
                color: 'white',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
              title={t('documents.rotateLeft', 'Rotate Left')}
            >
              ↶
            </button>
            <button 
              onClick={rotateRight}
              style={{
                background: 'none',
                border: '1px solid white',
                color: 'white',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
              title={t('documents.rotateRight', 'Rotate Right')}
            >
              ↷
            </button>
            <button 
              onClick={resetView}
              style={{
                background: 'none',
                border: '1px solid white',
                color: 'white',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
              title={t('documents.reset', 'Reset View')}
            >
              ↻
            </button>
          </div>
        )}

        {/* Zoom level indicator */}
        {showControls && (
          <div 
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '12px'
            }}
          >
            {Math.round(zoomLevel * 100)}%
          </div>
        )}

        {/* Image */}
        <img 
          ref={imageRef}
          src={url} 
          alt={document.name} 
          onError={() => setImageError(true)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            maxWidth: 'none',
            maxHeight: 'none',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        />
      </div>
    );
  };

  // PDF Preview Component
  const PDFPreview: React.FC<{ data: ArrayBuffer }> = ({ data }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const renderTaskRef = React.useRef<any>(null); // Ref to track the current render task
    const pdfRef = React.useRef<any>(null); // Ref to track the current PDF document
    const pageRef = React.useRef<any>(null); // Ref to track the current page
    const isRenderingRef = React.useRef<boolean>(false); // Ref to track if we're currently rendering
    const pendingRenderRef = React.useRef<{pageNumber: number} | null>(null); // Ref to track pending renders

    // Cleanup function to cancel any ongoing operations
    const cleanup = () => {
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // Ignore cancellation errors
        }
        renderTaskRef.current = null;
      }
      
      // Clear page reference
      pageRef.current = null;
      
      // Clear rendering state
      isRenderingRef.current = false;
      pendingRenderRef.current = null;
    };

    useEffect(() => {
      // Cancel any ongoing render task when component unmounts
      return () => {
        cleanup();
        pdfRef.current = null;
      };
    }, []);

    // Render a specific page
    const renderPage = async (pdf: any, pageNum: number) => {
      try {
        // If we're already rendering, queue this request
        if (isRenderingRef.current) {
          pendingRenderRef.current = { pageNumber: pageNum };
          return;
        }
        
        // Set rendering flag
        isRenderingRef.current = true;
        pendingRenderRef.current = null;
        
        // Cancel any ongoing render task
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // Ignore cancellation errors
          }
          renderTaskRef.current = null;
        }
        
        // Get the page
        const page = await pdf.getPage(pageNum);
        pageRef.current = page; // Store reference to page
        
        // Setup viewport
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Setup canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            
            // Render the page
            renderTaskRef.current = page.render(renderContext);
            await renderTaskRef.current.promise;
            
            // Clear the render task reference after completion
            renderTaskRef.current = null;
          }
        }
        
        // Clear rendering flag
        isRenderingRef.current = false;
        
        // Check if there's a pending render request
        const pending = pendingRenderRef.current;
        if (pending && typeof pending === 'object' && 'pageNumber' in pending) {
          pendingRenderRef.current = null;
          await renderPage(pdf, (pending as {pageNumber: number}).pageNumber);
        }
      } catch (err) {
        // Clear rendering flag on error
        isRenderingRef.current = false;
        pendingRenderRef.current = null;
        
        // Re-throw the error to be caught by the caller
        throw err;
      }
    };

    useEffect(() => {
      const loadPDF = async () => {
        try {
          setLoading(true);
          setPdfError(null);
          
          // Cleanup any previous operations
          cleanup();
          
          // Create a copy of the ArrayBuffer to avoid detached buffer issues
          const dataCopy = data.slice(0);
          
          // Cache the content (using the original data to avoid caching duplicated data)
          documentCache.set(document.id, data);
          
          // Load the PDF document
          const pdf = await pdfjsLib.getDocument({ data: dataCopy }).promise;
          pdfRef.current = pdf; // Store reference to PDF document
          setNumPages(pdf.numPages);
          
          // Render the current page
          await renderPage(pdf, pageNumber);
          
          setLoading(false);
        } catch (err) {
          // Check if the error is due to a cancelled task
          if ((err as any).name === 'RenderingCancelledException') {
            // This is expected when we cancel a render task, so we don't treat it as an error
            console.log('PDF rendering was cancelled');
            return;
          }
          
          console.error('PDF loading error:', err);
          const errorMessage = (err as Error).message || 'Unknown error';
          
          // Provide more specific error messages
          if (errorMessage.includes('worker')) {
            setPdfError('Failed to initialize PDF worker. Please check your network connection and try again.');
          } else if (errorMessage.includes('Invalid PDF')) {
            setPdfError('Invalid PDF file format. The file may be corrupted or not a valid PDF.');
          } else if (errorMessage.includes('detached')) {
            setPdfError('PDF data has been detached. This usually happens when the same data is used multiple times. Please try again.');
          } else if (errorMessage.includes('canvas')) {
            setPdfError('Cannot render PDF on canvas. This usually happens when trying to render multiple pages simultaneously. Please try again.');
          } else {
            setPdfError(`Failed to load PDF: ${errorMessage}`);
          }
          
          // Clear rendering flag on error
          isRenderingRef.current = false;
          pendingRenderRef.current = null;
          
          setLoading(false);
        }
      };

      loadPDF();
      
      // Cleanup when effect re-runs
      return () => {
        cleanup();
      };
    }, [data]);

    // Effect for handling page changes
    useEffect(() => {
      if (pdfRef.current && !loading) {
        renderPage(pdfRef.current, pageNumber).catch((err) => {
          // Handle render errors
          if ((err as any).name !== 'RenderingCancelledException') {
            console.error('PDF page rendering error:', err);
            const errorMessage = (err as Error).message || 'Unknown error';
            setPdfError(`Failed to render page: ${errorMessage}`);
          }
        });
      }
    }, [pageNumber, loading]);

    // Navigate to a specific page
    const navigatePage = (newPageNumber: number) => {
      if (newPageNumber >= 1 && newPageNumber <= (numPages || 0)) {
        setPageNumber(newPageNumber);
      }
    };

    if (pdfError) {
      return (
        <div className="error">
          <p>{t('documents.error', 'Error loading PDF: {{error}}', { error: pdfError })}</p>
          <p>{t('documents.pdfFallback', 'Try downloading the file to view it locally.')}</p>
        </div>
      );
    }

    return (
      <div className="pdf-preview">
        {loading && <div className="loading">{t('documents.loading', 'Loading PDF...')}</div>}
        <canvas ref={canvasRef} />
        {numPages && (
          <div className="pdf-navigation">
            <button 
              onClick={() => navigatePage(pageNumber - 1)} 
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <span>Page {pageNumber} of {numPages}</span>
            <button 
              onClick={() => navigatePage(pageNumber + 1)} 
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  // Text Preview Component
  const TextPreview: React.FC<{ content: string }> = ({ content }) => {
    const [textError, setTextError] = useState<string | null>(null);
    
    useEffect(() => {
      // Cache the content
      documentCache.set(document.id, content);
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

  // CSV Preview Component
  const CSVPreview: React.FC<{ content: string }> = ({ content }) => {
    const [tableData, setTableData] = useState<string[][]>([]);
    const [csvError, setCsvError] = useState<string | null>(null);

    useEffect(() => {
      try {
        setCsvError(null);
        const lines = content.split('\n');
        const data = lines.map(line => {
          // Simple CSV parsing (doesn't handle quoted fields)
          return line.split(',').map(cell => cell.trim());
        });
        setTableData(data);
        
        // Cache the content
        documentCache.set(document.id, content);
      } catch (err) {
        setCsvError('Failed to parse CSV: ' + (err as Error).message);
      }
    }, [content]);

    if (csvError) {
      return (
        <div className="error">
          <p>{t('documents.error', 'Error parsing CSV: {{error}}', { error: csvError })}</p>
        </div>
      );
    }

    return (
      <div className="csv-preview">
        <table>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Markdown Preview Component
  const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
    const [markdownError, setMarkdownError] = useState<string | null>(null);
    
    useEffect(() => {
      // Cache the content
      documentCache.set(document.id, content);
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

  // Office Document Preview Component
  const OfficeDocumentPreview: React.FC<{ content: ArrayBuffer; type: string }> = ({ content, type }) => {
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
                <p>{t('documents.documentPreview', 'Document preview for {{name}}', { name: document.name })}</p>
                <p>{t('documents.downloadPrompt', 'Download the file to view its contents')}</p>
              </div>
            );
          }
          
          // Cache the original content
          documentCache.set(document.id, content);
          
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