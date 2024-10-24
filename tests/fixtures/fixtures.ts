import path from "path"
import { test as base, chromium, type BrowserContext } from "@playwright/test"

const isDebug = process.env.DEBUG === "true"
export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
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
  }
})
export const expect = test.expect
