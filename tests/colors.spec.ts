import { expect, test } from "./fixtures/fixtures";
import { predefinedColors } from "../src/constants/colors";
import backgrounds from "../src/assets/backgrounds.json" with { type: "json" };

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

  test("Wallpaper restores the saved wallpaper palette after a reload", async ({
    dashboard,
    page
  }) => {
    const wallpaper = backgrounds.backgrounds[0]!;
    await page.evaluate((filename) => {
      localStorage.setItem("userWallpaper", filename);
      localStorage.setItem("userWallpaperCustom", "false");
      localStorage.setItem("wallpaperLastChange", String(Date.now()));
      localStorage.setItem("customColor", "true");
      localStorage.setItem("userWallpaperColor", "var(--color-primary-900)");
    }, wallpaper.filename);
    await page.reload();

    const settings = await dashboard.openSettings();
    await settings.getByTestId("Widgets").click();
    await settings.getByTestId("WidgetSettings").click();
    const dropdown = settings.getByTestId("Dropdown");
    await expect(dropdown.getByTestId("Green")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await dropdown.getByTestId("Wallpaper").click();
    await expect(dropdown.getByTestId("Wallpaper")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(dropdown.getByTestId("Green")).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    expect(
      await page.evaluate(() => localStorage.getItem("userWallpaperColor"))
    ).toBe(wallpaper.colors.backgroundColor);
    expect(await page.evaluate(() => localStorage.getItem("customColor"))).toBe(
      "false"
    );

    await page.reload();
    await expect(page.getByTestId("DigitalTime")).toBeVisible();
    expect(
      await page.evaluate(() => localStorage.getItem("userWallpaperColor"))
    ).toBe(wallpaper.colors.backgroundColor);
  });
});
