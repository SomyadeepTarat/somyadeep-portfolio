# Validation — 17 November 2026

## Automated checks

- `npm run lint`: pass, zero warnings/errors.
- `npm run typecheck`: pass.
- `npm test`: 4 passing window-state regression tests (single instances and stacking; maximize/restore and viewport bounds; search selection; minimize/restore preservation).
- `npm run build`: pass; static `/`, `/404`, `/robots.txt`, and `/sitemap.xml` output.
- `git diff --check`: pass.
- npm dependency audit after compatible fixes: zero vulnerabilities.

## Lighthouse

Production `out/` served locally, desktop preset, headless Chrome. Final run:

| Category       | Score |
| -------------- | ----- |
| Performance    | 97    |
| Accessibility  | 100   |
| Best practices | 100   |
| SEO            | 100   |

FCP 0.3s; LCP 0.9s; Speed Index 1.5s; total blocking time 0ms; CLS rounds to 0. Scores are local measurements, not a guarantee for every device or hosting response.

## Browser checks

Tested in the Codex Chromium browser at desktop sizes (including 1280×800) and 390×844 phone size:

- About, project gallery, Kew details, and experience content render.
- Spotlight searches Muzigal and opens the specific internship.
- Minimize/restore preserves the selected experience; maximize/restore works.
- Pointer dragging, keyboard resizing, and Escape-to-close work.
- Phone layout mounts no desktop shell and has no horizontal overflow at 390px.
- Switching across the breakpoint changes layouts.
- Light/dark themes, wallpaper selection, and reduced-motion preference work; preferences persist into a new tab.
- Resume page preview renders reliably; original PDF remains available for open/download. Native PDF embedding is optional because the in-app browser did not render it reliably.
- No console errors in final browser session.
- Desktop and mobile screenshots are in `docs/`.

## Deployment and limitations

The existing Vercel URL returned HTTP 200. Static export remains enabled; no hosting configuration or production content was changed remotely. Push/merge/deployment were not performed. Vercel account settings were not inspected.

Safari, Firefox, and Edge were not individually exercised. Screen-reader interaction and reduced-motion OS emulation were not separately audited; semantic labels, native modal focus management, keyboard controls, and reduced-motion CSS are implemented. No claim of universal 60fps is made.

The complete semantic portfolio is present in exported HTML and retained in the DOM for the standard layout. No-JavaScript behavior uses a noscript style to reveal it; this was checked in source, not through a separate browser session with JavaScript disabled.
