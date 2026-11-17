"use client";
import { useState } from "react";
import { skills } from "../data/profile";
import { ui } from "../data/interface";
import type { AppProps } from "../desktop/registry";
export default function Skills({ selection }: AppProps) {
  const [category, setCategory] = useState(
    skills.find(
      (g) => g.category === selection || g.items.includes(selection || ""),
    )?.category || skills[0].category,
  );
  const group = skills.find((g) => g.category === category)!;
  return (
    <div className="utility-app skills-app">
      <span className="eyebrow">ACTIVITY MONITOR</span>
      <h2>{ui.skills.title}</h2>
      <p>{ui.skills.note}</p>
      <div className="skill-tabs" role="tablist">
        {skills.map((g) => (
          <button
            key={g.category}
            role="tab"
            aria-selected={category === g.category}
            aria-controls="skill-panel"
            onClick={() => setCategory(g.category)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
                const next =
                  skills[
                    (skills.indexOf(g) +
                      (e.key === "ArrowRight" ? 1 : -1) +
                      skills.length) %
                      skills.length
                  ];
                setCategory(next.category);
                (
                  e.currentTarget.parentElement?.children[
                    skills.indexOf(next)
                  ] as HTMLElement
                )?.focus();
              }
            }}
          >
            {g.category}
          </button>
        ))}
      </div>
      <div
        id="skill-panel"
        role="tabpanel"
        aria-label={category}
        className="skill-inventory"
      >
        {group.items.map((s, i) => (
          <div key={s} className={selection === s ? "selected-skill" : ""}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{s}</strong>
            <span>●</span>
          </div>
        ))}
      </div>
      <p className="todo-note">{ui.skills.todo}</p>
    </div>
  );
}
