"use client";
import ProjectLinks from "../components/ProjectLinks";

import { useState } from "react";
import { projects, copy } from "../data/profile";
import type { AppProps } from "../desktop/registry";
import { Icon } from "../desktop/icons";
import ProjectArtwork from "../components/ProjectArtwork";
export default function Projects({ selection }: AppProps) {
  const [selected, setSelected] = useState<string | undefined>(selection);
  const [filter, setFilter] = useState("All projects");
  const project = projects.find((p) => p.id === selected);
  return (
    <div className="split-app projects-app">
      <aside className="app-sidebar">
        <span className="section-kicker">FAVORITES</span>
        <button
          className={!project && filter === "All projects" ? "selected" : ""}
          onClick={() => {
            setSelected(undefined);
            setFilter("All projects");
          }}
        >
          <Icon name="grid" size={17} />
          All projects <small className="count">03</small>
        </button>
        <span className="section-kicker sidebar-heading">COLLECTIONS</span>
        {projects.map((p) => (
          <button
            key={p.id}
            className={filter === p.category ? "selected" : ""}
            onClick={() => {
              setSelected(undefined);
              setFilter(p.category);
            }}
          >
            <span className={`category-dot ${p.id}`} />
            {p.category}
          </button>
        ))}
        <div className="sidebar-note">
          Built with purpose.
          <br />
          Explored with curiosity.
        </div>
      </aside>
      <div className="projects-content">
        {project ? (
          <>
            <div className="project-toolbar">
              <button onClick={() => setSelected(undefined)}>
                ← All projects
              </button>
              <span>{project.number} / 03</span>
            </div>
            <ProjectArtwork id={project.id} />
            <div className="project-detail">
              <span className="eyebrow">{project.category}</span>
              <h2>{project.name}</h2>
              <h3>{project.subtitle}</h3>
              <p>{project.description}</p>
              <div className="tags">
                {project.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <h4>{copy.projects.details}</h4>
              <ul className="highlights">
                {project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <ProjectLinks project={project} />
            </div>
          </>
        ) : (
          <>
            <header className="app-heading">
              <span className="eyebrow">A FEW THINGS I’VE BUILT</span>
              <h2>{copy.projects.title}</h2>
              <p>{copy.projects.intro}</p>
            </header>
            <div className="project-gallery">
              {projects
                .filter(
                  (p) => filter === "All projects" || p.category === filter,
                )
                .map((p) => (
                  <button
                    className="project-tile"
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                  >
                    <ProjectArtwork id={p.id} />
                    <div className="tile-copy">
                      <span>
                        {p.number} <Icon name="arrow" size={12} />
                      </span>
                      <h3>{p.name}</h3>
                      <p>{p.subtitle}</p>
                      <small>{p.stack.slice(0, 3).join(" · ")}</small>
                    </div>
                  </button>
                ))}
            </div>
            <footer className="gallery-footer">
              <span>
                {
                  projects.filter(
                    (p) => filter === "All projects" || p.category === filter,
                  ).length
                }{" "}
                items
              </span>
              <span>Original concept illustrations · Screenshots TODO</span>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
