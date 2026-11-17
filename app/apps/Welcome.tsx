'use client';
import Image from 'next/image';
import { profile } from '../data/profile';
import { ui } from '../data/interface';
import type { AppProps } from '../desktop/registry';
export default function Welcome({ onNavigate }: AppProps) {
  return <div className="welcome-app"><div className="welcome-top"><Image src={profile.portrait} width={72} height={88} alt={profile.name}/><span className="status-pill">{ui.welcome.status}</span></div><span className="eyebrow">{ui.welcome.eyebrow}</span><h2>{ui.welcome.title}</h2><p>{ui.welcome.intro}</p><div className="welcome-actions"><button className="primary-button" onClick={() => onNavigate('experience')}>{ui.welcome.experience} ↗</button><button onClick={() => onNavigate('projects')}>{ui.welcome.projects} ↗</button><a href={profile.resume} download>{ui.welcome.resume} ↓</a></div><footer><span>{profile.name}</span><button onClick={() => onNavigate("mail")}>{ui.welcome.contact} ↗</button></footer></div>;
}
