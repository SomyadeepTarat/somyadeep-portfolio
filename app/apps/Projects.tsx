"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { projects, copy } from "../data/profile";
import { ui } from "../data/interface";
import type { AppProps } from "../desktop/registry";
import ProjectArtwork from "../components/ProjectArtwork";
import ProjectLinks from "../components/ProjectLinks";
import Overlay from "../desktop/Overlay";
export default function Projects({ selection, onNavigate }: AppProps) {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list" | "columns">("grid");
  const [slide, setSlide] = useState(0);
  const [quick, setQuick] = useState<string | null>(null);
  const project = projects.find((p) => p.id === selection);
  const preview = projects.find((p) => p.id === quick);
  const tags = [...new Set(projects.flatMap((p) => p.stack))];
  const matches = projects.filter(
    (p) =>
      (!filter || p.stack.includes(filter)) &&
      `${p.name} ${p.subtitle} ${p.stack.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  useEffect(() => {
    const change = (e: Event) => setView((e as CustomEvent).detail);
    window.addEventListener("portfolio-project-view", change);
    return () => window.removeEventListener("portfolio-project-view", change);
  }, []);
  const detail = (p: (typeof projects)[number]) => (
    <>
      {p.screenshots?.length ? (
        <div className="screenshot-carousel">
          <Image
            src={p.screenshots[slide % p.screenshots.length].src}
            alt={p.screenshots[slide % p.screenshots.length].alt}
            width={1200}
            height={750}
          />
          <div>
            <button
              aria-label="Previous screenshot"
              onClick={() =>
                setSlide(
                  (slide - 1 + p.screenshots!.length) % p.screenshots!.length,
                )
              }
            >
              ←
            </button>
            <span>
              {(slide % p.screenshots.length) + 1} / {p.screenshots.length}
            </span>
            <button
              aria-label="Next screenshot"
              onClick={() => setSlide(slide + 1)}
            >
              →
            </button>
          </div>
        </div>
      ) : (
        <ProjectArtwork id={p.id} />
      )}
      <div className="project-detail">
        <span className="eyebrow">{p.category}</span>
        <h2>{p.name}</h2>
        <h3>{p.subtitle}</h3>
        <p>{p.description}</p>
        <div className="tags">
          {p.stack.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <p className="todo-note">{ui.projects.role}</p>
        <h4>{copy.projects.details}</h4>
        <ul className="highlights">
          {p.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ProjectLinks project={p} />
      </div>
    </>
  );
  return (
    <div className="split-app projects-app">
      <aside className="app-sidebar">
        <button
          className={!filter ? "selected" : ""}
          onClick={() => {
            setFilter("");
            if (project) onNavigate("projects");
          }}
        >
          {ui.projects.all}
          <small className="count">{projects.length}</small>
        </button>
        <span className="section-kicker sidebar-heading">
          {ui.projects.tags}
        </span>
        {tags.map((t) => (
          <button
            key={t}
            className={filter === t ? "selected" : ""}
            onClick={() => {
              setFilter(t);
              if (project) onNavigate("projects");
            }}
          >
            {t}
          </button>
        ))}
      </aside>
      <div className="projects-content">
        {project ? (
          <>
            <div className="project-toolbar">
              <button onClick={() => onNavigate("projects")}>
                ← {ui.projects.all}
              </button>
              <button onClick={() => setQuick(project.id)}>
                {ui.projects.quick}
              </button>
            </div>
            {detail(project)}
          </>
        ) : (
          <>
            <header className="app-heading">
              <span className="eyebrow">{copy.projects.title}</span>
              <h2>{copy.projects.title}</h2>
              <p>{copy.projects.intro}</p>
            </header>
            <div className="finder-controls">
              <input
                aria-label={ui.projects.search}
                placeholder={ui.projects.search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="segmented">
                {ui.projects.views.map((v) => (
                  <button
                    key={v}
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className={`project-gallery finder-${view}`}>
              {matches.map((p) => (
                <button
                  className="project-tile"
                  key={p.id}
                  onClick={() => onNavigate("projects", p.id)}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                      setQuick(p.id);
                    }
                  }}
                >
                  <ProjectArtwork id={p.id} />
                  <div className="tile-copy">
                    <span>{p.number} ↗</span>
                    <h3>{p.name}</h3>
                    <p>{p.subtitle}</p>
                    <small>{p.stack.slice(0, 3).join(" · ")}</small>
                    {view === "columns" && <p>{p.description}</p>}
                  </div>
                </button>
              ))}
            </div>
            {!matches.length && (
              <p className="empty-state">{ui.projects.empty}</p>
            )}
            <footer className="gallery-footer">
              <span>
                {matches.length} / {projects.length}
              </span>
              <span>{ui.projects.assets}</span>
            </footer>
          </>
        )}
      </div>
      {preview && (
        <Overlay
          title={`${ui.projects.quick} · ${preview.name}`}
          onClose={() => setQuick(null)}
        >
          {detail(preview)}
        </Overlay>
      )}
    </div>
  );
}
