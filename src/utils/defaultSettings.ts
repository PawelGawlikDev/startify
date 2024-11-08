import type { BaseStorage } from "@plasmohq/storage";

import {
  defaultColor,
  defaultQuickLink,
  defaultSearchEngine,
  defaultVanishAnimation,
  defaultWallpaper
} from "~constants/defaultSettingsValues";

export const setDefaultEngine = async (storage: BaseStorage) => {
  await storage.set("engine", defaultSearchEngine);
};

export const setDefaultColors = async (storage: BaseStorage) => {
  await storage.set("bgColors", defaultColor);
};

export const setDefaultWallpaper = async (storage: BaseStorage) => {
  await storage.set("background", defaultWallpaper);
};

export const setDefaultVanishAnimation = async (storage: BaseStorage) => {
  await storage.set("vanish", defaultVanishAnimation);
};

export const setDefaultQuickLink = async (storage: BaseStorage) => {
  await storage.set("quickLink", defaultQuickLink);
};
