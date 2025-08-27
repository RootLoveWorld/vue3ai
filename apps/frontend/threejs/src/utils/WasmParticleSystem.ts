export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  size: number;
  r: number;
  g: number;
  b: number;
  a: number;
  twinkle: number;
  pulse_speed: number;
  brightness: number;
}

export class WasmParticleSystem {
  private module: any = null;
  private initialized = false;
  private particleCount = 0;

  async init(particleCount: number): Promise<void> {
    try {
      // Try to load the WebAssembly module from public directory
      const response = await fetch('/particles.js');
      if (!response.ok) {
        throw new Error('WebAssembly module not found');
      }
      
      // Execute the module script to get the Module function
      const moduleText = await response.text();
      const moduleFunction = new Function('return ' + moduleText.replace('export default', ''))();
      this.module = await moduleFunction();
      
      // Initialize particles
      this.module._init_particles(particleCount);
      this.particleCount = particleCount;
      this.initialized = true;
      
      console.log(`WebAssembly particle system initialized with ${particleCount} particles`);
    } catch (error) {
      console.warn('Failed to load WebAssembly module, falling back to JavaScript implementation:', error);
      // We'll implement a JavaScript fallback
      this.initJavaScriptFallback(particleCount);
    }
  }

  private particles: Particle[] = [];

  private initJavaScriptFallback(count: number): void {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        life: 1.0,
        size: Math.random() * 0.5 + 0.1,
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        a: 1.0,
        twinkle: Math.random() * Math.PI * 2,
        pulse_speed: 2.0 + Math.random() * 3.0,
        brightness: 0.5 + Math.random() * 0.5
      });
    }
    this.particleCount = count;
    this.initialized = true;
  }

  update(deltaTime: number, gravity: number = 9.8, damping: number = 0.98): void {
    if (!this.initialized) return;

    if (this.module) {
      // Use WebAssembly implementation
      this.module._update_particles(deltaTime, gravity, damping);
    } else {
      // Use JavaScript fallback
      this.updateJavaScript(deltaTime, gravity, damping);
    }
  }

  private updateJavaScript(deltaTime: number, gravity: number, damping: number): void {
    for (const particle of this.particles) {
      // Apply gravity
      particle.vy -= gravity * deltaTime;
      
      // Apply damping
      particle.vx *= damping;
      particle.vy *= damping;
      particle.vz *= damping;
      
      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.z += particle.vz * deltaTime;
      
      // Update life
      particle.life -= deltaTime * 0.5;
      
      // Update twinkling phase
      particle.twinkle += particle.pulse_speed * deltaTime;
      if (particle.twinkle > Math.PI * 2) {
        particle.twinkle -= Math.PI * 2;
      }
      
      // Calculate twinkling effect (sine wave for smooth pulsing)
      const twinkleFactor = (Math.sin(particle.twinkle) + 1) * 0.5; // 0.0 to 1.0
      
      // Add sparkle effect (random bright flashes)
      let sparkle = 0;
      if (Math.random() < 0.003) { // 0.3% chance per frame
        sparkle = 2.0; // Bright flash
      }
      
      // Combine effects
      let finalBrightness = particle.brightness * twinkleFactor + sparkle;
      if (finalBrightness > 2.0) finalBrightness = 2.0;
      
      // Update alpha based on life and twinkling
      particle.a = particle.life * finalBrightness;
      
      // Reset particle if dead
      if (particle.life <= 0) {
        particle.x = (Math.random() - 0.5) * 2;
        particle.y = 10 + Math.random() * 2;
        particle.z = (Math.random() - 0.5) * 2;
        
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = Math.random() * 2;
        particle.vz = (Math.random() - 0.5) * 2;
        
        particle.life = 1.0;
        particle.a = 1.0;
        
        // Reset twinkling parameters
        particle.twinkle = Math.random() * Math.PI * 2;
        particle.pulse_speed = 2.0 + Math.random() * 3.0;
        particle.brightness = 0.5 + Math.random() * 0.5;
      }
    }
  }

  applyAttraction(targetX: number, targetY: number, targetZ: number, strength: number): void {
    if (!this.initialized) return;

    if (this.module) {
      this.module._apply_attraction(targetX, targetY, targetZ, strength);
    } else {
      this.applyAttractionJavaScript(targetX, targetY, targetZ, strength);
    }
  }

  private applyAttractionJavaScript(targetX: number, targetY: number, targetZ: number, strength: number): void {
    for (const particle of this.particles) {
      const dx = targetX - particle.x;
      const dy = targetY - particle.y;
      const dz = targetZ - particle.z;
      
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance > 0.1) {
        const force = strength / (distance * distance);
        
        particle.vx += (dx / distance) * force;
        particle.vy += (dy / distance) * force;
        particle.vz += (dz / distance) * force;
      }
    }
  }

  getParticles(): Particle[] {
    if (!this.initialized) return [];

    if (this.module) {
      // Get particles from WebAssembly memory
      const particlePtr = this.module._get_particles();
      const particles: Particle[] = [];
      
      const PARTICLE_SIZE = 15 * 4; // 15 floats * 4 bytes each (added 3 new fields)
      
      for (let i = 0; i < this.particleCount; i++) {
        const offset = particlePtr + i * PARTICLE_SIZE;
        const floatView = new Float32Array(this.module.HEAPF32.buffer, offset, 15);
        
        particles.push({
          x: floatView[0],
          y: floatView[1],
          z: floatView[2],
          vx: floatView[3],
          vy: floatView[4],
          vz: floatView[5],
          life: floatView[6],
          size: floatView[7],
          r: floatView[8],
          g: floatView[9],
          b: floatView[10],
          a: floatView[11],
          twinkle: floatView[12],
          pulse_speed: floatView[13],
          brightness: floatView[14]
        });
      }
      
      return particles;
    } else {
      return this.particles;
    }
  }

  cleanup(): void {
    if (this.module) {
      this.module._cleanup_particles();
    }
    this.particles = [];
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getParticleCount(): number {
    return this.particleCount;
  }
}