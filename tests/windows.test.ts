import test from "node:test";
import assert from "node:assert/strict";
import {
  windowReducer,
  clampBounds,
  type State,
} from "../app/desktop/window-state";
const viewport = { width: 1200, height: 800 };
test("opening, focusing, minimizing and restoring keep one instance and ordering", () => {
  let state: State = { windows: [] };
  state = windowReducer(state, { type: "open", id: "about", viewport });
  state = windowReducer(state, { type: "open", id: "projects", viewport });
  state = windowReducer(state, { type: "open", id: "about", viewport });
  assert.deepEqual(
    state.windows.map((w) => w.id),
    ["projects", "about"],
  );
  state = windowReducer(state, { type: "minimize", id: "about" });
  assert.equal(state.windows.at(-1)?.minimized, true);
  state = windowReducer(state, { type: "open", id: "about", viewport });
  assert.equal(state.windows.length, 2);
  assert.equal(state.windows.at(-1)?.minimized, false);
  state = windowReducer(state, { type: "close", id: "about" });
  assert.deepEqual(
    state.windows.map((w) => w.id),
    ["projects"],
  );
});
test("maximize restores original bounds and resize keeps windows on screen", () => {
  let state = windowReducer(
    { windows: [] },
    { type: "open", id: "projects", viewport },
  );
  const original = { ...state.windows[0] };
  state = windowReducer(state, { type: "maximize", id: "projects" });
  assert.equal(state.windows[0].maximized, true);
  state = windowReducer(state, { type: "maximize", id: "projects" });
  assert.deepEqual(state.windows[0], original);
  state = windowReducer(state, { type: "viewport", width: 768, height: 600 });
  const w = state.windows[0];
  assert.ok(w.x >= 12 && w.y >= 44);
  assert.ok(w.x + w.width <= 756);
  assert.ok(w.y + w.height <= 504);
  const b = clampBounds(
    { x: -100, y: 2000, width: 2000, height: 1000 },
    1024,
    768,
  );
  assert.ok(b.x >= 12 && b.y >= 44);
  assert.ok(b.x + b.width <= 1012);
  assert.ok(b.y + b.height <= 672);
});
test("search can target a different entry in an already-open app", () => {
  let state = windowReducer(
    { windows: [] },
    { type: "open", id: "projects", selection: "atlas", viewport },
  );
  state = windowReducer(state, {
    type: "open",
    id: "projects",
    selection: "kew",
    viewport,
  });
  assert.equal(state.windows.length, 1);
  assert.equal(state.windows[0].selection, "kew");
});
test("dock restoration preserves a search-selected entry", () => {
  let state = windowReducer(
    { windows: [] },
    { type: "open", id: "experience", selection: "muzigal", viewport },
  );
  state = windowReducer(state, { type: "minimize", id: "experience" });
  state = windowReducer(state, { type: "open", id: "experience", viewport });
  assert.equal(state.windows[0].selection, "muzigal");
  const version = state.windows[0].selectionVersion || 0;
  state = windowReducer(state, {
    type: "open",
    id: "experience",
    selection: "muzigal",
    viewport,
  });
  assert.equal(state.windows[0].selectionVersion, version + 1);
});
