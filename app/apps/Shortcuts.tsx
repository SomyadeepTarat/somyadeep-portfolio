import { shortcuts, windowShortcuts } from "../desktop/shortcuts";
import { ui } from "../data/interface";
export default function Shortcuts() {
  return (
    <div className="utility-app">
      <h2>{ui.shortcuts}</h2>
      <dl className="shortcut-list">
        {[...shortcuts, ...windowShortcuts].map((s) => (
          <div key={s.label}>
            <dt>
              <kbd>{s.label}</kbd>
            </dt>
            <dd>{s.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
