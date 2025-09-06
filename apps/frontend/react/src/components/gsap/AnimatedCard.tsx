import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface AnimatedCardProps {
  title: string;
  description: string;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  title, 
  description, 
  delay = 0 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Initial animation when component mounts
  useGSAP(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay,
        ease: "power2.out"
      });
    }
  }, []);

  // Toggle animation
  const toggleExpand = () => {
    if (cardRef.current) {
      if (isExpanded) {
        // Collapse animation
        gsap.to(cardRef.current, {
          height: '200px',
          duration: 0.5,
          ease: "power2.inOut"
        });
      } else {
        // Expand animation
        gsap.to(cardRef.current, {
          height: '300px',
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
      setIsExpanded(!isExpanded);
    }
  };

  // Hover animation
  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggleExpand}
      style={{
        width: '300px',
        height: isExpanded ? '300px' : '200px',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        margin: '20px',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <h3 style={{ 
        margin: '0 0 15px 0', 
        color: '#2c3e50',
        fontSize: '1.5rem'
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: '#7f8c8d',
        lineHeight: '1.6',
        flex: 1,
        overflow: 'hidden'
      }}>
        {description}
      </p>
      
      <div style={{ 
        marginTop: 'auto',
        textAlign: 'right',
        color: '#3498db',
        fontWeight: 'bold',
        fontSize: '0.9rem'
      }}>
        {isExpanded ? 'Click to collapse' : 'Click to expand'}
      </div>
    </div>
  );
};

export default AnimatedCard;