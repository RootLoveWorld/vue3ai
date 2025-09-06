import React, { useState } from 'react';
import GsapExamples from './GsapExamples';
import GsapTimelineExample from './GsapTimelineExample';
import GsapScrollExample from './GsapScrollExample';

const GsapDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState<'basic' | 'timeline' | 'scroll'>('basic');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>GSAP React Examples</h1>
        <p>Demonstrating various animation techniques with @gsap/react</p>
      </header>

      <nav style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '20px',
        backgroundColor: '#ecf0f1',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setActiveExample('basic')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: activeExample === 'basic' ? '#3498db' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Basic Animations
        </button>
        <button 
          onClick={() => setActiveExample('timeline')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: activeExample === 'timeline' ? '#3498db' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Timeline Animations
        </button>
        <button 
          onClick={() => setActiveExample('scroll')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: activeExample === 'scroll' ? '#3498db' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Scroll Animations
        </button>
      </nav>

      <main style={{ padding: '20px' }}>
        {activeExample === 'basic' && <GsapExamples />}
        {activeExample === 'timeline' && <GsapTimelineExample />}
        {activeExample === 'scroll' && <GsapScrollExample />}
      </main>

      <footer style={{ 
        backgroundColor: '#34495e', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p>GSAP React Examples - Using @gsap/react v2.1.2</p>
      </footer>
    </div>
  );
};

export default GsapDemo;