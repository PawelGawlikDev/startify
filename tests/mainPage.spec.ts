import { expect, test } from "./fixtures/fixtures"

test.describe("Main Page tests", () => {
  test("Main test", async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/newtab.html`)
    await expect(page.locator("main")).toBeVisible()
  })

  test("Digital timer visible", async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/newtab.html`)
    const digitalTime = page.getByTestId("DigitalTime")
    await expect(digitalTime).toBeVisible()
  })

  test("Search Input visible", async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/newtab.html`)
    const digitalTime = page.getByTestId("SearchInput")
    await expect(digitalTime).toBeVisible()
  })

  test("Add Quick Link button visible", async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/newtab.html`)
    const digitalTime = page.getByTestId("AddQuickLink")
    await expect(digitalTime).toBeVisible()
  })

  test("Quick Link grid visible", async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/newtab.html`)
    const digitalTime = page.getByTestId("QuickLinkGrid")
    await expect(digitalTime).toBeVisible()
  })
})
