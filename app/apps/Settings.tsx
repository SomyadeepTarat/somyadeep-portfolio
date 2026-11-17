"use client";
import { usePreferences, accents, initialPreferences } from "../desktop/preferences";
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
          {(["dawn", "dusk", "sage", "dynamic"] as const).map((wallpaper) => (
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
      <section><div className="setting-label"><h3>{ui.settings.accent}</h3></div><div className="accent-options">{Object.entries(accents).map(([key,value]) => <button key={key} aria-label={key} aria-pressed={preferences.accent === key} style={{background:value.light}} onClick={() => update({accent:key})}/>)}</div></section>
      <section><h3>{ui.settings.dock}</h3><div className="segmented">{[40,52,64].map(size => <button key={size} aria-pressed={preferences.dockSize === size} onClick={() => update({dockSize:size})}>{size}</button>)}</div></section>
      {([['magnification',ui.settings.magnify],['sound',ui.settings.sound],['transparency',ui.settings.transparency],['widgets',ui.settings.widgets]] as const).map(([key,label]) => <section key={key}><h3>{label}</h3><button className="switch" role="switch" aria-label={label} aria-checked={key === 'transparency' ? !preferences[key] : preferences[key]} onClick={() => update({[key]:!preferences[key]})}><span/></button></section>)}
      <section><div className="setting-label"><h3>{ui.settings.reset}</h3><p>{ui.settings.resetNote}</p></div><button className="text-button" onClick={() => { update(initialPreferences); try { localStorage.removeItem('portfolio-windows'); localStorage.removeItem('portfolio-widget-positions'); localStorage.removeItem('portfolio-hints'); } catch {} window.dispatchEvent(new Event('portfolio-reset')); }}>{ui.settings.reset}</button></section>
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
