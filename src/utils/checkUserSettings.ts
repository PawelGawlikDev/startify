import { Storage } from "@plasmohq/storage"

import {
  setDefaultColors,
  setDefaultEngine,
  setDefaultQuickLink,
  setDefaultVanishAnimation,
  setDefaultWallpaper
} from "./defaultSettings"

export async function checkUserSettings() {
  const storage = new Storage()
  const userEngineSettings = await storage.get("engine")
  const vanishAnimation = await storage.get("vanish")
  const backgroundColorSettings = await storage.get("bg-color")
  const bacground = await storage.get("background")
  const quickLinksSize = await storage.get("quickLink")
  if (!userEngineSettings) {
    await setDefaultEngine(storage)
  }

  if (!quickLinksSize) {
    await setDefaultQuickLink(storage)
  }

  if (!vanishAnimation) {
    await setDefaultVanishAnimation(storage)
  }

  if (!backgroundColorSettings) {
    await setDefaultColors(storage)
  }

  if (!bacground) {
    await setDefaultWallpaper(storage)
  }
}
