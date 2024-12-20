import { expect, test } from "./fixtures/fixtures";

test.describe("Quick Links tests", () => {
  test("Add and delete quick link test", async ({
    page,
    extensionId,
    startPage
  }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    let quickLinks = await page.getByTestId("QuickLink").all();

    expect(quickLinks.length).toBe(0);

    await startPage.addQuickLink("example", "https://example.com");

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    expect(quickLinks.length, {
      message: "One Quick Link should be added"
    }).toBe(1);

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

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    expect(quickLinks.length, {
      message: "Quick link should be deleted"
    }).toBe(0);
  });

  test("Add quick link test", async ({ page, extensionId, startPage }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    let quickLinks = await page.getByTestId("QuickLink").all();

    expect(quickLinks.length).toBe(0);

    await startPage.addQuickLink("example", "https://example.com");

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    await quickLinks[0].waitFor({ timeout: 2000 });

    expect(quickLinks.length, {
      message: "After add quick link one should be visible"
    }).toBe(1);
  });

  test("Reorder Quick links", async ({ page, extensionId, startPage }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    let quickLinks = await page.getByTestId("QuickLink").all();

    expect(quickLinks.length).toBe(0);

    await startPage.addQuickLink("example", "https://example.com");
    await startPage.addQuickLink("example2", "https://example.com");

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    expect(quickLinks.length, {
      message: "After add quick link two should be visible"
    }).toBe(2);

    const quickLinksOrder = [];

    for (const quickLink of quickLinks) {
      quickLinksOrder.push(
        await quickLink.getByTestId("QuickLinkName").textContent()
      );
    }

    await startPage.manualDragAndDropReorder(quickLinks[0], quickLinks[1], {
      x: 40,
      y: 40
    });

    const newOrder = [];

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    for (const quickLink of quickLinks) {
      newOrder.push(await quickLink.getByTestId("QuickLinkName").textContent());
    }

    expect(newOrder).toEqual(quickLinksOrder.reverse());
  });

  test("Change the order of quick links by dragging the image", async ({
    page,
    extensionId,
    startPage
  }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    let quickLinks = await page.getByTestId("QuickLink").all();

    expect(quickLinks.length).toBe(0);

    await startPage.addQuickLink("example", "https://example.com");
    await startPage.addQuickLink("example2", "https://example.com");

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    expect(quickLinks.length, {
      message: "After add quick links two should be visible"
    }).toBe(2);

    const quickLinksOrder = [];

    for (const quickLink of quickLinks) {
      quickLinksOrder.push(
        await quickLink.getByTestId("QuickLinkName").textContent()
      );
    }

    await startPage.manualDragAndDropReorder(quickLinks[0], quickLinks[1]);

    const newOrder = [];

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    for (const quickLink of quickLinks) {
      newOrder.push(await quickLink.getByTestId("QuickLinkName").textContent());
    }

    expect(newOrder).toEqual(quickLinksOrder.reverse());
  });

  test("Drag quick link without change order", async ({
    page,
    extensionId,
    startPage
  }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    let quickLinks = await page.getByTestId("QuickLink").all();

    expect(quickLinks.length).toBe(0);

    await startPage.addQuickLink("example", "https://example.com");
    await startPage.addQuickLink("example2", "https://example.com");

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    expect(quickLinks.length, {
      message: "After add quick link one should be visible"
    }).toBe(2);

    const quickLinksOrder = [];

    for (const quickLink of quickLinks) {
      quickLinksOrder.push(
        await quickLink.getByTestId("QuickLinkName").textContent()
      );
    }

    await startPage.manualDragAndDropWithNoReorder(quickLinks[0]);

    const newOrder = [];

    quickLinks = await page.getByTestId("QuickLink").all();

    await page.waitForLoadState("domcontentloaded");

    for (const quickLink of quickLinks) {
      await quickLink.waitFor({ timeout: 2000 });
    }

    for (const quickLink of quickLinks) {
      newOrder.push(await quickLink.getByTestId("QuickLinkName").textContent());
    }

    expect(newOrder).toEqual(quickLinksOrder);
  });
});
