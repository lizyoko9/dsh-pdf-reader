# dsh-pdf-reader

Practical PDF tools for the built-in DeepSeek Harness PDF preview. It does **not** replace PDF.js: it keeps DSH's existing renderer and adds a `PDF` action in the document header.

## Features

- **Full-text search** across the whole PDF, with previous/next navigation and current-match highlighting. Uses a small host route backed by `pypdf`; falls back to searching only rendered pages when the backend is unavailable.
- **Page jump** with current page / total pages.
- **Resume**: remembers the last page per file in `localStorage`.
- **Quote selection**: select text in the PDF, click **引用选中**, and get a Markdown quote with the file name and page number on the clipboard.
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

## Design

- Host: `GET /pdf-reader/search?path=<absolute pdf>&q=<query>`; token in `x-pdf-reader-token`; `pypdf` extracts text and returns `{pages, matches, truncated}`.
- Client: registers `sidebar.right.tab.document.actions` for PDFs; reads PDF.js text layers through `[data-pdf-text]` / `[data-pdf-page]`; uses `CSS.highlights` when available.
