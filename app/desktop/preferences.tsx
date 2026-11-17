"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Preferences = {
  theme: "auto" | "light" | "dark";
  wallpaper: "dawn" | "dusk" | "sage";
  motion: boolean;
};
const initial: Preferences = { theme: "auto", wallpaper: "dawn", motion: true };
const Context = createContext<{
  preferences: Preferences;
  update: (p: Partial<Preferences>) => void;
  dark: boolean;
} | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(initial);
  const [systemDark, setSystemDark] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemDark(query.matches);
    const frame = requestAnimationFrame(() => {
      sync();
      try {
        const stored = JSON.parse(
          localStorage.getItem("portfolio-preferences") || "null",
        );
        if (stored)
          setPreferences({
            theme: ["auto", "light", "dark"].includes(stored.theme)
              ? stored.theme
              : "auto",
            wallpaper: ["dawn", "dusk", "sage"].includes(stored.wallpaper)
              ? stored.wallpaper
              : "dawn",
            motion: stored.motion !== false,
          });
      } catch {}
      setReady(true);
    });
    query.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      query.removeEventListener("change", sync);
    };
  }, []);
  const dark =
    preferences.theme === "dark" ||
    (preferences.theme === "auto" && systemDark);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.wallpaper = preferences.wallpaper;
    document.documentElement.dataset.motion = preferences.motion ? "on" : "off";
    if (ready)
      try {
        localStorage.setItem(
          "portfolio-preferences",
          JSON.stringify(preferences),
        );
      } catch {}
  }, [preferences, dark, ready]);
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
