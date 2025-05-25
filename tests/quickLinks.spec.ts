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

  test("Change the order of quick links by dragging", async ({
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

    await dashboard.manualDragAndDropReorder(quickLinks[0], quickLinks[1]);

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
});
