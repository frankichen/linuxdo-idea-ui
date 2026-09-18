#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const repoRoot = resolve(root, "..");
const meta = (await readFile(resolve(root, "src/meta.js"), "utf8")).trim();
const main = (await readFile(resolve(root, "src/main.js"), "utf8")).trim() + "\n";
const userscript = meta + "\n\n" + main;

await mkdir(resolve(root, "dist"), { recursive: true });
await mkdir(resolve(root, "extension"), { recursive: true });
await writeFile(resolve(root, "dist/chatgpt-codex.user.js"), userscript);
await writeFile(resolve(root, "extension/content.js"), main);

let publishedRootArtifact = false;
try {
  await access(resolve(repoRoot, "chatgpt/src/main.js"));
  await writeFile(resolve(repoRoot, "chatgpt-codex.user.js"), userscript);
  publishedRootArtifact = true;
} catch {
  // Private CI may mount chatgpt/ as an isolated read/write workspace.
}

console.log(
  publishedRootArtifact
    ? "built dist userscript, root userscript and extension content"
    : "built workspace-local dist userscript and extension content"
);
