"use client";
import { useState } from "react";
import { profile, experience } from "../data/profile";
import { ui } from "../data/interface";
export default function Timeline() {
  const [filter, setFilter] = useState<string>("all");
  const entries = [
    ...experience.map((e) => ({
      id: e.id,
      type: "work",
      title: e.company,
      body: e.role,
      dates: e.dates,
      start: e.start,
    })),
    {
      id: "education",
      type: "education",
      title: profile.education.institution,
      body: profile.education.degree,
      dates: profile.education.dates,
      start: "2024-08",
    },
  ].sort((a, b) => b.start.localeCompare(a.start));
  return (
    <div className="utility-app">
      <span className="eyebrow">TIMELINE</span>
      <h2>{ui.timeline.title}</h2>
      <div className="segmented">
        {ui.timeline.filters.map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="career-timeline">
        {entries
          .filter((e) => filter === "all" || e.type === filter)
          .map((e) => (
            <article key={e.id}>
              <span>{e.dates}</span>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
              <small>{e.type}</small>
            </article>
          ))}
      </div>
      {filter === "awards" && (
        <p className="empty-state">{ui.timeline.empty}</p>
      )}
    </div>
  );
}
