import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const GsapTimelineExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Advanced timeline example
  useGSAP(() => {
    if (containerRef.current) {
      // Create a timeline
      const tl = gsap.timeline({ 
        defaults: { duration: 0.8, ease: "power2.out" },
        repeat: -1,
        repeatDelay: 0.5
      });

      // Add animations to the timeline
      tl.from(elementsRef.current[0], { 
        x: -200, 
        opacity: 0, 
        scale: 0.5 
      })
      .from(elementsRef.current[1], { 
        y: -200, 
        opacity: 0, 
        rotation: 180 
      }, "-=0.4")
      .from(elementsRef.current[2], { 
        x: 200, 
        opacity: 0, 
        borderRadius: 0 
      }, "-=0.4")
      .from(elementsRef.current[3], { 
        y: 200, 
        opacity: 0, 
        scale: 2 
      }, "-=0.4")
      .to(elementsRef.current, { 
        backgroundColor: "#e74c3c",
        stagger: 0.1
      })
      .to(elementsRef.current, { 
        backgroundColor: "#3498db",
        stagger: 0.1
      })
      .to(elementsRef.current, { 
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        borderRadius: "10px",
        stagger: 0.1
      });

      // Store timeline in ref for control
      (containerRef.current as any).timeline = tl;
    }
  }, []);

  const pauseTimeline = () => {
    if (containerRef.current && (containerRef.current as any).timeline) {
      (containerRef.current as any).timeline.pause();
    }
  };

  const resumeTimeline = () => {
    if (containerRef.current && (containerRef.current as any).timeline) {
      (containerRef.current as any).timeline.resume();
    }
  };

  const reverseTimeline = () => {
    if (containerRef.current && (containerRef.current as any).timeline) {
      (containerRef.current as any).timeline.reverse();
    }
  };

  const restartTimeline = () => {
    if (containerRef.current && (containerRef.current as any).timeline) {
      (containerRef.current as any).timeline.restart();
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <h1>GSAP Timeline Example</h1>
      <p>Complex sequenced animations with timeline control</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        margin: '40px 0',
        minHeight: '300px'
      }}>
        {[1, 2, 3, 4].map((item, index) => (
          <div
            key={item}
            ref={el => { elementsRef.current[index] = el; }}
            style={{
              width: '150px',
              height: '150px',
              backgroundColor: '#3498db',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px',
              margin: '0 auto'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={pauseTimeline}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Pause
        </button>
        <button 
          onClick={resumeTimeline}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Resume
        </button>
        <button 
          onClick={reverseTimeline}
          style={{
            padding: '10px 20px',
            backgroundColor: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reverse
        </button>
        <button 
          onClick={restartTimeline}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default GsapTimelineExample;