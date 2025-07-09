import { expect, test } from "./fixtures/fixtures";
import weatherMock from "./mocks/weatherMock.json" with { type: "json" };

test.describe("Dashboard elements tests", () => {
  test.beforeEach(async ({ extensionId, dashboard }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);
  });

  test("Digital timer visible", async ({ page }) => {
    const digitalTime = page.getByTestId("DigitalTime");

    await expect
      .poll(async () => {
        return await digitalTime.isVisible();
      })
      .toBeTruthy();
  });

  test("Search Input visible", async ({ page }) => {
    const searchInput = page.getByTestId("SearchInput");

    await expect(searchInput).toBeVisible();

    await expect
      .poll(async () => {
        return await searchInput.isVisible();
      })
      .toBeTruthy();
  });

  test("Add Quick Link button visible", async ({ page }) => {
    const addQuickLInkButton = page.getByTestId("AddQuickLink");

    await expect(addQuickLInkButton).toBeVisible();

    await expect
      .poll(async () => {
        return await addQuickLInkButton.isVisible();
      })
      .toBeTruthy();
  });

  test("Quick Link grid visible", async ({ page }) => {
    const quickLinkGrid = page.getByTestId("QuickLinkGrid");

    await expect
      .poll(async () => {
        return await quickLinkGrid.isVisible();
      })
      .toBeTruthy();
  });

  test("Wallpaper visible", async ({ page }) => {
    const wallpaper = page.getByTestId("wallpaper");

    await expect
      .poll(async () => {
        return await wallpaper.isVisible();
      })
      .toBeTruthy();
  });

  test("Settings gear visible", async ({ page }) => {
    const settingsGear = page.getByTestId("SettingsGear");

    await expect
      .poll(async () => {
        return await settingsGear.isVisible();
      })
      .toBeTruthy();
  });

  test("Chrome icon visible", async ({ page }) => {
    const chromeIcon = page.getByTestId("ChromeIcon");

    await expect
      .poll(async () => {
        return await chromeIcon.isVisible();
      })
      .toBeTruthy();
  });

  test("Weather widget visible", async ({ page, dashboard }) => {
    const settings = await dashboard.openSettings();
    const weatherToggle = settings.getByTestId("Warther");

    await expect
      .poll(async () => {
        await expect(weatherToggle).toBeVisible();

        return await weatherToggle.isChecked();
      })
      .toBeFalsy();

    await page.route("https://api.weatherapi.com/v1/*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(weatherMock)
      });
    });

    await settings.getByTestId("WartherToggle").click();

    const weatherWidget = page.getByTestId("WeatherWidget");

    await expect
      .poll(async () => {
        return await weatherWidget.isVisible();
      })
      .toBeTruthy();
  });
});

test.describe("Test chrome icon", () => {
  test.beforeEach(async ({ extensionId, dashboard }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);
  });

  test("Open chrome default tab", async ({ page }) => {
    const chromeIcon = page.getByTestId("ChromeIcon");

    await chromeIcon.click();

    const defaultChromeURL = await page.evaluate(() => {
      return window.document.URL;
    });

    expect(defaultChromeURL).toBe("chrome://new-tab-page/");
  });
});
