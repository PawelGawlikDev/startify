import { Locator } from "@playwright/test";
import { expect, test } from "./fixtures/fixtures";

test.describe("Quick Links tests", () => {
  test("Add and delete quick link test", async ({
    page,
    extensionId,
    dashboard
  }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(0);

    await dashboard.addQuickLink("example", "https://example.com");

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(1);

    await quickLinks[0].hover();
    await expect(quickLinks[0].getByTestId("QuickLinkSettingsButton"), {
      message: "Settings button should be visible after hover quick link"
    }).toBeVisible();

    await quickLinks[0].getByTestId("QuickLinkSettingsButton").click();
    await expect(page.getByTestId("QuickLinkMenu")).toBeVisible();
    await page
      .getByTestId("QuickLinkMenu")
      .getByTestId("DeleteQuickLink")
      .click();

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(0);
  });

  test("Add quick link test", async ({ page, extensionId, dashboard }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(0);

    await dashboard.addQuickLink("example", "https://example.com");

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(1);
  });

  test("Reorder Quick links", async ({ page, extensionId, dashboard }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(2);

    const quickLinksOrder = [];

    for (const quickLink of quickLinks) {
      quickLinksOrder.push(
        await quickLink.getByTestId("QuickLinkName").textContent()
      );
    }

    await dashboard.manualDragAndDropReorder(quickLinks[0], quickLinks[1], {
      x: 40,
      y: 40
    });

    await expect
      .poll(async () => {
        const newOrder = [];

        quickLinks = await page.getByTestId("QuickLink").all();
        for (const quickLink of quickLinks) {
          await quickLink.waitFor({ timeout: 2000 });
        }

        for (const quickLink of quickLinks) {
          newOrder.push(
            await quickLink.getByTestId("QuickLinkName").textContent()
          );
        }

        return newOrder;
      })
      .toStrictEqual(quickLinksOrder.reverse());
  });

  test("Drag quick link without change order", async ({
    page,
    extensionId,
    dashboard
  }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(2);

    const quickLinksOrder = [];

    for (const quickLink of quickLinks) {
      quickLinksOrder.push(
        await quickLink.getByTestId("QuickLinkName").textContent()
      );
    }

    await dashboard.manualDragAndDropWithNoReorder(quickLinks[0]);

    await expect
      .poll(async () => {
        const newOrder = [];

        quickLinks = await page.getByTestId("QuickLink").all();
        for (const quickLink of quickLinks) {
          await quickLink.waitFor({ timeout: 2000 });
        }

        for (const quickLink of quickLinks) {
          newOrder.push(
            await quickLink.getByTestId("QuickLinkName").textContent()
          );
        }

        return newOrder;
      })
      .toStrictEqual(quickLinksOrder);
  });

  test("Delete quick link and reorder", async ({
    dashboard,
    extensionId,
    page
  }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");
    await dashboard.addQuickLink("example3", "https://example.com");

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(3);

    await quickLinks[0].hover();
    await expect(quickLinks[0].getByTestId("QuickLinkSettingsButton"), {
      message: "Settings button should be visible after hover quick link"
    }).toBeVisible();

    await quickLinks[0].getByTestId("QuickLinkSettingsButton").click();
    await expect(page.getByTestId("QuickLinkMenu")).toBeVisible();
    await page
      .getByTestId("QuickLinkMenu")
      .getByTestId("DeleteQuickLink")
      .click();

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(2);

    const quickLinksOrder = [];

    for (const quickLink of quickLinks) {
      quickLinksOrder.push(
        await quickLink.getByTestId("QuickLinkName").textContent()
      );
    }

    await dashboard.manualDragAndDropReorder(quickLinks[0], quickLinks[1], {
      x: 40,
      y: 40
    });

    await expect
      .poll(async () => {
        const newOrder = [];

        quickLinks = await page.getByTestId("QuickLink").all();
        for (const quickLink of quickLinks) {
          await quickLink.waitFor({ timeout: 2000 });
        }

        for (const quickLink of quickLinks) {
          newOrder.push(
            await quickLink.getByTestId("QuickLinkName").textContent()
          );
        }

        return newOrder;
      })
      .toStrictEqual(quickLinksOrder.reverse());
  });

  test("Reorder and delete quick link", async ({
    dashboard,
    extensionId,
    page
  }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");
    await dashboard.addQuickLink("example3", "https://example.com");

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(3);

    const quickLinksOrder = [];

    for (const quickLink of quickLinks) {
      quickLinksOrder.push(
        await quickLink.getByTestId("QuickLinkName").textContent()
      );
    }

    await dashboard.manualDragAndDropReorder(quickLinks[0], quickLinks[1], {
      x: 40,
      y: 40
    });

    await expect
      .poll(async () => {
        const newOrder = [];

        quickLinks = await page.getByTestId("QuickLink").all();
        for (const quickLink of quickLinks) {
          await quickLink.waitFor({ timeout: 2000 });
        }

        for (const quickLink of quickLinks) {
          newOrder.push(
            await quickLink.getByTestId("QuickLinkName").textContent()
          );
        }

        return newOrder;
      })
      .toEqual([quickLinksOrder[1], quickLinksOrder[0], quickLinksOrder[2]]);

    await quickLinks[0].hover();
    await expect(quickLinks[0].getByTestId("QuickLinkSettingsButton"), {
      message: "Settings button should be visible after hover quick link"
    }).toBeVisible();

    await quickLinks[0].getByTestId("QuickLinkSettingsButton").click();
    await expect(page.getByTestId("QuickLinkMenu")).toBeVisible();
    await page
      .getByTestId("QuickLinkMenu")
      .getByTestId("DeleteQuickLink")
      .click();

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(2);
  });

  test("Edit quick link name", async ({ dashboard, extensionId, page }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);
    await dashboard.addQuickLink("example", "https://example.com");

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(1);

    await quickLinks[0].hover();
    await expect(quickLinks[0].getByTestId("QuickLinkSettingsButton"), {
      message: "Settings button should be visible after hover quick link"
    }).toBeVisible();

    await quickLinks[0].getByTestId("QuickLinkSettingsButton").click();
    await expect(page.getByTestId("QuickLinkMenu")).toBeVisible();
    await page
      .getByTestId("QuickLinkMenu")
      .getByTestId("EditQuickLink")
      .click();

    const editModal = page.getByTestId("QuickLinkModal");

    await expect(editModal).toBeVisible();

    let name = editModal.locator("#name");
    let url = editModal.locator("#url");

    await expect(name).toHaveValue("example");
    await expect(url).toHaveValue("https://example.com");

    await name.fill("newExample");

    await url.fill("https://newExample.com");

    await editModal.getByTestId("SaveButton").click();

    await quickLinks[0].getByTestId("QuickLinkSettingsButton").click();
    await expect(page.getByTestId("QuickLinkMenu")).toBeVisible();
    await page
      .getByTestId("QuickLinkMenu")
      .getByTestId("EditQuickLink")
      .click();

    name = editModal.locator("#name");
    url = editModal.locator("#url");

    await expect(name).toHaveValue("newExample");
    await expect(url).toHaveValue("https://newExample.com");
  });

  test("Open and colse edit modal", async ({
    dashboard,
    extensionId,
    page
  }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);
    await dashboard.addQuickLink("example", "https://example.com");

    let quickLinks: Array<Locator> = [];

    await expect
      .poll(async () => {
        quickLinks = await page.getByTestId("QuickLink").all();

        return quickLinks.length;
      })
      .toBe(1);

    await quickLinks[0].hover();
    await expect(quickLinks[0].getByTestId("QuickLinkSettingsButton"), {
      message: "Settings button should be visible after hover quick link"
    }).toBeVisible();

    await quickLinks[0].getByTestId("QuickLinkSettingsButton").click();
    await expect(page.getByTestId("QuickLinkMenu")).toBeVisible();
    await page
      .getByTestId("QuickLinkMenu")
      .getByTestId("EditQuickLink")
      .click();

    const editModal = page.getByTestId("QuickLinkModal");

    await expect(editModal).toBeVisible();

    let name = editModal.locator("#name");
    let url = editModal.locator("#url");

    await expect(name).toHaveValue("example");
    await expect(url).toHaveValue("https://example.com");

    await editModal.getByTestId("CloseButton").click();

    await quickLinks[0].getByTestId("QuickLinkSettingsButton").click();
    await expect(page.getByTestId("QuickLinkMenu")).toBeVisible();
    await page
      .getByTestId("QuickLinkMenu")
      .getByTestId("EditQuickLink")
      .click();

    name = editModal.locator("#name");
    url = editModal.locator("#url");

    await expect(name).toHaveValue("example");
    await expect(url).toHaveValue("https://example.com");
  });
});
