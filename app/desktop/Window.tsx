"use client";
import { Suspense, useEffect, useRef, useState, type PointerEvent } from "react";
import { apps, type AppId } from "./registry";
import { clampBounds, useWindows, type WindowState } from "./store";
import { ui } from "../data/interface";
import { copyLink } from "./navigation";
import { Icon } from "./icons";
export default function Window({
  window: w,
  index,
  active,
  onNavigate,
}: {
  window: WindowState;
  index: number;
  active: boolean;
  onNavigate: (id: AppId, selection?: string) => void;
}) {
  const [snap, setSnap] = useState<"left" | "right" | "full" | null>(null);
  const [copied, setCopied] = useState(false);
  const { dispatch } = useWindows();
  const ref = useRef<HTMLElement>(null);
  const gesture = useRef<{
    x: number;
    y: number;
    bounds: WindowState;
    resize: boolean;
  } | null>(null);
  const app = apps.find((a) => a.id === w.id)!;
  const Content = app.component;
  useEffect(() => {
    if (active && !w.minimized) {
      ref.current?.getAnimations().forEach((a) => {
        if (a.playState === "finished") a.cancel();
      });
      if (!ref.current?.contains(document.activeElement))
        ref.current?.focus({ preventScroll: true });
    }
  }, [active, w.minimized]);
  const leave = (action: "close" | "minimize") => {
    const finish = () => {
      dispatch({ type: action, id: w.id });
      document.getElementById(`dock-${w.id}`)?.focus();
    };
    const reduced =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "off";
    if (!ref.current || reduced) {
      finish();
      return;
    }
    const animation = ref.current.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        {
          opacity: 0,
          transform:
            action === "minimize"
              ? "translateY(90px) scale(.7)"
              : "translateY(8px) scale(.96)",
        },
      ],
      { duration: 180, easing: "ease-in", fill: "forwards" },
    );
    animation.onfinish = finish;
  };
  const start = (event: PointerEvent<HTMLElement>, resize = false) => {
    if (
      w.maximized ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest("button")
    )
      return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { x: event.clientX, y: event.clientY, bounds: w, resize };
    dispatch({ type: "focus", id: w.id });
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g) return;
    if (!g.resize) setSnap(event.clientY < 50 ? "full" : event.clientX < 25 ? "left" : event.clientX > innerWidth - 25 ? "right" : null);
    const dx = event.clientX - g.x,
      dy = event.clientY - g.y;
    const b = g.resize
      ? {
          ...g.bounds,
          width: g.bounds.width + dx,
          height: g.bounds.height + dy,
        }
      : { ...g.bounds, x: g.bounds.x + dx, y: g.bounds.y + dy };
    dispatch({
      type: "bounds",
      id: w.id,
      bounds: clampBounds(b, innerWidth, innerHeight),
    });
  };
  // Keep minimized app components mounted so their internal navigation survives.
  return (
    <> {snap && <div className="snap-preview" style={{left: snap === "right" ? "50%" : 12, right: snap === "left" ? "50%" : 12 }}/>}<section
      ref={ref}
      id={`window-${w.id}`}
      className={`desktop-window ${active ? "active" : ""} ${w.maximized ? "maximized" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-label={app.name}
      tabIndex={-1}
      hidden={w.minimized}
      style={{
        left: w.maximized ? 12 : w.x,
        top: w.maximized ? 43 : w.y,
        width: w.maximized ? "calc(100% - 24px)" : w.width,
        height: w.maximized ? "calc(100dvh - 139px)" : w.height,
        zIndex: 20 + index,
      }}
      onPointerDown={() => dispatch({ type: "focus", id: w.id })}
      onFocusCapture={() => {
        if (!active) dispatch({ type: "focus", id: w.id });
      }}
      onKeyDown={(e) => {
        if (e.altKey && e.key.startsWith("Arrow") && !w.maximized) {
          e.preventDefault();
          const dx =
              e.key === "ArrowRight" ? 20 : e.key === "ArrowLeft" ? -20 : 0,
            dy = e.key === "ArrowDown" ? 20 : e.key === "ArrowUp" ? -20 : 0;
          dispatch({
            type: "bounds",
            id: w.id,
            bounds: clampBounds(
              e.shiftKey
                ? { ...w, width: w.width + dx, height: w.height + dy }
                : { ...w, x: w.x + dx, y: w.y + dy },
              innerWidth,
              innerHeight,
            ),
          });
        }
      }}
    >
      <header
        className="window-titlebar"
        onPointerDown={(e) => start(e)}
        onPointerMove={move}
        onPointerUp={() => { if(snap) dispatch({ type: "snap", id: w.id, side: snap, width: innerWidth, height: innerHeight }); setSnap(null); gesture.current = null; }}
        onPointerCancel={() => { setSnap(null); gesture.current = null; }}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button"))
            dispatch({ type: "maximize", id: w.id });
        }}
      >
        <div className="traffic-lights">
          {(["close", "minimize", "maximize"] as const).map((action, i) => (
            <button
              key={action}
              className={action}
              title={`${action[0].toUpperCase() + action.slice(1)} ${app.name}`}
              aria-label={`${action} ${app.name}`}
              onClick={() =>
                action === "maximize"
                  ? dispatch({ type: action, id: w.id })
                  : leave(action)
              }
            >
              <span>{["×", "−", "+"][i]}</span>
            </button>
          ))}
        </div>
        <span className="window-title">
          <Icon name={app.icon} size={15} />
          {app.name}
        </span>
        <button className="window-title-hint" onClick={async () => { try { await copyLink(w.id, w.selection); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt(ui.link.failure, location.href); } }}>{copied ? ui.link.success : ui.link.copy}</button>
      </header>
      <div className="window-body">
        <Suspense fallback={<div className="loading">Opening {app.name}…</div>}>
          <Content
            key={`${w.selection || w.id}-${w.selectionVersion || 0}`}
            selection={w.selection}
            onNavigate={onNavigate}
          />
        </Suspense>
      </div>
      {!w.maximized && (
        <div
          className="resize-handle"
          aria-hidden="true"
          onPointerDown={(e) => start(e, true)}
          onPointerMove={move}
          onPointerUp={() => (gesture.current = null)}
          onPointerCancel={() => (gesture.current = null)}
        />
      )}
    </section></>
  );
}
