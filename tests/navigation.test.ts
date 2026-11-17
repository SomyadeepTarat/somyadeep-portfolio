import test from "node:test";
import assert from "node:assert/strict";
import { parseRoute, routeHash } from "../app/desktop/navigation";
import { searchPortfolio } from "../app/desktop/search";
import { windowReducer } from "../app/desktop/window-state";
test("deep links validate entries and malformed encodings", () => {
  assert.deepEqual(parseRoute("#/projects/kew"), {
    id: "projects",
    selection: "kew",
  });
  assert.equal(parseRoute("#/projects/missing"), null);
  assert.equal(parseRoute("#/experience/unknown"), null);
  assert.equal(parseRoute("#/projects/%zz"), null);
  assert.equal(parseRoute("#/unknown"), null);
  assert.equal(routeHash("skills", "C/C++"), "#/skills/C%2FC%2B%2B");
});
test("fuzzy search targets real projects, roles, skills and actions under 100ms", () => {
  const start = performance.now();
  assert.equal(searchPortfolio("mzgl")[0].selection, "muzigal");
  assert.equal(searchPortfolio("Latest role")[0].selection, "axis");
  assert.ok(
    searchPortfolio("Python").some(
      (r) => r.id === "skills" && r.selection === "Python",
    ),
  );
  assert.equal(searchPortfolio("Download resume")[0].action, "download");
  assert.ok(performance.now() - start < 100);
});
test("bulk actions and snapped windows remain bounded", () => {
  let state = windowReducer(
    { windows: [] },
    {
      type: "open",
      id: "projects",
      selection: "atlas",
      viewport: { width: 1200, height: 800 },
    },
  );
  state = windowReducer(state, {
    type: "snap",
    id: "projects",
    side: "right",
    width: 1200,
    height: 800,
  });
  assert.ok(state.windows[0].x >= 600);
  assert.ok(state.windows[0].x + state.windows[0].width <= 1188);
  state = windowReducer(state, { type: "minimizeAll" });
  assert.ok(state.windows[0].minimized);
  state = windowReducer(state, {
    type: "open",
    id: "projects",
    selection: "",
    viewport: { width: 1200, height: 800 },
  });
  assert.equal(state.windows[0].selection, "");
  state = windowReducer(state, { type: "closeAll" });
  assert.equal(state.windows.length, 0);
});
