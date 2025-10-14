// Animation of flag wave using Three.js
class FlagWaveEffect {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.flagTexture = null;
    this.container = null;
    this.clock = new THREE.Clock();

    // Wait for DOM content to be loaded before initializing
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    try {
      // Get flag element
      const flagElement = document.querySelector("#flag");
      if (!flagElement) {
        console.error("Flag element not found");
        return;
      }

      // Get flag image path
      const flagImageSrc = flagElement.getAttribute("src");
      if (!flagImageSrc) {
        console.error("Flag image source not found");
        return;
      }
      
      // Create container for our WebGL canvas
      this.container = document.createElement("div");
      this.container.setAttribute("id", "flag-3d");
      this.container.style.width = "20vw";
      this.container.style.height = "25vw";
      this.container.style.position = "absolute";
      this.container.style.left = "25%";
      this.container.style.opacity = "0";
      this.container.style.pointerEvents = "none";
    //   this.container.style.zIndex = "9999";
      
      // Find the main-text element and insert before it
      const mainText = document.querySelector(".main-text");
      if (mainText && mainText.parentNode) {
        mainText.parentNode.insertBefore(this.container, mainText);
      } else {
        // Fallback: add after flag element
        flagElement.parentNode.insertBefore(this.container, flagElement.nextSibling);
      }
      
      // Hide the original flag element - we'll use it as a texture source
      flagElement.style.opacity = "0";
      flagElement.style.pointerEvents = "none";
      
      // Set up Three.js scene
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, 20/25, 0.1, 1000);
      
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);
      
      // Load texture with error handling
      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = "Anonymous";
      this.flagTexture = textureLoader.load(
        flagImageSrc,
        // Success callback
        () => {
          this.createMaterial();
          this.setupScene();
        },
        // Progress callback
        undefined,
        // Error callback
        (err) => {
          console.error("Error loading texture:", err);
        }
      );
    } catch (err) {
      console.error("Error initializing flag effect:", err);
    }
  }
  
  createMaterial() {
    // Create shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
        mousePos: { value: new THREE.Vector2(0, 0) },
        flagTexture: { value: this.flagTexture }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mousePos;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          
          // Wave effect parameters
          float frequency = 5.0;
          float amplitude = 0.15;
          float speed = 2.0;
          
          // Calculate wave effect
          float distanceFromMouse = length(position.xy - mousePos * 2.0);
          float wave = sin(frequency * position.x + time * speed) * 
                       sin(frequency * position.y + time * speed) * 
                       amplitude;
          
          // Add mouse interaction
          float mouseEffect = smoothstep(0.0, 2.0, distanceFromMouse) * 0.5;
          
          // Apply wave to z position
          vec3 newPosition = position;
          newPosition.z += wave * (0.9 - mouseEffect);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D flagTexture;
        varying vec2 vUv;
        
        void main() {
          vec4 texColor = texture2D(flagTexture, vUv);
          gl_FragColor = texColor;
        }
      `,
      side: THREE.DoubleSide
    });
  }
  
  setupScene() {
    // Create mesh
    this.geometry = new THREE.PlaneGeometry(2, 2.7, 32, 32);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    
    // Position camera
    this.camera.position.z = 2;
    
    // Start animation
    this.animate();
    
    // Handle mouse movement from the parent element
    this.setupMouseEvents();
  }
  
  setupMouseEvents() {
    const flagElementParent = document.querySelector("#main-text3");
    if (!flagElementParent) {
      console.warn("Parent element for flag not found");
      return;
    }
    
    flagElementParent.addEventListener("mousemove", (e) => {
      // Map mouse position to normalized coordinates
      const rect = flagElementParent.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 - 1.5;
      
      if (this.material && this.material.uniforms) {
        this.material.uniforms.mousePos.value.set(mouseX, mouseY);
      }
      
      // Show the flag container
      gsap.to(this.container, {
        opacity: 1
      });
      
      // Position the container at the mouse position
      gsap.to(this.container, {
        left: e.clientX - (this.container.offsetWidth / 2),
        top: e.clientY - (this.container.offsetHeight / 2)
      });
    });
    
    flagElementParent.addEventListener("mouseleave", () => {
      // Hide the flag
      gsap.to(this.container, {
        opacity: 0
      });
    });
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  handleResize() {
    if (this.camera && this.renderer && this.container) {
      this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }
  }
  
  animate() {
    if (!this.material || !this.scene || !this.camera || !this.renderer) {
      console.warn("Animation stopped: missing required objects");
      return;
    }
    
    requestAnimationFrame(this.animate.bind(this));
    
    // Update time uniform
    this.material.uniforms.time.value = this.clock.getElapsedTime();
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the flag wave effect
const flagEffect = new FlagWaveEffect(); 