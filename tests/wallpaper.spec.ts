import { expect, test } from "./fixtures/fixtures";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe("Wallpaper tests", () => {
  test(`Custom wallpaper`, async ({ page, extensionId, dashboard }) => {
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);

    let wallpaper = page.getByTestId("wallpaper");

    let customWallpaper = await page.evaluate(() => {
      return {
        isUserWallpaper: localStorage.getItem("userWallpaperCustom"),
        wallpaperPath: localStorage.getItem("userWallpaper")
      };
    });

    expect(customWallpaper.isUserWallpaper).toBe("false");

    expect(
      customWallpaper.wallpaperPath?.startsWith("backgrounds/")
    ).toBeTruthy();

    expect(
      (await wallpaper.getAttribute("style"))?.includes(
        `${customWallpaper.wallpaperPath}`
      )
    ).toBeTruthy();

    const settings = await dashboard.openSettings();

    await settings.getByTestId("Photos").click();

    const uploadButton = settings.getByTestId("uploadWallpaper");

    await expect.poll(() => uploadButton.isVisible()).toBeTruthy();

    const fileChooserPromise = page.waitForEvent("filechooser");

    await uploadButton.click();

    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(
      path.join(__dirname, "./testsData/wallapper/testWallpaper.png")
    );

    await expect
      .poll(
        async () => {
          return (customWallpaper = await page.evaluate(() => ({
            isUserWallpaper: localStorage.getItem("userWallpaperCustom"),
            wallpaperPath: localStorage.getItem("userWallpaper")
          })));
        },
        {
          timeout: 3000,
          message: "Czekam na aktualizację localStorage po wgraniu tapety"
        }
      )
      .toMatchObject({
        isUserWallpaper: "true"
      });

    expect(customWallpaper.wallpaperPath?.startsWith("blob:")).toBeTruthy();

    wallpaper = page.getByTestId("wallpaper");
    expect(
      (await wallpaper.getAttribute("style"))?.includes(
        `${customWallpaper.wallpaperPath}`
      )
    ).toBeTruthy();
  });
});
