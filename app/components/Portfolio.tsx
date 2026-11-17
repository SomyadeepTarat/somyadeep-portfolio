'use client';
import dynamic from 'next/dynamic';
import {useEffect,useState,type ReactNode} from 'react';
import {PreferencesProvider,usePreferences} from '../desktop/preferences';
import {Icon} from '../desktop/icons';
const Desktop=dynamic(()=>import('../desktop/Desktop'),{ssr:false});
function Layout({children}:{children:ReactNode}){const [wide,setWide]=useState(false);const [standard,setStandard]=useState(false);const {dark,update}=usePreferences();useEffect(()=>{const media=matchMedia('(min-width: 768px)');const sync=()=>setWide(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);return wide&&!standard?<Desktop onStandard={()=>setStandard(true)}/>:<><div className="mobile-controls">{wide&&<button onClick={()=>setStandard(false)}>Desktop view ↗</button>}<button aria-label={`Switch to ${dark?'light':'dark'} theme`} onClick={()=>update({theme:dark?'light':'dark'})}><Icon name={dark?'moon':'sun'}/></button></div>{children}</>;}
export default function Portfolio({children}:{children:ReactNode}){return <PreferencesProvider><Layout>{children}</Layout></PreferencesProvider>;}
