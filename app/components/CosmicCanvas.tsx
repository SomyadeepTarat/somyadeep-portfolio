"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const randomFrom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

function StarField({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = randomFrom(9173);
    const points = new Float32Array(1250 * 3);
    for (let i = 0; i < 1250; i += 1) {
      const radius = 4 + random() * 16;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      points[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      points[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      points[i * 3 + 2] = radius * Math.cos(phi) - 4;
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.007;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.018, 0.025);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#f5ead3" size={0.022} sizeAttenuation depthWrite={false} opacity={0.72} />
    </Points>
  );
}

function Accretion() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = randomFrom(4219);
    const points = new Float32Array(520 * 3);
    for (let i = 0; i < 520; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 1.18 + random() * 1.4;
      points[i * 3] = Math.cos(angle) * radius;
      points[i * 3 + 1] = Math.sin(angle) * radius * 0.3 + (random() - 0.5) * 0.14;
      points[i * 3 + 2] = (random() - 0.5) * 0.15;
    }
    return points;
  }, []);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z -= delta * 0.028; });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#e7b65a" size={0.016} sizeAttenuation depthWrite={false} opacity={0.78} />
    </Points>
  );
}

function Singularity({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scroll = window.scrollY / max;
    const compact = viewport.width < 6;
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, (compact ? 0.9 : 2.15 - scroll * 1.4) + (reduced ? 0 : state.pointer.x * 0.16), 0.035);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (compact ? 0.25 : 0.34 - scroll * 1.9) + (reduced ? 0 : state.pointer.y * 0.1), 0.035);
    if (!reduced) group.current.rotation.z += delta * 0.015;
    if (ring.current && !reduced) ring.current.rotation.z -= delta * 0.09;
  });

  return (
    <group ref={group} position={[2.1, 0.3, -0.9]} scale={viewport.width < 6 ? 0.76 : 1}>
      <mesh><sphereGeometry args={[0.86, 64, 64]} /><meshBasicMaterial color="#000" /></mesh>
      <mesh rotation={[Math.PI / 2.25, 0.16, -0.25]}><torusGeometry args={[1.34, 0.045, 24, 220]} /><meshBasicMaterial color="#c9963f" transparent opacity={0.8} /></mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.2, 0.11, -0.3]}><torusGeometry args={[1.07, 0.016, 18, 180]} /><meshBasicMaterial color="#f3cf81" transparent opacity={0.88} /></mesh>
      <mesh rotation={[Math.PI / 2.3, -0.16, 0.62]}><torusGeometry args={[1.7, 0.009, 12, 200]} /><meshBasicMaterial color="#7c9bea" transparent opacity={0.24} /></mesh>
      <Accretion />
      <pointLight color="#d8a94f" intensity={18} distance={5} decay={2} />
    </group>
  );
}

function Fallback() {
  return <div className="cosmic-fallback" aria-hidden="true"><span className="fallback-stars" /><span className="fallback-stars far" /><span className="fallback-singularity"><span /></span></div>;
}

export default function CosmicCanvas({ reduced }: { reduced: boolean }) {
  const [ready, setReady] = useState<boolean | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const renderer = new THREE.WebGLRenderer({ canvas: document.createElement("canvas"), antialias: false });
        renderer.dispose();
        renderer.forceContextLoss();
        setReady(true);
      } catch { setReady(false); }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  if (!ready) return <Fallback />;
  return (
    <div className="cosmic-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.45]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <fog attach="fog" args={["#030305", 6, 21]} />
        <StarField reduced={reduced} />
        <Singularity reduced={reduced} />
        <EffectComposer multisampling={0}><Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.72} radius={0.58} /><Vignette eskil={false} offset={0.18} darkness={0.72} /></EffectComposer>
      </Canvas>
    </div>
  );
}
