# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Code formatting**: `prettier --write --use-tabs --print-width 160 "index.html" "./js/**/**.js" "./lib/gpu-buffer.js"`
- **Local development**: Serve with any HTTP server (e.g., `python3 -m http.server`)
- **Testing**: Open `index.html` in a web browser - this is a client-side only project with no build process

## Architecture Overview

This project is a web-based Matrix digital rain effect implementation with dual rendering backends:

### Core Architecture
- **Entry point**: `index.html` loads `js/main.js` as ES6 module
- **Main controller**: `js/main.js` detects WebGPU support and loads appropriate renderer
- **Dual rendering backends**:
  - `js/regl/main.js` - WebGL implementation using REGL
  - `js/webgpu/main.js` - WebGPU implementation (beta)

### Key Components

#### Configuration System (`js/config.js`)
- Central configuration with extensive customization options
- Multiple predefined versions (classic, operator, nightmare, paradise, resurrections, etc.)
- URL parameter parsing for runtime customization
- Font definitions with MSDF (Multi-channel Signed Distance Field) textures

#### Rendering Pipeline
Both backends use a similar multi-pass rendering architecture:
1. **Rain Pass** - Core particle/glyph rendering
2. **Bloom Pass** - Post-processing bloom effects  
3. **Effect Pass** - Color mapping (palette, stripes, image, mirror)
4. **Quilt Pass** - Optional holographic display support

#### Shader Organization
- **GLSL shaders** in `shaders/glsl/` for WebGL backend
- **WGSL shaders** in `shaders/wgsl/` for WebGPU backend
- Separate fragment shaders for different rendering passes

### Key Technical Features
- **MSDF Font Rendering**: Vector-quality glyph rendering using multi-channel distance fields
- **GPU-based Particle System**: Raindrops computed entirely on GPU
- **Dual Graphics API Support**: WebGL (REGL) and WebGPU implementations
- **Post-processing Pipeline**: Bloom, color mapping, and visual effects
- **Camera Integration**: Optional webcam input for mirror effects
- **Holographic Display Support**: Looking Glass display compatibility

### Directory Structure
- `js/` - Core JavaScript modules organized by rendering backend
- `js/regl/` - WebGL/REGL specific implementations
- `js/webgpu/` - WebGPU specific implementations
- `shaders/` - GPU shader code (GLSL and WGSL)
- `assets/` - Glyph textures, fonts, and image resources
- `lib/` - Third-party libraries (REGL, gl-matrix, holoplay)

### Development Notes
- No build process required - uses ES6 modules directly
- Configuration entirely through URL parameters
- All effects run client-side with GPU acceleration
- Extensive browser compatibility with fallback detection
- Performance monitoring for software rendering detection