"use client";
import { usePreferences } from "../desktop/preferences";
import type { AppProps } from "../desktop/registry";
import { ui } from "../data/interface";
import { Icon } from "../desktop/icons";
export default function Settings({ selection }: AppProps) {
  const { preferences, update } = usePreferences();
  return (
    <div className="settings-app">
      <header>
        <Icon name="settings" size={30} />
        <div>
          <h2>Make yourself at home.</h2>
          <p>A few preferences for this workspace.</p>
        </div>
      </header>
      <section>
        <div className="setting-label">
          <h3>Appearance</h3>
          <p>Auto follows your device settings.</p>
        </div>
        <div className="segmented">
          {(["light", "dark", "auto"] as const).map((theme) => (
            <button
              key={theme}
              aria-pressed={preferences.theme === theme}
              onClick={() => update({ theme })}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>
      <section className="wallpaper-setting">
        <div className="setting-label">
          <h3>Wallpaper</h3>
          <p>Original gradients. A different atmosphere.</p>
        </div>
        <div className="wallpaper-options">
          {(["dawn", "dusk", "sage"] as const).map((wallpaper) => (
            <button
              key={wallpaper}
              aria-pressed={preferences.wallpaper === wallpaper}
              onClick={() => update({ wallpaper })}
            >
              <span className={`wallpaper-swatch swatch-${wallpaper}`} />
              {wallpaper}
            </button>
          ))}
        </div>
      </section>
      <section>
        <div className="setting-label">
          <h3>Reduce motion</h3>
          <p>Your device’s reduced-motion preference always takes priority.</p>
        </div>
        <button
          className="switch"
          role="switch"
          aria-label="Reduce motion"
          aria-checked={!preferences.motion}
          onClick={() => update({ motion: !preferences.motion })}
        >
          <span />
        </button>
      </section>
      <section><button onClick={() => { try { localStorage.removeItem("portfolio-hints"); } catch {} window.dispatchEvent(new Event("portfolio-reset-hints")); }}>{ui.welcome.reset}</button></section>
      <details
        className="keyboard-guide"
        open={selection === "keyboard" || undefined}
      >
        <summary>Keyboard guide</summary>
        <dl>
          <dt>⌘ / Ctrl + K</dt>
          <dd>Search the portfolio</dd>
          <dt>Escape</dt>
          <dd>Close search, menu, or the top window</dd>
          <dt>Alt + Arrow</dt>
          <dd>Move the focused window</dd>
          <dt>Alt + Shift + Arrow</dt>
          <dd>Resize the focused window</dd>
          <dt>Tab / Shift + Tab</dt>
          <dd>Move between controls</dd>
        </dl>
      </details>
    </div>
  );
}
