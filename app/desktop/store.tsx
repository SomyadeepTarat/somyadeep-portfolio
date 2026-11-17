"use client";
import { createContext, useContext, useReducer, type ReactNode } from "react";
export { clampBounds } from "./window-state";
export type { Bounds, WindowState } from "./window-state";
import { windowReducer, type State, type Action } from "./window-state";
const Context = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);
export function WindowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, { windows: [] });
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}
export function useWindows() {
  const c = useContext(Context);
  if (!c) throw Error("WindowProvider missing");
  return c;
}
