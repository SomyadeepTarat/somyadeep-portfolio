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

Work is on `redesign/macos-portfolio`; main remains unchanged. Push this branch to the existing Git remote to request a Vercel preview if Git integration is enabled, review the preview, then merge via the normal repository workflow to deploy production. This implementation does not push, merge, or change the live site. The Vercel account’s project settings were not available locally.

## Edit content

All portfolio facts and shared copy live in `app/data/profile.ts`: profile/contact details, education, certification, experience, leadership, skills, and the three featured projects. Both the desktop apps and the server-rendered mobile portfolio consume it. Keep missing values null until verified; do not infer dates, metrics, or skill proficiency.

Replace `public/resume/Somyadeep-Tarat-Resume.pdf` when updating the resume, and regenerate `public/resume/preview.webp` from its first page. The preview app uses that rendered image by default (with zoom), plus an optional native PDF viewer. The current PDF is an unchanged copy of the supplied file. The existing portrait has been converted to a 15 KB WebP. The original source image is retained. Project artwork is original schematic CSS/SVG, explicitly labeled as a concept study, not a screenshot.

`app/layout.tsx` owns title/social metadata; `app/robots.ts` and `app/sitemap.ts` use `profile.site`. Update that value if the canonical domain changes. `public/assets/social-preview.png` is the share card.

## Add an app

1. Create a default-exported component in `app/apps/YourApp.tsx`. Accept `AppProps` if it needs a Spotlight selection or navigation to another app.
2. Add one entry to `app/desktop/registry.ts`: `id`, `name`, an existing `icon`, `component: lazy(() => import('../apps/YourApp'))`, and `defaultSize: { width, height }`.

The dock, running indicators, Window menu, and app search are generated from the registry. `AppId` is inferred. Reuse an existing icon, or add an original path in `icons.tsx` for a new one. Put any new portfolio facts in the data module. Add a semantic section to `StandardPortfolio.tsx` if the app introduces content that should also appear on mobile and without JavaScript.

Central window state lives in `window-state.ts` and `store.tsx`; app-local selection stays inside each app. Minimize preserves app state, close resets it, and explicit search navigation selects the requested entry. Breakpoint changes mount/unmount the desktop and reset its window arrangement. Theme, wallpaper, and motion preferences persist locally; the welcome intro runs once per browser session.

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
