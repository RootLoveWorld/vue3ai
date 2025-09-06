import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalImagePreviewProps {
  url: string;
  onClose: () => void;
}

const ModalImagePreview: React.FC<ModalImagePreviewProps> = ({ url, onClose }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (e.button !== 0) return; // Only left mouse button
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
      // Close modal with Escape key
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
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
        case 'R':
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
  }, [zoomLevel, rotation, onClose]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && e.target === containerRef.current) {
        onClose();
      }
    };

    const handleContainerRef = containerRef.current;
    if (handleContainerRef) {
      handleContainerRef.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (handleContainerRef) {
        handleContainerRef.removeEventListener('click', handleClickOutside);
      }
    };
  }, [onClose]);

  if (imageError) {
    return (
      <div className="modal-overlay" ref={containerRef}>
        <div className="modal-content">
          <div className="modal-header">
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="error">
            <p>{t('documents.error', 'Error loading image preview')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" ref={containerRef}>
      <div className="modal-content">
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {/* Image controls */}
        <div className="modal-controls">
          <button 
            onClick={zoomIn}
            className="control-button"
            title={t('documents.zoomIn', 'Zoom In')}
          >
            +
          </button>
          <button 
            onClick={zoomOut}
            className="control-button"
            title={t('documents.zoomOut', 'Zoom Out')}
          >
            -
          </button>
          <button 
            onClick={rotateLeft}
            className="control-button"
            title={t('documents.rotateLeft', 'Rotate Left')}
          >
            ↶
          </button>
          <button 
            onClick={rotateRight}
            className="control-button"
            title={t('documents.rotateRight', 'Rotate Right')}
          >
            ↷
          </button>
          <button 
            onClick={resetView}
            className="control-button"
            title={t('documents.reset', 'Reset View')}
          >
            ↻
          </button>
        </div>

        {/* Zoom level indicator */}
        <div className="zoom-indicator">
          {Math.round(zoomLevel * 100)}%
        </div>

        {/* Image container */}
        <div 
          className="modal-image-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img 
            ref={imageRef}
            src={url} 
            alt="Document preview" 
            onError={() => setImageError(true)}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease',
              cursor: isDragging ? 'grabbing' : 'grab',
              maxWidth: 'none',
              maxHeight: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalImagePreview;