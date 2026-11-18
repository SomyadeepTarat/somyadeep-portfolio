"use client";
import { ui } from "../data/interface";
import { experience, leadership, copy } from "../data/profile";
import type { AppProps } from "../desktop/registry";
export default function Experience({ selection, onNavigate }: AppProps) {
  const selected = selection || "highlights";
  const item = experience.find((e) => e.id === selected) || experience[0];
  return (
    <div className="split-app">
      <aside
        className="app-sidebar"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const ids = ["highlights", ...experience.map((e) => e.id)];
            onNavigate(
              "experience",
              ids[
                (ids.indexOf(selected) +
                  (e.key === "ArrowDown" ? 1 : -1) +
                  ids.length) %
                  ids.length
              ],
            );
          }
        }}
      >
        <span className="section-kicker">{ui.notes.pinned}</span>
        <button
          className={selected === "highlights" ? "selected" : ""}
          onClick={() => onNavigate("experience", "highlights")}
        >
          {ui.notes.highlights}
        </button>
        <span className="section-kicker">EXPERIENCE</span>
        {experience.map((e) => (
          <button
            className={selected === e.id ? "selected" : ""}
            key={e.id}
            onClick={() => onNavigate("experience", e.id)}
          >
            <span className={`company-avatar ${e.id}`}>{e.initials}</span>
            <span>
              {e.shortName}
              <small>{e.dates}</small>
            </span>
          </button>
        ))}
        <div className="sidebar-note">
          Two internships.
          <br />
          Different problems.
          <br />
          Always learning.
        </div>
      </aside>
      {selected === "highlights" ? (
        <article className="experience-detail">
          <span className="eyebrow">{ui.notes.highlights}</span>
          <h2>{ui.notes.title}</h2>
          {experience.map((e) => (
            <section className="highlight-note" key={e.id}>
              <button onClick={() => onNavigate("experience", e.id)}>
                <h3>{e.company} ↗</h3>
              </button>
              <p>
                {e.role} · {e.dates}
              </p>
              <ul className="highlights">
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          ))}
          <section className="leadership">
            <h3>{copy.experience.leadership}</h3>
            {leadership.map((l) => (
              <div key={l.organization}>
                <h3>
                  {l.organization}
                  <span>{l.role}</span>
                </h3>
                <p>{l.description}</p>
              </div>
            ))}
          </section>
        </article>
      ) : (
        <article className="experience-detail">
          <span className="eyebrow">{item.category}</span>
          <div className={`company-avatar large ${item.id}`}>
            {item.initials}
          </div>
          <h2>{item.company}</h2>
          <h3 className="role-title">{item.role}</h3>
          <div className="detail-meta">
            <span>{item.dates}</span>
            <span>{item.location}</span>
          </div>
          <div className="divider" />
          <span className="section-kicker">CONTRIBUTIONS</span>
          <ul className="highlights">
            {item.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="tags">
            {item.stack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <section className="leadership">
            <span className="section-kicker">{copy.experience.leadership}</span>
            {leadership.map((l) => (
              <div key={l.organization}>
                <h3>
                  {l.organization}
                  <span>{l.role}</span>
                </h3>
                <p>{l.description}</p>
              </div>
            ))}
          </section>
        </article>
      )}
    </div>
  );
}
