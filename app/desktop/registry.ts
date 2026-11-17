import { lazy } from "react";
import type { IconName } from "./icons";
export const apps = [
  {
    id: "mail",
    name: "Contact",
    icon: "mail",
    component: lazy(() => import("../apps/Mail")),
    defaultSize: { width: 660, height: 620 },
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "terminal",
    component: lazy(() => import("../apps/Terminal")),
    defaultSize: { width: 720, height: 480 },
  },
  {
    id: "skills",
    name: "Skills",
    icon: "activity",
    component: lazy(() => import("../apps/Skills")),
    defaultSize: { width: 760, height: 580 },
  },
  {
    id: "timeline",
    name: "Timeline",
    icon: "calendar",
    component: lazy(() => import("../apps/Timeline")),
    defaultSize: { width: 680, height: 560 },
  },
  {
    id: "photos",
    name: "Photos",
    icon: "photos",
    component: lazy(() => import("../apps/Photos")),
    defaultSize: { width: 760, height: 540 },
  },
  {
    id: "safari",
    name: "Live demos",
    icon: "globe",
    component: lazy(() => import("../apps/Safari")),
    defaultSize: { width: 860, height: 600 },
  },
  {
    id: "trash",
    name: "Trash",
    icon: "trash",
    component: lazy(() => import("../apps/Trash")),
    defaultSize: { width: 540, height: 380 },
  },
  {
    id: "shortcuts",
    name: "Keyboard Shortcuts",
    icon: "grid",
    component: lazy(() => import("../apps/Shortcuts")),
    defaultSize: { width: 600, height: 520 },
  },
  {
    id: "welcome",
    name: "Welcome",
    icon: "sun",
    component: lazy(() => import("../apps/Welcome")),
    defaultSize: { width: 680, height: 480 },
  },
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
