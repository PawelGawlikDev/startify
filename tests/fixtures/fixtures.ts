import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "path";
import { StartifyStartPage } from "../utils/startifyStartPage";

const pathToExtension = path.resolve(".output/chrome-mv3");

type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
  dashboard: StartifyStartPage;
};

const isDebug = process.env.DEBUG === "true";

export const test = base.extend<ExtensionFixtures>({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        ...(isDebug ? [] : [`--headless=new`]),
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ]
    });

    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let background: { url(): string };

    if (pathToExtension.endsWith("-mv3")) {
      [background] = context.serviceWorkers();

      if (!background) background = await context.waitForEvent("serviceworker");
    } else {
      [background] = context.backgroundPages();

      if (!background)
        background = await context.waitForEvent("backgroundpage");
    }

    const extensionId = background.url().split("/")[2];

    await use(extensionId);
  },
  dashboard: async ({ page }, use) => {
    await use(new StartifyStartPage(page));
  }
});
export const expect = test.expect;
