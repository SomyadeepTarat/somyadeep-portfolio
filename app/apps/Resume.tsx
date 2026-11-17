"use client";
import { useState } from "react";
import Image from "next/image";
import { profile, copy } from "../data/profile";
import { Icon } from "../desktop/icons";
export default function Resume() {
  const [native, setNative] = useState(false);
  const [zoom, setZoom] = useState(100);
  return (
    <div className="resume-app">
      <div className="resume-toolbar">
        <span>Somyadeep Tarat · 1 page</span>
        <div>
          <button onClick={() => setNative(!native)}>
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
      {native ? (
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
