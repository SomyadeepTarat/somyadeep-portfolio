"use client";

import { useState } from "react";
import type { Project } from "../data/projects";

export default function OrbitSystem({ projects, onOpen }: { projects: Project[]; onOpen: (index: number) => void }) {
  const [active, setActive] = useState(0);
  const project = projects[active];
  return (
    <div className="orrery" data-reveal>
      <div className="orrery-map" aria-label="Orbiting project navigation">
        <div className="sun"><span>ST</span></div>
        <div className="orbit-line l1" /><div className="orbit-line l2" /><div className="orbit-line l3" />
        {projects.map((item, index) => (
          <button key={item.name} className={`planet orbiting-planet moving-${index + 1} ${active === index ? "active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => onOpen(index)} aria-label={`Open ${item.name} project dossier`}>
            <span>{item.code}</span><b>{item.name}</b>
          </button>
        ))}
      </div>
      <article className="project-card">
        <div className="mission-stamp">CLASSIFIED</div>
        <p>MISSION LOG #{project.code} / {project.year}</p>
        <div className="mission-status"><span>{project.status}</span><span>{project.type}</span></div>
        <h3>{project.name}</h3><p>{project.text}</p>
        <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        <button onClick={() => onOpen(active)}>OPEN DOSSIER ↗</button>
      </article>
    </div>
  );
}
