"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";
import { apps, type AppId } from "./registry";
import { WindowProvider, useWindows } from "./store";
import { usePreferences } from "./preferences";
import { AppIcon, Icon } from "./icons";
import Window from "./Window";
import Image from "next/image";
import { profile, projects } from "../data/profile";
import Overlay from "./Overlay";
import { shortcuts } from "./shortcuts";
import { ui } from "../data/interface";
import { parseRoute, navigateHash } from "./navigation";
import { searchPortfolio, type SearchResult } from "./search";
const Widgets = lazy(() => import("./Widgets"));
function Shell({ onStandard }: { onStandard: () => void }) {
  const { state, dispatch } = useWindows();
  const { dark, update, preferences } = usePreferences();
  const [stack, setStack] = useState(false);
  const [notification, setNotification] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const [hoveredDock, setHoveredDock] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [mission, setMission] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [context, setContext] = useState<{
    x: number;
    y: number;
    app?: AppId;
  } | null>(null);
  const [time, setTime] = useState("");
  const [spotlight, setSpotlight] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [hint, setHint] = useState(false);
  const dismissHint = () => {
    setHint(false);
    try {
      localStorage.setItem("portfolio-hints", "seen");
    } catch {}
  };
  const [menu, setMenu] = useState<string | null>(null);
  const [intro, setIntro] = useState(false);
  const wallpaperRef = useRef<HTMLDivElement>(null);
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
      if (document.documentElement.dataset.sound === "on")
        import("./sound").then((s) => s.playSound("open"));
      setMenu(null);
    },
    [dispatch],
  );
  useEffect(() => {
    const initialize = requestAnimationFrame(() => {
      const route = parseRoute(location.hash);
      let restored = false;
      if (!location.hash) {
        try {
          const saved = JSON.parse(
            localStorage.getItem("portfolio-windows") || "null",
          );
          if (Array.isArray(saved) && saved.length) {
            dispatch({
              type: "restore",
              windows: saved,
              width: innerWidth,
              height: innerHeight,
            });
            restored = true;
          }
        } catch {}
      }
      if (!restored) open(route?.id || "welcome", route?.selection);
      setReady(true);
      try {
        if (!route && !sessionStorage.getItem("portfolio-visited"))
          setIntro(true);
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
    const routeChange = () => {
      if (document.querySelector(".desktop")?.closest("[hidden]")) return;
      const route = parseRoute(location.hash);
      open(route?.id || "welcome", route?.selection);
    };
    window.addEventListener("popstate", routeChange);
    window.addEventListener("hashchange", routeChange);
    const resetDesktop = () => {
      dispatch({ type: "closeAll" });
      open("welcome");
      setHint(true);
    };
    window.addEventListener("portfolio-reset", resetDesktop);
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
      window.removeEventListener("portfolio-reset", resetDesktop);
      window.removeEventListener("popstate", routeChange);
      window.removeEventListener("hashchange", routeChange);
      window.removeEventListener("portfolio-reset-hints", resetHints);
      cancelAnimationFrame(initialize);
      clearInterval(timer);
      window.removeEventListener("resize", resize);
    };
  }, [dispatch, open]);
  useEffect(() => {
    if (
      ready &&
      active &&
      !document.querySelector(".desktop")?.closest("[hidden]")
    )
      navigateHash(active.id, active.selection);
  }, [ready, active]);
  useEffect(() => {
    if (!ready) return;
    const save = () => {
      try {
        localStorage.setItem(
          "portfolio-windows",
          JSON.stringify(state.windows),
        );
      } catch {}
    };
    const timer = setTimeout(save, 250);
    window.addEventListener("pagehide", save);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", save);
    };
  }, [ready, state.windows]);
  useEffect(() => {
    if (tour === null) return;
    const target = document.querySelector(ui.tour[tour].target);
    target?.classList.add("tour-highlight");
    return () => target?.classList.remove("tour-highlight");
  }, [tour]);
  useEffect(() => {
    if (!ready || intro) return;
    const timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem("portfolio-notification")) return;
        sessionStorage.setItem("portfolio-notification", "seen");
      } catch {}
      setNotification(true);
    }, 14000);
    return () => clearTimeout(timer);
  }, [ready, intro]);
  useEffect(() => {
    const sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,textarea")) return;
      index = e.key === sequence[index] ? index + 1 : 0;
      if (index === sequence.length) {
        setSurprise(true);
        timer = setTimeout(() => setSurprise(false), 2500);
        index = 0;
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      clearTimeout(timer);
    };
  }, []);
  const dismissIntro = useCallback(() => {
    setIntro(false);
    try {
      sessionStorage.setItem("portfolio-visited", "1");
    } catch {}
  }, []);
  useEffect(() => {
    if (!intro) return;
    introRef.current?.showModal();
    const timer = setTimeout(dismissIntro, 1800);
    return () => clearTimeout(timer);
  }, [intro, dismissIntro]);
  const showSearch = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    setQuery("");
    setCursor(0);
    setHint(false);
    try {
      localStorage.setItem("portfolio-hints", "seen");
    } catch {}
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
      if (document.querySelector(".desktop")?.closest("[hidden]")) return;
      if (intro) {
        e.preventDefault();
        dismissIntro();
        return;
      }
      if (
        (e.target as HTMLElement).closest(
          'input,textarea,select,[contenteditable="true"]',
        )
      )
        return;
      if (document.querySelector("dialog[open]")) return;
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === e.key.toLowerCase() &&
          s.modifiers === (e.metaKey || e.ctrlKey),
      );
      const action =
        e.ctrlKey && e.key === "ArrowUp" ? "mission" : shortcut?.action;
      if (!action) return;
      e.preventDefault();
      if (action === "search") showSearch();
      if (action === "mission") setMission((v) => !v);
      if (action === "shortcuts") open("shortcuts");
      if (action === "cycle") {
        const list = state.windows.filter((w) => !w.minimized);
        if (list.length) dispatch({ type: "focus", id: list[0].id });
      }
      if ((action === "close" || action === "minimize") && active)
        dispatch({ type: action, id: active.id });
      if (action === "escape") {
        if (context) setContext(null);
        else if (menu) setMenu(null);
        else if (active) {
          dispatch({ type: "close", id: active.id });
          document.getElementById(`dock-${active.id}`)?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [
    active,
    dispatch,
    spotlight,
    menu,
    intro,
    dismissIntro,
    showSearch,
    open,
    state.windows,
    context,
  ]);
  useEffect(() => {
    if (notification && preferences.sound)
      import("./sound").then((s) => s.playSound("notification"));
  }, [notification, preferences.sound]);
  const ranked = searchPortfolio(query);
  const categories = [...new Set(ranked.map((r) => r.category))];
  const results = categories.flatMap((category) =>
    ranked.filter((r) => r.category === category),
  );
  useEffect(() => {
    if (spotlight)
      document
        .getElementById(`result-${cursor}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [cursor, spotlight]);
  const selectResult = (r: SearchResult) => {
    setSpotlight(false);
    if (r.action === "download") {
      const a = document.createElement("a");
      a.href = profile.resume;
      a.download = "";
      a.click();
    } else if (r.action === "theme") update({ theme: dark ? "light" : "dark" });
    else if (r.selection === "contact")
      location.assign(`mailto:${profile.email}`);
    else {
      open(r.id, r.selection);
      requestAnimationFrame(() =>
        document.getElementById(`window-${r.id}`)?.focus(),
      );
    }
  };
  const menuActions: Record<string, { label: string; action: () => void }[]> = {
    File: [
      {
        label: "Download Resume",
        action: () => {
          const a = document.createElement("a");
          a.href = profile.resume;
          a.download = "";
          a.click();
        },
      },
      {
        label: ui.link.copy,
        action: () => {
          navigator.clipboard
            .writeText(location.href)
            .catch(() => window.prompt(ui.link.failure, location.href));
        },
      },
      { label: "Open resume", action: () => open("resume") },
      {
        label: "Contact Somyadeep ↗",
        action: () => {
          open("mail");
        },
      },
    ],
    Edit: [{ label: "Search portfolio…", action: showSearch }],
    View: [
      ...(active?.id === "projects"
        ? ui.projects.views.map((view) => ({
            label: `As ${view}`,
            action: () =>
              window.dispatchEvent(
                new CustomEvent("portfolio-project-view", { detail: view }),
              ),
          }))
        : []),
      {
        label: "Enter / exit full screen",
        action: () => {
          if (document.fullscreenElement)
            document.exitFullscreen().catch(() => {});
          else document.documentElement.requestFullscreen?.().catch(() => {});
        },
      },
      { label: "Appearance & wallpaper", action: () => open("settings") },
      { label: ui.simple, action: onStandard },
    ],
    Window: [
      { label: "Mission Control", action: () => setMission(true) },
      {
        label: "Minimize All",
        action: () => dispatch({ type: "minimizeAll" }),
      },
      { label: "Close All", action: () => dispatch({ type: "closeAll" }) },
      ...(active
        ? (["left", "right"] as const).map((side) => ({
            label: `Tile ${side}`,
            action: () =>
              dispatch({
                type: "snap",
                id: active.id,
                side,
                width: innerWidth,
                height: innerHeight,
              }),
          }))
        : []),
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
      {
        label: ui.guidedTour,
        action: () => {
          open("welcome");
          setTour(0);
        },
      },
      { label: ui.simple, action: onStandard },
      { label: "About This Portfolio", action: () => open("about") },
      { label: "Welcome", action: () => open("welcome") },
      { label: "Search · ⌘ / Ctrl K", action: showSearch },
      { label: "Keyboard guide", action: () => open("shortcuts") },
    ],
  };
  return (
    <main
      className="desktop"
      aria-label="Portfolio desktop"
      onPointerMove={(e) => {
        if (
          !preferences.motion ||
          matchMedia("(prefers-reduced-motion: reduce)").matches ||
          e.buttons
        )
          return;
        wallpaperRef.current?.style.setProperty(
          "--parallax-x",
          `${(e.clientX / innerWidth - 0.5) * 8}px`,
        );
        wallpaperRef.current?.style.setProperty(
          "--parallax-y",
          `${(e.clientY / innerHeight - 0.5) * 8}px`,
        );
      }}
      onContextMenu={(e) => {
        if (
          (e.target as HTMLElement).closest(".desktop-window,input,textarea,a")
        )
          return;
        e.preventDefault();
        const dock = (e.target as HTMLElement).closest(
          "[data-app]",
        ) as HTMLElement;
        setContext({
          x: Math.min(e.clientX, innerWidth - 240),
          y: Math.min(e.clientY, innerHeight - 230),
          app: dock?.dataset.app as AppId,
        });
      }}
    >
      <div
        ref={wallpaperRef}
        className={`wallpaper ${surprise ? "wallpaper-surprise" : ""}`}
        aria-hidden="true"
      />
      {preferences.widgets &&
        !state.windows.some((w) => w.maximized && !w.minimized) && (
          <Suspense fallback={null}>
            <Widgets onNavigate={open} />
          </Suspense>
        )}
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
          <button className="simple-toggle" onClick={onStandard}>
            {ui.simple}
          </button>
          <button aria-label="Mission Control" onClick={() => setMission(true)}>
            <Icon name="grid" size={16} />
          </button>
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
            className="search-trigger"
            onClick={showSearch}
            aria-label="Search portfolio (Command or Control K)"
          >
            <Icon name="search" size={16} />
          </button>
          <time>{time}</time>
        </div>
      </header>
      {menu && <div className="menu-dismiss" onClick={() => setMenu(null)} />}
      <div className="desktop-intro" hidden={preferences.widgets}>
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
            onDoubleClick={() => {
              dismissHint();
              open(file.id);
            }}
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
      {hint && (
        <div className="first-hint">
          <span>{ui.welcome.hint}</span>
          <button onClick={dismissHint}>{ui.welcome.dismiss}</button>
        </div>
      )}
      <div className="desktop-footer">
        <span>DESIGNED FOR EXPLORATION</span>
        <button onClick={showSearch}>
          <Icon name="search" size={12} /> Find something <kbd>⌘ K</kbd>
        </button>
      </div>
      <nav className="dock" aria-label="Portfolio applications">
        {apps
          .filter((a) =>
            [
              "welcome",
              "about",
              "experience",
              "projects",
              "resume",
              "mail",
              "terminal",
              "settings",
            ].includes(a.id),
          )
          .map((app, dockIndex) => (
            <button
              id={`dock-${app.id}`}
              data-app={app.id}
              key={app.id}
              style={{
                transform:
                  preferences.magnification && hoveredDock !== null
                    ? `translateY(${-Math.max(0, 12 - Math.abs(dockIndex - hoveredDock) * 6)}px) scale(${1 + Math.max(0, 0.18 - Math.abs(dockIndex - hoveredDock) * 0.08)})`
                    : undefined,
              }}
              onPointerEnter={() => setHoveredDock(dockIndex)}
              onPointerLeave={() => setHoveredDock(null)}
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
        <button
          className="dock-stack-button"
          aria-label="Projects stack"
          aria-expanded={stack}
          onClick={() => setStack(!stack)}
        >
          <AppIcon name="projects" />
          <span className="dock-tooltip">Projects stack</span>
        </button>
        <a href={profile.resume} download aria-label="Download resume">
          <AppIcon name="resume" />
          <span className="dock-tooltip">Downloads · Resume</span>
        </a>
        <button aria-label="Open Trash" onClick={() => open("trash")}>
          <AppIcon name="trash" />
          <span className="dock-tooltip">Trash</span>
        </button>
      </nav>
      {stack && (
        <div className="projects-stack">
          {projects.map((p, i) => (
            <button
              style={{ transform: `rotate(${(i - 1) * 3}deg)` }}
              key={p.id}
              onClick={() => {
                open("projects", p.id);
                setStack(false);
              }}
            >
              <AppIcon name="projects" small />
              <span>
                {p.name}
                <small>{p.subtitle}</small>
              </span>
              ↗
            </button>
          ))}
        </div>
      )}
      {notification && (
        <aside className="notification" role="status">
          <AppIcon name="projects" small />
          <button
            onClick={() => {
              open("projects");
              setNotification(false);
            }}
          >
            {ui.widgets.notification}
          </button>
          <button aria-label={ui.close} onClick={() => setNotification(false)}>
            ×
          </button>
        </aside>
      )}
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
              role="combobox"
              aria-expanded={spotlight}
              aria-controls="search-list"
              aria-autocomplete="list"
              aria-activedescendant={
                results[cursor] ? `result-${cursor}` : undefined
              }
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setCursor(
                    (c) =>
                      (c + (e.key === "ArrowDown" ? 1 : -1) + results.length) %
                      Math.max(1, results.length),
                  );
                }
                if (e.key === "Enter" && results[cursor]) {
                  e.preventDefault();
                  selectResult(results[cursor]);
                }
              }}
              aria-label="Search portfolio"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCursor(0);
              }}
            />
            <button
              onClick={() => setSpotlight(false)}
              aria-label="Close search"
            >
              <kbd>esc</kbd>
            </button>
          </label>
          {!query && (
            <div className="search-suggestions">
              {ui.search.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    setCursor(0);
                  }}
                >
                  {s} ↗
                </button>
              ))}
            </div>
          )}
          <div id="search-list" role="listbox" className="search-results">
            {results.length ? (
              results.map((r, i) => (
                <button
                  key={`${r.id}-${r.selection || r.label}`}
                  id={`result-${i}`}
                  role="option"
                  aria-selected={cursor === i}
                  onClick={() => selectResult(r)}
                >
                  <AppIcon name={apps.find((a) => a.id === r.id)!.icon} small />
                  <span>
                    {(i === 0 || results[i - 1].category !== r.category) && (
                      <small className="search-group-label">{r.category}</small>
                    )}
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
      {context && (
        <>
          <div className="context-dismiss" onClick={() => setContext(null)} />
          <div
            className="context-menu"
            style={{ left: context.x, top: context.y }}
          >
            {(context.app
              ? [
                  { label: "Open", action: () => open(context.app!) },
                  {
                    label: "Close",
                    action: () => dispatch({ type: "close", id: context.app! }),
                  },
                  { label: "Show projects", action: () => open("projects") },
                ]
              : [
                  { label: "Open Terminal", action: () => open("terminal") },
                  { label: "Change Wallpaper", action: () => open("settings") },
                  { label: "Open Settings", action: () => open("settings") },
                  {
                    label: "About This Portfolio",
                    action: () => open("about"),
                  },
                ]
            ).map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setContext(null);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
      {mission && (
        <Overlay title="Mission Control" onClose={() => setMission(false)}>
          <div className="mission-grid">
            {state.windows.map((w) => {
              const a = apps.find((a) => a.id === w.id)!;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    open(w.id);
                    setMission(false);
                  }}
                >
                  <AppIcon name={a.icon} />
                  <strong>{a.name}</strong>
                  <small>
                    {w.selection || (w.minimized ? "Minimized" : "Open")}
                  </small>
                </button>
              );
            })}
            {!state.windows.length && (
              <button
                onClick={() => {
                  open("welcome");
                  setMission(false);
                }}
              >
                Open Welcome
              </button>
            )}
          </div>
        </Overlay>
      )}
      {tour !== null && (
        <Overlay
          title={ui.tour[tour].title}
          className="tour-overlay"
          onClose={() => setTour(null)}
        >
          <p>{ui.tour[tour].body}</p>
          <footer>
            <span>
              {tour + 1} / {ui.tour.length}
            </span>
            <button
              className="primary-button"
              onClick={() =>
                setTour(tour === ui.tour.length - 1 ? null : tour + 1)
              }
            >
              {tour === ui.tour.length - 1 ? ui.done : ui.next} →
            </button>
          </footer>
        </Overlay>
      )}
      {intro && (
        <dialog
          ref={introRef}
          className="boot-screen"
          aria-label="Welcome"
          onCancel={dismissIntro}
          onClick={dismissIntro}
          onKeyDown={dismissIntro}
        >
          <Image
            className="lock-portrait"
            src={profile.portrait}
            width={84}
            height={100}
            alt={profile.name}
          />
          <div className="boot-progress" />
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
          <button autoFocus onClick={dismissIntro}>
            {ui.boot.enter} <span>→</span>
          </button>
          <small>{ui.boot.subtitle}</small>
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
