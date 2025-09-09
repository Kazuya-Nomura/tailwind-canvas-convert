import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Fragment shader for burning paper effect
const fragmentShaderSource = `
precision mediump float;

uniform float u_time;
uniform float u_progress;
uniform vec2 u_resolution;

// Noise function
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    // Create burning edge with noise
    float noiseValue = fbm(st * 3.0 + u_time * 0.1);
    float burnEdge = u_progress + noiseValue * 0.3;
    
    // Paper mask - areas that should be transparent (burned)
    float paperMask = smoothstep(burnEdge - 0.1, burnEdge, st.y);
    
    // Fire effect along the burning edge
    float fireZone = 1.0 - smoothstep(burnEdge - 0.05, burnEdge + 0.05, st.y);
    
    // Fire animation
    vec2 fireUV = st + vec2(sin(u_time * 2.0) * 0.02, u_time * 0.1);
    float fireNoise = fbm(fireUV * 8.0);
    
    // Fire colors
    vec3 fireColor1 = vec3(1.0, 0.3, 0.0);  // Orange
    vec3 fireColor2 = vec3(1.0, 0.8, 0.0);  // Yellow
    vec3 fireColor3 = vec3(0.8, 0.0, 0.0);  // Red
    
    vec3 fireColor = mix(fireColor3, fireColor1, fireNoise);
    fireColor = mix(fireColor, fireColor2, fireNoise * 0.7);
    
    // Combine effects
    float fireIntensity = fireZone * fireNoise * (1.0 - paperMask);
    vec3 finalColor = fireColor * fireIntensity;
    
    // Paper darkening effect before burning
    float darkenZone = smoothstep(burnEdge - 0.2, burnEdge, st.y);
    float darkenAmount = darkenZone * (1.0 - paperMask) * 0.7;
    
    gl_FragColor = vec4(finalColor, paperMask + fireIntensity + darkenAmount);
}
`;

const vertexShaderSource = `
attribute vec4 a_position;
void main() {
    gl_Position = a_position;
}
`;

const BurningPaperTransition = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTime = useRef(Date.now());
  const progressRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // Helper function to create shader
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    
    programRef.current = program;

    // Set up geometry (full screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const progressLocation = gl.getUniformLocation(program, 'u_progress');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    // Resize function
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    // Animation loop
    const animate = () => {
      if (!gl || !program) return;
      
      resizeCanvas();
      
      const currentTime = (Date.now() - startTime.current) / 1000;
      
      gl.useProgram(program);
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform1f(progressLocation, progressRef.current);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // GSAP ScrollTrigger setup
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      }
    });

    // Start animation
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && glRef.current) {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        glRef.current.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default BurningPaperTransition;