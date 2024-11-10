import { expect, test } from "./fixtures/fixtures";

test.describe("Search Box tests", () => {
  test("Search 'example' in search box", async ({
    page,
    extensionId,
    startPage
  }) => {
    await startPage.goToExtensionPage(extensionId, startPage.newTab);

    const searchBox = page.locator("#SearchBox");

    await expect(searchBox, {
      message: "Search box should be visible"
    }).toBeVisible();
    await searchBox.focus();
    await expect(searchBox.getByTestId("Suggestions"), {
      message: "Suggestions box should not be visible before typing phrase"
    }).toBeHidden();
    await page.keyboard.insertText("example");
    await expect(page.getByTestId("Suggestions"), {
      message: "Suggestions box should not be visible after typing phrase"
    }).toBeVisible();
    await page.keyboard.press("Enter");
    await page.waitForURL("https://www.google.com/search?q=example");

    const currentUrl = await page.evaluate(() => {
      return document.URL;
    });

    expect(currentUrl).toContain("https://www.google.com/search?q=example");
  });
});
