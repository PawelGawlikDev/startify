import { expect, test } from "./fixtures/fixtures";
import { SearchEngineEnum } from "@/utils/searchEngine";

const searchEnginesList = Object.values(SearchEngineEnum);

test.describe("Test search engines", () => {
  for (const searchEngine of searchEnginesList) {
    test(`Test ${searchEngine}`, async ({ page, extensionId, dashboard }) => {
      await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

      const settings = await dashboard.openSettings();
      const engineButon = settings.getByTestId("EngineSettings");

      await expect
        .poll(async () => {
          return await engineButon.isVisible();
        })
        .toBeTruthy();

      await engineButon.click();

      await settings.getByTestId("Dropdown").getByTestId(searchEngine).click();

      const searchBox = page.getByTestId("SearchInput");

      await expect(searchBox).toBeVisible();

      await expect
        .poll(async () => {
          return searchBox.getByTestId(searchEngine).isVisible();
        })
        .toBeTruthy();
    });
  }
});
