import type { BaseStorage } from "@plasmohq/storage";

import { SearchEngineEnum, searchEngines } from "~utils/searchEngine";

export const setDefaultEngine = async (storage: BaseStorage) => {
  await storage.set("engine", searchEngines[SearchEngineEnum.Google]);
};

export const setDefaultColors = async (storage: BaseStorage) => {
  await storage.set("bg-colors", {
    deg: 0,
    primary: "#3498db",
    secondary: "#9b59b6"
  });
};

export const setDefaultWallpaper = async (storage: BaseStorage) => {
  await storage.set("background", "beams");
};

export const setDefaultVanishAnimation = async (storage: BaseStorage) => {
  await storage.set("vanish", true);
};

export const setDefaultQuickLink = async (storage: BaseStorage) => {
  await storage.set("quickLink", {
    bigQuickLinks: false,
    type: "gradient"
  });
};
