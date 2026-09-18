import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const workflow = await readFile(resolve("workflows/chatgpt-extension-release.yml"), "utf8");
const required = [
  "release:",
  "types: [published]",
  "chatgpt-codex-v",
  "npm --prefix chatgpt test",
  "chatgpt-codex-desktop-extension.zip",
  "sha256sum",
  "gh release upload",
  "--clobber"
];

for (const token of required) {
  if (!workflow.includes(token)) {
    throw new Error(`release workflow is missing required token: ${token}`);
  }
}

console.log("release workflow self-check passed");
