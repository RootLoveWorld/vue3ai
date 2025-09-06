# GSAP React Examples

This directory contains several examples demonstrating how to use GSAP with React using the `@gsap/react` package.

## Components

### 1. GsapExamples.tsx
Basic animations using the `useGSAP` hook:
- Simple element animations
- Staggered animations
- Text animations
- SVG morphing
- Animation controls

### 2. GsapTimelineExample.tsx
Advanced timeline animations:
- Sequenced animations
- Timeline controls (play, pause, reverse, restart)
- Repeat animations

### 3. GsapScrollExample.tsx
Scroll-triggered animations:
- ScrollTrigger plugin usage
- Pinning elements
- Progress indicators
- Parallax effects

### 4. AnimatedCard.tsx
A reusable animated card component:
- Mount animations
- Hover effects
- Click interactions
- Expand/collapse animations

### 5. AnimatedCardGallery.tsx
A gallery showcasing multiple animated cards with staggered animations.

### 6. GsapDemo.tsx
A demo page that showcases all the examples in a single interface.

## Usage

### Basic Animation
```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function MyComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (elementRef.current) {
      gsap.from(elementRef.current, {
        x: -100,
        opacity: 0,
        duration: 1
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  return <div ref={elementRef}>Hello GSAP!</div>;
}
```

### Timeline Animation
```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function TimelineComponent() {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(elementsRef.current[0], { opacity: 0, y: 20 })
      .from(elementsRef.current[1], { opacity: 0, y: 20 }, "-=0.3")
      .from(elementsRef.current[2], { opacity: 0, y: 20 }, "-=0.3");

  }, []);

  return (
    <div>
      <div ref={el => elementsRef.current[0] = el}>Element 1</div>
      <div ref={el => elementsRef.current[1] = el}>Element 2</div>
      <div ref={el => elementsRef.current[2] = el}>Element 3</div>
    </div>
  );
}
```

### Scroll-Triggered Animation
```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

function ScrollComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (elementRef.current) {
      gsap.from(elementRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    }
  }, []);

  return <div ref={elementRef}>Scroll to see me animate!</div>;
}
```

## Key Features Demonstrated

1. **useGSAP Hook**: A drop-in replacement for React's `useLayoutEffect` that automatically handles cleanup of GSAP animations.

2. **Staggered Animations**: Animating multiple elements with a time delay between each.

3. **Timeline Control**: Creating complex sequences of animations with precise timing control.

4. **ScrollTrigger Integration**: Triggering animations based on scroll position.

5. **Performance Optimization**: Proper cleanup and efficient animation patterns.

6. **Reusable Components**: Creating animated components that can be used throughout your application.

## Installation

The required dependencies are already included in the project:
- `gsap`: The core GSAP library
- `@gsap/react`: React-specific tools for GSAP

## Browser Support

GSAP works in all major browsers including Chrome, Firefox, Safari, Edge, and mobile browsers.

## Documentation

For more information, visit:
- [GSAP Documentation](https://gsap.com/docs/)
- [@gsap/react Documentation](https://github.com/greensock/react)