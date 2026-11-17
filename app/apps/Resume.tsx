"use client";
import { useState } from "react";
import Image from "next/image";
import { profile, copy, experience, projects, skills } from "../data/profile";
import { Icon } from "../desktop/icons";
export default function Resume() {
  const [web, setWeb] = useState(false);
  const [native, setNative] = useState(false);
  const [zoom, setZoom] = useState(100);
  return (
    <div className="resume-app">
      <div className="resume-toolbar">
        <span>Somyadeep Tarat · 1 page</span>
        <div>
          <button onClick={() => setWeb(!web)}>{web ? "PDF preview" : "View as web page"}</button>
          <button onClick={() => window.open(profile.resume, "_blank", "noopener,noreferrer")}>Print / open PDF</button>
          <button onClick={() => { setWeb(false); setNative(!native); }}>
            {native ? "Page preview" : "Native PDF"}
          </button>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            aria-label="Open resume PDF in a new tab"
          >
            <Icon name="arrow" size={15} />
            Open
          </a>
          <a className="primary-button" href={profile.resume} download>
            Download ↓
          </a>
        </div>
      </div>
      {web ? <article className="web-resume utility-app"><h1>{profile.name}</h1><p>{profile.role} · {profile.email}</p><h2>{profile.education.institution}</h2><p>{profile.education.degree} · {profile.education.dates} · CGPA {profile.education.cgpa}</p>{experience.map(e => <section key={e.id}><h2>{e.company}</h2><p>{e.role} · {e.dates}</p><ul>{e.highlights.map(h => <li key={h}>{h}</li>)}</ul></section>)}{projects.map(p => <section key={p.id}><h2>{p.name}</h2><p>{p.subtitle}</p><ul>{p.highlights.map(h => <li key={h}>{h}</li>)}</ul></section>)}{skills.map(s => <section key={s.category}><h3>{s.category}</h3><p>{s.items.join(" · ")}</p></section>)}</article> : native ? (
        <object
          className="pdf-viewer"
          data={profile.resume}
          type="application/pdf"
          aria-label="Somyadeep Tarat resume PDF"
        >
          <div className="pdf-fallback">
            <h2>{copy.resume.title}</h2>
            <p>{copy.resume.fallback}</p>
            <a
              className="primary-button"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              Open resume ↗
            </a>
          </div>
        </object>
      ) : (
        <>
          <div className="pdf-zoom">
            <button
              aria-label="Zoom out resume"
              disabled={zoom <= 75}
              onClick={() => setZoom((z) => z - 25)}
            >
              −
            </button>
            <span>{zoom}%</span>
            <button
              aria-label="Zoom in resume"
              disabled={zoom >= 175}
              onClick={() => setZoom((z) => z + 25)}
            >
              +
            </button>
            <span>Page 1 of 1</span>
          </div>
          <div className="pdf-page-scroll">
            <Image
              src="/resume/preview.webp"
              width={1391}
              height={1800}
              alt="Preview of Somyadeep Tarat’s one-page resume. The same content is available as accessible text in About, Experience, and Projects, and in the downloadable PDF."
              style={{ width: `${zoom}%`, height: "auto", maxWidth: "none" }}
            />
          </div>
        </>
      )}
      <p className="pdf-note">{copy.resume.note}</p>
    </div>
  );
}
