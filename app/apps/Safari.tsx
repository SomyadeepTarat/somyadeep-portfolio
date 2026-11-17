'use client';
import { useState } from 'react';
import { projects, profile } from '../data/profile';
import { ui } from '../data/interface';
export default function Safari() {
 const links = [...projects.filter(p => p.live).map(p => ({ name:p.name,url:p.live! })), { name:'GitHub',url:profile.github },{ name:'LinkedIn',url:profile.linkedin }];
 const [tab,setTab] = useState(0), [loaded,setLoaded] = useState(false);
 const item = links[tab];
 return <div className="safari-app"><div className="browser-tabs">{links.map((l,i) => <button key={l.url} aria-pressed={tab === i} onClick={() => { setTab(i); setLoaded(false); }}>{l.name}</button>)}</div><div className="address-bar"><span>↗ {new URL(item.url).hostname}</span><a href={item.url} target="_blank" rel="noreferrer">{ui.safari.open} ↗</a></div><div className="utility-app"><h2>{ui.safari.title}</h2><p>{ui.safari.fallback}</p>{!projects.some(p => p.live) && <p className="todo-note">{ui.safari.empty}</p>}<button className="primary-button" onClick={() => setLoaded(true)}>{ui.safari.load}</button></div>{loaded && <iframe key={item.url} title={item.name} src={item.url} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerPolicy="no-referrer" loading="lazy"/>}</div>;
}
