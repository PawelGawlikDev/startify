import path from "path"
import { test as base, chromium, type BrowserContext } from "@playwright/test"
import { StartifyStartPage } from "tests/utils/mainPageUtils"

type ExtensionFixtures = {
  context: BrowserContext
  extensionId: string
  startPage: StartifyStartPage
}

const isDebug = process.env.DEBUG === "true"

export const test = base.extend<ExtensionFixtures>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, "../../build/chrome-mv3-prod")

    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        ...(isDebug ? [] : [`--headless=new`]),
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ]
    })

    await use(context)

    await context.close()
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers()

    if (!background) background = await context.waitForEvent("serviceworker")

    const extensionId = background.url().split("/")[2]

    await use(extensionId)
  },
  startPage: async ({ page }, use) => {
    await use(new StartifyStartPage(page))
  }
})

export const expect = test.expect
