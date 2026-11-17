import { lazy } from "react";
import type { IconName } from "./icons";
export const apps = [
  {
    id: "about",
    name: "About Me",
    icon: "about",
    component: lazy(() => import("../apps/About")),
    defaultSize: { width: 740, height: 520 },
  },
  {
    id: "experience",
    name: "Experience",
    icon: "experience",
    component: lazy(() => import("../apps/Experience")),
    defaultSize: { width: 830, height: 560 },
  },
  {
    id: "projects",
    name: "Projects",
    icon: "projects",
    component: lazy(() => import("../apps/Projects")),
    defaultSize: { width: 900, height: 590 },
  },
  {
    id: "resume",
    name: "Resume",
    icon: "resume",
    component: lazy(() => import("../apps/Resume")),
    defaultSize: { width: 760, height: 650 },
  },
  {
    id: "settings",
    name: "Settings",
    icon: "settings",
    component: lazy(() => import("../apps/Settings")),
    defaultSize: { width: 620, height: 490 },
  },
] as const satisfies readonly {
  id: string;
  name: string;
  icon: IconName;
  component: ReturnType<typeof lazy>;
  defaultSize: { width: number; height: number };
}[];
export type AppId = (typeof apps)[number]["id"];
export type AppProps = {
  selection?: string;
  onNavigate: (id: AppId, selection?: string) => void;
};
