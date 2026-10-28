window.__ModuleLoader__.load({
  id: 'dsh-pdf-reader',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    let createPortal;
    try {
      const reactDom = require('react-dom');
      if (typeof reactDom?.createPortal === 'function') createPortal = reactDom.createPortal;
    } catch {
      createPortal = undefined;
    }

    const ACTION_ID = 'pdf-reader-tools';
    const NS = 'pdfTools';
    const STORE_PREFIX = 'dsh.pdf-reader.v1:';
    const HIT = 'pdf-tools-all';
    const CURRENT = 'pdf-tools-current';

    const CSS = [
      '.pdf_tools_root{display:inline-flex;align-items:center;min-width:0}',
      '.pdf_tools_btn{box-sizing:border-box;height:26px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:.5px solid transparent;border-radius:6px;align-items:center;gap:5px;padding:0 7px;font:inherit;font-size:11px;display:inline-flex}',
      '.pdf_tools_btn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.pdf_tools_btn[aria-expanded=true]{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2)}',
      '.pdf_tools_btn svg{width:14px;height:14px;flex:none}',
      '.pdf_tools_label{white-space:nowrap}',
      '.pdf_tools_pop{box-sizing:border-box;position:fixed;z-index:1000;width:340px;max-width:calc(100vw - 16px);background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l2);border-radius:10px;box-shadow:0 12px 32px #00000038;padding:10px;font-family:inherit;font-size:12px;color:var(--dsw-alias-label-primary)}',
      '.pdf_tools_head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}',
      '.pdf_tools_title{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.pdf_tools_close{width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:5px;justify-content:center;align-items:center;display:inline-flex;font-size:15px;line-height:1}',
      '.pdf_tools_close:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.pdf_tools_searchRow{display:flex;align-items:center;gap:6px}',
      '.pdf_tools_input{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-1);height:29px;min-width:0;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;outline:none;padding:0 8px}',
      '.pdf_tools_input:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}',
      '.pdf_tools_input[data-kind=search]{flex:1 1 auto}',
      '.pdf_tools_input[data-kind=page]{width:52px;text-align:center;flex:none}',
      '.pdf_tools_count{flex:none;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:11px;min-width:36px;text-align:right}',
      '.pdf_tools_row{display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap}',
      '.pdf_tools_small{border:.5px solid var(--dsw-alias-border-l2);border-radius:5px;background:0 0;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:11px;height:25px;padding:0 8px;display:inline-flex;align-items:center;justify-content:center}',
      '.pdf_tools_small:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.pdf_tools_small:disabled{opacity:.4;cursor:default}',
      '.pdf_tools_pageLabel{color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap}',
      '.pdf_tools_total{color:var(--dsw-alias-label-tertiary);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.pdf_tools_hint{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:15px;margin-top:7px;white-space:normal}',
      '.pdf_tools_snippet{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px;margin-top:7px;padding-top:7px;border-top:.5px solid var(--dsw-alias-border-l1);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
      '.pdf_tools_quote{position:fixed;z-index:1100;border:none;border-radius:6px;background:var(--dsw-alias-state-business-primary);color:#fff;box-shadow:0 4px 14px #00000035;cursor:pointer;font:inherit;font-size:11px;font-weight:600;padding:5px 9px;white-space:nowrap}',
      '.pdf_tools_quote:hover{filter:brightness(1.08)}',
      '.pdf_tools_toast{position:fixed;z-index:1200;left:50%;bottom:28px;transform:translateX(-50%);background:var(--dsw-alias-bg-layer-3);border:.5px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;padding:6px 12px;box-shadow:0 6px 20px #00000030;pointer-events:none}',
      '.pdf_tools_overlay{position:fixed;inset:0;z-index:999;pointer-events:none}',
      '.pdf_tools_overlay .pdf_tools_pop,.pdf_tools_overlay .pdf_tools_quote{pointer-events:auto}',
      '::highlight(pdf-tools-all){background-color:#ffc40066;color:inherit}',
      '::highlight(pdf-tools-current){background-color:#ff8c00a8;color:#1b1b1b}',
    ].join('\n');

    const CSS_TAG = 'dsh-pdf-reader/tools.css';
    if (typeof document !== 'undefined') {
      const existing = document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG) + ']');
      if (existing !== null) existing.textContent = CSS;
      else {
        const style = document.createElement('style');
        style.dataset.plugin = 'dsh-pdf-reader';
        style.dataset.pluginCss = CSS_TAG;
        style.textContent = CSS;
        document.head.appendChild(style);
      }
    }

    const zh = {
      title: 'PDF 工具',
      search: '搜索全文',
      placeholder: '搜索全文（⌘F）',
      searching: '搜索中…',
      noResults: '没有匹配',
      page: '页',
      jump: '跳转',
      prev: '上一处',
      next: '下一处',
      clear: '清除',
      copyQuote: '引用选中',
      copied: '已复制引用',
      localOnly: '后端未连接，只搜索已渲染的页面',
      backendUnavailable: 'PDF 搜索后端未注入，只搜索已渲染的页面',
      resumeHint: '自动记住本页；搜索覆盖全文',
      close: '关闭',
    };
    const en = {
      title: 'PDF tools',
      search: 'Search',
      placeholder: 'Search the document (⌘F)',
      searching: 'Searching…',
      noResults: 'No matches',
      page: 'Page',
      jump: 'Go',
      prev: 'Previous',
      next: 'Next',
      clear: 'Clear',
      copyQuote: 'Quote selection',
      copied: 'Quote copied',
      localOnly: 'Backend unavailable; searching rendered pages only',
      backendUnavailable: 'PDF search backend is not injected; searching rendered pages only',
      resumeHint: 'Remembers this page; search covers the whole PDF',
      close: 'Close',
    };

    function SearchIcon() {
      return h('svg', { viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' },
        h('circle', { cx: 7, cy: 7, r: 4.4, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('path', { d: 'M10.3 10.3 14 14', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' })
      );
    }

    function isPdf(path) {
      return typeof path === 'string' && /\.pdf$/i.test(path);
    }

    function basename(path) {
      return String(path).replace(/\\/g, '/').split('/').filter(Boolean).pop() || 'document.pdf';
    }

    function previewFor(button) {
      if (typeof document === 'undefined') return undefined;
      const pane = button?.closest('[data-dockkit-pane],[data-dockkit-float]') ?? document;
      const local = [...pane.querySelectorAll('[data-pdf-preview]')];
      const visible = local.find((element) => element.getClientRects().length > 0);
      if (visible !== undefined) return visible;
      if (local.length > 0) return local[0];
      return document.querySelector('[data-pdf-preview]') ?? undefined;
    }

    function pagesOf(root) {
      if (root === undefined) return [];
      return [...root.querySelectorAll('[data-pdf-page]')].map((element) => {
        const raw = element.getAttribute('data-page-number') ?? element.getAttribute('data-page-label') ?? '0';
        const page = Number.parseInt(raw, 10);
        return { element, page: Number.isFinite(page) ? page : 0 };
      }).filter((entry) => entry.page > 0);
    }

    function findPage(root, page) {
      return pagesOf(root).find((entry) => entry.page === page)?.element;
    }

    function pageNumber(element) {
      const page = Number.parseInt(element?.getAttribute('data-page-number') ?? '0', 10);
      return Number.isFinite(page) ? page : 0;
    }

    function scrollportOf(root) {
      if (root === undefined) return undefined;
      return root.closest('[data-document-zoom-scrollport]') ?? root.parentElement ?? root;
    }

    function scrollToPage(root, page) {
      const element = findPage(root, page);
      if (element === undefined) return false;
      const port = scrollportOf(root);
      if (port !== undefined && port !== root) {
        const delta = element.getBoundingClientRect().top - port.getBoundingClientRect().top;
        port.scrollTop += delta - 12;
      } else {
        element.scrollIntoView({ block: 'start' });
      }
      return true;
    }

    function currentPage(root, port) {
      const pages = pagesOf(root);
      if (pages.length === 0) return 1;
      const top = port.getBoundingClientRect().top + 44;
      let active = pages[0].page;
      for (const entry of pages) {
        if (entry.element.getBoundingClientRect().top <= top) active = entry.page;
        else break;
      }
      return active;
    }

    function storeKey(path) {
      return STORE_PREFIX + path;
    }

    function readStore(path) {
      try {
        const raw = globalThis.localStorage?.getItem(storeKey(path));
        if (raw === null || raw === undefined) return 0;
        const value = JSON.parse(raw);
        const page = Number(value?.page);
        return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 0;
      } catch {
        return 0;
      }
    }

    function writeStore(path, page) {
      try {
        globalThis.localStorage?.setItem(storeKey(path), JSON.stringify({ page, at: Date.now() }));
      } catch {
        // localStorage can be unavailable in restricted contexts.
      }
    }

    function collectTextNodes(pageElement) {
      const nodes = [];
      if (pageElement === undefined) return nodes;
      const walker = document.createTreeWalker(pageElement, NodeFilter.SHOW_TEXT);
      let full = '';
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const value = node.nodeValue;
        if (value === null || value === '' || !node.parentElement?.closest('[data-pdf-text]')) continue;
        nodes.push({ node, start: full.length });
        full += value;
      }
      return { nodes, full };
    }

    function rangesForPage(pageElement, query) {
      const needle = String(query).toLocaleLowerCase();
      if (pageElement === undefined || needle === '') return [];
      const { nodes, full } = collectTextNodes(pageElement);
      if (nodes.length === 0) return [];
      const haystack = full.toLocaleLowerCase();
      const locate = (offset, end) => {
        for (const entry of nodes) {
          const length = entry.node.nodeValue?.length ?? 0;
          const finish = entry.start + length;
          if (end ? offset > entry.start && offset <= finish : offset >= entry.start && offset < finish) {
            return { node: entry.node, offset: Math.max(0, Math.min(length, offset - entry.start)) };
          }
        }
        return undefined;
      };
      const ranges = [];
      let from = 0;
      while (ranges.length < 300) {
        const found = haystack.indexOf(needle, from);
        if (found < 0) break;
        const start = locate(found, false);
        const end = locate(found + needle.length, true);
        if (start !== undefined && end !== undefined) {
          try {
            const range = document.createRange();
            range.setStart(start.node, start.offset);
            range.setEnd(end.node, end.offset);
            ranges.push(range);
          } catch {
            // A detached text layer can change while PDF.js re-renders.
          }
        }
        from = found + Math.max(1, needle.length);
      }
      return ranges;
    }

    function clearHighlights() {
      try {
        if (typeof CSS !== 'undefined' && CSS.highlights !== undefined) {
          CSS.highlights.delete(HIT);
          CSS.highlights.delete(CURRENT);
        }
      } catch {
        // ignore unsupported highlight contexts
      }
    }

    function showHighlights(ranges, activeIndex) {
      try {
        if (typeof CSS === 'undefined' || CSS.highlights === undefined || typeof Highlight === 'undefined') return;
        CSS.highlights.delete(HIT);
        CSS.highlights.delete(CURRENT);
        if (ranges.length > 0) CSS.highlights.set(HIT, new Highlight(...ranges));
        const active = ranges[activeIndex];
        if (active !== undefined) CSS.highlights.set(CURRENT, new Highlight(active));
      } catch {
        // Range/highlight support is best-effort.
      }
    }

    async function copyText(value) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch {
        try {
          const area = document.createElement('textarea');
          area.value = value;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          document.execCommand('copy');
          area.remove();
          return true;
        } catch {
          return false;
        }
      }
    }

    function fetchSearch(config, absolutePath, query) {
      const base = (config.origin === undefined || config.origin === '' ? '' : String(config.origin).replace(/\/$/, '')) + (config.endpoint ?? '/pdf-reader');
      return fetch(base + '/search?path=' + encodeURIComponent(absolutePath) + '&q=' + encodeURIComponent(query), {
        headers: { 'x-pdf-reader-token': config.token },
      }).then(async (response) => {
        const data = await response.json().catch(() => ({ ok: false, error: 'invalid JSON response' }));
        if (!response.ok || data.ok !== true) throw new Error(data.error ?? 'search failed');
        return data;
      });
    }

    function PdfToolsAction(props) {
      const t = props.t;
      const absolutePath = props.absolutePath;
      const enabled = isPdf(absolutePath);
      const config = React.useMemo(() => (typeof globalThis === 'undefined' ? undefined : globalThis.__PDF_READER__), []);
      const [open, setOpen] = React.useState(false);
      const [anchor, setAnchor] = React.useState(undefined);
      const [query, setQuery] = React.useState('');
      const [matches, setMatches] = React.useState([]);
      const [current, setCurrent] = React.useState(0);
      const [truncated, setTruncated] = React.useState(false);
      const [pages, setPages] = React.useState(0);
      const [page, setPage] = React.useState(1);
      const [pageInput, setPageInput] = React.useState('1');
      const [status, setStatus] = React.useState('idle');
      const [localOnly, setLocalOnly] = React.useState(false);
      const [quote, setQuote] = React.useState(undefined);
      const [toast, setToast] = React.useState('');
      const buttonRef = React.useRef(null);
      const popRef = React.useRef(null);
      const inputRef = React.useRef(null);
      const pageInputRef = React.useRef(null);
      const rootRef = React.useRef(undefined);
      const pagesRef = React.useRef(0);
      const restoredRef = React.useRef(false);
      const saveTimer = React.useRef(undefined);
      const searchSeq = React.useRef(0);

      const openTools = React.useCallback(() => {
        const rect = buttonRef.current?.getBoundingClientRect();
        const width = 340;
        const left = Math.max(8, Math.min(rect?.left ?? 16, window.innerWidth - width - 8));
        setAnchor({ top: (rect?.bottom ?? 48) + 6, left });
        setOpen(true);
      }, []);

      const closeTools = React.useCallback(() => {
        setOpen(false);
        setQuote(undefined);
        clearHighlights();
      }, []);

      React.useEffect(() => {
        if (!enabled) return undefined;
        let stopped = false;
        let boundRoot;
        let boundPort;
        let onScroll;
        const attach = () => {
          if (stopped) return;
          const root = previewFor(buttonRef.current);
          if (root === undefined) return;
          rootRef.current = root;
          const list = pagesOf(root);
          if (list.length === 0) return;
          const total = Math.max(...list.map((entry) => entry.page));
          if (pagesRef.current !== total) {
            pagesRef.current = total;
            setPages(total);
          }
          if (!restoredRef.current) {
            restoredRef.current = true;
            const saved = readStore(absolutePath);
            if (saved > 1) {
              setTimeout(() => {
                if (!stopped) {
                  scrollToPage(root, saved);
                  setPage(saved);
                }
              }, 300);
            }
          }
          if (boundRoot !== root) {
            if (boundPort !== undefined && onScroll !== undefined) boundPort.removeEventListener('scroll', onScroll);
            boundRoot = root;
            boundPort = scrollportOf(root);
            onScroll = () => {
              if (stopped || boundPort === undefined) return;
              const next = currentPage(root, boundPort);
              setPage(next);
              if (saveTimer.current !== undefined) clearTimeout(saveTimer.current);
              saveTimer.current = setTimeout(() => writeStore(absolutePath, next), 350);
            };
            boundPort?.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
          }
        };
        attach();
        const timer = setInterval(attach, 500);
        return () => {
          stopped = true;
          clearInterval(timer);
          if (saveTimer.current !== undefined) clearTimeout(saveTimer.current);
          if (boundPort !== undefined && onScroll !== undefined) boundPort.removeEventListener('scroll', onScroll);
        };
      }, [enabled, absolutePath]);

      React.useEffect(() => {
        restoredRef.current = false;
        pagesRef.current = 0;
        setPages(0);
        setPage(1);
        setPageInput('1');
      }, [absolutePath]);

      React.useEffect(() => {
        if (!open) return;
        setTimeout(() => inputRef.current?.focus(), 40);
      }, [open]);

      React.useEffect(() => {
        if (!open) clearHighlights();
      }, [open]);

      React.useEffect(() => {
        if (pageInputRef.current !== null && document.activeElement !== pageInputRef.current) {
          setPageInput(String(page));
        }
      }, [page]);

      React.useEffect(() => {
        if (toast === '') return undefined;
        const timer = setTimeout(() => setToast(''), 1600);
        return () => clearTimeout(timer);
      }, [toast]);

      React.useEffect(() => {
        if (!open) return undefined;
        const onDown = (event) => {
          if (popRef.current?.contains(event.target) === true) return;
          if (buttonRef.current?.contains(event.target) === true) return;
          setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
      }, [open]);

      React.useEffect(() => {
        if (!enabled) return undefined;
        const onKey = (event) => {
          if ((event.metaKey || event.ctrlKey) && String(event.key).toLowerCase() === 'f') {
            const root = previewFor(buttonRef.current);
            if (root === undefined) return;
            const pane = root.closest('[data-dockkit-pane-active],[data-dockkit-float-active]');
            const host = root.closest('[data-dockkit-pane],[data-dockkit-float]');
            const active = pane !== null || host === null || (document.activeElement !== null && host.contains(document.activeElement));
            if (!active) return;
            event.preventDefault();
            openTools();
          } else if (event.key === 'Escape' && open) {
            closeTools();
          }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
      }, [enabled, open, openTools, closeTools]);

      const focusMatch = React.useCallback((index, list) => {
        const match = list[index];
        if (match === undefined) return;
        const root = rootRef.current ?? previewFor(buttonRef.current);
        if (root === undefined) return;
        scrollToPage(root, match.page);
        setPage(match.page);
        writeStore(absolutePath, match.page);
        const paint = () => {
          const pageElement = findPage(root, match.page);
          if (pageElement === undefined) return false;
          const ranges = rangesForPage(pageElement, query.trim());
          if (ranges.length === 0) return false;
          const occurrence = Math.max(0, Number(match.occurrence ?? 0));
          const active = Math.min(occurrence, ranges.length - 1);
          showHighlights(ranges, active);
          const port = scrollportOf(root);
          const range = ranges[active];
          if (port !== undefined && range !== undefined) {
            const rect = range.getBoundingClientRect();
            const top = port.getBoundingClientRect().top;
            if (rect.height > 0 && (rect.top < top + 24 || rect.bottom > top + port.clientHeight - 24)) {
              port.scrollTop += rect.top - top - port.clientHeight * 0.3;
            }
          }
          return true;
        };
        if (!paint()) {
          for (const delay of [200, 500, 900, 1500, 2500]) setTimeout(paint, delay);
        }
      }, [absolutePath, query]);

      React.useEffect(() => {
        if (!open) return undefined;
        const value = query.trim();
        if (value.length < 2) {
          setMatches([]);
          setCurrent(0);
          setTruncated(false);
          setStatus('idle');
          setLocalOnly(false);
          clearHighlights();
          return undefined;
        }
        const sequence = ++searchSeq.current;
        const timer = setTimeout(async () => {
          if (sequence !== searchSeq.current) return;
          setStatus('searching');
          const root = rootRef.current ?? previewFor(buttonRef.current);
          if (root === undefined) {
            setStatus('idle');
            return;
          }
          if (config !== undefined && config !== null && typeof config.token === 'string') {
            try {
              const data = await fetchSearch(config, absolutePath, value);
              if (sequence !== searchSeq.current) return;
              const list = Array.isArray(data.matches) ? data.matches : [];
              if (Number.isFinite(Number(data.pages)) && Number(data.pages) > 0) {
                pagesRef.current = Number(data.pages);
                setPages(Number(data.pages));
              }
              setMatches(list);
              setTruncated(Boolean(data.truncated));
              setCurrent(0);
              setLocalOnly(false);
              setStatus('idle');
              if (list.length > 0) focusMatch(0, list);
              else clearHighlights();
              return;
            } catch {
              if (sequence !== searchSeq.current) return;
              setLocalOnly(true);
            }
          }
          const list = [];
          for (const entry of pagesOf(root)) {
            const ranges = rangesForPage(entry.element, value);
            for (const range of ranges) {
              list.push({ page: entry.page, snippet: range.toString().replace(/\s+/g, ' ').slice(0, 180) });
              if (list.length >= 200) break;
            }
            if (list.length >= 200) break;
          }
          if (sequence !== searchSeq.current) return;
          setMatches(list);
          setTruncated(list.length >= 200);
          setCurrent(0);
          setLocalOnly(true);
          setStatus('idle');
          if (list.length > 0) focusMatch(0, list);
          else clearHighlights();
        }, 320);
        return () => clearTimeout(timer);
      }, [open, query, config, absolutePath, focusMatch]);

      React.useEffect(() => {
        if (!enabled) return undefined;
        const onSelection = () => {
          setTimeout(() => {
            const selection = window.getSelection();
            if (selection === null || selection.isCollapsed || selection.rangeCount === 0) {
              setQuote(undefined);
              return;
            }
            const text = selection.toString().trim();
            if (text === '') {
              setQuote(undefined);
              return;
            }
            const root = previewFor(buttonRef.current);
            if (root === undefined || !root.contains(selection.anchorNode)) {
              setQuote(undefined);
              return;
            }
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) {
              setQuote(undefined);
              return;
            }
            const anchor = selection.anchorNode;
            const element = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor;
            const pageElement = element?.closest('[data-pdf-page]');
            const number = pageElement === null || pageElement === undefined ? 0 : pageNumber(pageElement);
            setQuote({ text, page: number, x: rect.left + rect.width / 2, y: rect.top });
          }, 0);
        };
        document.addEventListener('selectionchange', onSelection);
        return () => document.removeEventListener('selectionchange', onSelection);
      }, [enabled]);

      const copyQuote = async () => {
        if (quote === undefined) return;
        const body = quote.text.split(/\r?\n/).map((line) => '> ' + line).join('\n');
        const label = quote.page > 0 ? `p. ${quote.page}` : 'PDF';
        const markdown = `${body}\n>\n> — ${basename(absolutePath)}, ${label}`;
        await copyText(markdown);
        setToast(t('copied'));
        setQuote(undefined);
      };

      const move = (delta) => {
        if (matches.length === 0) return;
        const next = (current + delta + matches.length) % matches.length;
        setCurrent(next);
        focusMatch(next, matches);
      };

      const jump = () => {
        const value = Number.parseInt(pageInput, 10);
        if (!Number.isFinite(value)) return;
        const max = pages > 0 ? pages : value;
        const target = Math.max(1, Math.min(max, value));
        const root = rootRef.current ?? previewFor(buttonRef.current);
        if (root !== undefined) scrollToPage(root, target);
        setPage(target);
        setPageInput(String(target));
        writeStore(absolutePath, target);
      };

      const count = matches.length > 0
        ? `${current + 1}/${matches.length}${truncated ? '+' : ''}`
        : status === 'searching' ? '…' : '0/0';
      const hint = status === 'searching'
        ? t('searching')
        : query.trim().length >= 2 && matches.length === 0
          ? t('noResults')
          : localOnly
            ? t('localOnly')
            : config === undefined
              ? t('backendUnavailable')
              : t('resumeHint');

      if (!enabled) return null;

      const overlays = [
        open && anchor !== undefined ? h('div', {
          ref: popRef,
          className: 'pdf_tools_pop',
          style: { top: anchor.top, left: anchor.left },
          onMouseDown: (event) => event.stopPropagation(),
        },
          h('div', { className: 'pdf_tools_head' },
            h('span', { className: 'pdf_tools_title' }, t('title')),
            h('button', { type: 'button', className: 'pdf_tools_close', title: t('close'), 'aria-label': t('close'), onClick: closeTools }, '×')
          ),
          h('div', { className: 'pdf_tools_searchRow' },
            h('input', {
              ref: inputRef,
              className: 'pdf_tools_input',
              'data-kind': 'search',
              value: query,
              placeholder: t('placeholder'),
              onChange: (event) => setQuery(event.target.value),
              onKeyDown: (event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  if (matches.length > 0) move(event.shiftKey ? -1 : 1);
                }
              },
            }),
            h('span', { className: 'pdf_tools_count' }, count)
          ),
          h('div', { className: 'pdf_tools_row' },
            h('button', { type: 'button', className: 'pdf_tools_small', disabled: matches.length === 0, onClick: () => move(-1) }, '‹ ' + t('prev')),
            h('button', { type: 'button', className: 'pdf_tools_small', disabled: matches.length === 0, onClick: () => move(1) }, t('next') + ' ›'),
            h('button', {
              type: 'button',
              className: 'pdf_tools_small',
              disabled: query === '',
              onClick: () => {
                setQuery('');
                setMatches([]);
                setCurrent(0);
                setTruncated(false);
                clearHighlights();
              },
            }, t('clear'))
          ),
          h('div', { className: 'pdf_tools_row' },
            h('span', { className: 'pdf_tools_pageLabel' }, t('page')),
            h('input', {
              ref: pageInputRef,
              className: 'pdf_tools_input',
              'data-kind': 'page',
              value: pageInput,
              inputMode: 'numeric',
              onChange: (event) => setPageInput(event.target.value.replace(/[^0-9]/g, '')),
              onKeyDown: (event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  jump();
                }
              },
            }),
            h('span', { className: 'pdf_tools_total' }, '/ ' + (pages > 0 ? pages : '—')),
            h('button', { type: 'button', className: 'pdf_tools_small', onClick: jump }, t('jump'))
          ),
          h('div', { className: 'pdf_tools_hint' }, hint),
          matches[current]?.snippet ? h('div', { className: 'pdf_tools_snippet' }, matches[current].snippet) : null
        ) : null,
        quote !== undefined ? h('button', {
          type: 'button',
          className: 'pdf_tools_quote',
          style: {
            left: Math.max(8, Math.min(quote.x - 48, window.innerWidth - 120)),
            top: Math.max(8, quote.y - 38),
          },
          onMouseDown: (event) => event.preventDefault(),
          onClick: copyQuote,
        }, t('copyQuote')) : null,
        toast !== '' ? h('div', { className: 'pdf_tools_toast' }, toast) : null,
      ].filter(Boolean);

      const overlay = h('div', { className: 'pdf_tools_overlay' }, ...overlays);
      return h('div', { className: 'pdf_tools_root' },
        h('button', {
          ref: buttonRef,
          type: 'button',
          className: 'pdf_tools_btn',
          title: t('title'),
          'aria-label': t('title'),
          'aria-expanded': open,
          onClick: () => (open ? closeTools() : openTools()),
        },
          h(SearchIcon),
          h('span', { className: 'pdf_tools_label' }, 'PDF')
        ),
        createPortal !== undefined && typeof document !== 'undefined'
          ? createPortal(overlay, document.body)
          : overlay
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'pdf-reader: copy');
        const t = ctx.locale.bind(NS);
        ctx.effect(() => ctx.slots.inject('sidebar.right.tab.document.actions', () => ctx.slots.register({
          name: 'sidebar.right.tab.document.actions',
          id: ACTION_ID,
          order: 5,
          locale: NS,
        }, PdfToolsAction)), 'pdf-reader: actions');
      },
    };
  },
});
