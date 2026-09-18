#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const repoRoot = resolve(root, "..");
const source = await readFile(resolve(root, "src/main.js"), "utf8");
const userscript = await readFile(resolve(root, "dist/chatgpt-codex.user.js"), "utf8");
const content = await readFile(resolve(root, "extension/content.js"), "utf8");
const manifest = JSON.parse(await readFile(resolve(root, "extension/manifest.json"), "utf8"));
const background = await readFile(resolve(root, "extension/background.js"), "utf8");

let rootUserscript = null;
try {
  rootUserscript = await readFile(resolve(repoRoot, "chatgpt-codex.user.js"), "utf8");
} catch {
  // Expected when chatgpt/ is tested as an isolated Private CI workspace.
}

const fail = (m) => {
  console.error("self-check failed:", m);
  process.exitCode = 1;
};

if (!userscript.includes("@match        https://chatgpt.com/*")) fail("userscript @match missing");
if (!userscript.includes("cgpt-codex-hotzone")) fail("top hot zone missing");
if (!userscript.includes('data-window="minimize"')) fail("window controls missing");
if (!source.includes('type: "bookmarks"')) fail("bookmark bridge missing");
if (content.trim() !== source.trim()) fail("extension content is not generated from src/main.js");
if (rootUserscript && rootUserscript.trim() !== userscript.trim()) fail("root userscript is not generated from the same source");
if (!manifest.permissions.includes("bookmarks")) fail("bookmarks permission missing");
if (!manifest.permissions.includes("windows")) fail("windows permission missing");
if (!manifest.host_permissions.includes("https://chatgpt.com/*")) fail("chatgpt host permission missing");
if (/fetch\s*\(/.test(source)) fail("skin source must not intercept or call ChatGPT network APIs");
if (!source.includes('type: "environment"')) fail("extension environment gate missing");
if (!source.includes('environment.windowType === "popup"')) fail("extension must activate only in popup windows");
if (!background.includes('message.type === "environment"')) fail("background environment responder missing");
if (!background.includes('chrome.windows.create({ tabId, type: "popup"')) fail("current ChatGPT tab must move into popup mode");
if (source.includes("body > div:first-of-type")) fail("broad ChatGPT root selector can break page interaction");
if (source.includes("overflow: hidden !important")) fail("global body overflow lock can break ChatGPT interaction");
if (!source.includes("visibility: hidden;\n      transition: opacity .14s ease, transform .14s ease, visibility .14s;\n      pointer-events: none;")) fail("hidden tools must not capture pointer events");
if (manifest.version !== "0.1.1") fail("extension version must be 0.1.1");

if (!process.exitCode) console.log("self-check passed");
