# Somyadeep’s personal workspace

A macOS-inspired portfolio built with Next.js 16, React 19, TypeScript, and CSS. Desktop visitors get draggable app windows, a dock, Spotlight, and persistent appearance settings. Screens below 768px get a semantic single-page portfolio with the same content. No Apple assets, backend, tracking, or external font requests.

## Run and check

Use Node.js 22 LTS or newer and npm.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`dev` starts Next’s development server. `build` generates the static website in `out/`. `start` serves that production export at http://127.0.0.1:3000 using the small local server in `scripts/serve.mjs` (use `PORT=3001 npm start` for another port). `next start` is not compatible with this project’s static export. `npm run format` formats source and documentation.

## Deployment: existing Vercel project

The existing public URL is https://somyadeep-portfolio.vercel.app/. Keep the Vercel project connected to this GitHub repository; no host migration or new hosting identity is needed. Build command: `npm run build`; static output: `out`; install command: `npm ci`. Next.js framework detection can handle the export automatically. No environment variables are required.

Enhancement work is on `main` at the user’s request. The existing Git remote and Vercel project remain the deployment path.

## Edit content

All portfolio facts and shared copy live in `app/data/profile.ts`: profile/contact details, education, certification, experience, leadership, skills, and the three featured projects. Both the desktop apps and the server-rendered mobile portfolio consume it. Keep missing values null until verified; do not infer dates, metrics, or skill proficiency.

Replace `public/resume/Somyadeep-Tarat-Resume.pdf` when updating the resume, and regenerate `public/resume/preview.webp` from its first page. The preview app uses that rendered image by default (with zoom), plus an optional native PDF viewer. The current PDF is an unchanged copy of the supplied file. The existing portrait has been converted to a 15 KB WebP. The original source image is retained. Project artwork is original schematic CSS/SVG, explicitly labeled as a concept study, not a screenshot.

`app/layout.tsx` owns title/social metadata; `app/robots.ts` and `app/sitemap.ts` use `profile.site`. Update that value if the canonical domain changes. `public/assets/social-preview.png` is the share card.

## Add an app

1. Create a default-exported component in `app/apps/YourApp.tsx`. Accept `AppProps` if it needs a Spotlight selection or navigation to another app.
2. Add one entry to `app/desktop/registry.ts`: `id`, `name`, an existing `icon`, `component: lazy(() => import('../apps/YourApp'))`, and `defaultSize: { width, height }`.

The Window menu and app search are generated from the registry; the dock pins a curated subset. `AppId` is inferred. Reuse an existing icon, or add an original path in `icons.tsx` for a new one. Put any new portfolio facts in the data module. Add a semantic section to `StandardPortfolio.tsx` if the app introduces content that should also appear on mobile and without JavaScript.

Central window state lives in `window-state.ts` and `store.tsx`; app-local selection stays inside each app. Minimize preserves app state, close resets it, and explicit search navigation selects the requested entry. Breakpoint changes mount/unmount the desktop; saved windows restore when returning without an explicit deep link. Theme, wallpaper, and motion preferences persist locally; the welcome intro runs once per browser session.

## Accessibility and navigation

- Cmd/Ctrl + K opens Spotlight; Tab navigates results and Enter opens one.
- Escape dismisses the active menu/search or closes the top window.
- Alt + Arrow moves the focused window; Alt + Shift + Arrow resizes it.
- Title-bar double click maximizes/restores. Traffic lights have accessible names and 24px targets.
- Desktop files support double click and keyboard Enter/Space.
- View → Standard portfolio provides the conventional layout on desktop.
- The semantic portfolio is included in exported HTML, retained in the DOM, and readable without JavaScript. It is hidden only while the desktop view is active.
- System reduced motion takes priority over the saved preference. All decorative motion can be disabled in Settings. Auto theme follows the OS.

## Remaining content TODOs

- Preferred displayed location (workplace/university locations are not assumed to be your residence).
- Project screenshots, repository URLs, and live URLs for Atlas, Kew, and FraudGraph AI.
- Replace the placeholder GitHub and portfolio links inside the source resume PDF.
- Optional certification verification URL; confirm the retained LinkedIn URL.
- Optional replacement profile photo. No wallpaper asset is required: three original gradients are included.

## Validation

Lint, strict type checking, production static export, and window-state regression tests are included. Browser QA covers desktop and phone layouts, theme switching, project navigation, search, window controls, and breakpoint changes. `npm audit fix` was applied after updating Next.js within version 16; the resulting dependency audit reported zero vulnerabilities.

Lighthouse can be rerun against the production preview:

```sh
npx lighthouse http://127.0.0.1:3000 --preset=desktop --chrome-flags='--headless' --output=html --output-path=/tmp/portfolio-lighthouse.html
```

Real Safari, Firefox, and Edge checks require those browsers; Chromium checks alone do not establish cross-browser certification. Performance scores depend on the machine and deployment; final measured results are recorded in `QA.md`.

