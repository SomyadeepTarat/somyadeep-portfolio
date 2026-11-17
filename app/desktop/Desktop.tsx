"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { apps, type AppId } from "./registry";
import { WindowProvider, useWindows } from "./store";
import { usePreferences } from "./preferences";
import { AppIcon, Icon } from "./icons";
import Window from "./Window";
import { profile } from "../data/profile";
import Overlay from "./Overlay";
import { shortcuts } from "./shortcuts";
import { ui } from "../data/interface";
import { parseRoute, navigateHash } from "./navigation";
import { searchPortfolio, type SearchResult } from "./search";
function Shell({ onStandard }: { onStandard: () => void }) {
  const { state, dispatch } = useWindows();
  const { dark, update } = usePreferences();
  const [ready, setReady] = useState(false);
  const [mission, setMission] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [context, setContext] = useState<{ x: number; y: number; app?: AppId } | null>(null);
  const [time, setTime] = useState("");
  const [spotlight, setSpotlight] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [hint, setHint] = useState(false);
  const dismissHint = () => { setHint(false); try { localStorage.setItem("portfolio-hints", "seen"); } catch {} };
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
      navigateHash(id, selection);
      setMenu(null);
    },
    [dispatch],
  );
  useEffect(() => {
    const initialize = requestAnimationFrame(() => {
      const route = parseRoute(location.hash);
      let restored = false;
      if (!location.hash) { try { const saved = JSON.parse(localStorage.getItem('portfolio-windows') || 'null'); if (Array.isArray(saved) && saved.length) { dispatch({ type: 'restore', windows: saved, width: innerWidth, height: innerHeight }); restored = true; } } catch {} }
      if (!restored) open(route?.id || "welcome", route?.selection);
      setReady(true);
      try {
        if (!route && !sessionStorage.getItem("portfolio-visited")) setIntro(true);
        setHint(!localStorage.getItem("portfolio-hints"));
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
    const routeChange = () => { const route = parseRoute(location.hash); open(route?.id || "welcome", route?.selection); };
    window.addEventListener("popstate", routeChange);
    window.addEventListener("hashchange", routeChange);
    const resetHints = () => setHint(true);
    window.addEventListener("portfolio-reset-hints", resetHints);
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
      window.removeEventListener("popstate", routeChange);
      window.removeEventListener("hashchange", routeChange);
      window.removeEventListener("portfolio-reset-hints", resetHints);
      cancelAnimationFrame(initialize);
      clearInterval(timer);
      window.removeEventListener("resize", resize);
    };
  }, [dispatch, open]);
  useEffect(() => { if (ready) { try { localStorage.setItem('portfolio-windows', JSON.stringify(state.windows)); } catch {} } }, [ready, state.windows]);
  useEffect(() => {
    if (tour === null) return;
    const target = document.querySelector(ui.tour[tour].target);
    target?.classList.add('tour-highlight');
    return () => target?.classList.remove('tour-highlight');
  }, [tour]);
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
    setCursor(0);
    setHint(false);
    try { localStorage.setItem("portfolio-hints", "seen"); } catch {}
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
      if (intro) { e.preventDefault(); dismissIntro(); return; }
      if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]')) return;
      if (document.querySelector('dialog[open]')) return;
      const shortcut = shortcuts.find(s => s.key.toLowerCase() === e.key.toLowerCase() && s.modifiers === (e.metaKey || e.ctrlKey));
      const action = e.ctrlKey && e.key === 'ArrowUp' ? 'mission' : shortcut?.action;
      if (!action) return;
      e.preventDefault();
      if (action === 'search') showSearch();
      if (action === 'mission') setMission(v => !v);
      if (action === 'shortcuts') open('shortcuts');
      if (action === 'cycle') { const list = state.windows.filter(w => !w.minimized); if(list.length) dispatch({ type: 'focus', id: list[0].id }); }
      if ((action === 'close' || action === 'minimize') && active) dispatch({ type: action, id: active.id });
      if (action === 'escape') {
        if (context) setContext(null);
        else if (menu) setMenu(null);
        else if (active) { dispatch({ type: 'close', id: active.id }); document.getElementById(`dock-${active.id}`)?.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, dispatch, spotlight, menu, intro, dismissIntro, showSearch, open, state.windows, context]);
  const results = searchPortfolio(query);
  const selectResult = (r: SearchResult) => {
    previousFocus.current = null;
    setSpotlight(false);
    if (r.action === 'download') { const a = document.createElement('a'); a.href = profile.resume; a.download = ''; a.click(); }
    else if (r.action === 'theme') update({ theme: dark ? 'light' : 'dark' });
    else if (r.selection === 'contact') location.assign(`mailto:${profile.email}`);
    else open(r.id, r.selection);
  };
  const menuActions: Record<string, { label: string; action: () => void }[]> = {
    File: [
      { label: "Download Resume", action: () => { const a = document.createElement("a"); a.href = profile.resume; a.download = ""; a.click(); } },
      { label: ui.link.copy, action: () => { navigator.clipboard.writeText(location.href).catch(() => window.prompt(ui.link.failure, location.href)); } },
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
      { label: "Enter / exit full screen", action: () => { if(document.fullscreenElement) document.exitFullscreen().catch(() => {}); else document.documentElement.requestFullscreen?.().catch(() => {}); } },
      { label: "Appearance & wallpaper", action: () => open("settings") },
      { label: ui.simple, action: onStandard },
    ],
    Window: [
      { label: "Mission Control", action: () => setMission(true) },
      { label: "Minimize All", action: () => dispatch({ type: "minimizeAll" }) },
      { label: "Close All", action: () => dispatch({ type: "closeAll" }) },
      ...(active ? (["left", "right"] as const).map(side => ({ label: `Tile ${side}`, action: () => dispatch({ type: "snap", id: active.id, side, width: innerWidth, height: innerHeight }) })) : []),
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
      { label: ui.guidedTour, action: () => { open("welcome"); setTour(0); } },
      { label: ui.simple, action: onStandard },
      { label: "About This Portfolio", action: () => open("about") },
      { label: "Welcome", action: () => open("welcome") },
      { label: "Search · ⌘ / Ctrl K", action: showSearch },
      { label: "Keyboard guide", action: () => open("shortcuts") },
    ],
  };
  return (
    <main className="desktop" aria-label="Portfolio desktop" onContextMenu={e => { if ((e.target as HTMLElement).closest(".desktop-window,input,textarea,a")) return; e.preventDefault(); const dock = (e.target as HTMLElement).closest("[data-app]") as HTMLElement; setContext({ x: Math.min(e.clientX, innerWidth - 240), y: Math.min(e.clientY, innerHeight - 230), app: dock?.dataset.app as AppId }); }}>
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
        <div className="menu-status"><button className="simple-toggle" onClick={onStandard}>{ui.simple}</button><button aria-label="Mission Control" onClick={() => setMission(true)}><Icon name="grid" size={16}/></button>
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
            className="search-trigger" onClick={showSearch}
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
            onDoubleClick={() => { dismissHint(); open(file.id); }}
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
      {hint && <div className="first-hint"><span>{ui.welcome.hint}</span><button onClick={dismissHint}>{ui.welcome.dismiss}</button></div>}
      <div className="desktop-footer">
        <span>DESIGNED FOR EXPLORATION</span>
        <button onClick={showSearch}>
          <Icon name="search" size={12} /> Find something <kbd>⌘ K</kbd>
        </button>
      </div>
      <nav className="dock" aria-label="Portfolio applications">
        {apps.map((app) => (
          <button
            id={`dock-${app.id}`} data-app={app.id}
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
              placeholder={ui.search.placeholder}
              role="combobox" aria-expanded={spotlight} aria-controls="search-list" aria-autocomplete="list" aria-activedescendant={results[cursor] ? `result-${cursor}` : undefined}
              onKeyDown={e => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setCursor(c => (c + (e.key === "ArrowDown" ? 1 : -1) + results.length) % Math.max(1, results.length)); } if (e.key === "Enter" && results[cursor]) { e.preventDefault(); selectResult(results[cursor]); } }}
              aria-label="Search portfolio"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            />
            <button
              onClick={() => setSpotlight(false)}
              aria-label="Close search"
            >
              <kbd>esc</kbd>
            </button>
          </label>
          {!query && <div className="search-suggestions">{ui.search.suggestions.map(s => <button key={s} onClick={() => { setQuery(s); setCursor(0); }}>{s} ↗</button>)}</div>}
          <div id="search-list" role="listbox" className="search-results">
            {results.length ? (
              results.map((r, i) => (
                <button
                  key={`${r.id}-${r.selection || r.label}`}
                  id={`result-${i}`} role="option" aria-selected={cursor === i}
                  onClick={() => selectResult(r)}

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
              <p>{ui.search.empty}</p>
            )}
          </div>
          <footer>{ui.search.footer}</footer>
        </div>
      </dialog>
      {context && <><div className="context-dismiss" onClick={() => setContext(null)}/><div className="context-menu" style={{ left: context.x, top: context.y }}>{(context.app ? [{ label: 'Open', action: () => open(context.app!) }, { label: 'Close', action: () => dispatch({ type: 'close', id: context.app! }) }, { label: 'Show projects', action: () => open('projects') }] : [{ label: 'Change Wallpaper', action: () => open('settings') }, { label: 'Open Settings', action: () => open('settings') }, { label: 'About This Portfolio', action: () => open('about') }]).map(item => <button key={item.label} onClick={() => { item.action(); setContext(null); }}>{item.label}</button>)}</div></>}
      {mission && <Overlay title="Mission Control" onClose={() => setMission(false)}><div className="mission-grid">{state.windows.map(w => { const a = apps.find(a => a.id === w.id)!; return <button key={w.id} onClick={() => { open(w.id, w.selection); setMission(false); }}><AppIcon name={a.icon}/><strong>{a.name}</strong><small>{w.selection || (w.minimized ? 'Minimized' : 'Open')}</small></button>; })}{!state.windows.length && <button onClick={() => { open('welcome'); setMission(false); }}>Open Welcome</button>}</div></Overlay>}
      {tour !== null && <Overlay title={ui.tour[tour].title} className="tour-overlay" onClose={() => setTour(null)}><p>{ui.tour[tour].body}</p><footer><span>{tour + 1} / {ui.tour.length}</span><button className="primary-button" onClick={() => setTour(tour === ui.tour.length - 1 ? null : tour + 1)}>{tour === ui.tour.length - 1 ? ui.done : ui.next} →</button></footer></Overlay>}
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
