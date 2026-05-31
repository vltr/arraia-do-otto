import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// The one WebGL touch (hybrid sky): embers rising from the bonfire, shown only
// at the footer and code-split so Three.js never weighs down the initial load.
// Each ember has a random size and a lifecycle — it fades in low, drifts up, and
// fades fully BEFORE reaching the top (it never crosses the upper edge visible).
// Per-particle size + alpha need a custom shader (PointsMaterial is global-only).

const COUNT = 100;
const Y_START = -4.8; // bottom (just below the visible area)

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const rand = (a, b) => a + Math.random() * (b - a);

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,246,210,1)");
  g.addColorStop(0.35, "rgba(255,168,60,0.85)");
  g.addColorStop(1, "rgba(255,120,40,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (70.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const fragmentShader = `
  uniform sampler2D uTex;
  varying float vAlpha;
  void main() {
    vec4 t = texture2D(uTex, gl_PointCoord);
    gl_FragColor = vec4(t.rgb, t.a * vAlpha);
  }
`;

function Particles() {
  const geomRef = useRef();
  const tex = useMemo(makeSprite, []);

  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const aSize = new Float32Array(COUNT);
    const aAlpha = new Float32Array(COUNT);
    // per-particle CPU state
    const life = new Float32Array(COUNT);
    const speed = new Float32Array(COUNT);
    const yEnd = new Float32Array(COUNT);
    const baseX = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    const size = new Float32Array(COUNT);

    const spawn = (i, startLife) => {
      life[i] = startLife;
      speed[i] = rand(0.12, 0.32); // slow rise; short-ish lifetimes
      yEnd[i] = rand(0.5, 4.0); // random fade-out height — always below the top (4.8)
      baseX[i] = rand(-4.8, 4.8);
      phase[i] = Math.random() * Math.PI * 2;
      size[i] = rand(0.45, 1.5); // small, varied
    };
    for (let i = 0; i < COUNT; i++) {
      spawn(i, Math.random()); // stagger initial lives
      aSize[i] = size[i];
    }
    return { positions, aSize, aAlpha, life, speed, yEnd, baseX, phase, size, spawn };
  }, []);

  const uniforms = useMemo(() => ({ uTex: { value: tex } }), [tex]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    const { positions, aSize, aAlpha, life, speed, yEnd, baseX, phase, size, spawn } = data;

    for (let i = 0; i < COUNT; i++) {
      life[i] += speed[i] * d;
      if (life[i] >= 1) spawn(i, 0);
      const l = life[i];
      // fade in low, fade fully out by ~0.85 of life → invisible before yEnd/top
      aAlpha[i] = smoothstep(0, 0.12, l) * (1 - smoothstep(0.7, 0.92, l));
      aSize[i] = size[i];
      positions[i * 3] = baseX[i] + Math.sin(t * 0.7 + phase[i]) * 0.35;
      positions[i * 3 + 1] = Y_START + (yEnd[i] - Y_START) * l;
      positions[i * 3 + 2] = 0;
    }
    const g = geomRef.current;
    g.attributes.position.needsUpdate = true;
    g.attributes.aAlpha.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.aSize, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[data.aAlpha, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Embers() {
  return (
    <Canvas
      className="!absolute inset-0"
      style={{ zIndex: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
    >
      <Particles />
    </Canvas>
  );
}
