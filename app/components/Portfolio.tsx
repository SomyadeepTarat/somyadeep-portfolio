"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { PreferencesProvider, usePreferences } from "../desktop/preferences";
import { ui } from "../data/interface";
import { Icon } from "../desktop/icons";
const Desktop = dynamic(() => import("../desktop/Desktop"), { ssr: false });
function Layout({ children }: { children: ReactNode }) {
  const [wide, setWide] = useState<boolean | null>(null);
  const [standard, setStandard] = useState(false);
  const [notice, setNotice] = useState(true);
  const { dark, update } = usePreferences();
  useEffect(() => {
    const media = matchMedia("(min-width: 768px)");
    const sync = () => setWide(media.matches);
    sync();
    const frame = requestAnimationFrame(() => { try { setStandard(localStorage.getItem("portfolio-simple") === "true"); setNotice(sessionStorage.getItem("portfolio-mobile-notice") !== "dismissed"); } catch {} });
    media.addEventListener("change", sync);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", sync); };
  }, []);
  const switchView = (value: boolean) => { setStandard(value); try { localStorage.setItem("portfolio-simple", String(value)); } catch {} };
  const desktopVisible = wide === true && !standard;
  return (
    <>
      {wide === true && <div hidden={!desktopVisible}><Desktop onStandard={() => switchView(true)} /></div>}
      {wide === null && (
        <div className="desktop-loading" aria-hidden="true">
          <div className="wallpaper" />
          <span>st.</span>
        </div>
      )}
      <div
        className={wide === null ? "initial-standard" : undefined}
        hidden={desktopVisible}
      >
        <div className="mobile-controls">
          {wide && (
            <button onClick={() => switchView(false)}>{ui.desktop} ↗</button>
          )}
          <button
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
            onClick={() => update({ theme: dark ? "light" : "dark" })}
          >
            <Icon name={dark ? "moon" : "sun"} />
          </button>
        </div>
        {wide === false && notice && <aside className="mobile-notice"><Icon name="grid"/><div><strong>{ui.mobile.title}</strong><p>{ui.mobile.body}</p></div><button aria-label={ui.mobile.dismiss} onClick={() => { setNotice(false); try { sessionStorage.setItem("portfolio-mobile-notice", "dismissed"); } catch {} }}>×</button></aside>}
        {children}
      </div>
      <noscript>
        <style>{`.desktop-loading{display:none!important}.initial-standard{display:block!important}`}</style>
      </noscript>
    </>
  );
}
export default function Portfolio({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <Layout>{children}</Layout>
    </PreferencesProvider>
  );
}
