import { expect, type Locator, type Page } from "@playwright/test";

export class StartifyStartPage {
  readonly page: Page;
  readonly newTab: string;

  constructor(page: Page) {
    this.page = page;
    this.newTab = "newtab.html";
  }

  async goToExtensionPage(extensionId: string, pageName: string, page?: Page) {
    const currentPage = page ?? this.page;
    await currentPage.goto(`chrome-extension://${extensionId}/${pageName}`);

    await currentPage.waitForLoadState("domcontentloaded");
  }

  async openSettings() {
    const settingsGear = this.page.getByTestId("SettingsGear");

    await expect
      .poll(async () => {
        return await settingsGear.isVisible();
      })
      .toBeTruthy();

    await settingsGear.click();

    const settingsPanel = this.page.getByTestId("SettingsPanel");

    await expect
      .poll(async () => {
        return settingsPanel.isVisible();
      })
      .toBeTruthy();

    return settingsPanel;
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

    const saveButton = addModal.getByTestId("SaveButton");

    await expect(saveButton).toBeDisabled();

    await this.fillInput(addModal.locator("#name"), linkName);

    await this.fillInput(addModal.locator("#url"), url);

    await expect(saveButton).toBeEnabled();

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
