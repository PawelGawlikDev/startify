import { expect, test } from "./fixtures/fixtures";
import { predefinedColors } from "../src/constants/colors";

test.describe("Test widgest colors", () => {
  for (const color of predefinedColors) {
    test(`Test ${color.name}`, async ({ page, extensionId, dashboard }) => {
      await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

      const settings = await dashboard.openSettings();

      await settings.getByTestId("Widgets").click();

      const colorButton = settings.getByTestId("WidgetSettings");

      await expect
        .poll(async () => {
          return await colorButton.isVisible();
        })
        .toBeTruthy();

      await colorButton.click();

      await settings.getByTestId("Dropdown").getByTestId(color.name).click();

      const savedColor = await page.evaluate(() => {
        return localStorage.getItem("userWallpaperColor");
      });

      expect(savedColor).toBe(color.value);
    });
  }
});
