import { expect, test } from "./fixtures/fixtures";
import { predefinedColors } from "../src/constants/colors";

test.describe("Test widgest colors", () => {
  test.beforeEach(async ({ extensionId, dashboard }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);
  });
  for (const color of predefinedColors.filter((color) => color.value)) {
    test(`Test ${color.name}`, async ({ page, dashboard }) => {
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
  test("Custom color after change wallpaper", async ({ dashboard, page }) => {
    const settings = await dashboard.openSettings();
    await settings.getByTestId("Widgets").click();

    const colorButton = settings.getByTestId("WidgetSettings");

    await colorButton.click();

    await settings.getByTestId("Dropdown").getByTestId("Transparent").click();

    const savedColor = await page.evaluate(() => {
      return localStorage.getItem("userWallpaperColor");
    });

    await page.evaluate(() => {
      localStorage.removeItem("wallpaperLastChange");
    });

    await page.reload();

    const colorAfterChangeWallpaper = await page.evaluate(() => {
      return localStorage.getItem("userWallpaperColor");
    });

    expect(savedColor).toBe(colorAfterChangeWallpaper);
  });
});
