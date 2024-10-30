import { expect, type Locator, type Page } from "@playwright/test"

export class StartifyStartPage {
  readonly page: Page
  readonly newTab: string

  constructor(page: Page) {
    this.page = page
    this.newTab = "newtab.html"
  }

  async goToExtensionPage(extensionId: string, page: string) {
    await this.page.goto(`chrome-extension://${extensionId}/${page}`)

    await this.page.waitForLoadState("domcontentloaded")
  }

  async fillInput(input: Locator, text: string) {
    await expect(input, {
      message: "Input need to be visible before fill"
    }).toBeVisible()

    await input.fill(text)

    await expect(input, {
      message: "Input content don't match to given text"
    }).toHaveValue(text)
  }

  async addQuickLink(linkName: string, url: string) {
    const addButon = this.page.getByTestId("AddQuickLink")

    await expect(addButon, {
      message: "Add button should be visible"
    }).toBeVisible()

    await addButon.click()

    const addModal = this.page.getByTestId("QuickLinkModal")

    await expect(addModal, {
      message: "Modal should be visible after click add buton"
    }).toBeVisible()

    await this.fillInput(addModal.locator("#name"), linkName)

    await this.fillInput(addModal.locator("#url"), url)

    await addModal.getByRole("button", { name: "Save" }).click()

    await this.page.waitForLoadState("domcontentloaded")
  }
}
