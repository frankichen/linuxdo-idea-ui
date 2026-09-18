(() => {
  "use strict";

  const ROOT = "cgpt-codex";
  const OPEN = "cgpt-codex-tools-open";
  const STYLE_ID = "cgpt-codex-style";
  const SHELL_ID = "cgpt-codex-shell";
  const HOT_ID = "cgpt-codex-hotzone";
  const BOOKMARK_LIMIT = 14;
  let hideTimer = 0;
  let bookmarksLoaded = false;

  const openAiPath = "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";

  const CSS = `
    html.${ROOT} {
      --cgpt-frame-h: 34px;
      --cgpt-bg: #f7f7f5;
      --cgpt-raised: #ffffff;
      --cgpt-sidebar: #ececea;
      --cgpt-sidebar-hover: #e4e4e1;
      --cgpt-border: rgba(15,15,15,.11);
      --cgpt-text: #171717;
      --cgpt-muted: #70706b;
      --cgpt-blue: #2f6feb;
      --main-surface-primary: var(--cgpt-bg) !important;
      --main-surface-secondary: var(--cgpt-raised) !important;
      --main-surface-tertiary: var(--cgpt-sidebar) !important;
      --sidebar-surface-primary: var(--cgpt-sidebar) !important;
      --sidebar-surface-secondary: var(--cgpt-sidebar-hover) !important;
      --sidebar-surface-tertiary: #dededb !important;
      --message-surface: var(--cgpt-raised) !important;
      color-scheme: light;
    }
    html.${ROOT}.dark,
    html.${ROOT}[data-theme="dark"] {
      --cgpt-bg: #0f1011;
      --cgpt-raised: #171819;
      --cgpt-sidebar: #151617;
      --cgpt-sidebar-hover: #202224;
      --cgpt-border: rgba(255,255,255,.11);
      --cgpt-text: #ececec;
      --cgpt-muted: #9a9a96;
      --cgpt-blue: #6ea8fe;
      --main-surface-primary: var(--cgpt-bg) !important;
      --main-surface-secondary: var(--cgpt-raised) !important;
      --main-surface-tertiary: #1d1f20 !important;
      --sidebar-surface-primary: var(--cgpt-sidebar) !important;
      --sidebar-surface-secondary: var(--cgpt-sidebar-hover) !important;
      --sidebar-surface-tertiary: #26282a !important;
      --message-surface: var(--cgpt-raised) !important;
      color-scheme: dark;
    }
    html.${ROOT}, html.${ROOT} body {
      background: var(--cgpt-bg) !important;
      color: var(--cgpt-text);
    }
    html.${ROOT} body {
      box-sizing: border-box !important;
      height: 100vh !important;
      padding-top: var(--cgpt-frame-h) !important;
      overflow: hidden !important;
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    }
    html.${ROOT} body > #__next,
    html.${ROOT} body > #root,
    html.${ROOT} body > div:first-of-type {
      height: calc(100vh - var(--cgpt-frame-h)) !important;
      min-height: 0 !important;
    }
    html.${ROOT} main { background: var(--cgpt-bg) !important; }
    html.${ROOT} nav,
    html.${ROOT} aside {
      background: var(--cgpt-sidebar) !important;
      border-color: var(--cgpt-border) !important;
    }
    html.${ROOT} nav a,
    html.${ROOT} nav button,
    html.${ROOT} aside a,
    html.${ROOT} aside button { border-radius: 8px !important; }
    html.${ROOT} nav a:hover,
    html.${ROOT} nav button:hover,
    html.${ROOT} aside a:hover,
    html.${ROOT} aside button:hover { background: var(--cgpt-sidebar-hover) !important; }
    html.${ROOT} #prompt-textarea,
    html.${ROOT} [contenteditable="true"] { caret-color: var(--cgpt-blue); }
    html.${ROOT} [data-testid*="composer"],
    html.${ROOT} form:has(#prompt-textarea) { border-color: var(--cgpt-border) !important; }
    html.${ROOT} pre {
      border: 1px solid var(--cgpt-border) !important;
      border-radius: 10px !important;
      background: color-mix(in srgb, var(--cgpt-raised) 90%, #000 10%) !important;
    }
    #${HOT_ID} {
      position: fixed; left: 0; right: 0; top: 0; height: 4px;
      z-index: 2147483647; background: transparent;
    }
    #${SHELL_ID}, #${SHELL_ID} * { box-sizing: border-box; }
    #${SHELL_ID} {
      position: fixed; z-index: 2147483646; left: 0; right: 0; top: 0;
      height: var(--cgpt-frame-h); color: var(--cgpt-text);
      font: 12px/1.2 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      pointer-events: none;
    }
    #${SHELL_ID} .cgpt-titlebar {
      height: var(--cgpt-frame-h); display: grid; grid-template-columns: 1fr minmax(120px, 42vw) 1fr;
      align-items: center; gap: 8px; padding: 0 8px 0 10px;
      background: color-mix(in srgb, var(--cgpt-sidebar) 93%, transparent);
      border-bottom: 1px solid var(--cgpt-border); backdrop-filter: blur(16px);
      pointer-events: auto; user-select: none;
    }
    #${SHELL_ID} .cgpt-brand, #${SHELL_ID} .cgpt-window-actions,
    #${SHELL_ID} .cgpt-nav-actions { display: flex; align-items: center; gap: 5px; min-width: 0; }
    #${SHELL_ID} .cgpt-window-actions { justify-content: flex-end; }
    #${SHELL_ID} .cgpt-brand svg { width: 16px; height: 16px; flex: 0 0 auto; }
    #${SHELL_ID} .cgpt-brand-name { font-weight: 650; }
    #${SHELL_ID} .cgpt-chip {
      padding: 2px 6px; border-radius: 999px; color: var(--cgpt-muted);
      border: 1px solid var(--cgpt-border); font-size: 10px;
    }
    #${SHELL_ID} .cgpt-current-title {
      text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      color: var(--cgpt-muted); pointer-events: none;
    }
    #${SHELL_ID} button {
      width: 26px; height: 24px; border: 0; border-radius: 7px;
      background: transparent; color: var(--cgpt-muted); cursor: pointer;
      display: inline-grid; place-items: center; padding: 0; font: inherit;
    }
    #${SHELL_ID} button:hover { background: var(--cgpt-sidebar-hover); color: var(--cgpt-text); }
    #${SHELL_ID} button[data-window="close"]:hover { background: #d94b4b; color: white; }
    #${SHELL_ID} .cgpt-tools {
      position: absolute; left: 10px; right: 10px; top: calc(var(--cgpt-frame-h) + 6px);
      padding: 8px; border: 1px solid var(--cgpt-border); border-radius: 11px;
      background: color-mix(in srgb, var(--cgpt-raised) 96%, transparent);
      box-shadow: 0 14px 40px rgba(0,0,0,.20); backdrop-filter: blur(18px);
      opacity: 0; transform: translateY(-12px); visibility: hidden;
      transition: opacity .14s ease, transform .14s ease, visibility .14s;
      pointer-events: auto;
    }
    html.${OPEN} #${SHELL_ID} .cgpt-tools {
      opacity: 1; transform: translateY(0); visibility: visible;
    }
    #${SHELL_ID} .cgpt-address-row { display: flex; align-items: center; gap: 6px; }
    #${SHELL_ID} .cgpt-address {
      flex: 1; height: 30px; min-width: 0; padding: 0 10px;
      border: 1px solid var(--cgpt-border); border-radius: 8px;
      background: var(--cgpt-bg); color: var(--cgpt-text); outline: none; font: inherit;
    }
    #${SHELL_ID} .cgpt-address:focus { border-color: color-mix(in srgb, var(--cgpt-blue) 65%, var(--cgpt-border)); }
    #${SHELL_ID} .cgpt-bookmarks {
      display: flex; gap: 5px; margin-top: 7px; overflow-x: auto; scrollbar-width: none;
    }
    #${SHELL_ID} .cgpt-bookmarks::-webkit-scrollbar { display: none; }
    #${SHELL_ID} .cgpt-bookmark {
      width: auto; max-width: 190px; height: 24px; padding: 0 8px; flex: 0 0 auto;
      border: 1px solid transparent; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #${SHELL_ID} .cgpt-bookmark:hover { border-color: var(--cgpt-border); }
    #${SHELL_ID} .cgpt-note { color: var(--cgpt-muted); padding: 4px 6px; white-space: nowrap; }
    @media (max-width: 760px) {
      #${SHELL_ID} .cgpt-chip, #${SHELL_ID} [data-window="minimize"], #${SHELL_ID} [data-window="maximize"] { display: none; }
      #${SHELL_ID} .cgpt-titlebar { grid-template-columns: auto 1fr auto; }
    }
  `;

  function extensionMode() {
    return typeof chrome !== "undefined" && Boolean(chrome.runtime && chrome.runtime.id && chrome.runtime.sendMessage);
  }

  function bridge(message) {
    if (!extensionMode()) return Promise.resolve(null);
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) return resolve(null);
          resolve(response || null);
        });
      } catch {
        resolve(null);
      }
    });
  }

  function injectStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = CSS;
  }

  function logoSvg() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${openAiPath}"/></svg>`;
  }

  function titleText() {
    const raw = String(document.title || "ChatGPT").replace(/\s*[-–—]\s*ChatGPT\s*$/i, "").trim();
    return raw && raw !== "ChatGPT" ? raw : "New chat";
  }

  function syncShell() {
    const shell = document.getElementById(SHELL_ID);
    if (!shell) return;
    const title = shell.querySelector(".cgpt-current-title");
    const address = shell.querySelector(".cgpt-address");
    if (title) title.textContent = titleText();
    if (address && document.activeElement !== address) address.value = location.href;
    bridge({ type: "page-url", url: location.href });
  }

  function openTools(force) {
    const html = document.documentElement;
    const next = force == null ? !html.classList.contains(OPEN) : Boolean(force);
    html.classList.toggle(OPEN, next);
    clearTimeout(hideTimer);
    if (next && !bookmarksLoaded) loadBookmarks();
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => openTools(false), 650);
  }

  function normalizeUrl(value) {
    const text = String(value || "").trim();
    if (!text) return null;
    try {
      if (text.startsWith("/")) return new URL(text, location.origin);
      const withScheme = /^[a-z]+:\/\//i.test(text) ? text : `https://${text}`;
      return new URL(withScheme);
    } catch {
      return null;
    }
  }

  async function goAddress(value) {
    const url = normalizeUrl(value);
    if (!url || !["http:", "https:"].includes(url.protocol)) return;
    if (url.hostname === "chatgpt.com") {
      location.assign(url.href);
      return;
    }
    const response = await bridge({ type: "open-normal", url: url.href });
    if (!response) window.open(url.href, "_blank", "noopener");
  }

  function renderBookmarks(items) {
    const box = document.querySelector(`#${SHELL_ID} .cgpt-bookmarks`);
    if (!box) return;
    box.innerHTML = "";
    if (!items || !items.length) {
      const note = document.createElement("span");
      note.className = "cgpt-note";
      note.textContent = extensionMode() ? "没有可显示的书签" : "书签仅在扩展模式可用";
      box.appendChild(note);
      return;
    }
    for (const item of items.slice(0, BOOKMARK_LIMIT)) {
      const btn = document.createElement("button");
      btn.className = "cgpt-bookmark";
      btn.type = "button";
      btn.title = item.url;
      btn.textContent = item.title || item.url;
      btn.addEventListener("click", () => bridge({ type: "open-normal", url: item.url }));
      box.appendChild(btn);
    }
  }

  async function loadBookmarks() {
    bookmarksLoaded = true;
    if (!extensionMode()) return renderBookmarks([]);
    const result = await bridge({ type: "bookmarks", limit: BOOKMARK_LIMIT });
    renderBookmarks(result && Array.isArray(result.items) ? result.items : []);
  }

  function ensureShell() {
    if (!document.body || document.getElementById(SHELL_ID)) return;
    const hot = document.createElement("div");
    hot.id = HOT_ID;
    hot.setAttribute("aria-hidden", "true");
    const shell = document.createElement("div");
    shell.id = SHELL_ID;
    shell.innerHTML = `
      <div class="cgpt-titlebar">
        <div class="cgpt-brand">${logoSvg()}<span class="cgpt-brand-name">ChatGPT</span><span class="cgpt-chip">Codex</span></div>
        <div class="cgpt-current-title">New chat</div>
        <div class="cgpt-window-actions">
          <button type="button" data-action="app" title="在 Codex 独立窗口打开">↗</button>
          <button type="button" data-window="minimize" title="最小化">—</button>
          <button type="button" data-window="maximize" title="最大化 / 还原">□</button>
          <button type="button" data-window="close" title="关闭窗口">×</button>
        </div>
      </div>
      <div class="cgpt-tools">
        <div class="cgpt-address-row">
          <div class="cgpt-nav-actions">
            <button type="button" data-action="back" title="后退">←</button>
            <button type="button" data-action="forward" title="前进">→</button>
            <button type="button" data-action="reload" title="刷新">↻</button>
          </div>
          <input id="cgpt-codex-address" name="cgpt-codex-address" class="cgpt-address" aria-label="地址" spellcheck="false" />
          <button type="button" data-action="copy" title="复制地址">⧉</button>
          <button type="button" data-action="normal" title="在普通浏览器窗口打开">◱</button>
        </div>
        <div class="cgpt-bookmarks"><span class="cgpt-note">将鼠标移到顶部即可临时显示地址和书签</span></div>
      </div>`;

    document.body.append(hot, shell);
    if (!extensionMode()) shell.querySelectorAll("[data-window]").forEach((el) => { el.hidden = true; });

    hot.addEventListener("mouseenter", () => openTools(true));
    shell.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    shell.addEventListener("mouseleave", scheduleHide);
    document.addEventListener("mousemove", (event) => {
      if (event.clientY <= 3) openTools(true);
    }, { passive: true });

    const address = shell.querySelector(".cgpt-address");
    address.addEventListener("keydown", (event) => {
      if (event.key === "Enter") goAddress(address.value);
      if (event.key === "Escape") { address.blur(); openTools(false); }
    });
    address.addEventListener("focus", () => address.select());

    shell.addEventListener("click", async (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const action = button.dataset.action;
      const windowAction = button.dataset.window;
      if (windowAction) return void await bridge({ type: "window-control", action: windowAction });
      if (action === "back") history.back();
      else if (action === "forward") history.forward();
      else if (action === "reload") location.reload();
      else if (action === "copy") {
        try { await navigator.clipboard.writeText(location.href); } catch { /* ignore */ }
      } else if (action === "normal") {
        const response = await bridge({ type: "open-normal", url: location.href });
        if (!response) window.open(location.href, "_blank", "noopener");
      } else if (action === "app") {
        const response = await bridge({ type: "open-app", url: location.href });
        if (!response && !extensionMode()) {
          window.alert("油猴脚本只能修改网页，不能隐藏浏览器原生地址栏。安装仓库 chatgpt/extension 后，点扩展图标即可打开无地址栏的 Codex 独立窗口。");
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.altKey && event.shiftKey && event.code === "KeyB") {
        event.preventDefault();
        openTools();
      } else if (event.key === "Escape" && document.documentElement.classList.contains(OPEN)) {
        openTools(false);
      }
    }, true);
    syncShell();
  }

  function patchHistory() {
    if (window.__cgptCodexHistoryPatched) return;
    window.__cgptCodexHistoryPatched = true;
    for (const method of ["pushState", "replaceState"]) {
      const original = history[method];
      history[method] = function (...args) {
        const result = original.apply(this, args);
        queueMicrotask(syncShell);
        return result;
      };
    }
    addEventListener("popstate", syncShell);
  }

  function bootstrap() {
    if (!document.documentElement) return requestAnimationFrame(bootstrap);
    document.documentElement.classList.add(ROOT);
    injectStyle();
    patchHistory();
    const mount = () => {
      if (!document.body) return requestAnimationFrame(mount);
      ensureShell();
      syncShell();
      const observer = new MutationObserver(() => syncShell());
      const title = document.querySelector("title");
      if (title) observer.observe(title, { childList: true, subtree: true, characterData: true });
    };
    mount();
  }

  bootstrap();
})();
