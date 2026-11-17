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

# Phase 5–6 enhancement validation — 17 November 2026

## Checkpoints

| Checkpoint                                             | Lint / types / build | Desktop Lighthouse P / A / BP / SEO |
| ------------------------------------------------------ | -------------------- | ----------------------------------- |
| Welcome, search, links; window controls and navigation | Pass                 | 97 / 100 / 100 / 100                |
| Richer apps, widgets, appearance                       | Pass                 | 97 / 100 / 100 / 100                |
| Final polish                                           | Pass                 | 97 / 100 / 100 / 100                |

Related groups were validated together rather than maintaining a separate build for every numbered subgroup. Lighthouse ran against the static export on loopback with desktop Chrome. These scores do not certify all app states, wallpapers, browser engines, or 60fps on other hardware.

Seven regression tests pass. New coverage includes valid/invalid and malformed deep links, fuzzy results for companies/skills/actions, under-100ms search on the actual dataset, snap bounds, bulk actions, and explicit root navigation. Existing tests cover single instances, order, minimize/restore selection, viewport clamping, and maximize restoration.

Browser checks in Codex Chromium:

- Welcome and the revised dock render; desktop and 390×844 mobile layouts were inspected visually.
- The mobile recommendation is dismissible and leaves the full semantic portfolio available.
- Spotlight search for Muzigal lands at `#/experience/muzigal` with the correct company detail.
- Project search produces an explicit empty state; Space opens Atlas Quick Look.
- Terminal `open skills` opens Skills and changes the URL.
- Mission Control lists eight open windows; selecting a card focuses its app.
- Simple View and returning to Desktop View preserve all eight windows.
- Missing assets remain labeled TODO; original project artwork is never presented as real screenshots.
- GitHub cache refresh successfully captured 367 public contribution days. Browser failure keeps the rest of the page functional.

## Scope decisions and remaining verification

- Contact uses only `mailto:` at the user’s request. No messages were sent. There is no server-side delivery state or external form provider.
- Mission Control renders lightweight app cards, not scaled live document previews.
- Column view uses horizontally arranged project cards. No proficiency bars are fabricated; skill levels await user data.
- Resume is one page. Native PDF printing is reached through Print/open PDF; the browser owns its print UI.
- External embeds are opt-in and always have an external-link fallback. Cross-origin framing rejection cannot be detected reliably by the parent page.
- Widgets can be toggled as a collection. Narrow/short screens hide secondary cards; maximized windows hide the collection.
- Photos, awards, project roles, screenshots, demos, learning topics, and deleted-idea stories need user content (README checklist).
- Automated Lighthouse accessibility passed the landing state. A full manual screen-reader audit, all wallpaper/appearance combinations, real Firefox/Safari/Edge, and midrange-device frame profiling were not performed.
- Existing uncommitted portrait edits were preserved and excluded from enhancement commits.

## Final resumed verification — 18 November 2026

- Lint: pass with zero warnings/errors; typecheck: pass; all 7 tests: pass; production static build: pass; whitespace check: pass.
- Fresh desktop Lighthouse: performance **97**, accessibility **100**, best practices **100**, SEO **100**.
- Hash synchronization follows the active window without ref access during render. Window persistence is debounced; full-screen edge snap preserves restore bounds; malformed stored windows are filtered safely.
