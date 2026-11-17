"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ui } from "../data/interface";
import { profile, projects } from "../data/profile";
import type { AppProps } from "./registry";
type Position = { x: number; y: number };
function Widget({
  id,
  title,
  children,
  initial,
}: {
  id: string;
  title: string;
  children: ReactNode;
  initial: Position;
}) {
  const [position, setPosition] = useState(initial);
  const drag = useRef<{ x: number; y: number; start: Position } | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const all = JSON.parse(
          localStorage.getItem("portfolio-widget-positions") || "{}",
        );
        if (all[id] && Number.isFinite(all[id].x) && Number.isFinite(all[id].y))
          setPosition(all[id]);
      } catch {}
    });
    const reset = () => setPosition(initial);
    window.addEventListener("portfolio-reset", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("portfolio-reset", reset);
    };
  }, [id, initial]);
  const save = (p: Position) => {
    setPosition(p);
    try {
      const all = JSON.parse(
        localStorage.getItem("portfolio-widget-positions") || "{}",
      );
      localStorage.setItem(
        "portfolio-widget-positions",
        JSON.stringify({ ...all, [id]: p }),
      );
    } catch {}
  };
  const clamp = (p: Position) => ({
    x: Math.max(16, Math.min(p.x, innerWidth - 240)),
    y: Math.max(55, Math.min(p.y, innerHeight - 290)),
  });
  return (
    <section
      className="desktop-widget"
      style={{ left: position.x, top: position.y }}
    >
      <button
        className="widget-handle"
        aria-label={`Move ${title}. Use arrow keys.`}
        onKeyDown={(e) => {
          if (e.key.startsWith("Arrow")) {
            e.preventDefault();
            save(
              clamp({
                x:
                  position.x +
                  (e.key === "ArrowLeft"
                    ? -20
                    : e.key === "ArrowRight"
                      ? 20
                      : 0),
                y:
                  position.y +
                  (e.key === "ArrowUp" ? -20 : e.key === "ArrowDown" ? 20 : 0),
              }),
            );
          }
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, start: position };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d)
            setPosition(
              clamp({
                x: d.start.x + e.clientX - d.x,
                y: d.start.y + e.clientY - d.y,
              }),
            );
        }}
        onPointerUp={() => {
          drag.current = null;
          save(position);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {title}
        <span>⠿</span>
      </button>
      {children}
    </section>
  );
}
const positions = {
  clock: { x: 24, y: 70 },
  status: { x: 24, y: 250 },
  learning: { x: 24, y: 430 },
  latest: { x: 274, y: 70 },
  github: { x: 274, y: 250 },
};
export default function Widgets({ onNavigate }: AppProps) {
  const [time, setTime] = useState(""),
    [days, setDays] = useState<{ date: string; count: number }[] | null>(null);
  useEffect(() => {
    const clock = () =>
      setTime(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    const frame = requestAnimationFrame(clock),
      timer = setInterval(clock, 60000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/github-contributions.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => {
        if (Array.isArray(d.days)) setDays(d.days.slice(-84));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <div className="widgets">
      <Widget id="clock" title={ui.widgets.clock} initial={positions.clock}>
        <strong className="widget-clock">{time}</strong>
      </Widget>
      <Widget id="status" title={ui.widgets.status} initial={positions.status}>
        <p>{ui.welcome.status}</p>
        <button onClick={() => onNavigate("mail")}>
          {ui.welcome.contact} ↗
        </button>
      </Widget>
      <Widget
        id="learning"
        title={ui.widgets.learning}
        initial={positions.learning}
      >
        <p>{ui.widgets.learningTodo}</p>
      </Widget>
      <Widget id="latest" title={ui.widgets.latest} initial={positions.latest}>
        <h3>{projects[0].name}</h3>
        <p>{projects[0].subtitle}</p>
        <button onClick={() => onNavigate("projects", projects[0].id)}>
          {ui.welcome.projects} ↗
        </button>
      </Widget>
      <Widget id="github" title={ui.widgets.github} initial={positions.github}>
        {days?.length ? (
          <div className="contribution-grid">
            {days.map((d) => (
              <span
                key={d.date}
                title={`${d.date}: ${d.count}`}
                style={{
                  opacity: d.count ? Math.min(1, 0.3 + d.count / 10) : 0.12,
                }}
              />
            ))}
          </div>
        ) : (
          <p>{ui.widgets.unavailable}</p>
        )}
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </Widget>
    </div>
  );
}
