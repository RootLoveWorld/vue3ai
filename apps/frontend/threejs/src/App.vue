<template>
  <div id="app">
    <ParticleSystemCanvas />
    <div class="controls">
      <h3>Particle System Controls</h3>
      <div class="control-group">
        <label>Particle Count: {{ particleCount }}</label>
        <input 
          v-model.number="particleCount" 
          type="range" 
          min="100" 
          max="10000" 
          step="100"
          @input="updateParticleCount"
        />
      </div>
      
      <div class="control-group">
        <label>Gravity: {{ gravity.toFixed(1) }}</label>
        <input 
          v-model.number="gravity" 
          type="range" 
          min="0" 
          max="20" 
          step="0.1"
        />
      </div>
      
      <div class="control-group">
        <label>Damping: {{ (damping * 100).toFixed(0) }}%</label>
        <input 
          v-model.number="damping" 
          type="range" 
          min="0.8" 
          max="1.0" 
          step="0.001"
        />
      </div>
      
      <div class="control-group">
        <label>Attraction Strength: {{ attractionStrength.toFixed(1) }}</label>
        <input 
          v-model.number="attractionStrength" 
          type="range" 
          min="0" 
          max="50" 
          step="0.1"
        />
      </div>
      
      <div class="control-group">
        <label>Twinkling Effect: {{ twinkleIntensity.toFixed(1) }}</label>
        <input 
          v-model.number="twinkleIntensity" 
          type="range" 
          min="0.5" 
          max="3.0" 
          step="0.1"
        />
      </div>
      
      <div class="control-group">
        <button @click="resetParticles">Reset Particles</button>
        <button @click="togglePause">{{ isPaused ? 'Resume' : 'Pause' }}</button>
      </div>
      
      <div class="info">
        <p>Engine: {{ engineType }}</p>
        <p>FPS: {{ fps }}</p>
        <p>Move mouse to attract particles</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import ParticleSystemCanvas from './components/ParticleSystemCanvas.vue'

// Reactive state
const particleCount = ref(2000)
const gravity = ref(9.8)
const damping = ref(0.98)
const attractionStrength = ref(10.0)
const twinkleIntensity = ref(1.5)
const isPaused = ref(false)
const engineType = ref('Loading...')
const fps = ref(0)

// Provide state to child components
provide('particleCount', particleCount)
provide('gravity', gravity)
provide('damping', damping)
provide('attractionStrength', attractionStrength)
provide('twinkleIntensity', twinkleIntensity)
provide('isPaused', isPaused)
provide('engineType', engineType)
provide('fps', fps)

// Event handlers
const updateParticleCount = () => {
  // This will be handled by the child component
}

const resetParticles = () => {
  // Emit event that child component can listen to
  window.dispatchEvent(new CustomEvent('resetParticles'))
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

onMounted(() => {
  // Listen for engine type updates from child component
  window.addEventListener('engineTypeUpdate', (e: any) => {
    engineType.value = e.detail
  })
  
  // Listen for FPS updates
  window.addEventListener('fpsUpdate', (e: any) => {
    fps.value = e.detail
  })
})
</script>

<style scoped>
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
  min-width: 250px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.controls h3 {
  margin: 0 0 15px 0;
  color: #4CAF50;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #333;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.control-group input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  border: none;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background 0.3s;
}

button:hover {
  background: #45a049;
}

.info {
  margin-top: 15px;
  font-size: 12px;
  color: #ccc;
}

.info p {
  margin: 5px 0;
}
</style>