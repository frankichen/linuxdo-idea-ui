#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const repoRoot = resolve(root, "..");
const meta = (await readFile(resolve(root, "src/meta.js"), "utf8")).trim();
const main = (await readFile(resolve(root, "src/main.js"), "utf8")).trim() + "\n";
await mkdir(resolve(root, "extension"), { recursive: true });
await writeFile(resolve(repoRoot, "chatgpt-codex.user.js"), meta + "\n\n" + main);
await writeFile(resolve(root, "extension/content.js"), main);
console.log("built chatgpt-codex.user.js and chatgpt/extension/content.js");
