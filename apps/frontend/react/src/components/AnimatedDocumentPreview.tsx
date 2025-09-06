import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import DocumentPreview from './DocumentPreview';
import { Document } from './previews/types';

interface AnimatedDocumentPreviewProps {
  document: Document;
}

const AnimatedDocumentPreview: React.FC<AnimatedDocumentPreviewProps> = ({ document }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate the document preview when it mounts
  useGSAP(() => {
    if (containerRef.current) {
      // Initial state - hidden and scaled down
      gsap.set(containerRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50
      });

      // Animate in
      gsap.to(containerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, []);

  // Hover animation
  const handleMouseEnter = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1.02,
        y: -5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        cursor: 'pointer'
      }}
    >
      <DocumentPreview document={document} />
    </div>
  );
};

export default AnimatedDocumentPreview;