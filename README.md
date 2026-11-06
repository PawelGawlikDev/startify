# Startify new tab extension

## Overview

A fast, open and free-to-use browser extension that gives a new, fresh and customisable tab page to modern browsers.

## Development

Preferred package manager is [Bun](https://bun.sh)

Install dependency

```bash
bun install
```

Then you can run extension in development mode

```bash
bun run dev
```

To build production version run

```bash
bun run build
```

## Testing

Startify have autoamtion tests using playwright to make testing process easier. To run tests follow steps.

Build production build.

```bash
bun run build
```

and run

```bash
bun run e2e
```

On first run you may also need to install Playwright browsers.

```bash
bunx playwright install --with-deps chromium
```

<div align="center">

[![Chrome](./docs/chrome.svg)](https://chromewebstore.google.com/detail/startify/fjjipcmebaelmnkkbdjnhhjbgenecgbd)
[![Firefox](./docs/firefox.svg)](https://addons.mozilla.org/pl/firefox/addon/startify_new_tab/)

</div>
