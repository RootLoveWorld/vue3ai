import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import DocumentPreview from '../DocumentPreview';
import { Document } from '../previews/types';

// Sample documents data
const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Vacation Photo.jpg',
    type: 'image/jpeg',
    size: 1024000,
    uploadDate: '2023-06-15',
    previewUrl: 'https://picsum.photos/seed/vacation/800/600'
  },
  {
    id: '2',
    name: 'Project Report.pdf',
    type: 'application/pdf',
    size: 2048000,
    uploadDate: '2023-06-10',
    content: 'JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDEwOCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE3OAolJUVPRg=='
  },
  {
    id: '3',
    name: 'Financial Data.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 512000,
    uploadDate: '2023-06-05',
    content: new ArrayBuffer(100)
  },
  {
    id: '4',
    name: 'Meeting Notes.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 256000,
    uploadDate: '2023-06-01',
    content: new ArrayBuffer(100)
  }
];

const GsapDocumentShowcase: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document>(sampleDocuments[0]);
  const [isGridView, setIsGridView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Animate the entire showcase when it mounts
  useGSAP(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, []);

  // Animate document selection
  const selectDocument = (doc: Document) => {
    // Animate out the current view
    const currentView = isGridView ? gridRef.current : detailRef.current;
    
    if (currentView) {
      gsap.to(currentView, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        onComplete: () => {
          setSelectedDocument(doc);
          
          // Animate in the new view
          const newView = isGridView ? gridRef.current : detailRef.current;
          if (newView) {
            gsap.fromTo(newView,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
            );
          }
        }
      });
    } else {
      setSelectedDocument(doc);
    }
  };

  // Toggle between grid and detail view with animation
  const toggleView = () => {
    const currentView = isGridView ? gridRef.current : detailRef.current;
    
    if (currentView) {
      gsap.to(currentView, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          setIsGridView(!isGridView);
          
          // Animate in the new view
          setTimeout(() => {
            const newView = !isGridView ? gridRef.current : detailRef.current;
            if (newView) {
              gsap.fromTo(newView,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
              );
            }
          }, 50);
        }
      });
    } else {
      setIsGridView(!isGridView);
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <h1 style={{ 
          color: '#2c3e50',
          marginBottom: '10px'
        }}>
          GSAP Document Showcase
        </h1>
        <p style={{ 
          color: '#7f8c8d',
          fontSize: '1.1rem'
        }}>
          Animated document preview with smooth transitions
        </p>
      </header>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '30px',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={toggleView}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              backgroundColor: '#2980b9',
              scale: 1.05,
              duration: 0.2
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              backgroundColor: '#3498db',
              scale: 1,
              duration: 0.2
            });
          }}
        >
          Toggle View ({isGridView ? 'Grid' : 'Detail'})
        </button>
        
        <button
          onClick={() => {
            // Animate all documents with a staggered bounce effect
            if (gridRef.current) {
              gsap.from(gridRef.current.children, {
                y: -50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "bounce.out"
              });
            }
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Animate All
        </button>
      </div>

      {/* Document Grid View */}
      {isGridView && (
        <div 
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}
        >
          {sampleDocuments.map((doc, index) => (
            <div
              key={doc.id}
              onClick={() => selectDocument(doc)}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedDocument.id === doc.id ? '2px solid #3498db' : 'none'
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -10,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  duration: 0.3
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  duration: 0.3
                });
              }}
            >
              <div style={{ 
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#3498db',
                  borderRadius: '10px',
                  margin: '0 auto 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {doc.type.includes('image') ? '🖼️' : 
                   doc.type.includes('pdf') ? '📄' : 
                   doc.type.includes('sheet') ? '📊' : '📝'}
                </div>
                <h3 style={{ 
                  margin: '0 0 10px 0',
                  color: '#2c3e50',
                  fontSize: '1.1rem'
                }}>
                  {doc.name}
                </h3>
                <p style={{ 
                  color: '#7f8c8d',
                  fontSize: '0.9rem',
                  margin: '5px 0'
                }}>
                  {doc.type.split('/').pop()?.toUpperCase()}
                </p>
                <p style={{ 
                  color: '#95a5a6',
                  fontSize: '0.8rem'
                }}>
                  {(doc.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Detail View */}
      {!isGridView && (
        <div 
          ref={detailRef}
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            padding: '30px',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{ 
              margin: 0,
              color: '#2c3e50'
            }}>
              {selectedDocument.name}
            </h2>
            <button
              onClick={() => setIsGridView(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ecf0f1',
                color: '#2c3e50',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← Back to Grid
            </button>
          </div>
          
          <div style={{ 
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '15px'
            }}>
              <div>
                <p style={{ 
                  color: '#7f8c8d',
                  fontSize: '0.9rem',
                  margin: '0 0 5px 0'
                }}>
                  File Type
                </p>
                <p style={{ 
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  {selectedDocument.type.split('/').pop()?.toUpperCase()}
                </p>
              </div>
              <div>
                <p style={{ 
                  color: '#7f8c8d',
                  fontSize: '0.9rem',
                  margin: '0 0 5px 0'
                }}>
                  File Size
                </p>
                <p style={{ 
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  {(selectedDocument.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <div>
                <p style={{ 
                  color: '#7f8c8d',
                  fontSize: '0.9rem',
                  margin: '0 0 5px 0'
                }}>
                  Upload Date
                </p>
                <p style={{ 
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  {selectedDocument.uploadDate}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ 
            border: '1px solid #ecf0f1',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <DocumentPreview document={selectedDocument} />
          </div>
        </div>
      )}

      {/* Navigation Thumbnails */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        marginTop: '30px',
        flexWrap: 'wrap'
      }}>
        {sampleDocuments.map((doc) => (
          <div
            key={`thumb-${doc.id}`}
            onClick={() => selectDocument(doc)}
            style={{
              width: '70px',
              height: '70px',
              backgroundColor: selectedDocument.id === doc.id ? '#3498db' : '#ecf0f1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: selectedDocument.id === doc.id ? 'white' : '#7f8c8d',
              fontSize: '24px'
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.1,
                duration: 0.2
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                duration: 0.2
              });
            }}
          >
            {doc.type.includes('image') ? '🖼️' : 
             doc.type.includes('pdf') ? '📄' : 
             doc.type.includes('sheet') ? '📊' : '📝'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GsapDocumentShowcase;