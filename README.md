# dsh-pdf-reader

Practical PDF tools for the built-in DeepSeek Harness PDF preview. It does **not** replace PDF.js: it keeps DSH's existing renderer and adds a `PDF` action in the document header.

## Features

The built-in DSH PDF.js preview stays responsible for rendering and text selection. This plugin adds a research-reading layer on top:

- **Full-text search** across the whole PDF, with previous/next navigation and current-match highlighting.
- **Page jump** and **resume** (last page per file).
- **Annotations**: select text, pick yellow / green / blue / pink, add an optional note, and keep a list per PDF. Annotations are stored as a sidecar JSON in `~/.dsh/pdf-reader/notes/<sha1>.json`; the page highlight uses CSS Custom Highlights plus a DOM overlay fallback, and the list can be exported as Markdown.
- **AI translation / explanation**: select text and choose Translate or Explain. The host calls DSH's configured default model through `ctx.llm`; the answer is rendered as Markdown in a floating panel. The selected text is sent to that model.
- **Quote selection**: insert a Markdown quote with the file name and page number into the chat composer; if the composer is unavailable, copy it to the clipboard.
- Keyboard shortcut `Cmd/Ctrl+F` opens the PDF search when the PDF pane is active.

## Install

Install the directory as a bundle from DSH's **Plugins** page, then restart DSH (host bundles load at start):

```text
/Users/lizg/Documents/Projects/dsh-pdf-reader
```

For the local desktop profile, the equivalent is a `link:` dependency plus the bundle name in `dsh.profile.bundles`, then restart.

## Requirements

- Python 3 for the full-text backend.
- `pypdf`; on first search the host creates `~/.dsh/pdf-reader/venv`, or reuses `~/.dsh/formula-verify/venv` if that already contains `pypdf`.
- The built-in PDF preview must be available (it is part of DSH's document preview).

## Limits

- Scanned/image-only PDFs have no text layer; search and quote need OCR, which is not included yet.
- Search results can point at a page that is not rendered yet; the client scrolls there and highlights the page after PDF.js renders it. A failed highlight does not affect navigation.
- The action is attached only to `.pdf` files. Word/PowerPoint converted to PDF via the Office preview is not handled yet.
- The backend is token-protected and injected into the HTTP index; the Desktop app loads the UI over HTTP.

## AI model

Translate/Explain uses the current DSH default model (`agentDefaultModel.currentSelection()`), falling back to the first registered provider model. If the model is unavailable, the AI panel reports the error; the reading and annotation features still work.

The host sends only the selected text (truncated to 6000 characters) plus the file name and page number. It does not upload the whole PDF.

## Design


- Host: `GET /pdf-reader/search?path=<absolute pdf>&q=<query>`; token in `x-pdf-reader-token`; `pypdf` extracts text and returns `{pages, matches, truncated}`.
- Host: `GET/POST /pdf-reader/notes?path=<absolute pdf>` reads/writes the sidecar JSON; `POST /pdf-reader/ai` resolves the default model and streams from `ctx.llm`.
- Client: registers `sidebar.right.tab.document.actions` for PDFs; reads PDF.js text layers through `[data-pdf-text]` / `[data-pdf-page]`; uses `CSS.highlights` for search and annotation highlights, plus a floating selection toolbar and AI panel.
