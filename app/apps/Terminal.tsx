"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { profile, experience, skills, projects } from "../data/profile";
import { ui } from "../data/interface";
import { apps, type AppProps } from "../desktop/registry";
import { usePreferences } from "../desktop/preferences";
const commands = [
  "help",
  "whoami",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
  "open",
  "resume",
  "theme",
  "clear",
  "history",
];
export default function Terminal({ onNavigate }: AppProps) {
  const { update } = usePreferences();
  const [lines, setLines] = useState<{ command: string; output: ReactNode }[]>(
    [],
  );
  const [input, setInput] = useState(""),
    [history, setHistory] = useState<string[]>([]),
    [index, setIndex] = useState(0);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);
  function run() {
    const value = input.trim();
    if (!value) return;
    const [command, ...args] = value.toLowerCase().split(/\s+/);
    let output: ReactNode = ui.terminal.unknown;
    setHistory((h) => [...h, value]);
    setIndex(history.length + 1);
    setInput("");
    if (command === "clear") {
      setLines([]);
      return;
    }
    if (command === "help") output = ui.terminal.help;
    if (command === "whoami" || command === "neofetch")
      output = `${profile.name}\n${profile.role}\n${profile.bio}\n${profile.education.institution}`;
    if (command === "skills")
      output = skills
        .map((g) => `${g.category}: ${g.items.join(", ")}`)
        .join("\n\n");
    if (command === "projects")
      output = (
        <div className="terminal-links">
          {projects.map((p) => (
            <button key={p.id} onClick={() => onNavigate("projects", p.id)}>
              {p.name} → {p.subtitle}
            </button>
          ))}
        </div>
      );
    if (command === "experience")
      output = experience
        .map((e) => `${e.company} · ${e.role} · ${e.dates}`)
        .join("\n");
    if (command === "education")
      output = `${profile.education.institution}\n${profile.education.degree}\n${profile.education.dates} · CGPA ${profile.education.cgpa}`;
    if (command === "contact" || value.toLowerCase() === "sudo hire-me")
      output = (
        <>
          <p>{ui.terminal.hire}</p>
          <a href={`mailto:${profile.email}`}>{profile.email} ↗</a>
        </>
      );
    if (command === "resume")
      output = (
        <a href={profile.resume} download>
          {ui.welcome.resume} ↓
        </a>
      );
    if (command === "history")
      output = [...history, value].map((c, i) => `${i + 1}  ${c}`).join("\n");
    if (command === "theme") {
      if (args[0] === "light" || args[0] === "dark") {
        update({ theme: args[0] });
        output = `Theme: ${args[0]}`;
      } else output = ui.terminal.usage;
    }
    if (command === "open") {
      const app = apps.find(
        (a) => a.id === args[0] || a.name.toLowerCase() === args.join(" "),
      );
      if (app) {
        onNavigate(app.id);
        output = app.name;
      } else output = apps.map((a) => a.id).join(" · ");
    }
    if (command === "matrix")
      output = (
        <div className="matrix-output">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i}>{"01 10 01 11 00 ".repeat(4)}</div>
          ))}
          <p>{ui.terminal.matrix}</p>
        </div>
      );
    if (command === "coffee") output = "☕";
    if (command === "hello") output = ui.terminal.greeting;
    setLines((l) => [...l.slice(-99), { command: value, output }]);
  }
  return (
    <div className="terminal-app">
      <header className="terminal-header">
        <span className="terminal-emblem" aria-hidden="true">
          &gt;_
        </span>
        <div>
          <h2>Workspace terminal</h2>
          <p>{ui.terminal.greeting}</p>
        </div>
        <span className="terminal-session">Interactive session</span>
      </header>
      <div
        className="terminal-transcript"
        role="log"
        aria-live="polite"
        aria-label="Command output"
      >
        {lines.map((l, i) => (
          <div className="terminal-entry" key={i}>
            <div className="terminal-command">
              <span aria-hidden="true">❯</span>
              <span>{l.command}</span>
            </div>
            <div className="terminal-output">{l.output}</div>
          </div>
        ))}
        {!lines.length && (
          <div className="terminal-empty">
            <span aria-hidden="true">~</span>
            <p>Your workspace, one command away.</p>
            <small>
              Start with <code>help</code> to see what’s possible.
            </small>
          </div>
        )}
        <div ref={end} />
      </div>
      <form
        className="terminal-composer"
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <label htmlFor="terminal-input">
          <span>{ui.terminal.prompt}</span>
          <span>~/portfolio</span>
        </label>
        <div className="terminal-input-row">
          <span className="terminal-prompt-mark" aria-hidden="true">
            ❯
          </span>
          <input
            autoFocus
            placeholder="Type a command…"
            enterKeyHint="send"
            id="terminal-input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={ui.terminal.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = Math.max(
                  0,
                  Math.min(
                    history.length,
                    index + (e.key === "ArrowUp" ? -1 : 1),
                  ),
                );
                setIndex(next);
                setInput(history[next] || "");
              }
              if (e.key === "Tab") {
                const choices = input.startsWith("open ")
                  ? apps.map((a) => `open ${a.id}`)
                  : input.startsWith("theme ")
                    ? ["theme light", "theme dark"]
                    : commands;
                const matches = choices.filter((c) => c.startsWith(input));
                if (matches.length) {
                  e.preventDefault();
                  if (matches.length === 1) setInput(matches[0]);
                  else
                    setLines((l) => [
                      ...l,
                      { command: input, output: matches.join(" · ") },
                    ]);
                }
              }
            }}
          />
          <button
            type="submit"
            className="terminal-submit"
            aria-label="Run command"
            disabled={!input.trim()}
          >
            ↵
          </button>
        </div>
        <div className="terminal-input-hints" aria-hidden="true">
          <span>
            <kbd>↵</kbd> Run
          </span>
          <span>
            <kbd>Tab</kbd> Complete
          </span>
          <span>
            <kbd>↑ ↓</kbd> History
          </span>
        </div>
      </form>
    </div>
  );
}
