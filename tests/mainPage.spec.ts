import { expect, test } from "./fixtures/fixtures";

test.describe("Main Page tests", () => {
  test("Digital timer visible", async ({ page, extensionId, startPage }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    const digitalTime = page.getByTestId("DigitalTime");

    await expect(digitalTime).toBeVisible();
  });

  test("Search Input visible", async ({ page, extensionId, startPage }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    const digitalTime = page.getByTestId("SearchInput");

    await expect(digitalTime).toBeVisible();
  });

  test("Add Quick Link button visible", async ({
    page,
    extensionId,
    startPage
  }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    const digitalTime = page.getByTestId("AddQuickLink");

    await expect(digitalTime).toBeVisible();
  });

  test("Quick Link grid visible", async ({ page, extensionId, startPage }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    const digitalTime = page.getByTestId("QuickLinkGrid");

    await expect(digitalTime).toBeVisible();
  });
});
