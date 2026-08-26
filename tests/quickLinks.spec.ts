import type { Locator } from "@playwright/test";

import { expect, test } from "./fixtures/fixtures";

async function reorderQuickLinks(
  dashboard: {
    manualDragAndDropReorder: (
      dragged: Locator,
      target: Locator,
      position?: { x: number; y: number }
    ) => Promise<void>;
    waitForQuickLinkCount: (count: number) => Promise<Locator[]>;
    getQuickLinkNames: () => Promise<Array<string | null>>;
  },
  quickLinks: Locator[]
) {
  const currentOrder = await dashboard.getQuickLinkNames();

  await dashboard.manualDragAndDropReorder(quickLinks[0]!, quickLinks[1]!, {
    x: 40,
    y: 40
  });

  await expect
    .poll(() => dashboard.getQuickLinkNames())
    .toStrictEqual([
      currentOrder[1],
      currentOrder[0],
      ...currentOrder.slice(2)
    ]);
}

test.describe("Quick Links tests", () => {
  test.beforeEach(async ({ extensionId, dashboard }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);
  });

  test("Add and delete quick link test", async ({ dashboard }) => {
    let quickLinks = await dashboard.waitForQuickLinkCount(0);
    expect(quickLinks).toHaveLength(0);

    await dashboard.addQuickLink("example", "https://example.com");

    quickLinks = await dashboard.waitForQuickLinkCount(1);
    expect(quickLinks).toHaveLength(1);
    const quickLinkMenu = await dashboard.openQuickLinkMenu(quickLinks[0]!);

    await quickLinkMenu.getByTestId("DeleteQuickLink").click();

    quickLinks = await dashboard.waitForQuickLinkCount(0);
    expect(quickLinks).toHaveLength(0);
  });

  test("Add quick link test", async ({ dashboard }) => {
    let quickLinks = await dashboard.waitForQuickLinkCount(0);
    expect(quickLinks).toHaveLength(0);

    await dashboard.addQuickLink("example", "https://example.com");

    quickLinks = await dashboard.waitForQuickLinkCount(1);
    expect(quickLinks).toHaveLength(1);
  });

  test("Reorder Quick links", async ({ dashboard }) => {
    let quickLinks = await dashboard.waitForQuickLinkCount(0);
    expect(quickLinks).toHaveLength(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");

    quickLinks = await dashboard.waitForQuickLinkCount(2);
    expect(quickLinks).toHaveLength(2);

    await reorderQuickLinks(dashboard, quickLinks);
  });

  test("Drag quick link without change order", async ({ dashboard }) => {
    await dashboard.waitForQuickLinkCount(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");

    const quickLinks = await dashboard.waitForQuickLinkCount(2);
    const quickLinksOrder = await dashboard.getQuickLinkNames();

    await dashboard.manualDragAndDropWithNoReorder(quickLinks[0]!);

    await expect
      .poll(() => dashboard.getQuickLinkNames())
      .toStrictEqual(quickLinksOrder);
  });

  test("Delete quick link and reorder", async ({ dashboard }) => {
    let quickLinks = await dashboard.waitForQuickLinkCount(0);
    expect(quickLinks).toHaveLength(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");
    await dashboard.addQuickLink("example3", "https://example.com");

    quickLinks = await dashboard.waitForQuickLinkCount(3);
    expect(quickLinks).toHaveLength(3);
    const quickLinkMenu = await dashboard.openQuickLinkMenu(quickLinks[0]!);

    await quickLinkMenu.getByTestId("DeleteQuickLink").click();

    quickLinks = await dashboard.waitForQuickLinkCount(2);
    expect(quickLinks).toHaveLength(2);

    await reorderQuickLinks(dashboard, quickLinks);
  });

  test("Reorder and delete quick link", async ({ dashboard }) => {
    let quickLinks = await dashboard.waitForQuickLinkCount(0);
    expect(quickLinks).toHaveLength(0);

    await dashboard.addQuickLink("example", "https://example.com");
    await dashboard.addQuickLink("example2", "https://example.com");
    await dashboard.addQuickLink("example3", "https://example.com");

    quickLinks = await dashboard.waitForQuickLinkCount(3);
    expect(quickLinks).toHaveLength(3);

    await reorderQuickLinks(dashboard, quickLinks);

    const reorderedLinks = await dashboard.waitForQuickLinkCount(3);
    expect(reorderedLinks).toHaveLength(3);
    const quickLinkMenu = await dashboard.openQuickLinkMenu(reorderedLinks[0]!);

    await quickLinkMenu.getByTestId("DeleteQuickLink").click();

    quickLinks = await dashboard.waitForQuickLinkCount(2);
    expect(quickLinks).toHaveLength(2);
  });

  test("Edit quick link name", async ({ dashboard, page }) => {
    await dashboard.addQuickLink("example", "https://example.com");

    const quickLinks = await dashboard.waitForQuickLinkCount(1);
    let quickLinkMenu = await dashboard.openQuickLinkMenu(quickLinks[0]!);

    await quickLinkMenu.getByTestId("EditQuickLink").click();

    const editModal = page.getByTestId("QuickLinkModal");

    await expect(editModal).toBeVisible();

    let name = editModal.locator("#name");
    let url = editModal.locator("#url");

    await expect(name).toHaveValue("example");
    await expect(url).toHaveValue("https://example.com");

    await name.fill("newExample");
    await url.fill("https://newExample.com");

    await editModal.getByTestId("SaveButton").click();

    quickLinkMenu = await dashboard.openQuickLinkMenu(quickLinks[0]!);
    await quickLinkMenu.getByTestId("EditQuickLink").click();

    name = editModal.locator("#name");
    url = editModal.locator("#url");

    await expect(name).toHaveValue("newExample");
    await expect(url).toHaveValue("https://newExample.com");
  });

  test("Open and colse edit modal", async ({ dashboard, page }) => {
    await dashboard.addQuickLink("example", "https://example.com");

    const quickLinks = await dashboard.waitForQuickLinkCount(1);
    let quickLinkMenu = await dashboard.openQuickLinkMenu(quickLinks[0]!);

    await quickLinkMenu.getByTestId("EditQuickLink").click();

    const editModal = page.getByTestId("QuickLinkModal");

    await expect(editModal).toBeVisible();

    let name = editModal.locator("#name");
    let url = editModal.locator("#url");

    await expect(name).toHaveValue("example");
    await expect(url).toHaveValue("https://example.com");

    await editModal.getByTestId("CloseButton").click();

    quickLinkMenu = await dashboard.openQuickLinkMenu(quickLinks[0]!);
    await quickLinkMenu.getByTestId("EditQuickLink").click();

    name = editModal.locator("#name");
    url = editModal.locator("#url");

    await expect(name).toHaveValue("example");
    await expect(url).toHaveValue("https://example.com");
  });

  test("Quicklinks sync between tabs", async ({
    dashboard,
    context,
    page,
    extensionId
  }) => {
    await dashboard.addQuickLink("1", "https://1");
    await dashboard.addQuickLink("2", "https://2");
    await dashboard.addQuickLink("3", "https://3");

    await dashboard.waitForQuickLinkCount(3);

    const pagePromise = context.waitForEvent("page");
    await context.newPage();
    const newPage = await pagePromise;

    await dashboard.goToExtensionPage(extensionId, dashboard.newTab, newPage);

    await expect
      .poll(async () => {
        const newPageQuickLinks = await newPage.getByTestId("QuickLink").all();

        return newPageQuickLinks.length;
      })
      .toBe(3);

    const pageLinkNames = await Promise.all(
      (await page.getByTestId("QuickLink").all()).map((link) =>
        link.getByTestId("QuickLinkName").textContent()
      )
    );

    const newPageLinkNames = await Promise.all(
      (await newPage.getByTestId("QuickLink").all()).map((link) =>
        link.getByTestId("QuickLinkName").textContent()
      )
    );

    expect(pageLinkNames).toEqual(newPageLinkNames);
  });
});
