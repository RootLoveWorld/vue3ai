import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const GsapScrollExample: React.FC = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered animations
  useGSAP(() => {
    // Pin section
    if (pinRef.current) {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=1000",
        pin: true,
        pinSpacing: true
      });
    }

    // Progress bar animation
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "100%",
        scrollTrigger: {
          trigger: progressRef.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5
        }
      });
    }

    // Animate each section
    sectionRefs.current.forEach((section, index) => {
      if (section) {
        // Fade in animation
        gsap.from(section.querySelector('.content'), {
          opacity: 0,
          y: 50,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        });

        // Parallax effect
        gsap.from(section.querySelector('.parallax-element'), {
          y: 100,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    });
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1>GSAP Scroll-Triggered Animations</h1>
      <p>Scroll down to see animations triggered by scroll position</p>
      
      {/* Progress bar */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '5px', 
        backgroundColor: '#ecf0f1',
        zIndex: 1000
      }}>
        <div 
          ref={progressRef}
          style={{ 
            height: '100%', 
            backgroundColor: '#3498db', 
            width: '0%' 
          }}
        />
      </div>

      {/* Pinned section */}
      <div 
        ref={pinRef}
        style={{
          height: '100vh',
          backgroundColor: '#9b59b6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}
      >
        <div>
          <h2>Pinned Section</h2>
          <p>This section stays pinned while you scroll</p>
        </div>
      </div>

      {/* Scroll sections */}
      {[1, 2, 3, 4, 5].map((item, index) => (
        <div
          key={item}
          ref={el => { sectionRefs.current[index] = el; }}
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#bdc3c7'
          }}
        >
          <div 
            className="parallax-element"
            style={{
              position: 'absolute',
              top: '20%',
              left: index % 2 === 0 ? '10%' : '80%',
              width: '100px',
              height: '100px',
              backgroundColor: '#e74c3c',
              borderRadius: '50%',
              zIndex: 10
            }}
          />
          
          <div 
            className="content"
            style={{
              textAlign: 'center',
              zIndex: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '40px',
              borderRadius: '10px',
              maxWidth: '600px'
            }}
          >
            <h2>Section {item}</h2>
            <p>
              This is section {item}. As you scroll, you'll see fade-in animations 
              and parallax effects. The progress bar at the top shows your scroll progress.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      ))}

      <div style={{ 
        height: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#2c3e50',
        color: 'white'
      }}>
        <h2>End of Scroll Example</h2>
      </div>
    </div>
  );
};

export default GsapScrollExample;