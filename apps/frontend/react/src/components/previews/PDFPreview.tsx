// Import required libraries
import * as pdfjsLib from 'pdfjs-dist';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Import PDF.js worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

// Import cache utility
import { documentCache } from '../../utils/documentCache';

// Set up PDF.js worker using local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFPreviewProps {
  data: ArrayBuffer;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ data }) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null); // Ref to track the current render task
  const pdfRef = useRef<any>(null); // Ref to track the current PDF document
  const pageRef = useRef<any>(null); // Ref to track the current page
  const isRenderingRef = useRef<boolean>(false); // Ref to track if we're currently rendering
  const pendingRenderRef = useRef<{pageNumber: number} | null>(null); // Ref to track pending renders

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
        documentCache.set('pdf-document', data);
        
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

export default PDFPreview;