## Enhancement controls (Phases 5–6)

The enhancement work is committed directly to `main`, as requested. Pushes to `origin/main` use the existing Git/Vercel integration; no Sites hosting migration is involved.

- **Welcome:** fresh visits open Welcome; its primary actions reach Experience, Projects, Resume, and Contact. Help reopens it and starts the five-step tour. Settings resets first-use hints.
- **Spotlight:** Cmd/Ctrl+K, arrows, Enter, Escape. Searches apps, projects, skills, roles, education, and actions with a small local fuzzy index. Results are grouped by category. No search service or network dependency.
- **Links:** `/#/projects/atlas`, `/#/experience/muzigal`, `/#/skills/Python`. Each title bar copies its own app/item link. Browser history opens the matching item. Invalid project/company links fall back to Welcome. Mobile shared project/company links scroll to the matching semantic article.
- **Windows:** drag/resize, edge snapping, keyboard move/resize, tile commands, minimize/close all, and Mission Control. Mission Control uses lightweight app cards rather than duplicate live app renders. Windows persist locally; explicit deep links take precedence. Simple View leaves the mounted desktop state intact.
- **Projects:** tech filters, text search, grid/list/column cards, Space for Quick Look. Add `screenshots: [{src:'/assets/example.webp', alt:'Description'}]` to a project to enable its screenshot carousel; absent screenshots retain labeled original concept artwork.
- **Experience:** pinned Highlights plus company notes. Arrow keys in the sidebar move between notes.
- **Resume:** page image zoom, native PDF, download, print/open PDF, and accessible data-driven web content. The supplied PDF is one page; additional pagination is unnecessary until that asset changes. Printing is handled by the browser PDF viewer.
- **Contact:** email only, per the revised request. The validated composer opens an encoded `mailto:` draft. The visitor sends it from their email app. There is no backend, delivery confirmation, Formspree integration, or environment variable.
- **Terminal:** `help`, `whoami`, `skills`, `projects`, `experience`, `education`, `contact`, `open <app>`, `resume`, `theme light|dark`, `clear`, `history`; Tab completion and Up/Down history. Discreet commands include `sudo hire-me`, `neofetch`, `matrix`, `coffee`, and `hello`.
- **Other apps:** Skills, Timeline, Photos, and Live demos are available through Spotlight and Window. Skill categories have no invented ratings. Empty albums and awards remain explicit TODOs. Embedded external previews load only on request, always alongside an external link; browser cross-origin restrictions prevent reliably detecting every blocked frame.
- **Widgets:** draggable and keyboard-movable clock, status, learning, featured project, and GitHub. Settings toggles the widget collection. Short/narrow desktops hide some secondary widgets to preserve space; maximized windows hide the collection. Refresh the public contribution cache with `npm run cache:github` before a build. Failure retains the previous cache; an empty cache displays a profile link.
- **Appearance:** Settings controls theme, four accent palettes, wallpaper (including local-time dynamic), dock size/magnification, motion, transparency, optional sounds, and reset. Sounds are synthesized lazily and off by default. OS reduced motion/transparency override decoration; two-core devices use opaque panels.

### Add shortcuts, wallpapers, and content

Add shortcut bindings in `app/desktop/shortcuts.ts`; implement their action in the shell keyboard dispatcher. The Shortcuts app generates its list from that registry. Editing controls suppress global shortcuts; browser-reserved bindings may remain under browser control.

UI copy and tour content live in `app/data/interface.ts`; verified portfolio facts live in `app/data/profile.ts`. Configure the status in `ui.welcome.status` and learning text in `ui.widgets.learningTodo` when real content is supplied. Existing pre-enhancement components still contain some static interface labels. App names and icons are registry metadata.

Wallpaper gradients and surface/spacing tokens are in `app/globals.css`; add a wallpaper name to `Preferences`, its validation list, and Settings. Accent colors are in `accents` in `app/desktop/preferences.tsx`, with separate contrast-conscious light/dark values. Shared animation timing is `app/desktop/motion.ts` and the matching CSS `--duration`/`--ease` tokens. Add new icons as original SVG paths in `icons.tsx`. The dock intentionally shows core apps only; update its ID list to pin an additional app.

### Final content checklist

- [ ] Confirm availability/status wording if it should say “Open to opportunities.” Current status uses the verified student/developer role.
- [ ] Supply current learning topics, project roles, and confirmed skill levels if ratings are desired.
- [ ] Supply project screenshots (WebP preferred), repository URLs, and live demos.
- [ ] Supply certificate images/verification URL, personal photos, and any writing links.
- [ ] Supply verified awards and dates, if applicable.
- [ ] Supply “Things I deleted” stories.
- [ ] Confirm preferred location and LinkedIn URL.
- [ ] Replace placeholder links within the original resume PDF and regenerate its preview.
- [ ] Refresh GitHub contribution cache periodically with `npm run cache:github`.

No email provider setup is required. No additional assets are required for the current implementation to run.
