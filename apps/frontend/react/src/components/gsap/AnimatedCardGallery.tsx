import React from 'react';
import AnimatedCard from './AnimatedCard';

const AnimatedCardGallery: React.FC = () => {
  const cardData = [
    {
      title: "Smooth Animations",
      description: "GSAP provides incredibly smooth animations that run at 60fps, ensuring a buttery-smooth experience for your users across all devices."
    },
    {
      title: "Timeline Control",
      description: "Create complex sequenced animations with precise control over timing, easing, and synchronization using GSAP's powerful timeline features."
    },
    {
      title: "Scroll Trigger",
      description: "Trigger animations based on scroll position with ScrollTrigger plugin, creating engaging scroll-based experiences effortlessly."
    },
    {
      title: "Cross-Browser",
      description: "GSAP works consistently across all major browsers and devices, ensuring your animations look great everywhere."
    },
    {
      title: "Performance Optimized",
      "description": "Built with performance in mind, GSAP animations are optimized to minimize layout thrashing and maximize rendering efficiency."
    },
    {
      title: "Extensive Plugins",
      description: "Extend GSAP's functionality with a rich ecosystem of plugins for drawing SVG, morphing shapes, and much more."
    }
  ];

  return (
    <div style={{ 
      padding: '40px 20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <header style={{ 
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          color: '#2c3e50',
          fontSize: '2.5rem',
          marginBottom: '10px'
        }}>
          GSAP React Animation Gallery
        </h1>
        <p style={{ 
          color: '#7f8c8d',
          fontSize: '1.2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Interactive cards demonstrating the power of @gsap/react
        </p>
      </header>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {cardData.map((card, index) => (
          <AnimatedCard
            key={index}
            title={card.title}
            description={card.description}
            delay={index * 0.1}
          />
        ))}
      </div>

      <footer style={{
        textAlign: 'center',
        marginTop: '60px',
        padding: '20px',
        color: '#7f8c8d'
      }}>
        <p>Built with @gsap/react and React</p>
      </footer>
    </div>
  );
};

export default AnimatedCardGallery;