import * as THREE from 'three'

export interface SceneConfig {
  canvas: HTMLCanvasElement
  width: number
  height: number
  enableOrbitControls?: boolean
}

export class ThreeScene {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  public clock: THREE.Clock
  
  private animationId: number | null = null
  private resizeObserver: ResizeObserver | null = null
  
  constructor(config: SceneConfig) {
    // Initialize clock
    this.clock = new THREE.Clock()
    
    // Create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)
    this.scene.fog = new THREE.FogExp2(0x000000, 0.01)
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      config.width / config.height, 
      0.1, 
      1000
    )
    this.camera.position.set(0, 5, 15)
    this.camera.lookAt(0, 0, 0)
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: config.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(config.width, config.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Enable shadows
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // Set up lighting
    this.setupLighting()
    
    // Set up resize handling
    this.setupResizeHandling(config.canvas)
    
    console.log('Three.js scene initialized')
  }
  
  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    this.scene.add(ambientLight)
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.camera.left = -10
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10
    this.scene.add(directionalLight)
    
    // Point lights for color variation
    const pointLight1 = new THREE.PointLight(0xff4444, 0.5, 30)
    pointLight1.position.set(-10, 5, -10)
    this.scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0x4444ff, 0.5, 30)
    pointLight2.position.set(10, 5, 10)
    this.scene.add(pointLight2)
    
    const pointLight3 = new THREE.PointLight(0x44ff44, 0.5, 30)
    pointLight3.position.set(0, -5, 0)
    this.scene.add(pointLight3)
  }
  
  private setupResizeHandling(canvas: HTMLCanvasElement): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        this.handleResize(width, height)
      }
    })
    
    this.resizeObserver.observe(canvas.parentElement || canvas)
  }
  
  private handleResize(width: number, height: number): void {
    // Update camera
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    
    // Update renderer
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  
  public startRenderLoop(renderCallback?: () => void): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      
      const deltaTime = this.clock.getDelta()
      
      // Call custom render callback if provided
      if (renderCallback) {
        renderCallback()
      }
      
      // Render scene
      this.renderer.render(this.scene, this.camera)
    }
    
    animate()
  }
  
  public stopRenderLoop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
  
  public addToScene(object: THREE.Object3D): void {
    this.scene.add(object)
  }
  
  public removeFromScene(object: THREE.Object3D): void {
    this.scene.remove(object)
  }
  
  public getDeltaTime(): number {
    return this.clock.getDelta()
  }
  
  public getElapsedTime(): number {
    return this.clock.getElapsedTime()
  }
  
  public dispose(): void {
    // Stop render loop
    this.stopRenderLoop()
    
    // Dispose of resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    
    // Dispose of Three.js objects
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose()
        if (object.material instanceof THREE.Material) {
          object.material.dispose()
        } else if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        }
      }
    })
    
    this.renderer.dispose()
    
    console.log('Three.js scene disposed')
  }
}

// Mouse tracking utility
export class MouseTracker {
  public mousePosition = new THREE.Vector2()
  public worldPosition = new THREE.Vector3()
  public isMouseDown = false
  
  private camera: THREE.PerspectiveCamera
  private canvas: HTMLCanvasElement
  private raycaster = new THREE.Raycaster()
  
  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    this.camera = camera
    this.canvas = canvas
    
    this.setupEventListeners()
  }
  
  private setupEventListeners(): void {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this))
  }
  
  private handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    
    // Normalize mouse coordinates
    this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    // Calculate world position at a specific depth
    this.raycaster.setFromCamera(this.mousePosition, this.camera)
    
    // Project to a plane at z=0
    const distance = -this.camera.position.z / this.raycaster.ray.direction.z
    this.worldPosition.copy(this.raycaster.ray.origin).add(
      this.raycaster.ray.direction.multiplyScalar(distance)
    )
  }
  
  private handleMouseDown(): void {
    this.isMouseDown = true
  }
  
  private handleMouseUp(): void {
    this.isMouseDown = false
  }
  
  private handleMouseLeave(): void {
    this.isMouseDown = false
  }
  
  public dispose(): void {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave.bind(this))
  }
}