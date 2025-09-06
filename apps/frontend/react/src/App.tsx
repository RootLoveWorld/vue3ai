import React, { useState } from 'react';
import DocumentPreview from './components/DocumentPreview';
import AnimatedDocumentPreview from './components/AnimatedDocumentPreview';
import { GsapDemo, GsapDocumentShowcase } from './components';
import { Document } from './components/previews/types';

// Sample document data for testing
const sampleDocument: Document = {
  id: '1',
  name: 'sample-image.jpg',
  type: 'image/jpeg',
  size: 1024000,
  uploadDate: '2023-01-01',
  previewUrl: 'https://picsum.photos/800/600?random=1'
};

const samplePdfDocument: Document = {
  id: '2',
  name: 'sample-document.pdf',
  type: 'application/pdf',
  size: 2048000,
  uploadDate: '2023-01-02',
  content: 'JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDEwOCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE3OAolJUVPRg=='
};

function App() {
  return (
    <div className="App">
      {/* App is now handled by React Router */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '20px',
        backgroundColor: '#f5f5f5',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setActiveTab('documents')}
          style={{
            padding: '10px 20px',
            margin: '5px 10px',
            backgroundColor: activeTab === 'documents' ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Document Preview
        </button>
        <button 
          onClick={() => setActiveTab('animated')}
          style={{
            padding: '10px 20px',
            margin: '5px 10px',
            backgroundColor: activeTab === 'animated' ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Animated Preview
        </button>
        <button 
          onClick={() => {
            setActiveTab('documents');
            setCurrentDocument(sampleDocument);
          }}
          style={{
            padding: '10px 20px',
            margin: '5px 10px',
            backgroundColor: currentDocument.id === sampleDocument.id && activeTab === 'documents' ? '#28a745' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Image Document
        </button>
        <button 
          onClick={() => {
            setActiveTab('documents');
            setCurrentDocument(samplePdfDocument);
          }}
          style={{
            padding: '10px 20px',
            margin: '5px 10px',
            backgroundColor: currentDocument.id === samplePdfDocument.id && activeTab === 'documents' ? '#28a745' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          PDF Document
        </button>
        <button 
          onClick={() => setActiveTab('gsap')}
          style={{
            padding: '10px 20px',
            margin: '5px 10px',
            backgroundColor: activeTab === 'gsap' ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          GSAP Examples
        </button>
        <button 
          onClick={() => setActiveTab('showcase')}
          style={{
            padding: '10px 20px',
            margin: '5px 10px',
            backgroundColor: activeTab === 'showcase' ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          GSAP Showcase
        </button>
      </nav>

      <div style={{ padding: '20px' }}>
        {activeTab === 'documents' && (
          <div>
            <h1>Document Preview Demo</h1>
            <DocumentPreview document={currentDocument} />
          </div>
        )}
        
        {activeTab === 'animated' && (
          <div>
            <h1>Animated Document Preview</h1>
            <AnimatedDocumentPreview document={currentDocument} />
          </div>
        )}
        
        {activeTab === 'gsap' && <GsapDemo />}
        
        {activeTab === 'showcase' && <GsapDocumentShowcase />}
      </div>
    </div>
  );
}

export default App;