import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ModalImagePreview from './ModalImagePreview';

interface ImagePreviewProps {
  url: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ url }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    <>
      <div 
        className="image-preview-container"
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={() => setShowModal(true)}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'pointer'
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
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
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
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
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
              onClick={(e) => { e.stopPropagation(); rotateLeft(); }}
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
              onClick={(e) => { e.stopPropagation(); rotateRight(); }}
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
              onClick={(e) => { e.stopPropagation(); resetView(); }}
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
          alt="Document preview" 
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
            cursor: isDragging ? 'grabbing' : 'pointer'
          }}
        />
      </div>

      {/* Modal Image Preview */}
      {showModal && (
        <ModalImagePreview 
          url={url} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default ImagePreview;