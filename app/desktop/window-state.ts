import { apps, type AppId } from "./registry";
export type Bounds = { x: number; y: number; width: number; height: number };
export type WindowState = Bounds & {
  id: AppId;
  minimized: boolean;
  maximized: boolean;
  selection?: string;
  selectionVersion?: number;
};
export type State = { windows: WindowState[] };
export type Action =
  | {
      type: "open";
      id: AppId;
      selection?: string;
      viewport: { width: number; height: number };
    }
  | { type: "focus" | "close" | "minimize" | "maximize"; id: AppId }
  | { type: "bounds"; id: AppId; bounds: Bounds }
  | { type: "restore"; windows: WindowState[]; width: number; height: number }
  | { type: "closeAll" | "minimizeAll" }
  | { type: "snap"; id: AppId; side: "left" | "right" | "full"; width: number; height: number }
  | { type: "viewport"; width: number; height: number };
export function clampBounds(b: Bounds, width: number, height: number): Bounds {
  const w = Math.min(
    Math.max(Math.min(320, width - 24), b.width),
    Math.max(1, width - 24),
  );
  const h = Math.min(
    Math.max(Math.min(240, height - 140), b.height),
    Math.max(1, height - 140),
  );
  return {
    width: w,
    height: h,
    x: Math.max(12, Math.min(b.x, width - w - 12)),
    y: Math.max(44, Math.min(b.y, height - h - 96)),
  };
}
export function windowReducer(state: State, action: Action): State {
  const existing =
    "id" in action ? state.windows.find((w) => w.id === action.id) : undefined;
  switch (action.type) {
    case "restore":
      return { windows: action.windows.filter((w, i, all) => apps.some(a => a.id === w.id) && all.findIndex(x => x.id === w.id) === i && [w.x,w.y,w.width,w.height].every(Number.isFinite)).map(w => ({ ...w, ...clampBounds(w, action.width, action.height) })) };
    case "closeAll": return { windows: [] };
    case "minimizeAll": return { windows: state.windows.map(w => ({ ...w, minimized: true })) };
    case "snap": return { windows: state.windows.map(w => w.id === action.id ? { ...w, maximized: action.side === 'full', ...clampBounds({ x: action.side === 'right' ? action.width / 2 + 4 : 12, y: 44, width: action.width / 2 - 16, height: action.height - 140 }, action.width, action.height) } : w) };
    case "open": {
      const app = apps.find((a) => a.id === action.id)!;
      const w = existing
        ? {
            ...existing,
            minimized: false,
            selection: action.selection,
            selectionVersion: action.selection
              ? (existing.selectionVersion || 0) + 1
              : existing.selectionVersion,
          }
        : {
            id: action.id,
            minimized: false,
            maximized: false,
            selection: action.selection,
            ...clampBounds(
              {
                x:
                  (action.viewport.width - app.defaultSize.width) / 2 +
                  state.windows.length * 22,
                y:
                  Math.max(
                    80,
                    (action.viewport.height - app.defaultSize.height) / 2 - 15,
                  ) +
                  state.windows.length * 16,
                ...app.defaultSize,
              },
              action.viewport.width,
              action.viewport.height,
            ),
          };
      return {
        windows: [...state.windows.filter((w) => w.id !== action.id), w],
      };
    }
    case "focus":
      return existing
        ? {
            windows: [
              ...state.windows.filter((w) => w.id !== action.id),
              existing,
            ],
          }
        : state;
    case "close":
      return { windows: state.windows.filter((w) => w.id !== action.id) };
    case "minimize":
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      };
    case "maximize":
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, maximized: !w.maximized } : w,
        ),
      };
    case "bounds":
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, ...action.bounds } : w,
        ),
      };
    case "viewport":
      return {
        windows: state.windows.map((w) => ({
          ...w,
          ...clampBounds(w, action.width, action.height),
        })),
      };
  }
}
