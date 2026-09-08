# Somyadeep Tarat — Singularity

A responsive, space-themed portfolio built with Next.js 16, React 19, React Three Fiber, and Three.js. The site exports to static HTML and can be served by any static host.

## Development

```sh
npm install
npm run dev
```

## Checks and production output

```sh
npm run lint
npx tsc --noEmit
npm run build
```

The production output is `out/`. `next start` does not serve static exports; use a static file server or upload `out/` to a static host. Dependencies and the existing lockfile are retained.

## Structure

- `app/page.tsx`: visitor flow, project diagrams, navigation, and native project dialog.
- `app/globals.css`: shared visual tokens and responsive layouts.
- `app/components/CosmicCanvas.tsx`: procedural 3D planet, rings, drag controls, visibility-aware rendering, reduced-motion support, and WebGL fallback.
- `app/components/TerminalContactForm.tsx`: validated email draft composer.
- `app/data/projects.ts`: editable project content and technology stacks.
- `public/assets/`: existing portrait and monogram.

## Experience

Visitors can immediately explore all projects, read project details, learn about the person and their experience, and compose an email. Projects are stable click targets. Native dialogs provide keyboard focus containment and Escape support, with focus restored on close. Navigation has a mobile menu and a skip link. The optional 3D scene never blocks the content; animation pauses offscreen, when the tab is hidden, when manually paused, or when reduced motion is preferred.

Project diagrams are explicitly labeled concept visualizations, not product screenshots. No invented performance metrics, job dates, roles, testimonials, or project-specific URLs have been added.

## Before public launch

1. Confirm the contact email (`sayantarat@gmail.com`) in the page and contact component, plus the GitHub and LinkedIn profile URLs.
2. Supply exact repository and live-demo URLs for each project, genuine screenshots, your role, and any verified outcomes you want to feature.
3. Confirm education dates and supply job titles, dates, and concrete responsibilities for Muzigal, Axis Max Life Insurance, and ACM–VIT. The current text is inherited from the original site.
4. Provide a PDF resume if a resume download should be added.
5. Choose your public domain and hosting account. The repository supports static hosting without a database.
6. If you want the form to send directly, provide a verified sending domain and an email service account. Add a server endpoint with server-side validation, rate limiting, and clear delivery/error states; do not place secret keys in client code. The present form honestly opens an email draft and does not claim delivery.
7. Perform real-device browser checks for pointer/touch interaction, keyboard navigation, 200% text zoom, contrast, reduced motion, no-WebGL behavior, and email-app integration before public launch.

No extra plugin or paid 3D asset is required. There are no API keys, analytics, database, or third-party font requests in the implementation.

## Audit of the original implementation

- Removed the simulated loading delay so the introduction and work are immediately available.
- Replaced moving, hover-dependent project navigation with three directly accessible cards and project details.
- Replaced the full-page WebGL background and multiple effect layers with a focused, bounded hero scene.
- Removed the globally mounted custom cursor and scroll hijacking from the active interface.
- Replaced the non-semantic overlay with a native dialog and focus restoration.
- Consolidated the stylesheet, which previously contained repeated overrides and unused feature styling.
- Replaced fictional secure-uplink/contact language with accurate email-draft behavior.
- Retained original assets, project information, career entries, and social links. Legacy visual components remain unmounted for reference.

## Validation performed

ESLint, TypeScript, production static build, and local HTTP compile smoke check. Interactive browser/device QA is still a pre-launch check; it has not been performed in this task.
