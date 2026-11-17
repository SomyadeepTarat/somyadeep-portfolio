"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
export type Preferences = {
  theme: "auto" | "light" | "dark";
  wallpaper: "dawn" | "dusk" | "sage" | "dynamic";
  motion: boolean;
  accent: string;
  dockSize: number;
  magnification: boolean;
  sound: boolean;
  transparency: boolean;
  widgets: boolean;
};
export const initialPreferences: Preferences = {
  theme: "auto",
  wallpaper: "dynamic",
  motion: true,
  accent: "blue",
  dockSize: 52,
  magnification: true,
  sound: false,
  transparency: true,
  widgets: true,
};
export const accents: Record<string, { light: string; dark: string }> = {
  blue: { light: "#365f8a", dark: "#a5c8f2" },
  teal: { light: "#25665e", dark: "#8bd4bf" },
  violet: { light: "#67508d", dark: "#cbb3ee" },
  rose: { light: "#92516a", dark: "#efb1c5" },
};
const Context = createContext<{
  preferences: Preferences;
  update: (p: Partial<Preferences>) => void;
  dark: boolean;
} | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(initialPreferences),
    [systemDark, setSystemDark] = useState(false),
    [ready, setReady] = useState(false),
    [hour, setHour] = useState(12),
    [systemSolid, setSystemSolid] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)"),
      solid = matchMedia("(prefers-reduced-transparency: reduce)");
    const sync = () => setSystemDark(media.matches),
      syncSolid = () =>
        setSystemSolid(solid.matches || navigator.hardwareConcurrency <= 2);
    const frame = requestAnimationFrame(() => {
      sync();
      syncSolid();
      setHour(new Date().getHours());
      try {
        const s = JSON.parse(
          localStorage.getItem("portfolio-preferences") || "null",
        );
        if (s)
          setPreferences({
            theme: ["auto", "light", "dark"].includes(s.theme)
              ? s.theme
              : "auto",
            wallpaper: ["dawn", "dusk", "sage", "dynamic"].includes(s.wallpaper)
              ? s.wallpaper
              : "dynamic",
            motion: s.motion !== false,
            accent: Object.hasOwn(accents, s.accent) ? s.accent : "blue",
            dockSize: [40, 52, 64].includes(s.dockSize) ? s.dockSize : 52,
            magnification: s.magnification !== false,
            sound: s.sound === true,
            transparency: s.transparency !== false,
            widgets: s.widgets !== false,
          });
      } catch {}
      setReady(true);
    });
    const timer = setInterval(() => setHour(new Date().getHours()), 60000);
    media.addEventListener("change", sync);
    solid.addEventListener("change", syncSolid);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      media.removeEventListener("change", sync);
      solid.removeEventListener("change", syncSolid);
    };
  }, []);
  const dark =
    preferences.theme === "dark" ||
    (preferences.theme === "auto" && systemDark);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = dark ? "dark" : "light";
    root.dataset.wallpaper =
      preferences.wallpaper === "dynamic"
        ? hour >= 7 && hour < 18
          ? "dawn"
          : "dusk"
        : preferences.wallpaper;
    root.dataset.motion = preferences.motion ? "on" : "off";
    root.dataset.transparency =
      preferences.transparency && !systemSolid ? "on" : "off";
    root.dataset.magnification = preferences.magnification ? "on" : "off";
    root.dataset.sound = preferences.sound ? "on" : "off";
    root.style.setProperty(
      "--accent",
      accents[preferences.accent][dark ? "dark" : "light"],
    );
    root.style.setProperty("--dock-size", `${preferences.dockSize}px`);
    if (ready)
      try {
        localStorage.setItem(
          "portfolio-preferences",
          JSON.stringify(preferences),
        );
      } catch {}
  }, [preferences, dark, ready, hour, systemSolid]);
  return (
    <Context.Provider
      value={{
        preferences,
        update: (p) => setPreferences((v) => ({ ...v, ...p })),
        dark,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePreferences() {
  const c = useContext(Context);
  if (!c) throw Error("PreferencesProvider missing");
  return c;
}
