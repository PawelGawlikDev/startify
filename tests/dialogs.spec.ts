import { expect, test } from "./fixtures/fixtures";

for (const width of [390, 1366]) {
  test(`Dialogs fit a ${width}px viewport`, async ({
    page,
    dashboard,
    extensionId
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await dashboard.goToExtensionPage(extensionId, dashboard.newTab);
    await page.getByTestId("AddQuickLink").click();

    const editor = page.getByTestId("QuickLinkModal");
    await expect(editor).toBeVisible();
    await expect(editor.getByTestId("SaveButton")).toBeDisabled();
    await editor
      .locator("#name")
      .fill("A long shortcut name for layout testing");
    await editor
      .locator("#url")
      .fill("https://example.com/a-long-address-for-layout-testing");
    await expect(editor.getByTestId("SaveButton")).toBeEnabled();

    expect(
      await editor.evaluate(
        (element) => element.scrollWidth <= element.clientWidth
      )
    ).toBe(true);
    for (const input of await editor.locator("input").all()) {
      const bounds = await input.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(16);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width - 16);
    }

    await editor.getByTestId("CloseButton").click();
    await expect(editor).toBeHidden();
    await page.getByTestId("SettingsGear").click();

    const settings = page.getByTestId("SettingsPanel");
    await expect(settings).toBeVisible();
    await expect(settings.getByTestId("EngineSettings")).toBeVisible();
    const navigation = await settings.getByTestId("SectionList").boundingBox();
    const content = await settings.getByTestId("MainSettings").boundingBox();
    expect(navigation).not.toBeNull();
    expect(content).not.toBeNull();
    expect(content!.y).toBeGreaterThanOrEqual(
      navigation!.y + navigation!.height
    );

    for (const section of ["Photos", "Widgets", "Main"]) {
      await settings.getByTestId(section).click();
      await expect(settings.getByTestId(`${section}Settings`)).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(settings).toBeHidden();
  });
}
