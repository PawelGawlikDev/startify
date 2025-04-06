import { Storage } from "@plasmohq/storage";

import {
  defaultColor,
  defaultQuickLink,
  defaultWeatherWidget
} from "@/constants/defaultSettingsValues";
import type {
  ColorSettings,
  QuickLinkSettings,
  WeatherWidgetSettings
} from "@/types";

import checkAndSetDefaults from "./checkAndSetDefault";
import {
  setDefaultEngine,
  setDefaultVanishAnimation,
  setDefaultWallpaper
} from "./defaultSettings";

export async function checkUserSettings() {
  const storage = new Storage({
    area: "local"
  });
  const userEngineSettings = await storage.get("engine");

  if (userEngineSettings === undefined) {
    await setDefaultEngine(storage);
  }

  const vanishAnimation = await storage.get("vanish");

  if (vanishAnimation === undefined) {
    await setDefaultVanishAnimation(storage);
  }

  const backgroundColorSettings: ColorSettings = await storage.get("bgColors");

  if (backgroundColorSettings === undefined) {
    await checkAndSetDefaults(
      storage,
      "bgColors",
      backgroundColorSettings,
      defaultColor
    );
  }

  const bacground = await storage.get("background");

  if (bacground === undefined) {
    await setDefaultWallpaper(storage);
  }

  const quickLinksSettings: QuickLinkSettings = await storage.get("quickLink");

  if (quickLinksSettings === undefined) {
    await checkAndSetDefaults(
      storage,
      "quickLink",
      quickLinksSettings,
      defaultQuickLink
    );
  }

  const weatherWidgetSettings: WeatherWidgetSettings =
    await storage.get("weatherWidget");

  if (weatherWidgetSettings === undefined) {
    await checkAndSetDefaults(
      storage,
      "weatherWidget",
      weatherWidgetSettings,
      defaultWeatherWidget
    );
  }
}
