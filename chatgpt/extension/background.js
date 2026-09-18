"use strict";
const DEFAULT_URL = "https://chatgpt.com/";
function safeChatUrl(value) {
  try {
    const url = new URL(value || DEFAULT_URL);
    if (url.protocol !== "https:" || url.hostname !== "chatgpt.com") return DEFAULT_URL;
    return url.href;
  } catch { return DEFAULT_URL; }
}
function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
async function lastChatUrl(fallback) {
  const stored = await chrome.storage.local.get("lastChatUrl");
  return safeChatUrl(fallback || stored.lastChatUrl || DEFAULT_URL);
}
async function openApp(url) {
  const target = await lastChatUrl(url);
  return chrome.windows.create({ url: target, type: "popup", focused: true, state: "maximized" });
}
function flattenBookmarks(nodes, out, limit) {
  for (const node of nodes || []) {
    if (out.length >= limit) return out;
    if (node.url) {
      const url = safeWebUrl(node.url);
      if (url) out.push({ title: node.title || url, url });
    }
    if (node.children) flattenBookmarks(node.children, out, limit);
  }
  return out;
}
chrome.action.onClicked.addListener((tab) => { openApp(tab && tab.url).catch(() => openApp()); });
chrome.commands.onCommand.addListener((command) => { if (command === "open-codex-chatgpt") openApp(); });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (!message || typeof message.type !== "string") return { ok: false };
    if (message.type === "page-url") {
      const url = safeChatUrl(message.url);
      await chrome.storage.local.set({ lastChatUrl: url });
      return { ok: true };
    }
    if (message.type === "open-app") {
      const win = await openApp(message.url);
      return { ok: true, windowId: win.id };
    }
    if (message.type === "open-normal") {
      const url = safeWebUrl(message.url);
      if (!url) return { ok: false };
      const win = await chrome.windows.create({ url, type: "normal", focused: true });
      return { ok: true, windowId: win.id };
    }
    if (message.type === "bookmarks") {
      const limit = Math.max(1, Math.min(Number(message.limit) || 14, 30));
      const tree = await chrome.bookmarks.getTree();
      return { ok: true, items: flattenBookmarks(tree, [], limit) };
    }
    if (message.type === "window-control") {
      const windowId = sender.tab && sender.tab.windowId;
      if (typeof windowId !== "number") return { ok: false };
      if (message.action === "close") {
        await chrome.windows.remove(windowId);
        return { ok: true };
      }
      if (message.action === "minimize") {
        await chrome.windows.update(windowId, { state: "minimized" });
        return { ok: true };
      }
      if (message.action === "maximize") {
        const current = await chrome.windows.get(windowId);
        await chrome.windows.update(windowId, { state: current.state === "maximized" ? "normal" : "maximized" });
        return { ok: true };
      }
    }
    return { ok: false };
  })().then(sendResponse).catch((error) => sendResponse({ ok: false, error: String(error && error.message || error) }));
  return true;
});
