<template>
  <canvas 
    ref="canvasRef" 
    class="particle-canvas"
    @contextmenu.prevent
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import * as THREE from 'three'
import { ThreeScene, MouseTracker } from '../utils/ThreeScene'
import { WasmParticleSystem, type Particle } from '../utils/WasmParticleSystem'

// Injected reactive state from parent
const particleCount = inject<any>('particleCount')
const gravity = inject<any>('gravity')
const damping = inject<any>('damping')
const attractionStrength = inject<any>('attractionStrength')
const twinkleIntensity = inject<any>('twinkleIntensity')
const isPaused = inject<any>('isPaused')
const engineType = inject<any>('engineType')
const fps = inject<any>('fps')

// Component state
const canvasRef = ref<HTMLCanvasElement>()
let threeScene: ThreeScene | null = null
let mouseTracker: MouseTracker | null = null
let particleSystem: WasmParticleSystem | null = null
let particleMesh: THREE.Points | null = null

// Performance tracking
let frameCount = 0
let lastTime = performance.now()

// Particle rendering
const createParticleMesh = (particles: Particle[]) => {
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.PointsMaterial({
    size: 0.15,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    alphaTest: 0.001 // Helps with performance
  })

  // Create buffers
  const positions = new Float32Array(particles.length * 3)
  const colors = new Float32Array(particles.length * 3)
  const sizes = new Float32Array(particles.length)

  // Fill buffers with particle data
  updateParticleBuffers(particles, positions, colors, sizes)

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  return new THREE.Points(geometry, material)
}

const updateParticleBuffers = (
  particles: Particle[],
  positions: Float32Array,
  colors: Float32Array,
  sizes: Float32Array
) => {
  const twinkleMultiplier = twinkleIntensity?.value || 1.5
  
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i]
    const i3 = i * 3

    // Update positions
    positions[i3] = particle.x
    positions[i3 + 1] = particle.y
    positions[i3 + 2] = particle.z

    // Enhanced color calculation with adjustable twinkling
    const brightness = Math.max(0.1, particle.a * twinkleMultiplier) // Adjustable minimum brightness
    const colorIntensity = brightness * 1.2 // Boost intensity
    
    colors[i3] = particle.r * colorIntensity
    colors[i3 + 1] = particle.g * colorIntensity
    colors[i3 + 2] = particle.b * colorIntensity

    // Dynamic sizing based on brightness and life with twinkle multiplier
    const baseSizeMultiplier = 60 + (particle.a * twinkleMultiplier * 30) // Dynamic base range
    const twinkleBonus = particle.a > 1.5 ? 40 * twinkleMultiplier : 0 // Extra size for sparkles
    sizes[i] = particle.size * (baseSizeMultiplier + twinkleBonus)
  }
}

const initializeParticleSystem = async () => {
  if (!particleSystem || !threeScene) return

  try {
    await particleSystem.init(particleCount?.value || 2000)
    
    // Determine engine type
    const isWasm = particleSystem.isInitialized() && (particleSystem as any).module
    engineType!.value = isWasm ? 'WebAssembly + Three.js' : 'JavaScript + Three.js'
    
    // Dispatch engine type update
    window.dispatchEvent(new CustomEvent('engineTypeUpdate', { 
      detail: engineType!.value 
    }))

    // Create initial particle mesh
    const particles = particleSystem.getParticles()
    particleMesh = createParticleMesh(particles)
    threeScene.addToScene(particleMesh)

    console.log(`Particle system initialized with ${particles.length} particles`)
  } catch (error) {
    console.error('Failed to initialize particle system:', error)
    engineType!.value = 'Error'
  }
}

const updateParticles = () => {
  if (!particleSystem || !threeScene || !particleMesh || isPaused?.value) return

  const deltaTime = Math.min(threeScene.getDeltaTime(), 1/30) // Cap at 30fps for stability

  // Update particle physics
  particleSystem.update(deltaTime, gravity?.value || 9.8, damping?.value || 0.98)

  // Apply mouse attraction if mouse is active
  if (mouseTracker && attractionStrength?.value > 0) {
    const { x, y, z } = mouseTracker.worldPosition
    particleSystem.applyAttraction(x, y, z, attractionStrength.value * deltaTime * 10)
  }

  // Update particle mesh
  const particles = particleSystem.getParticles()
  if (particles.length > 0 && particleMesh.geometry) {
    const positionAttribute = particleMesh.geometry.getAttribute('position') as THREE.BufferAttribute
    const colorAttribute = particleMesh.geometry.getAttribute('color') as THREE.BufferAttribute
    const sizeAttribute = particleMesh.geometry.getAttribute('size') as THREE.BufferAttribute

    updateParticleBuffers(
      particles,
      positionAttribute.array as Float32Array,
      colorAttribute.array as Float32Array,
      sizeAttribute.array as Float32Array
    )

    positionAttribute.needsUpdate = true
    colorAttribute.needsUpdate = true
    sizeAttribute.needsUpdate = true
  }

  // Update FPS counter
  frameCount++
  const currentTime = performance.now()
  if (currentTime - lastTime >= 1000) {
    fps!.value = Math.round((frameCount * 1000) / (currentTime - lastTime))
    frameCount = 0
    lastTime = currentTime
    
    // Dispatch FPS update
    window.dispatchEvent(new CustomEvent('fpsUpdate', { detail: fps!.value }))
  }
}

const resetParticles = async () => {
  if (!particleSystem || !threeScene) return

  // Clean up existing mesh
  if (particleMesh) {
    threeScene.removeFromScene(particleMesh)
    particleMesh.geometry.dispose()
    if (particleMesh.material instanceof THREE.Material) {
      particleMesh.material.dispose()
    }
  }

  // Reinitialize
  await initializeParticleSystem()
}

// Watchers for reactive properties
watch(() => particleCount?.value, async (newCount) => {
  if (newCount && particleSystem) {
    await resetParticles()
  }
})

// Event listeners
const setupEventListeners = () => {
  window.addEventListener('resetParticles', resetParticles)
}

const cleanupEventListeners = () => {
  window.removeEventListener('resetParticles', resetParticles)
}

onMounted(async () => {
  if (!canvasRef.value) return

  try {
    // Initialize Three.js scene
    const rect = canvasRef.value.getBoundingClientRect()
    threeScene = new ThreeScene({
      canvas: canvasRef.value,
      width: rect.width,
      height: rect.height
    })

    // Initialize mouse tracking
    mouseTracker = new MouseTracker(threeScene.camera, canvasRef.value)

    // Initialize particle system
    particleSystem = new WasmParticleSystem()
    await initializeParticleSystem()

    // Set up event listeners
    setupEventListeners()

    // Start render loop
    threeScene.startRenderLoop(updateParticles)

    console.log('ParticleSystemCanvas mounted and initialized')
  } catch (error) {
    console.error('Failed to initialize ParticleSystemCanvas:', error)
  }
})

onUnmounted(() => {
  // Cleanup
  cleanupEventListeners()
  
  if (particleSystem) {
    particleSystem.cleanup()
  }
  
  if (mouseTracker) {
    mouseTracker.dispose()
  }
  
  if (threeScene) {
    threeScene.dispose()
  }
  
  console.log('ParticleSystemCanvas unmounted and cleaned up')
})
</script>

<style scoped>
.particle-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}
</style>