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

function Planet({ moving }: { moving: boolean }) {
  const planet = useRef<THREE.Mesh>(null);
  useFrame((_,delta) => { if(planet.current && moving) planet.current.rotation.y += Math.min(delta,.05)*.035; });
  const rings = useMemo(() => Array.from({length:7},(_,i) => {
    const points = Array.from({length:181},(_,j) => { const a=j/180*Math.PI*2;const r=2.2+i*.065;return new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r); });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color:i%2===0?"#b5946b":"#655b49",transparent:true,opacity:i===0||i===6?.55:.25});
    return new THREE.LineLoop(geometry,material);
  }),[]);
  useEffect(()=>()=>{rings.forEach(r=>{r.geometry.dispose();(r.material as THREE.Material).dispose();});},[rings]);
  return <group rotation={[.22,0,-.35]}>
    <mesh ref={planet}><sphereGeometry args={[1.62,96,64]}/><shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader}/></mesh>
    <group rotation={[.19,0,.06]}>{rings.map((ring,i)=><primitive key={i} object={ring}/>)}</group>
    <mesh position={[2.63,.25,.3]}><sphereGeometry args={[.045,12,12]}/><meshBasicMaterial color="#d1b38a"/></mesh>
    <mesh rotation={[1.15,.3,.15]}><torusGeometry args={[3.02,.002,3,180]}/><meshBasicMaterial color="#caa27c" transparent opacity={.2}/></mesh>
  </group>;
}

function Fallback(){return <div className="cosmic-fallback" aria-hidden="true"><Image className="fallback-orbits" src="/assets/st-monogram.webp" width={400} height={400} alt=""/></div>;}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<Fallback/>:this.props.children;}}

export default function CosmicCanvas({ paused }: { paused: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible,setVisible] = useState(false);
  const [reduced,setReduced] = useState(true);
  const [supported,setSupported] = useState(false);
  const [lost,setLost] = useState(false);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReduced(media.matches);
    media.addEventListener("change",update);
    const initialize = requestAnimationFrame(() => {
    update();
    const canvas=document.createElement("canvas");
    const gl=canvas.getContext("webgl2");
    setSupported(Boolean(gl));
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    });
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.05});
    if(root.current)observer.observe(root.current);
    const visibility=()=>setVisible(document.visibilityState==="visible" && Boolean(root.current && root.current.getBoundingClientRect().bottom>0));
    document.addEventListener("visibilitychange",visibility);
    return()=>{cancelAnimationFrame(initialize);media.removeEventListener("change",update);observer.disconnect();document.removeEventListener("visibilitychange",visibility);};
  },[]);
  const moving=visible&&!reduced&&!paused;
  return <div className="cosmic-canvas" ref={root} aria-hidden="true">{supported&&!lost?<SceneBoundary><Canvas frameloop={moving?"always":"demand"} camera={{position:[0,1.1,8.7],fov:44}} dpr={[1,1.5]} gl={{antialias:true,alpha:true,powerPreference:"low-power"}} onCreated={({gl})=>{gl.domElement.addEventListener("webglcontextlost",()=>setLost(true),{once:true});}}><Planet moving={moving}/><OrbitControls enableZoom={false} enablePan={false} enableDamping={false} autoRotate={moving} autoRotateSpeed={.18} minPolarAngle={Math.PI*.25} maxPolarAngle={Math.PI*.7}/></Canvas></SceneBoundary>:<Fallback/>}</div>;
}
