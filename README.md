# Startify new tab extension

## Overview

A fast, open and free-to-use browser extension that gives a new, fresh and customisable tab page to modern browsers.

## Development
Prefers package manager is [PNPM](https://pnpm.io)

Create .env file in root of project with variables.
```
VITE_WEATHER_KEYS=<Array or sinle weather API key>
VITE_WEATHER_API=<Weather API endpoint>
```
By default Startify use [WeatherAPI](https://www.weatherapi.com) to as weather service.

Install dependency
``` bash
pnpm install
```

Then you can run extension in development mode
``` bash
pnpm dev
```

To build production version run 
``` bash
pnpm build
```

## Testing

Startify have autoamtion tests using playwright to make testing process easier. To run tests follow steps.

Build production build.
``` bash
pnpm build
```
and run 
``` bash
pnpm e2e
```
On first time you need to install playwright browsers.


<div align="center">

[![Chrome](./docs/chrome.svg)](https://chromewebstore.google.com/detail/startify/fjjipcmebaelmnkkbdjnhhjbgenecgbd)
[![Firefox](./docs/firefox.svg)](https://addons.mozilla.org/pl/firefox/addon/startify_new_tab/)

</div>
