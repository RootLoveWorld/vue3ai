import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const GsapExamples: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);
  const staggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<SVGSVGElement>(null);

  // Example 1: Basic animation with useGSAP
  useGSAP(() => {
    if (boxRef.current) {
      gsap.from(boxRef.current, {
        x: -100,
        rotation: 360,
        duration: 2,
        ease: "bounce.out"
      });
    }
  }, []);

  // Example 2: Staggered animations
  useGSAP(() => {
    if (staggerRef.current) {
      gsap.from(staggerRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out"
      });
    }
  }, []);

  // Example 3: Text animation
  useGSAP(() => {
    if (textRef.current) {
      const text = textRef.current;
      const characters = text.textContent?.split('') || [];
      text.innerHTML = characters.map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
      
      gsap.from(text.children, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
      });
    }
  }, []);

  // Toggle visibility animation
  const toggleVisibility = () => {
    if (boxRef.current) {
      if (isVisible) {
        gsap.to(boxRef.current, {
          x: 200,
          rotation: 180,
          scale: 0.5,
          duration: 0.5,
          ease: "power2.inOut"
        });
      } else {
        gsap.to(boxRef.current, {
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
      setIsVisible(!isVisible);
    }
  };

  // Staggered button animation
  const animateStagger = () => {
    if (staggerRef.current) {
      gsap.to(staggerRef.current.children, {
        x: gsap.utils.random(-50, 50),
        rotation: gsap.utils.random(-45, 45),
        duration: 0.8,
        stagger: 0.1,
        ease: "elastic.out(1, 0.3)"
      });
    }
  };

  // Reset all animations
  const resetAnimations = () => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 0.5
      });
      setIsVisible(true);
    }
    
    if (staggerRef.current) {
      gsap.to(staggerRef.current.children, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1
      });
    }
    
    if (textRef.current) {
      const text = textRef.current;
      const characters = text.textContent?.split('') || [];
      text.innerHTML = characters.map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
      
      gsap.from(text.children, {
        opacity: 0,
        y: 50,
        duration: 0.1,
        stagger: 0.02
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>GSAP React Examples</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>1. Basic Animation</h2>
        <div 
          ref={boxRef} 
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#3498db',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            margin: '20px 0'
          }}
        >
          Box
        </div>
        <button onClick={toggleVisibility}>
          {isVisible ? 'Animate Out' : 'Animate In'}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>2. Staggered Animations</h2>
        <div 
          ref={staggerRef} 
          style={{ 
            display: 'flex', 
            gap: '10px', 
            margin: '20px 0',
            flexWrap: 'wrap'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#e74c3c',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <button onClick={animateStagger}>Animate Staggered</button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>3. Text Animation</h2>
        <div 
          ref={textRef}
          style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '20px 0',
            minHeight: '40px'
          }}
        >
          Animated Text
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>4. SVG Morphing</h2>
        <svg 
          ref={morphRef}
          width="200" 
          height="200" 
          viewBox="0 0 200 200"
          style={{ margin: '20px 0' }}
        >
          <circle 
            cx="100" 
            cy="100" 
            r="50" 
            fill="#9b59b6" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (morphRef.current) {
                gsap.to(morphRef.current.querySelector('circle'), {
                  attr: { r: gsap.utils.random(30, 70) },
                  duration: 0.5,
                  ease: "elastic.out(1, 0.3)"
                });
              }
            }}
          />
        </svg>
        <p>Click the circle to morph it</p>
      </div>

      <div>
        <button 
          onClick={resetAnimations}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reset All Animations
        </button>
      </div>
    </div>
  );
};

export default GsapExamples;