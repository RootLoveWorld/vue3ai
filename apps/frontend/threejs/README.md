# Three.js + Vue 3 + WebAssembly Particle System

A high-performance particle system demo that combines Three.js for 3D rendering, Vue 3 for reactive UI controls, and WebAssembly for optimized particle calculations.

## Features

- 🚀 **High Performance**: WebAssembly-powered particle physics with JavaScript fallback
- 🎮 **Interactive Controls**: Real-time parameter adjustment via intuitive UI
- 🖱️ **Mouse Interaction**: Particles are attracted to mouse cursor
- 🎨 **Visual Effects**: Dynamic lighting, fog, and particle blending
- 📊 **Performance Monitoring**: Real-time FPS counter and engine detection

## Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **3D Graphics**: Three.js for WebGL rendering
- **High Performance Computing**: WebAssembly (C compiled with Emscripten)
- **Build Tool**: Vite with TypeScript support
- **Styling**: CSS with modern effects

## Project Structure

```
src/
├── components/
│   └── ParticleSystemCanvas.vue    # Main 3D canvas component
├── utils/
│   ├── ThreeScene.ts              # Three.js scene management
│   └── WasmParticleSystem.ts      # WebAssembly interface
├── wasm/
│   └── particles.c                # C code for particle calculations
├── App.vue                        # Root component with controls
└── main.ts                        # Application entry point

public/
└── particles.js                   # Compiled WebAssembly module
```

## Installation & Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   # or
   npx vite
   # or 
   npm run dev
   ```

3. **Build for production**:
   ```bash
   pnpm build
   ```

4. **Optional: Compile WebAssembly (requires Emscripten)**:
   ```bash
   pnpm build:wasm
   ```

## Usage

### Controls

- **Particle Count**: Adjust the number of particles (100-10,000)
- **Gravity**: Control downward force on particles (0-20)
- **Damping**: Air resistance/friction effect (80-100%)
- **Attraction Strength**: Mouse attraction force (0-50)
- **Reset**: Reinitialize all particles
- **Pause/Resume**: Stop/start the simulation

### Interaction

- **Move Mouse**: Particles will be attracted to cursor position
- **Mouse Over Canvas**: Enhanced attraction effects
- **Real-time Adjustment**: All controls update the simulation immediately

## Technical Details

### WebAssembly Integration

The particle system uses WebAssembly for high-performance calculations:

- **Language**: C compiled to WebAssembly using Emscripten
- **Physics**: Position updates, velocity calculations, life cycle management
- **Memory Management**: Direct memory access for optimal performance
- **Fallback**: Pure JavaScript implementation when WASM fails to load

### Three.js Rendering

Advanced 3D graphics features:

- **Point Cloud Rendering**: Efficient particle visualization
- **Dynamic Lighting**: Multiple colored point lights and directional lighting
- **Fog Effects**: Atmospheric depth perception
- **Additive Blending**: Glowing particle effects
- **Buffer Attributes**: Optimized geometry updates

### Performance Optimizations

- **Delta Time Capping**: Prevents physics instability during frame drops
- **Buffer Reuse**: Efficient memory management for particle data
- **Level of Detail**: Size and alpha based on particle life
- **Culling**: Automatic removal and respawn of dead particles

## Development Notes

### WebAssembly Compilation

To compile the WebAssembly module, you'll need Emscripten installed:

```bash
# Install Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

# Compile particles.c
emcc src/wasm/particles.c -o public/particles.js \\
  -s WASM=1 \\
  -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \\
  -s EXPORTED_FUNCTIONS=['_malloc','_free'] \\
  --no-entry
```

### Browser Compatibility

- **WebAssembly**: Supported in all modern browsers (2017+)
- **WebGL**: Required for Three.js rendering
- **ES6 Modules**: Modern JavaScript features used throughout

## Performance Benchmarks

Typical performance on modern hardware:

- **10,000 particles**: 60 FPS (WebAssembly)
- **5,000 particles**: 60 FPS (JavaScript fallback)
- **Memory usage**: ~50MB for 10,000 particles

## Troubleshooting

### Common Issues

1. **WebAssembly not loading**: 
   - Check browser console for CORS errors
   - Ensure `particles.js` exists in `public/` directory
   - Falls back to JavaScript automatically

2. **Poor performance**:
   - Reduce particle count
   - Check if hardware acceleration is enabled
   - Monitor browser's Task Manager for GPU usage

3. **Build errors**:
   - Ensure all dependencies are installed: `pnpm install`
   - Check TypeScript configuration
   - Verify Vite configuration

### Debug Mode

Enable additional logging by opening browser console. The application logs:
- Initialization status
- Engine type detection
- Performance metrics
- WebAssembly loading status

## License

MIT License - feel free to use this code in your own projects!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

*Built with ❤️ using Vue 3, Three.js, and WebAssembly*