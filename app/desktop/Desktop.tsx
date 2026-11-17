"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { apps, type AppId } from "./registry";
import { WindowProvider, useWindows } from "./store";
import { usePreferences } from "./preferences";
import { AppIcon, Icon } from "./icons";
import Window from "./Window";
import { profile, projects, experience } from "../data/profile";
function Shell({ onStandard }: { onStandard: () => void }) {
  const { state, dispatch } = useWindows();
  const { dark, update } = usePreferences();
  const [time, setTime] = useState("");
  const [spotlight, setSpotlight] = useState(false);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [intro, setIntro] = useState(false);
  const searchRef = useRef<HTMLDialogElement>(null);
  const introRef = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const active = state.windows.filter((w) => !w.minimized).at(-1);
  const activeApp = apps.find((a) => a.id === active?.id);
  const open = useCallback(
    (id: AppId, selection?: string) => {
      dispatch({
        type: "open",
        id,
        selection,
        viewport: { width: innerWidth, height: innerHeight },
      });
      setMenu(null);
    },
    [dispatch],
  );
  useEffect(() => {
    const initialize = requestAnimationFrame(() => {
      open("about");
      try {
        if (!sessionStorage.getItem("portfolio-visited")) setIntro(true);
      } catch {}
      const clock = () =>
        setTime(
          new Intl.DateTimeFormat(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date()),
        );
      clock();
    });
    const timer = setInterval(
      () =>
        setTime(
          new Intl.DateTimeFormat(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date()),
        ),
      1000,
    );
    const resize = () =>
      dispatch({ type: "viewport", width: innerWidth, height: innerHeight });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(initialize);
      clearInterval(timer);
      window.removeEventListener("resize", resize);
    };
  }, [dispatch, open]);
  const dismissIntro = useCallback(() => {
    setIntro(false);
    try {
      sessionStorage.setItem("portfolio-visited", "1");
    } catch {}
  }, []);
  useEffect(() => {
    if (!intro) return;
    introRef.current?.showModal();
    const timer = setTimeout(dismissIntro, 2000);
    return () => clearTimeout(timer);
  }, [intro, dismissIntro]);
  const showSearch = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    setQuery("");
    setSpotlight(true);
    setMenu(null);
  }, []);
  useEffect(() => {
    if (spotlight) searchRef.current?.showModal();
    else {
      searchRef.current?.close();
      previousFocus.current?.focus();
    }
  }, [spotlight]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        showSearch();
      }
      if (e.key === "Escape" && !spotlight) {
        if (intro) {
          dismissIntro();
          return;
        }
        if (menu) {
          setMenu(null);
          return;
        }
        if (active) {
          dispatch({ type: "close", id: active.id });
          document.getElementById(`dock-${active.id}`)?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, dispatch, spotlight, menu, intro, dismissIntro, showSearch]);
  const results = [
    ...apps.map((a) => ({
      id: a.id,
      label: a.name,
      category: "Application",
      selection: undefined as string | undefined,
    })),
    ...projects.map((p) => ({
      id: "projects" as const,
      label: p.name,
      category: "Project",
      selection: p.id,
    })),
    ...experience.map((e) => ({
      id: "experience" as const,
      label: e.company,
      category: e.role,
      selection: e.id,
    })),
  ].filter((r) =>
    `${r.label} ${r.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const menuActions: Record<string, { label: string; action: () => void }[]> = {
    File: [
      { label: "Open resume", action: () => open("resume") },
      {
        label: "Contact Somyadeep ↗",
        action: () => {
          window.location.assign(`mailto:${profile.email}`);
        },
      },
    ],
    Edit: [{ label: "Search portfolio…", action: showSearch }],
    View: [
      { label: "Appearance & wallpaper", action: () => open("settings") },
      { label: "Standard portfolio", action: onStandard },
    ],
    Window: [
      ...apps.map((a) => ({ label: a.name, action: () => open(a.id) })),
      ...(active
        ? [
            {
              label: "Minimize active window",
              action: () => dispatch({ type: "minimize", id: active.id }),
            },
            {
              label: "Maximize / restore",
              action: () => dispatch({ type: "maximize", id: active.id }),
            },
          ]
        : []),
    ],
    Help: [
      { label: "Search · ⌘ / Ctrl K", action: showSearch },
      { label: "Keyboard guide", action: () => open("settings", "keyboard") },
    ],
  };
  return (
    <main className="desktop" aria-label="Portfolio desktop">
      <div className="wallpaper" aria-hidden="true" />
      <header className="menubar">
        <button
          className="menu-brand"
          onClick={() => open("about")}
          aria-label="st. — About Somyadeep"
        >
          st<span>.</span>
        </button>
        <strong className="active-app-name">
          {activeApp?.name || "Desktop"}
        </strong>
        <nav aria-label="Desktop menus">
          {Object.keys(menuActions).map((label) => (
            <div className="menu-container" key={label}>
              <button
                aria-expanded={menu === label}
                onClick={() => setMenu(menu === label ? null : label)}
              >
                {label}
              </button>
              {menu === label && (
                <div className="menu-popover">
                  {menuActions[label].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setMenu(null);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="menu-status">
          <span
            className="connection"
            title="Decorative connection indicator"
            aria-hidden="true"
          >
            ◉
          </span>
          <span className="battery" aria-hidden="true" />
          <button
            onClick={() => update({ theme: dark ? "light" : "dark" })}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
          >
            <Icon name={dark ? "moon" : "sun"} size={16} />
          </button>
          <button
            onClick={showSearch}
            aria-label="Search portfolio (Command or Control K)"
          >
            <Icon name="search" size={16} />
          </button>
          <time>{time}</time>
        </div>
      </header>
      {menu && <div className="menu-dismiss" onClick={() => setMenu(null)} />}
      <div className="desktop-intro">
        <span className="eyebrow">A PERSONAL WORKSPACE</span>
        <h1>
          Somyadeep Tarat<span>.</span>
        </h1>
        <p>Software, systems & a little curiosity.</p>
      </div>
      <div className="desktop-files">
        {[
          { id: "resume" as const, label: "Resume.pdf" },
          { id: "projects" as const, label: "Selected projects" },
        ].map((file) => (
          <button
            key={file.id}
            onDoubleClick={() => open(file.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(file.id);
              }
            }}
            aria-label={`Open ${file.label}. Double click or press Enter.`}
          >
            <AppIcon name={file.id} />
            <span>{file.label}</span>
          </button>
        ))}
      </div>
      {state.windows.map((w, i) => (
        <Window
          key={w.id}
          window={w}
          index={i}
          active={active?.id === w.id}
          onNavigate={open}
        />
      ))}
      <div className="desktop-footer">
        <span>DESIGNED FOR EXPLORATION</span>
        <button onClick={showSearch}>
          <Icon name="search" size={12} /> Find something <kbd>⌘ K</kbd>
        </button>
      </div>
      <nav className="dock" aria-label="Portfolio applications">
        {apps.map((app) => (
          <button
            id={`dock-${app.id}`}
            key={app.id}
            aria-label={`Open ${app.name}`}
            aria-pressed={active?.id === app.id}
            className={
              state.windows.some((w) => w.id === app.id) ? "running" : ""
            }
            onClick={() => open(app.id)}
          >
            <span className="dock-tooltip">{app.name}</span>
            <AppIcon name={app.icon} />
            <i aria-hidden="true" />
          </button>
        ))}
        <span className="dock-divider" />
        <a
          className="dock-contact"
          href={`mailto:${profile.email}`}
          aria-label="Email Somyadeep"
        >
          <span className="dock-tooltip">Say hello</span>
          <span className="app-icon icon-mail">
            <Icon name="mail" size={30} />
          </span>
        </a>
      </nav>
      <dialog
        ref={searchRef}
        className="spotlight"
        aria-label="Search portfolio"
        onCancel={() => setSpotlight(false)}
        onClose={() => setSpotlight(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSpotlight(false);
        }}
      >
        <div className="search-inner">
          <label className="search-input">
            <Icon name="search" size={24} />
            <input
              autoFocus
              placeholder="Search apps, projects, experience…"
              aria-label="Search portfolio"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={() => setSpotlight(false)}
              aria-label="Close search"
            >
              <kbd>esc</kbd>
            </button>
          </label>
          <div className="search-results" aria-live="polite">
            {results.length ? (
              results.map((r) => (
                <button
                  key={`${r.id}-${r.selection || "app"}`}
                  onClick={() => {
                    previousFocus.current = null;
                    setSpotlight(false);
                    open(r.id, r.selection);
                    requestAnimationFrame(() =>
                      document.getElementById(`window-${r.id}`)?.focus(),
                    );
                  }}
                >
                  <AppIcon name={apps.find((a) => a.id === r.id)!.icon} small />
                  <span>
                    {r.label}
                    <small>{r.category}</small>
                  </span>
                  <span className="result-arrow">↗</span>
                </button>
              ))
            ) : (
              <p>No results. Try “Atlas” or “Experience”.</p>
            )}
          </div>
          <footer>Navigate with Tab · Open with Enter</footer>
        </div>
      </dialog>
      {intro && (
        <dialog
          ref={introRef}
          className="boot-screen"
          aria-label="Welcome"
          onCancel={dismissIntro}
        >
          <div className="boot-monogram">st.</div>
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
          <button autoFocus onClick={dismissIntro}>
            Enter workspace <span>→</span>
          </button>
          <small>A place for things I build.</small>
        </dialog>
      )}
    </main>
  );
}
export default function Desktop(props: { onStandard: () => void }) {
  return (
    <WindowProvider>
      <Shell {...props} />
    </WindowProvider>
  );
}
