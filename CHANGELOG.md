# Changelog

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
