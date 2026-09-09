"use client";

import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){vec3 p=vPosition;float n=noise(p*5.)*.5+noise(p*13.)*.25+noise(p*36.)*.15+noise(p*95.)*.1;float fine=noise(p*230.);vec3 norm=normalize(vNormal);vec3 light=normalize(vec3(-.9,1.2,.7));float diffuse=max(dot(norm,light),0.);float rim=pow(1.-max(norm.z,0.),3.);vec3 dark=vec3(.065,.069,.064);vec3 rock=mix(vec3(.19,.16,.12),vec3(.69,.54,.36),smoothstep(.28,.76,n));vec3 color=mix(dark,rock,diffuse)*(n*.7+.65);color+=fine*.035*diffuse;color+=vec3(.77,.47,.22)*rim*pow(max(dot(norm,light),0.),1.6)*.7;gl_FragColor=vec4(color,1.);}`;

type SceneMode = "planet" | "network" | "orbit";

function OrbitalScene({ moving, mode }: { moving: boolean; mode: SceneMode }) {
  const planet = useRef<THREE.Mesh>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const network = useRef<THREE.Group>(null);
  const armillary = useRef<THREE.Group>(null);
  const satellites = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const ringLines = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const points = Array.from({ length: 181 }, (_, j) => {
      const angle = j / 180 * Math.PI * 2;
      const radius = 2.2 + i * .065;
      return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    });
    return new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: i % 2 === 0 ? "#c2a17a" : "#655b49", transparent: true, opacity: i === 0 || i === 6 ? .65 : .3 }),
    );
  }), []);
  const networkData = useMemo(() => {
    const nodes = Array.from({ length: 42 }, (_, i) => {
      const y = 1 - i / 41 * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = Math.PI * (3 - Math.sqrt(5)) * i;
      return new THREE.Vector3(Math.cos(angle) * radius * 2.05, y * 2.05, Math.sin(angle) * radius * 2.05);
    });
    const edges: number[] = [];
    nodes.forEach((a, i) => nodes.forEach((b, j) => {
      if (j > i && a.distanceTo(b) < 1.18) edges.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }));
    return { nodes, edges: new Float32Array(edges) };
  }, []);
  useEffect(() => () => {
    ringLines.forEach(line => { line.geometry.dispose(); (line.material as THREE.Material).dispose(); });
  }, [ringLines]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, .05);
    if (moving) elapsed.current += delta;
    const time = elapsed.current;
    const ease = moving ? 1 - Math.exp(-delta * 4.5) : 1;
    const scaleTo = (object: THREE.Object3D | null, target: number) => {
      if (!object) return;
      object.scale.setScalar(THREE.MathUtils.lerp(object.scale.x, target, ease));
      object.visible = object.scale.x > .004;
    };
    scaleTo(planet.current, mode === "planet" ? 1 : mode === "orbit" ? .31 : .001);
    scaleTo(ringGroup.current, mode === "planet" ? 1 : .001);
    scaleTo(network.current, mode === "network" ? 1 : .001);
    scaleTo(armillary.current, mode === "orbit" ? 1 : .001);
    if (planet.current && moving) planet.current.rotation.y += delta * .075;
    if (network.current && moving) {
      network.current.rotation.y += delta * .11;
      network.current.rotation.z = Math.sin(time * .22) * .12;
    }
    if (armillary.current && moving) {
      armillary.current.children.forEach((ring, index) => {
        ring.rotation.x += delta * (.12 + index * .04);
        ring.rotation.y += delta * .08 * (index % 2 ? -1 : 1);
      });
    }
    if (satellites.current) satellites.current.children.forEach((satellite, index) => {
      const angle = time * (.3 + index * .09) + index * 2.1;
      const radius = 2.25 + index * .22;
      satellite.position.set(Math.cos(angle) * radius, Math.sin(angle * (index + 1)) * .5, Math.sin(angle) * radius);
      satellite.scale.setScalar(mode === "network" ? .5 : 1);
    });
  });

  return <group rotation={[.22, 0, -.35]}>
    <mesh ref={planet}>
      <sphereGeometry args={[1.62, 96, 64]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
    <group ref={ringGroup} rotation={[.19, 0, .06]}>{ringLines.map((line, i) => <primitive key={i} object={line} />)}</group>
    <group ref={network} scale={.001}>
      <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[networkData.edges, 3]} /></bufferGeometry><lineBasicMaterial color="#aebdc8" transparent opacity={.42} /></lineSegments>
      {networkData.nodes.map((position, i) => <mesh key={i} position={position}>
        <sphereGeometry args={[i % 7 === 0 ? .085 : .042, 12, 12]} />
        <meshBasicMaterial color={i % 7 === 0 ? "#e6b87f" : "#b3c2ce"} />
      </mesh>)}
      <mesh><icosahedronGeometry args={[.45, 0]} /><meshBasicMaterial color="#dab288" wireframe /></mesh>
    </group>
    <group ref={armillary} scale={.001}>
      {[0, 1, 2, 3].map(index => <mesh key={index} rotation={[index * .8, index * .6, index * .4]}>
        <torusGeometry args={[1.45 + index * .3, index === 0 ? .022 : .009, 8, 140]} />
        <meshBasicMaterial color={index % 2 === 0 ? "#d2ac7f" : "#a7b7c7"} transparent opacity={.8} />
      </mesh>)}
    </group>
    <group ref={satellites}>{[0, 1, 2].map(index => <mesh key={index}>
      <sphereGeometry args={[index === 0 ? .072 : .043, 16, 16]} />
      <meshBasicMaterial color={index === 0 ? "#e3c294" : "#a2b6c3"} />
    </mesh>)}</group>
    <mesh rotation={[1.15, .3, .15]}><torusGeometry args={[3.02, .002, 3, 180]} /><meshBasicMaterial color="#caa27c" transparent opacity={.2} /></mesh>
  </group>;
}

function Fallback() { return <div className="cosmic-fallback" aria-hidden="true"><Image className="fallback-orbits" src="/assets/st-monogram.webp" width={400} height={400} alt="" /></div>; }
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> { state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; } render() { return this.state.failed ? <Fallback /> : this.props.children; } }

export default function CosmicCanvas({ paused, mode }: { paused: boolean; mode: SceneMode }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [supported, setSupported] = useState(false);
  const [lost, setLost] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    const initialize = requestAnimationFrame(() => {
      update();
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupported(Boolean(gl));
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    });
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .05 });
    if (root.current) observer.observe(root.current);
    const visibility = () => setVisible(document.visibilityState === "visible" && Boolean(root.current && root.current.getBoundingClientRect().bottom > 0));
    document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(initialize); media.removeEventListener("change", update); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  const moving = visible && !reduced && !paused;
  return <div className="cosmic-canvas" ref={root} aria-hidden="true">{supported && !lost ? <SceneBoundary><Canvas frameloop={moving ? "always" : "demand"} camera={{ position: [0, 1.1, 8.7], fov: 44 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} onCreated={({ gl }) => { gl.domElement.addEventListener("webglcontextlost", () => setLost(true), { once: true }); }}><OrbitalScene moving={moving} mode={mode} /><OrbitControls enableZoom={false} enablePan={false} enableDamping={false} autoRotate={moving} autoRotateSpeed={.45} minPolarAngle={Math.PI * .25} maxPolarAngle={Math.PI * .7} /></Canvas></SceneBoundary> : <Fallback />}</div>;
}
