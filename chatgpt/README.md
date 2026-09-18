# ChatGPT · Codex Desktop 外观

这个目录把上游 `linuxdo-codex.user.js` 的 Codex Desktop 视觉语言迁到 **chatgpt.com**，但不接管 ChatGPT 数据层。

目标是两层：

1. **油猴脚本**：只改 ChatGPT 网页外观，保留原生会话、模型、上传、Projects、搜索等行为。
2. **Chromium 扩展**：把 ChatGPT 打开成 `popup` 独立窗口，因此 Chrome / Edge 原生地址栏、标签栏和书签栏不会占据顶部；鼠标碰到页面顶部时，再滑出我们自己的地址 + 书签工具栏。

## 推荐：扩展模式

### 直接下载插件包

下载最新固定版本：

[`chatgpt-codex-desktop-extension.zip`](https://github.com/frankichen/linuxdo-idea-ui/releases/latest/download/chatgpt-codex-desktop-extension.zip)

同时发布 SHA-256 校验文件：

[`chatgpt-codex-desktop-extension.zip.sha256`](https://github.com/frankichen/linuxdo-idea-ui/releases/latest/download/chatgpt-codex-desktop-extension.zip.sha256)

安装：

1. 下载 ZIP 并解压。
2. 打开 Chrome / Edge 的扩展管理页。
3. 开启「开发者模式」。
4. 选择「加载已解压的扩展程序」。
5. 选择刚才解压出的插件目录。
6. 打开普通的 `chatgpt.com` 页面后，点击扩展图标 **ChatGPT Codex Desktop**。

如果当前标签页就是 ChatGPT，扩展会把**当前标签页直接移动到 popup 独立窗口**，保留当前会话；如果当前页不是 ChatGPT，则打开上一次 ChatGPT 地址。普通浏览器标签页本身不会再注入 Codex 壳层，也不会出现第二套“假地址栏”。

也可以直接克隆仓库后选择 `chatgpt/extension` 目录。

扩展会打开最大化的 ChatGPT popup 窗口。这个窗口没有普通浏览器的标签栏 / 地址栏 / 书签栏。

### 需要地址栏或书签时

- 鼠标移动到窗口最顶部 **3px** 热区；
- 或按 **Alt + Shift + B**；
- 工具栏会临时出现；
- 鼠标离开后自动收起；
- `Esc` 立即收起。

工具栏提供：后退 / 前进 / 刷新、当前 URL、复制 URL、普通浏览器打开、浏览器书签、最小化 / 最大化 / 关闭。

> Chromium 不允许网页或油猴脚本直接隐藏、再按 hover 恢复浏览器原生地址栏。这里采用 popup 窗口 + 页面内临时工具栏，达到同样的使用效果，而且不依赖实验性浏览器设置。

## 仅使用油猴脚本

安装仓库根目录的 `chatgpt-codex.user.js`。

它会把 ChatGPT 页面换成 Codex 风格并增加顶部控制条，但 **不能隐藏 Chrome / Edge 自己的原生工具栏**。点击标题栏的 ↗ 按钮会提示安装配套扩展。

## 隐私与边界

- 不调用、不代理、不重写 ChatGPT 网络 API。
- 不读取会话正文。
- 不发送书签到任何服务器。
- 扩展只保存最后一个 `chatgpt.com` URL，用于下次打开独立窗口。
- 外部书签点击后在普通浏览器窗口打开，不在 Codex popup 中接管其它站点。

## 开发

本目录无第三方运行时依赖，Node.js 即可：

```bash
cd chatgpt
npm run build
npm run check
```

`npm run build` 从 `src/main.js` 同时生成 `../chatgpt-codex.user.js` 与 `extension/content.js`，两者共用同一份页面换肤与顶部工具栏实现。

## v0.1.1 修复

- 扩展内容脚本只在 `window.type === "popup"` 时启用；普通 ChatGPT 标签页保持原样。
- 隐藏的临时工具层使用 `pointer-events: none`，不会形成透明点击遮罩。
- 不再对 ChatGPT `body` 强制 `overflow: hidden`，也不再使用 `body > div:first-of-type` 这种宽泛选择器。
- 点击扩展图标时，如果当前页就是 ChatGPT，会把当前标签页直接移动到 popup 窗口。

从 v0.1.0 更新后，请在扩展管理页点一次“重新加载”，并刷新已经打开的 ChatGPT 普通标签页。

## 当前兼容策略

ChatGPT 页面会持续更新，因此本实现尽量不重建 ChatGPT DOM，而是覆盖 surface CSS variables，对 `main / nav / aside / composer` 做低侵入样式，并独立注入 Codex titlebar / 临时浏览器工具栏；不依赖会话 API、内部 React state 或私有接口。
