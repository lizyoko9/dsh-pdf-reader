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
      '.pdf_tools_pop{max-height:calc(100vh - 86px);overflow:auto}',
      '.pdf_tools_sel{box-sizing:border-box;position:fixed;z-index:1150;display:flex;align-items:center;gap:2px;background:var(--dsw-alias-bg-layer-3);border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;box-shadow:0 8px 26px #00000042;padding:3px}',
      '.pdf_tools_selBtn{border:none;border-radius:5px;background:0 0;color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;font-size:11px;line-height:1;padding:5px 8px;white-space:nowrap}',
      '.pdf_tools_selBtn:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.pdf_tools_selBtn[data-accent=true]{color:var(--dsw-alias-state-business-primary);font-weight:600}',
      '.pdf_tools_editor{box-sizing:border-box;position:fixed;z-index:1120;width:340px;max-width:calc(100vw - 16px);background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l2);border-radius:10px;box-shadow:0 16px 44px #00000050;padding:10px;font:inherit;font-size:12px;color:var(--dsw-alias-label-primary)}',
      '.pdf_tools_editorHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}',
      '.pdf_tools_editorTitle{font-size:12px;font-weight:600}',
      '.pdf_tools_editorQuote{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-fill-l1);border-radius:5px;max-height:58px;overflow:auto;padding:5px 7px;font-size:11px;line-height:16px;margin-bottom:7px;white-space:pre-wrap;word-break:break-word}',
      '.pdf_tools_colors{display:flex;align-items:center;gap:6px;margin-bottom:7px}',
      '.pdf_tools_color{width:18px;height:18px;border-radius:50%;cursor:pointer;border:2px solid transparent;box-shadow:0 0 0 .5px #00000030 inset;padding:0}',
      '.pdf_tools_color[data-selected=true]{border-color:var(--dsw-alias-label-primary)}',
      '.pdf_tools_color[data-color=yellow]{background:#ffd54f}',
      '.pdf_tools_color[data-color=green]{background:#81c784}',
      '.pdf_tools_color[data-color=blue]{background:#64b5f6}',
      '.pdf_tools_color[data-color=pink]{background:#f48fb1}',
      '.pdf_tools_textarea{box-sizing:border-box;width:100%;min-height:64px;resize:vertical;border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:17px;outline:none;padding:6px 8px}',
      '.pdf_tools_textarea:focus{border-color:var(--dsw-alias-state-business-primary)}',
      '.pdf_tools_editorFoot{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:7px}',
      '.pdf_tools_primary{border:none;border-radius:6px;background:var(--dsw-alias-state-business-primary);color:#fff;cursor:pointer;font:inherit;font-size:11px;font-weight:600;height:27px;padding:0 10px}',
      '.pdf_tools_primary:hover{filter:brightness(1.08)}',
      '.pdf_tools_primary:disabled{opacity:.45;cursor:default}',
      '.pdf_tools_ai{box-sizing:border-box;position:fixed;z-index:1140;right:18px;bottom:18px;width:420px;max-width:calc(100vw - 24px);max-height:62vh;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;box-shadow:0 20px 56px #00000055;overflow:hidden}',
      '.pdf_tools_aiHead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 10px 7px;border-bottom:.5px solid var(--dsw-alias-border-l1)}',
      '.pdf_tools_aiTitle{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.pdf_tools_aiBody{min-height:70px;overflow:auto;padding:9px 10px;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;white-space:pre-wrap;word-break:break-word}',
      '.pdf_tools_aiBody[data-error=true]{color:var(--dsw-alias-state-error-primary)}',
      '.pdf_tools_aiHint{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:15px;padding:0 10px 7px}',
      '.pdf_tools_aiFoot{display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:7px 10px 9px;border-top:.5px solid var(--dsw-alias-border-l1)}',
      '.pdf_tools_loading{display:inline-flex;align-items:center;gap:7px;color:var(--dsw-alias-label-secondary)}',
      '.pdf_tools_spinner{width:12px;height:12px;border:1.5px solid var(--dsw-alias-border-l2);border-top-color:var(--dsw-alias-state-business-primary);border-radius:50%;animation:pdf_tools_spin .8s linear infinite}',
      '@keyframes pdf_tools_spin{to{transform:rotate(360deg)}}',
      '.pdf_tools_notes{margin-top:8px;padding-top:8px;border-top:.5px solid var(--dsw-alias-border-l1)}',
      '.pdf_tools_notesHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}',
      '.pdf_tools_notesTitle{color:var(--dsw-alias-label-tertiary);font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}',
      '.pdf_tools_notesList{display:flex;flex-direction:column;gap:2px;max-height:170px;overflow:auto;scrollbar-gutter:stable}',
      '.pdf_tools_note{width:100%;min-width:0;display:flex;align-items:flex-start;gap:6px;text-align:left;border:none;border-radius:5px;background:0 0;color:inherit;cursor:pointer;font:inherit;padding:4px 5px}',
      '.pdf_tools_note:hover{background:var(--dsw-alias-fill-l1)}',
      '.pdf_tools_note[data-active=true]{background:var(--dsw-alias-fill-l2)}',
      '.pdf_tools_noteDot{width:7px;height:7px;border-radius:50%;flex:none;margin-top:4px}',
      '.pdf_tools_noteDot[data-color=yellow]{background:#ffd54f}',
      '.pdf_tools_noteDot[data-color=green]{background:#81c784}',
      '.pdf_tools_noteDot[data-color=blue]{background:#64b5f6}',
      '.pdf_tools_noteDot[data-color=pink]{background:#f48fb1}',
      '.pdf_tools_noteMain{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px}',
      '.pdf_tools_noteText{color:var(--dsw-alias-label-primary);font-size:11px;line-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.pdf_tools_noteMeta{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.pdf_tools_noteDelete{width:18px;height:18px;border:none;border-radius:4px;background:0 0;color:var(--dsw-alias-label-tertiary);cursor:pointer;font:inherit;font-size:13px;line-height:1;flex:none}',
      '.pdf_tools_noteDelete:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.pdf_tools_empty{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;padding:2px 0}',
      '::highlight(pdf-note-yellow){background-color:#ffd54f8c;color:inherit}',
      '::highlight(pdf-note-green){background-color:#81c7848c;color:inherit}',
      '::highlight(pdf-note-blue){background-color:#64b5f68c;color:inherit}',
      '::highlight(pdf-note-pink){background-color:#f48fb18c;color:inherit}',
      '::highlight(pdf-note-active){background-color:#ff8c00b3;color:#1b1b1b}',
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
      '.pdf_tools_overlay .pdf_tools_pop,.pdf_tools_overlay .pdf_tools_quote,.pdf_tools_overlay .pdf_tools_sel,.pdf_tools_overlay .pdf_tools_editor,.pdf_tools_overlay .pdf_tools_ai{pointer-events:auto}',
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
      'select.annotate': '标注',
      'select.translate': '翻译',
      'select.explain': '解释',
      'select.quote': '引用',
      'note.title': '添加标注',
      'note.placeholder': '写点笔记（可留空，只高亮）',
      'note.save': '保存标注',
      'note.cancel': '取消',
      'note.saved': '标注已保存',
      'note.saveError': '标注保存失败',
      'note.unanchored': '这段选区跨页或无法定位，暂时不能标注',
      'notes.title': '标注',
      'notes.empty': '还没有标注',
      'notes.export': '导出 Markdown',
      'notes.exported': '标注已复制为 Markdown',
      'notes.delete': '删除标注',
      'notes.loadError': '标注读取失败',
      'ai.translateTitle': 'AI 翻译',
      'ai.explainTitle': 'AI 解释',
      'ai.loading': '正在请求当前模型…',
      'ai.error': 'AI 请求失败',
      'ai.copy': '复制',
      'ai.copied': '已复制',
      'ai.saveNote': '存为标注',
      'ai.saved': '已存为标注',
      'ai.hint': '选中文本会发送给当前 DSH 模型；公式与术语会保留。',
      'ai.noBackend': 'AI 后端未连接',
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
      'select.annotate': 'Annotate',
      'select.translate': 'Translate',
      'select.explain': 'Explain',
      'select.quote': 'Quote',
      'note.title': 'Add annotation',
      'note.placeholder': 'Optional note; leave empty for a highlight',
      'note.save': 'Save annotation',
      'note.cancel': 'Cancel',
      'note.saved': 'Annotation saved',
      'note.saveError': 'Could not save annotation',
      'note.unanchored': 'This selection spans pages or cannot be anchored',
      'notes.title': 'Annotations',
      'notes.empty': 'No annotations yet',
      'notes.export': 'Export Markdown',
      'notes.exported': 'Annotations copied as Markdown',
      'notes.delete': 'Delete annotation',
      'notes.loadError': 'Could not load annotations',
      'ai.translateTitle': 'AI translation',
      'ai.explainTitle': 'AI explanation',
      'ai.loading': 'Asking the current model…',
      'ai.error': 'AI request failed',
      'ai.copy': 'Copy',
      'ai.copied': 'Copied',
      'ai.saveNote': 'Save as annotation',
      'ai.saved': 'Saved as annotation',
      'ai.hint': 'The selection is sent to the current DSH model; formulas and terms are preserved.',
      'ai.noBackend': 'AI backend is not connected',
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

    function apiBase(config) {
      const origin = config?.origin === undefined || config.origin === '' ? '' : String(config.origin).replace(/\/$/, '');
      return origin + (config?.endpoint ?? '/pdf-reader');
    }

    async function apiJSON(config, route, options) {
      if (config === undefined || config === null || typeof config.token !== 'string') {
        throw new Error('PDF backend is not connected');
      }
      const response = await fetch(apiBase(config) + route, {
        ...options,
        headers: {
          'content-type': 'application/json',
          'x-pdf-reader-token': config.token,
          ...(options?.headers ?? {}),
        },
      });
      const data = await response.json().catch(() => ({ ok: false, error: 'invalid JSON response' }));
      if (!response.ok || data.ok !== true) throw new Error(data.error ?? 'request failed');
      return data;
    }

    async function loadNotes(config, absolutePath) {
      const data = await apiJSON(config, '/notes?path=' + encodeURIComponent(absolutePath));
      return Array.isArray(data.notes) ? data.notes : [];
    }

    async function saveNotes(config, absolutePath, notes) {
      const data = await apiJSON(config, '/notes', {
        method: 'POST',
        body: JSON.stringify({ path: absolutePath, notes }),
      });
      return Array.isArray(data.notes) ? data.notes : notes;
    }

    async function askAI(config, absolutePath, text, action, page) {
      return apiJSON(config, '/ai', {
        method: 'POST',
        body: JSON.stringify({ path: absolutePath, text, action, page }),
      });
    }

    function newId() {
      try {
        return globalThis.crypto?.randomUUID?.() ?? String(Date.now()) + '-' + Math.random().toString(36).slice(2);
      } catch {
        return String(Date.now()) + '-' + Math.random().toString(36).slice(2);
      }
    }

    function rangeFromOffsets(pageElement, start, end) {
      const { nodes } = collectTextNodes(pageElement);
      if (nodes.length === 0) return undefined;
      const locate = (offset, isEnd) => {
        for (const entry of nodes) {
          const length = entry.node.nodeValue?.length ?? 0;
          const finish = entry.start + length;
          if (isEnd ? offset > entry.start && offset <= finish : offset >= entry.start && offset < finish) {
            return { node: entry.node, offset: Math.max(0, Math.min(length, offset - entry.start)) };
          }
        }
        return undefined;
      };
      const begin = locate(start, false);
      const finish = locate(end, true);
      if (begin === undefined || finish === undefined) return undefined;
      try {
        const range = document.createRange();
        range.setStart(begin.node, begin.offset);
        range.setEnd(finish.node, finish.offset);
        return range;
      } catch {
        return undefined;
      }
    }

    function clearNoteHighlights() {
      try {
        if (typeof CSS === 'undefined' || CSS.highlights === undefined) return;
        for (const name of ['yellow', 'green', 'blue', 'pink']) CSS.highlights.delete('pdf-note-' + name);
        CSS.highlights.delete('pdf-note-active');
      } catch {
        // ignore
      }
    }

    function paintNotes(root, notes, activeId) {
      if (root === undefined || typeof CSS === 'undefined' || CSS.highlights === undefined || typeof Highlight === 'undefined') return 0;
      clearNoteHighlights();
      const groups = { yellow: [], green: [], blue: [], pink: [] };
      let activeRange;
      let painted = 0;
      for (const note of notes) {
        const pageElement = findPage(root, note.page);
        if (pageElement === undefined) continue;
        const range = rangeFromOffsets(pageElement, note.start, note.end);
        if (range === undefined) continue;
        const color = note.color === 'green' || note.color === 'blue' || note.color === 'pink' ? note.color : 'yellow';
        groups[color].push(range);
        if (note.id === activeId) activeRange = range;
        painted += 1;
      }
      try {
        for (const [color, ranges] of Object.entries(groups)) {
          if (ranges.length > 0) CSS.highlights.set('pdf-note-' + color, new Highlight(...ranges));
        }
        if (activeRange !== undefined) CSS.highlights.set('pdf-note-active', new Highlight(activeRange));
      } catch {
        return 0;
      }
      return painted;
    }

    function offsetWithinPage(pageElement, node, offset) {
      const { nodes } = collectTextNodes(pageElement);
      for (const entry of nodes) {
        if (entry.node === node) return entry.start + Math.max(0, Math.min(offset, entry.node.nodeValue?.length ?? 0));
      }
      return undefined;
    }

    function selectionAnchor(root, selection) {
      if (selection === null || selection.rangeCount === 0) return undefined;
      const range = selection.getRangeAt(0);
      const startElement = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : range.startContainer;
      const endElement = range.endContainer.nodeType === Node.TEXT_NODE ? range.endContainer.parentElement : range.endContainer;
      const startPage = startElement?.closest('[data-pdf-page]');
      const endPage = endElement?.closest('[data-pdf-page]');
      if (startPage === null || startPage === undefined) return undefined;
      const page = pageNumber(startPage);
      const text = selection.toString().trim();
      if (text === '') return undefined;
      const rect = range.getBoundingClientRect();
      const anchor = { text, page, x: rect.left + rect.width / 2, y: rect.top };
      if (endPage !== startPage) return anchor;
      const start = offsetWithinPage(startPage, range.startContainer, range.startOffset);
      const end = offsetWithinPage(startPage, range.endContainer, range.endOffset);
      if (start === undefined || end === undefined) return anchor;
      anchor.start = Math.min(start, end);
      anchor.end = Math.max(start, end);
      return anchor.end > anchor.start ? anchor : anchor;
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
      const [notes, setNotes] = React.useState([]);
      const [activeNote, setActiveNote] = React.useState(undefined);
      const [noteDraft, setNoteDraft] = React.useState(undefined);
      const [ai, setAI] = React.useState(undefined);
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
        if (!enabled) return undefined;
        let cancelled = false;
        setNotes([]);
        setActiveNote(undefined);
        if (config === undefined) return undefined;
        loadNotes(config, absolutePath).then((list) => {
          if (!cancelled) setNotes(list);
        }).catch(() => {
          if (!cancelled) setNotes([]);
        });
        return () => { cancelled = true; };
      }, [enabled, absolutePath, config]);

      React.useEffect(() => {
        if (!enabled) return undefined;
        let stopped = false;
        let observer;
        let debounce;
        const paint = () => {
          if (stopped) return;
          const root = rootRef.current ?? previewFor(buttonRef.current);
          if (root !== undefined) paintNotes(root, notes, activeNote);
        };
        const attach = () => {
          if (stopped) return;
          const root = rootRef.current ?? previewFor(buttonRef.current);
          if (root === undefined) return;
          if (observer === undefined) {
            observer = new MutationObserver(() => {
              clearTimeout(debounce);
              debounce = setTimeout(paint, 120);
            });
            observer.observe(root, { childList: true, subtree: true, characterData: true });
          }
          paint();
        };
        attach();
        const timer = setInterval(() => {
          if (stopped) return;
          if (observer === undefined) attach();
          else paint();
        }, 1500);
        return () => {
          stopped = true;
          clearInterval(timer);
          clearTimeout(debounce);
          observer?.disconnect();
          clearNoteHighlights();
        };
      }, [enabled, notes, activeNote]);

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
            const anchor = selectionAnchor(root, selection);
            if (anchor === undefined || !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) {
              setQuote(undefined);
              return;
            }
            setQuote(anchor);
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

      const commitNotes = (next) => {
        setNotes(next);
        if (config === undefined) {
          setToast(t('note.saveError'));
          return;
        }
        saveNotes(config, absolutePath, next)
          .then((saved) => setNotes(saved))
          .catch(() => setToast(t('note.saveError')));
      };

      const addNote = (selection, color, noteText) => {
        if (selection === undefined || selection.start === undefined || selection.end === undefined) {
          setToast(t('note.unanchored'));
          return false;
        }
        const note = {
          id: newId(),
          page: selection.page,
          start: selection.start,
          end: selection.end,
          text: selection.text.slice(0, 8000),
          note: String(noteText ?? '').slice(0, 8000),
          color,
          createdAt: Date.now(),
        };
        commitNotes([note, ...notes]);
        setActiveNote(note.id);
        return true;
      };

      const openNoteEditor = () => {
        if (quote === undefined) return;
        setNoteDraft({ selection: quote, color: 'yellow', note: '' });
        setQuote(undefined);
      };

      const saveDraft = () => {
        if (noteDraft === undefined) return;
        if (!addNote(noteDraft.selection, noteDraft.color, noteDraft.note)) return;
        setNoteDraft(undefined);
        setToast(t('note.saved'));
      };

      const deleteNote = (id) => {
        commitNotes(notes.filter((note) => note.id !== id));
        if (activeNote === id) setActiveNote(undefined);
      };

      const focusNote = (note) => {
        const root = rootRef.current ?? previewFor(buttonRef.current);
        if (root !== undefined) scrollToPage(root, note.page);
        setPage(note.page);
        setActiveNote(note.id);
        setOpen(true);
      };

      const exportNotes = async () => {
        if (notes.length === 0) return;
        const lines = [`# PDF 标注 — ${basename(absolutePath)}`, ''];
        const ordered = [...notes].sort((left, right) => left.page - right.page || left.start - right.start);
        let page = 0;
        for (const note of ordered) {
          if (note.page !== page) {
            page = note.page;
            lines.push(`## p. ${page}`, '');
          }
          lines.push('> ' + note.text.split(/\r?\n/).join('\n> '));
          if (note.note !== '') lines.push('', note.note);
          lines.push('');
        }
        await copyText(lines.join('\n'));
        setToast(t('notes.exported'));
      };

      const runAI = async (action, selection) => {
        const target = selection ?? quote;
        if (target === undefined) return;
        setQuote(undefined);
        if (config === undefined) {
          setAI({ action, selection: target, text: target.text, error: t('ai.noBackend') });
          return;
        }
        setAI({ action, selection: target, text: target.text, loading: true });
        try {
          const data = await askAI(config, absolutePath, target.text, action, target.page);
          setAI((previous) => ({ ...(previous ?? {}), action, selection: target, text: target.text, loading: false, result: data.text }));
        } catch (error) {
          setAI((previous) => ({ ...(previous ?? {}), action, selection: target, text: target.text, loading: false, error: String(error?.message ?? error) }));
        }
      };

      const saveAIAsNote = () => {
        if (ai?.result === undefined) return;
        if (!addNote(ai.selection, 'blue', ai.result)) return;
        setAI(undefined);
        setToast(t('ai.saved'));
      };

      const copyAI = async () => {
        if (ai?.result === undefined) return;
        await copyText(ai.result);
        setToast(t('ai.copied'));
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
          matches[current]?.snippet ? h('div', { className: 'pdf_tools_snippet' }, matches[current].snippet) : null,
          h('div', { className: 'pdf_tools_notes' },
            h('div', { className: 'pdf_tools_notesHead' },
              h('span', { className: 'pdf_tools_notesTitle' }, t('notes.title') + ' (' + notes.length + ')'),
              notes.length > 0 ? h('button', { type: 'button', className: 'pdf_tools_small', onClick: exportNotes }, t('notes.export')) : null
            ),
            notes.length === 0
              ? h('div', { className: 'pdf_tools_empty' }, t('notes.empty'))
              : h('div', { className: 'pdf_tools_notesList' },
                  notes.map((note) => h('div', {
                    key: note.id,
                    className: 'pdf_tools_note',
                    'data-active': activeNote === note.id,
                    role: 'button',
                    tabIndex: 0,
                    onClick: () => focusNote(note),
                    onKeyDown: (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); focusNote(note); } },
                  },
                    h('span', { className: 'pdf_tools_noteDot', 'data-color': note.color }),
                    h('span', { className: 'pdf_tools_noteMain' },
                      h('span', { className: 'pdf_tools_noteText' }, note.note || note.text),
                      h('span', { className: 'pdf_tools_noteMeta' }, 'p. ' + note.page + (note.note ? ' · ' + note.text : ''))
                    ),
                    h('button', {
                      type: 'button',
                      className: 'pdf_tools_noteDelete',
                      title: t('notes.delete'),
                      'aria-label': t('notes.delete'),
                      onClick: (event) => { event.stopPropagation(); deleteNote(note.id); },
                    }, '×')
                  ))
                )
          )
        ) : null,
        quote !== undefined ? h('div', {
          className: 'pdf_tools_sel',
          style: {
            left: Math.max(8, Math.min(quote.x - 110, window.innerWidth - 230)),
            top: quote.y - 42 < 8 ? quote.y + 18 : quote.y - 42,
          },
          onMouseDown: (event) => event.preventDefault(),
        },
          h('button', {
            type: 'button',
            className: 'pdf_tools_selBtn',
            disabled: quote.start === undefined,
            title: quote.start === undefined ? t('note.unanchored') : t('select.annotate'),
            onClick: openNoteEditor,
          }, t('select.annotate')),
          h('button', { type: 'button', className: 'pdf_tools_selBtn', onClick: () => runAI('translate', quote) }, t('select.translate')),
          h('button', { type: 'button', className: 'pdf_tools_selBtn', 'data-accent': true, onClick: () => runAI('explain', quote) }, t('select.explain')),
          h('button', { type: 'button', className: 'pdf_tools_selBtn', onClick: copyQuote }, t('select.quote'))
        ) : null,
        noteDraft !== undefined ? h('div', {
          className: 'pdf_tools_editor',
          style: {
            left: Math.max(8, Math.min(noteDraft.selection.x - 170, window.innerWidth - 348)),
            top: Math.max(8, Math.min(noteDraft.selection.y + 16, window.innerHeight - 250)),
          },
          onMouseDown: (event) => event.stopPropagation(),
        },
          h('div', { className: 'pdf_tools_editorHead' },
            h('span', { className: 'pdf_tools_editorTitle' }, t('note.title')),
            h('button', { type: 'button', className: 'pdf_tools_close', title: t('note.cancel'), 'aria-label': t('note.cancel'), onClick: () => setNoteDraft(undefined) }, '×')
          ),
          h('div', { className: 'pdf_tools_editorQuote' }, noteDraft.selection.text),
          h('div', { className: 'pdf_tools_colors' },
            ['yellow', 'green', 'blue', 'pink'].map((color) => h('button', {
              key: color,
              type: 'button',
              className: 'pdf_tools_color',
              'data-color': color,
              'data-selected': noteDraft.color === color,
              'aria-label': color,
              onClick: () => setNoteDraft((previous) => ({ ...previous, color })),
            }))
          ),
          h('textarea', {
            className: 'pdf_tools_textarea',
            value: noteDraft.note,
            placeholder: t('note.placeholder'),
            onChange: (event) => setNoteDraft((previous) => ({ ...previous, note: event.target.value })),
          }),
          noteDraft.selection.start === undefined ? h('div', { className: 'pdf_tools_hint' }, t('note.unanchored')) : null,
          h('div', { className: 'pdf_tools_editorFoot' },
            h('button', { type: 'button', className: 'pdf_tools_small', onClick: () => setNoteDraft(undefined) }, t('note.cancel')),
            h('button', { type: 'button', className: 'pdf_tools_primary', disabled: noteDraft.selection.start === undefined, onClick: saveDraft }, t('note.save'))
          )
        ) : null,
        ai !== undefined ? h('div', { className: 'pdf_tools_ai', onMouseDown: (event) => event.stopPropagation() },
          h('div', { className: 'pdf_tools_aiHead' },
            h('span', { className: 'pdf_tools_aiTitle' }, ai.action === 'translate' ? t('ai.translateTitle') : t('ai.explainTitle')),
            h('button', { type: 'button', className: 'pdf_tools_close', title: t('close'), 'aria-label': t('close'), onClick: () => setAI(undefined) }, '×')
          ),
          h('div', { className: 'pdf_tools_aiBody', 'data-error': ai.error !== undefined },
            ai.loading
              ? h('span', { className: 'pdf_tools_loading' }, h('span', { className: 'pdf_tools_spinner' }), t('ai.loading'))
              : ai.error !== undefined ? ai.error : ai.result
          ),
          h('div', { className: 'pdf_tools_aiHint' }, t('ai.hint')),
          h('div', { className: 'pdf_tools_aiFoot' },
            h('button', { type: 'button', className: 'pdf_tools_small', disabled: ai.result === undefined, onClick: copyAI }, t('ai.copy')),
            h('button', { type: 'button', className: 'pdf_tools_primary', disabled: ai.result === undefined || ai.selection.start === undefined, onClick: saveAIAsNote }, t('ai.saveNote'))
          )
        ) : null,
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
