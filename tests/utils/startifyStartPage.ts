import { expect, type Locator, type Page } from "@playwright/test";

export class StartifyStartPage {
  readonly page: Page;
  readonly newTab: string;

  constructor(page: Page) {
    this.page = page;
    this.newTab = "newtab.html";
  }

  async goToExtensionPage(extensionId: string, page: string) {
    await this.page.goto(`chrome-extension://${extensionId}/${page}`);

    await this.page.waitForLoadState("domcontentloaded");
  }

  async fillInput(input: Locator, text: string) {
    await expect(input, {
      message: "Input need to be visible before fill"
    }).toBeVisible();

    await input.fill(text);

    await expect(input, {
      message: "Input content don't match to given text"
    }).toHaveValue(text);
  }

  async addQuickLink(linkName: string, url: string) {
    const addButon = this.page.getByTestId("AddQuickLink");

    await expect(addButon, {
      message: "Add button should be visible"
    }).toBeVisible();

    await addButon.click();

    const addModal = this.page.getByTestId("QuickLinkModal");

    await expect(addModal, {
      message: "Modal should be visible after click add buton"
    }).toBeVisible();

    await this.fillInput(addModal.locator("#name"), linkName);

    await this.fillInput(addModal.locator("#url"), url);

    await addModal.getByTestId("SaveButton").click();

    await this.page.waitForLoadState("domcontentloaded");
  }

  async manualDragAndDropReorder(
    dragged: Locator,
    target: Locator,
    position?: { x: number; y: number }
  ) {
    await expect(dragged, {
      message: "Dragged need to be in vievport"
    }).toBeInViewport();
    await expect(target, {
      message: "Target nedd to be in vievport"
    }).toBeInViewport();

    await dragged.hover({ position: position });
    await this.page.mouse.down();

    const targetPosition = await target.evaluate((element) => {
      return element.getBoundingClientRect();
    });

    await this.page.mouse.move(targetPosition.x, targetPosition.y, {
      steps: 200
    });

    await this.page.mouse.up();
  }

  async manualDragAndDropWithNoReorder(dragged: Locator) {
    await expect(dragged, {
      message: "Dragged need to be in vievport"
    }).toBeInViewport();

    await dragged.hover({ position: { x: 40, y: 40 } });
    await this.page.mouse.down();

    const targetPosition = await dragged.evaluate((element) => {
      return element.getBoundingClientRect();
    });

    await this.page.mouse.move(targetPosition.x, targetPosition.y + 200, {
      steps: 200
    });

    await this.page.mouse.up();
  }
}
