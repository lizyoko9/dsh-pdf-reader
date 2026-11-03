# Changelog

## 0.2.4 — 2026-11-03

- Render AI Translate/Explain replies as Markdown (headings, lists, bold, inline code, links, blockquotes, code fences) instead of showing raw Markdown.
- Add a DOM overlay for annotation highlights in addition to CSS Custom Highlights. This makes saved annotations visible in the PDF itself even when the Custom Highlight pseudo-element does not paint.
- Repaint annotation overlays on PDF scroll and page re-render.

## 0.2.3 — 2026-11-03

- Fix index injection: listen on the web server's context (`web.ctx`), so `window.__PDF_READER__` reaches the client. This is why the panel previously said “AI backend not connected” and annotations never loaded.
- Quote selection now inserts a Markdown quote into the chat composer; if no composer is found it falls back to the clipboard.
- Update the quote copy in the README.

## 0.2.2 — 2026-11-03

- Fix the bundle patch format: DSH bundle patches must use `- insert:`; the previous bare row was silently ignored, so the host and client halves never loaded.
- Mount the host route from the already-mounted `webServer` when possible, falling back to `ctx.inject` only when needed.
- Minimal-profile verification now returns 401 (route mounted) instead of 404 and includes `dsh-pdf-reader` in the client graph.

## 0.2.1 — 2026-11-03

- Merge annotations already added in the panel with the sidecar list when the asynchronous load returns, so a quick highlight is not lost.

## 0.2.0 — 2026-11-03

- Add selection annotations: four highlight colors, optional note editor, annotation list, page navigation and Markdown export.
- Persist annotations per PDF in `~/.dsh/pdf-reader/notes/<sha1>.json` through a token-protected host route.
- Add AI Translate and AI Explain for selections. The host uses DSH's configured default model through `ctx.llm` and streams the answer back as a panel.
- Replace the single quote button with a selection toolbar (Annotate / Translate / Explain / Quote).
- Keep full-text search, page jump and resume.

## 0.1.1 — 2026-10-28

- Portal the PDF tools popover and quote button to `document.body` so the header cannot clip them.
- Add per-page occurrence indexes from the Python search backend and scroll to the exact occurrence within a page.
- Prefer the visible PDF preview when several PDF tabs are mounted.

## 0.1.0 — 2026-10-28

- Initial PDF tools action: full-text search, page jump, resume and Markdown quote.
- Token-protected host search route backed by `pypdf`.
