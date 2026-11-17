'use client';
import { useState } from 'react';
import { projects } from '../data/profile';
import { ui } from '../data/interface';
import ProjectArtwork from '../components/ProjectArtwork';
import Overlay from '../desktop/Overlay';
export default function Photos() {
 const [album,setAlbum] = useState('Projects'), [index,setIndex] = useState<number|null>(null);
 return <div className="utility-app"><h2>{ui.photos.title}</h2><div className="segmented">{ui.photos.albums.map(a => <button key={a} aria-pressed={a === album} onClick={() => setAlbum(a)}>{a}</button>)}</div>{album === 'Projects' ? <><p className="photo-caption">{ui.projects.assets}</p><div className="photo-grid">{projects.map((p,i) => <button key={p.id} onClick={() => setIndex(i)}><ProjectArtwork id={p.id}/><span>{p.name}</span></button>)}</div></> : <p className="empty-state">{ui.photos.empty}</p>}{index !== null && <Overlay title={projects[index].name} onClose={() => setIndex(null)}><div className="photo-lightbox" tabIndex={0} onKeyDown={e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setIndex((index+(e.key === 'ArrowRight'?1:-1)+projects.length)%projects.length); } }}><ProjectArtwork id={projects[index].id}/><footer><button aria-label="Previous photo" onClick={() => setIndex((index-1+projects.length)%projects.length)}>←</button><span>{index+1} / {projects.length}</span><button aria-label="Next photo" onClick={() => setIndex((index+1)%projects.length)}>→</button></footer></div></Overlay>}</div>;
}
